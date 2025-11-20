import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell, PieChart, Pie } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ageData = [
  { name: "18-24", value: 35 },
  { name: "25-34", value: 45 },
  { name: "35-44", value: 25 },
  { name: "45-54", value: 15 },
  { name: "55+", value: 10 },
];

const genderData = [
  { name: "Male", value: 45 },
  { name: "Female", value: 55 },
];

const COLORS = ['hsl(217 91% 60%)', 'hsl(180 100% 50%)', 'hsl(280 100% 70%)', 'hsl(40 100% 60%)', 'hsl(0 84% 60%)'];

export function DemographicsChart() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
      <Card className="bg-card/40 backdrop-blur border-primary/20 shadow-lg">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground font-sans uppercase tracking-wider">
            Age Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ageData}>
              <XAxis 
                dataKey="name" 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
              />
              <Tooltip 
                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }}
                cursor={{ fill: 'hsl(var(--muted)/0.2)' }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {ageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-card/40 backdrop-blur border-primary/20 shadow-lg">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground font-sans uppercase tracking-wider">
            Gender Ratio
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={genderData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {genderData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                 contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-[-20px]">
            {genderData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                <span>{entry.name} ({entry.value}%)</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
