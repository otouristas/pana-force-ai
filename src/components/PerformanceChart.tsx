import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from "recharts";

const performanceData = [
  { session: "Mon", distance: 10.2, load: 420, recovery: 85 },
  { session: "Tue", distance: 8.5, load: 380, recovery: 78 },
  { session: "Wed", distance: 11.8, load: 510, recovery: 70 },
  { session: "Thu", distance: 9.2, load: 440, recovery: 75 },
  { session: "Fri", distance: 10.8, load: 487, recovery: 68 },
  { session: "Sat", distance: 7.5, load: 350, recovery: 82 },
  { session: "Sun", distance: 12.5, load: 550, recovery: 65 },
];

export const PerformanceChart = () => {
  return (
    <Card className="p-6 bg-card/50 border-border backdrop-blur-sm">
      <h3 className="text-xl font-bold text-foreground mb-6">Weekly Performance Trends</h3>
      
      <div className="space-y-8">
        {/* Distance & Load Chart */}
        <div className="h-[220px] sm:h-[260px] lg:h-[320px]">
          <h4 className="text-sm font-medium text-muted-foreground mb-4">Distance & Player Load</h4>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="colorDistance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--warning))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--warning))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis 
                dataKey="session" 
                stroke="hsl(var(--muted-foreground))" 
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))" 
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="distance" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                fill="url(#colorDistance)" 
                name="Distance (km)"
              />
              <Area 
                type="monotone" 
                dataKey="load" 
                stroke="hsl(var(--warning))" 
                strokeWidth={2}
                fill="url(#colorLoad)" 
                name="Player Load"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Recovery Chart */}
        <div className="h-[200px] sm:h-[240px] lg:h-[300px]">
          <h4 className="text-sm font-medium text-muted-foreground mb-4">Recovery Index</h4>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis 
                dataKey="session" 
                stroke="hsl(var(--muted-foreground))" 
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))" 
                style={{ fontSize: '12px' }}
                domain={[0, 100]}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="recovery" 
                stroke="hsl(var(--success))" 
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--success))', r: 4 }}
                name="Recovery %"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
};
