import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Bell, Filter } from "lucide-react";

interface IntelRow {
  id: string;
  summary: string;
  event_type: string;
  confidence: number;
  urgency: string;
  created_at: string;
  source?: string;
  opponent?: string;
}

const Intel = () => {
  const [rows, setRows] = useState<IntelRow[]>([]);
  const [severity, setSeverity] = useState<string>("all");
  const [opponent, setOpponent] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("7d");
  const [query, setQuery] = useState<string>("");
  const isEnabled = import.meta.env.VITE_FEATURE_INTEL_ALERTS === "true";

  useEffect(() => {
    if (!isEnabled || !isSupabaseConfigured) return;
    let active = true;
    async function load() {
      const { data } = await supabase
        .from("intel_events")
        .select("id, summary, event_type, confidence, urgency, created_at")
        .order("created_at", { ascending: false })
        .limit(100);
      if (!active) return;
      setRows((data as IntelRow[]) || []);
    }
    void load();
    return () => { active = false; };
  }, [isEnabled]);

  const filtered = useMemo(() => {
    return rows.filter(r => {
      if (severity !== "all" && r.urgency !== severity) return false;
      if (opponent !== "all" && (r.opponent || "").toLowerCase() !== opponent.toLowerCase()) return false;
      if (dateRange !== "all") {
        const now = Date.now();
        const cutoff = dateRange === '24h' ? now - 24*60*60*1000 : dateRange === '7d' ? now - 7*24*60*60*1000 : now - 30*24*60*60*1000;
        if (new Date(r.created_at).getTime() < cutoff) return false;
      }
      if (query && !r.summary.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [rows, severity, opponent, dateRange, query]);

  if (!isEnabled) return (
    <div className="container mx-auto px-4 sm:px-6 py-6">
      <Card className="p-6 text-sm text-muted-foreground">Intel feature is disabled.</Card>
    </div>
  );

  if (!isSupabaseConfigured) return (
    <div className="container mx-auto px-4 sm:px-6 py-6">
      <Card className="p-6 text-sm text-muted-foreground">Supabase is not configured.</Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <div className="container mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">Intel Feed</h1>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="flex-1 sm:flex-none">
              <Input placeholder="Search summaries" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
            <Select value={severity} onValueChange={setSeverity}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
            <Select value={opponent} onValueChange={setOpponent}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Opponent" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Opponents</SelectItem>
                <SelectItem value="Olympiacos">Olympiacos</SelectItem>
                <SelectItem value="AEK Athens">AEK Athens</SelectItem>
                <SelectItem value="PAOK">PAOK</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">24h</SelectItem>
                <SelectItem value="7d">7d</SelectItem>
                <SelectItem value="30d">30d</SelectItem>
                <SelectItem value="all">All</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline"><Filter className="w-4 h-4 mr-2" />Filter</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((r) => (
            <Card key={r.id} className="p-4 border border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {r.urgency === 'high' ? <AlertTriangle className="w-4 h-4 text-destructive" /> : <Bell className="w-4 h-4 text-primary" />}
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">{r.event_type}</span>
                </div>
                <span className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString()}</span>
              </div>
              <p className="text-sm mt-2 text-foreground">{r.summary}</p>
              <div className="mt-2 text-xs text-muted-foreground flex items-center gap-2">
                <span>Confidence {r.confidence.toFixed(2)}</span>
                <span>•</span>
                <span>Urgency {r.urgency}</span>
                {r.source && (
                  <span className="ml-auto px-2 py-0.5 rounded bg-muted">{r.source}</span>
                )}
              </div>
              
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Intel;


