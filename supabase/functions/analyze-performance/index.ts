const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { playerData, analysisType } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = "";
    
    if (analysisType === "injury_risk") {
      systemPrompt = `You are an AI sports science analyst for Panathinaikos FC. Analyze the player's performance metrics and provide a detailed injury risk assessment. Consider:
- Current fatigue levels and workload trends
- Recovery patterns and heart rate data
- Historical injury indicators
- Training load accumulation

Provide a risk score (0-100), risk level (low/medium/high), specific concerns, and actionable recommendations.`;
    } else if (analysisType === "performance_prediction") {
      systemPrompt = `You are an AI performance analyst for Panathinaikos FC. Based on the player's metrics, predict their performance potential for the next match. Consider:
- Current fitness levels and trends
- Recent training loads
- Recovery status
- Performance history

Provide predictions for distance covered, sprint capacity, and overall match readiness.`;
    } else if (analysisType === "training_recommendation") {
      systemPrompt = `You are an AI training optimization specialist for Panathinaikos FC. Based on the player's current state, recommend optimal training adjustments. Consider:
- Current fatigue and recovery status
- Upcoming match schedule
- Performance goals
- Injury prevention

Provide specific training load recommendations and recovery strategies.`;
    } else if (analysisType === "squad_forecast") {
      systemPrompt = `You are an AI tactical analyst for Panathinaikos FC. Analyze the entire squad's fitness, form, and fatigue data to recommend the optimal starting XI for the upcoming match. Consider:
- Player fitness levels and injury risk
- Recent form and match ratings
- Fatigue accumulation and recovery status
- Opponent analysis and tactical matchups
- Formation suitability for each player
- Squad rotation needs
- Match importance and competition

Provide:
1. **Recommended Starting XI** with positions
2. **Key Tactical Insights** about the suggested lineup
3. **Substitution Strategy** for during the match
4. **Risk Assessment** for each high-risk player
5. **Alternative Options** if key players are unavailable

Use **bold text** for emphasis, bullet points for lists, and clear sections for different recommendations.`;
    }

    console.log("Calling Lovable AI for analysis:", analysisType);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { 
            role: "user", 
            content: `Analyze this player data:\n${JSON.stringify(playerData, null, 2)}\n\nProvide a comprehensive analysis with specific insights and recommendations.` 
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const analysis = data.choices[0].message.content;

    console.log("AI analysis completed successfully");

    return new Response(
      JSON.stringify({ analysis }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );

  } catch (error) {
    console.error("Error in analyze-performance function:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to analyze performance";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
