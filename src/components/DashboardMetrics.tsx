import { MetricCard } from "./MetricCard";
import { Activity, Footprints, Heart, Zap, TrendingDown } from "lucide-react";

export const DashboardMetrics = () => {
  return (
    <section className="py-12 sm:py-20 px-4 sm:px-6">
      <div className="container mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
            Live Player Performance
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            Real-time metrics from today's training session
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6 mb-8 sm:mb-12">
          <MetricCard
            title="Distance Covered"
            value={10.8}
            unit="km"
            icon={Footprints}
            trend="up"
            riskLevel="safe"
          />
          <MetricCard
            title="High-Speed Runs"
            value={38}
            icon={Zap}
            trend="neutral"
            riskLevel="safe"
          />
          <MetricCard
            title="Avg Heart Rate"
            value={152}
            unit="bpm"
            icon={Heart}
            trend="up"
            riskLevel="warning"
          />
          <MetricCard
            title="Player Load"
            value={487}
            icon={Activity}
            trend="up"
            riskLevel="warning"
          />
          <MetricCard
            title="HR Recovery"
            value={72}
            unit="sec"
            icon={TrendingDown}
            trend="down"
            riskLevel="danger"
          />
        </div>
      </div>
    </section>
  );
};
