import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { VideoFeed } from "@/components/dashboard/VideoFeed";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ZoneHeatmap } from "@/components/dashboard/ZoneHeatmap";
import { DemographicsChart } from "@/components/dashboard/DemographicsChart";
import { TrafficChart } from "@/components/dashboard/TrafficChart";
import { Users, Clock, LogIn, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-[1600px] mx-auto">
        
        {/* Header Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard 
            title="Total Visitors" 
            value="1,284" 
            trend="+12.5%" 
            trendUp={true} 
            icon={Users} 
            description="Today's count"
          />
          <StatsCard 
            title="Avg Dwell Time" 
            value="18m 42s" 
            trend="-2.1%" 
            trendUp={false} 
            icon={Clock}
            description="Per customer"
          />
          <StatsCard 
            title="Current Occupancy" 
            value="42" 
            trend="+5" 
            trendUp={true} 
            icon={LogIn}
            description="Live count"
          />
          <StatsCard 
            title="Zone Engagement" 
            value="89%" 
            trend="+1.2%" 
            trendUp={true} 
            icon={Activity}
            description="Apparel Section"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Video Feed & Map */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-display font-semibold text-primary">Live Surveillance Analysis</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="h-8 border-primary/30 text-primary hover:bg-primary/10">
                  CAM 01
                </Button>
                <Button variant="outline" size="sm" className="h-8 border-border text-muted-foreground">
                  CAM 02
                </Button>
              </div>
            </div>
            <VideoFeed />
            
            <div className="mt-8">
              <h2 className="text-lg font-display font-semibold text-primary mb-4">Traffic Trends</h2>
              <TrafficChart />
            </div>
          </div>

          {/* Right Column: Analytics Widgets */}
          <div className="space-y-6">
             <div>
                <h2 className="text-lg font-display font-semibold text-primary mb-4">Store Heatmap</h2>
                <ZoneHeatmap />
             </div>
             
             <div>
                <h2 className="text-lg font-display font-semibold text-primary mb-4">Demographics</h2>
                <DemographicsChart />
             </div>

             {/* Recent Alerts List */}
             <div className="bg-card/40 backdrop-blur border border-primary/20 rounded-lg p-4">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">Recent Alerts</h3>
                <div className="space-y-3">
                  {[
                    { time: "10:42 AM", msg: "High occupancy in Apparel Zone", type: "warn" },
                    { time: "09:15 AM", msg: "Queue length > 5 customers", type: "info" },
                    { time: "08:55 AM", msg: "Staff detection in restricted area", type: "crit" }
                  ].map((alert, i) => (
                    <div key={i} className="flex gap-3 items-start text-sm border-l-2 border-primary/30 pl-3 py-1">
                      <span className="text-xs font-mono text-primary">{alert.time}</span>
                      <span className="text-foreground/90">{alert.msg}</span>
                    </div>
                  ))}
                </div>
             </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
