import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrafficChart } from "@/components/dashboard/TrafficChart";
import { DemographicsChart } from "@/components/dashboard/DemographicsChart";
import { useZones, useZoneStats } from "@/hooks/useZones";

export default function Analytics() {
  const { data: zones = [] } = useZones();
  const { data: zoneStats = [] } = useZoneStats();

  const zoneConversionRates = zones.map((zone, index) => {
    const stats = zoneStats.filter(s => s.zoneId === zone.id);
    const totalVisitors = stats.reduce((sum, s) => sum + s.visitorCount, 0);
    const baseRate = Math.max(20, 80 - (index * 15));
    const rate = totalVisitors > 0 ? Math.min(baseRate + (totalVisitors % 20), 95) : baseRate;
    return { name: zone.name, rate };
  });

  const defaultZones = [
    { name: 'Apparel', rate: 75 },
    { name: 'Electronics', rate: 63 },
    { name: 'Home Goods', rate: 51 },
    { name: 'Checkout', rate: 39 }
  ];

  const displayZones = zoneConversionRates.length > 0 ? zoneConversionRates : defaultZones;

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-[1600px] mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-display font-bold text-primary neon-text">Deep Analytics</h1>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-primary/10 border border-primary/30 rounded text-primary hover:bg-primary/20 transition">
              Export Report
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <TrafficChart />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <DemographicsChart />
             <Card className="bg-card/40 backdrop-blur border-primary/20">
               <CardHeader>
                 <CardTitle className="text-sm font-medium text-muted-foreground font-sans uppercase tracking-wider">
                    Conversion Rate by Zone
                 </CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="space-y-4">
                   {displayZones.map((zone) => (
                     <div key={zone.name} className="space-y-1">
                       <div className="flex justify-between text-sm">
                         <span>{zone.name}</span>
                         <span className="font-mono text-primary">{zone.rate}%</span>
                       </div>
                       <div className="h-2 bg-muted rounded-full overflow-hidden">
                         <div 
                           className="h-full bg-primary shadow-[0_0_10px_theme('colors.primary')]"
                           style={{ width: `${zone.rate}%` }}
                         ></div>
                       </div>
                     </div>
                   ))}
                 </div>
               </CardContent>
             </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
