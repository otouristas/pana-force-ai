const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

interface RawItem {
  source: string;
  source_id?: string;
  url?: string;
  title?: string;
  content?: string;
  author?: string;
  language?: string;
  published_at?: string;
  team?: string;
  opponent?: string;
  match_id?: string;
  metadata?: Record<string, unknown>;
}

function hashContent(input: string): string {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  let hash = 0;
  for (let i = 0; i < data.length; i++) hash = (hash * 31 + data[i]) >>> 0;
  return hash.toString(16);
}

async function fetchNewsItems(team: string, keywords: string[], apiKey?: string): Promise<RawItem[]> {
  if (!apiKey) return [];
  const q = encodeURIComponent([team, ...keywords].filter(Boolean).join(' OR '));
  const resp = await fetch(`https://gnews.io/api/v4/search?q=${q}&lang=en&max=10&token=${apiKey}`);
  if (!resp.ok) return [];
  const json = await resp.json();
  return (json.articles || []).map((a: any) => ({
    source: 'news',
    url: a.url,
    title: a.title,
    content: a.description,
    author: a.source?.name,
    language: a.language || 'en',
    published_at: a.publishedAt,
    metadata: { image: a.image },
  }));
}

async function classifyWithAI(text: string, apiKey?: string) {
  if (!apiKey) return null;
  const body = {
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'Classify football intel updates: extract event_type (injury|lineup|travel|disciplinary|weather|other), confidence (0..1), urgency (low|medium|high), entities {players:[], team, opponent} and a concise summary.' },
      { role: 'user', content: text.slice(0, 4000) }
    ]
  };
  const resp = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify(body)
  });
  if (!resp.ok) return null;
  const data = await resp.json();
  const content = data.choices?.[0]?.message?.content || '';
  try { return JSON.parse(content); } catch { return { summary: content, event_type: 'other', confidence: 0.5, urgency: 'low', entities: {} }; }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  try {
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    const GNEWS_API_KEY = Deno.env.get('GNEWS_API_KEY') || Deno.env.get('NEWS_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) throw new Error('Missing Supabase service credentials');

    const { createClient } = await import('npm:@supabase/supabase-js@2');
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Fetch enabled settings
    const { data: settings, error: settingsError } = await supabase
      .from('intel_settings')
      .select('*')
      .eq('is_enabled', true)
      .limit(20);
    if (settingsError) throw settingsError;

    let createdAlerts = 0;
    for (const s of settings || []) {
      const team = s.team as string;
      const keywords = (s.keywords as string[]) || [];

      const newsItems = await fetchNewsItems(team, keywords, GNEWS_API_KEY);
      const items: RawItem[] = [...newsItems];

      for (const item of items) {
        const text = `${item.title || ''} ${item.content || ''}`.trim();
        if (!text) continue;
        const hash = hashContent(`${item.source}|${item.url || ''}|${text}`);

        const { data: existing } = await supabase
          .from('intel_raw_events')
          .select('id')
          .eq('hash', hash)
          .maybeSingle();
        if (existing?.id) continue;

        const { data: rawInsert, error: rawErr } = await supabase
          .from('intel_raw_events')
          .insert({
            source: item.source,
            source_id: item.source_id,
            url: item.url,
            title: item.title,
            content: item.content,
            author: item.author,
            language: item.language,
            published_at: item.published_at,
            team,
            hash,
            metadata: item.metadata || {},
          })
          .select('id')
          .maybeSingle();
        if (rawErr) continue;

        const classification = await classifyWithAI(text, OPENAI_API_KEY);
        if (!classification) continue;

        const { data: eventInsert, error: eventErr } = await supabase
          .from('intel_events')
          .insert({
            raw_event_id: rawInsert?.id,
            event_type: classification.event_type || 'other',
            confidence: classification.confidence ?? 0.5,
            urgency: classification.urgency || 'low',
            entities: classification.entities || {},
            summary: classification.summary || text.slice(0, 280),
            team,
          })
          .select('id, event_type, confidence, urgency')
          .maybeSingle();
        if (eventErr) continue;

        const isImportant = ['injury', 'lineup', 'travel'].includes((eventInsert as any).event_type) && ((eventInsert as any).confidence ?? 0.5) >= 0.6;
        if (isImportant) {
          await supabase.from('intel_alerts').insert({ event_id: (eventInsert as any).id, severity: ((eventInsert as any).urgency || 'low') === 'high' ? 'critical' : 'warning' });
          createdAlerts++;
        }
      }
    }

    return new Response(JSON.stringify({ ok: true, createdAlerts }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to monitor news';
    return new Response(JSON.stringify({ error: message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});


