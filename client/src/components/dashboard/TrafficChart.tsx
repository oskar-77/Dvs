import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
  { time: "09:00", visitors: 120, entry: 140, exit: 20 },
  { time: "10:00", visitors: 250, entry: 280, exit: 30 },
  { time: "11:00", visitors: 380, entry: 200, exit: 70 },
  { time: "12:00", visitors: 450, entry: 250, exit: 180 },
  { time: "13:00", visitors: 520, entry: 300, exit: 230 },
  { time: "14:00", visitors: 480, entry: 150, exit: 190 },
  { time: "15:00", visitors: 420, entry: 120, exit: 180 },
  { time: "16:00", visitors: 550, entry: 350, exit: 220 },
  { time: "17:00", visitors: 680, entry: 400, exit: 270 },
  { time: "18:00", visitors: 750, entry: 380, exit: 310 },
];

export function TrafficChart() {
  return (
    <Card className="bg-card/40 backdrop-blur border-primary/20 shadow-lg h-full">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground font-sans uppercase tracking-wider">
          Real-time Foot Traffic
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(217 91% 60%)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(217 91% 60%)" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorEntry" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(180 100% 50%)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(180 100% 50%)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border)/0.5)" vertical={false} />
            <XAxis 
              dataKey="time" 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                borderColor: 'hsl(var(--border))', 
                color: 'hsl(var(--foreground))',
                borderRadius: '8px'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="visitors" 
              stroke="hsl(217 91% 60%)" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorVisitors)" 
            />
            <Area 
              type="monotone" 
              dataKey="entry" 
              stroke="hsl(180 100% 50%)" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorEntry)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
