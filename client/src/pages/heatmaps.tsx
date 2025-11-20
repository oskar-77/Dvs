import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Play, Download, Filter } from "lucide-react";
import { format } from "date-fns";
import { ZoneHeatmap } from "@/components/dashboard/ZoneHeatmap";

export default function Heatmaps() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
             <h1 className="text-2xl font-display font-bold text-primary neon-text">Zone Intelligence & Heatmaps</h1>
             <p className="text-muted-foreground">Analyze customer movement patterns and dwell zones.</p>
          </div>
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[240px] justify-start text-left font-normal border-primary/30">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
              </PopoverContent>
            </Popover>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px] border-primary/30">
                <SelectValue placeholder="Select Zone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Zones</SelectItem>
                <SelectItem value="entrance">Entrance</SelectItem>
                <SelectItem value="apparel">Apparel</SelectItem>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="checkout">Checkout</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Play className="mr-2 h-4 w-4" /> Replay Flow
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           {/* Main Heatmap View */}
           <div className="lg:col-span-2">
              <Card className="bg-card/40 backdrop-blur border-primary/20 shadow-lg h-full min-h-[500px]">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-display text-primary">Interactive Floor Map</CardTitle>
                  <div className="flex gap-2">
                     <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><Download className="h-4 w-4" /></Button>
                     <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><Filter className="h-4 w-4" /></Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <ZoneHeatmap />
                  <div className="mt-6 grid grid-cols-4 gap-4">
                     <div className="text-center p-3 bg-primary/5 rounded border border-primary/10">
                        <div className="text-2xl font-bold text-red-500">High</div>
                        <div className="text-xs text-muted-foreground">Density &gt; 80%</div>
                     </div>
                     <div className="text-center p-3 bg-primary/5 rounded border border-primary/10">
                        <div className="text-2xl font-bold text-yellow-500">Med</div>
                        <div className="text-xs text-muted-foreground">Density 40-80%</div>
                     </div>
                     <div className="text-center p-3 bg-primary/5 rounded border border-primary/10">
                        <div className="text-2xl font-bold text-green-500">Low</div>
                        <div className="text-xs text-muted-foreground">Density &lt; 40%</div>
                     </div>
                     <div className="text-center p-3 bg-primary/5 rounded border border-primary/10">
                        <div className="text-2xl font-bold text-blue-500">Cold</div>
                        <div className="text-xs text-muted-foreground">No Activity</div>
                     </div>
                  </div>
                </CardContent>
              </Card>
           </div>

           {/* Zone Statistics */}
           <div className="space-y-6">
              <Card className="bg-card/40 backdrop-blur border-primary/20">
                 <CardHeader>
                    <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Popular Paths</CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-4">
                    {[
                       { path: "Entrance → Apparel → Checkout", count: 450, percent: 65 },
                       { path: "Entrance → Electronics → Exit", count: 120, percent: 18 },
                       { path: "Entrance → Checkout (Return)", count: 80, percent: 12 },
                    ].map((item, i) => (
                       <div key={i} className="space-y-2">
                          <div className="flex justify-between text-sm">
                             <span className="font-medium text-foreground">{item.path}</span>
                             <span className="font-mono text-primary">{item.count}</span>
                          </div>
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                             <div className="h-full bg-accent shadow-[0_0_5px_theme('colors.accent')]" style={{ width: `${item.percent}%` }}></div>
                          </div>
                       </div>
                    ))}
                 </CardContent>
              </Card>

              <Card className="bg-card/40 backdrop-blur border-primary/20">
                 <CardHeader>
                    <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Dwell Time by Zone</CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-4">
                    {[
                       { zone: "Apparel", time: "12m 30s", trend: "+2m" },
                       { zone: "Electronics", time: "18m 45s", trend: "-1m" },
                       { zone: "Home Goods", time: "08m 15s", trend: "+0m" },
                       { zone: "Checkout", time: "04m 20s", trend: "+1m" },
                    ].map((item, i) => (
                       <div key={i} className="flex items-center justify-between p-3 rounded bg-background/50 border border-border/50">
                          <span className="font-medium">{item.zone}</span>
                          <div className="text-right">
                             <div className="font-mono text-lg text-primary font-bold">{item.time}</div>
                             <div className="text-xs text-muted-foreground">Avg. vs last week {item.trend}</div>
                          </div>
                       </div>
                    ))}
                 </CardContent>
              </Card>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
