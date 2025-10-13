import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, AlertTriangle, Info } from "lucide-react";

interface IntelAlert {
  id: string;
  event_id: string;
  severity: "info" | "warning" | "critical";
  is_acknowledged: boolean;
  created_at: string;
  event?: {
    summary: string;
    event_type: string;
    confidence: number;
    urgency: string;
  };
}

interface IntelAlertsProps {
  limit?: number;
}

export function IntelAlerts({ limit = 5 }: IntelAlertsProps) {
  const [alerts, setAlerts] = useState<IntelAlert[]>([]);
  const isEnabled = import.meta.env.VITE_FEATURE_INTEL_ALERTS === "true";

  useEffect(() => {
    if (!isEnabled) return;
    let isMounted = true;

    async function loadAlerts() {
      const { data } = await supabase
        .from("intel_alerts")
        .select("id, event_id, severity, is_acknowledged, created_at, intel_events: event_id ( summary, event_type, confidence, urgency )")
        .order("created_at", { ascending: false })
        .limit(limit);
      if (!isMounted) return;
      const normalized: IntelAlert[] = (data || []).map((row: any) => ({
        id: row.id,
        event_id: row.event_id,
        severity: row.severity,
        is_acknowledged: row.is_acknowledged,
        created_at: row.created_at,
        event: row.intel_events ? {
          summary: row.intel_events.summary,
          event_type: row.intel_events.event_type,
          confidence: row.intel_events.confidence,
          urgency: row.intel_events.urgency,
        } : undefined,
      }));
      setAlerts(normalized);
    }

    void loadAlerts();

    const channel = supabase
      .channel("intel-alerts")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "intel_alerts" },
        () => { void loadAlerts(); }
      )
      .subscribe();

    return () => {
      isMounted = false;
      void supabase.removeChannel(channel);
    };
  }, [isEnabled, limit]);

  const badgeCount = useMemo(() => alerts.filter(a => !a.is_acknowledged).length, [alerts]);
  if (!isEnabled) return null;

  return (
    <Card className="p-4 border border-border">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4" />
          <span className="font-semibold">Opponent Intel</span>
          {badgeCount > 0 && (
            <span className="ml-2 rounded-full bg-primary text-primary-foreground text-xs px-2 py-0.5">{badgeCount}</span>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={() => setAlerts([])}>Clear</Button>
      </div>
      <div className="mt-3 space-y-2">
        {alerts.length === 0 ? (
          <div className="text-sm text-muted-foreground flex items-center gap-2"><Info className="w-4 h-4" />No intel alerts</div>
        ) : (
          alerts.map((a) => (
            <div key={a.id} className="p-3 rounded-md border border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {a.severity === "critical" ? (
                    <AlertTriangle className="w-4 h-4 text-destructive" />
                  ) : (
                    <Bell className="w-4 h-4 text-primary" />
                  )}
                  <span className="text-sm font-medium capitalize">{a.event?.event_type || "update"}</span>
                </div>
                <span className="text-xs text-muted-foreground">{new Date(a.created_at).toLocaleString()}</span>
              </div>
              <p className="text-sm mt-2 text-foreground">{a.event?.summary || "New intel event"}</p>
              <div className="mt-2 text-xs text-muted-foreground">Confidence {(a.event?.confidence ?? 0).toFixed(2)} • Urgency {a.event?.urgency || "low"}</div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}


