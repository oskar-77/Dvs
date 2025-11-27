import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { VideoFeed } from "@/components/dashboard/VideoFeed";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ZoneHeatmap } from "@/components/dashboard/ZoneHeatmap";
import { DemographicsChart } from "@/components/dashboard/DemographicsChart";
import { TrafficChart } from "@/components/dashboard/TrafficChart";
import { Users, Clock, LogIn, Activity, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOverviewStats } from "@/hooks/useStats";
import { useCameras } from "@/hooks/useCameras";
import { useAlerts } from "@/hooks/useAlerts";
import { Link } from "wouter";

function formatDwellTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}m ${secs}s`;
}

function formatAlertTime(dateString: string | null): string {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

export default function Dashboard() {
  const [selectedCamera, setSelectedCamera] = useState(0);
  const { data: stats } = useOverviewStats();
  const { data: cameras } = useCameras();
  const { data: alerts = [] } = useAlerts();
  
  const recentAlerts = alerts.slice(0, 5);

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-[1600px] mx-auto">
        
        {/* Header Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard 
            title="Total Visitors" 
            value={stats?.total_visitors ?? "0"} 
            icon={Users} 
            description="Today's count"
          />
          <StatsCard 
            title="Avg Dwell Time" 
            value={formatDwellTime(stats?.avg_dwell_time ?? 0)} 
            icon={Clock}
            description="Per customer"
          />
          <StatsCard 
            title="Current Occupancy" 
            value={stats?.current_occupancy ?? "0"} 
            icon={LogIn}
            description="Live count"
          />
          <StatsCard 
            title="Zone Engagement" 
            value={`${stats?.zone_engagement ?? 0}%`} 
            icon={Activity}
            description="Average across zones"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Video Feed & Map */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-display font-semibold text-primary">Live Surveillance Analysis</h2>
              <div className="flex gap-2">
                {cameras?.map((camera) => (
                  <Button 
                    key={camera.id}
                    variant="outline" 
                    size="sm" 
                    className={`h-8 ${selectedCamera === camera.cameraIndex ? 'border-primary/30 text-primary hover:bg-primary/10' : 'border-border text-muted-foreground'}`}
                    onClick={() => setSelectedCamera(camera.cameraIndex)}
                  >
                    CAM {camera.cameraIndex.toString().padStart(2, '0')}
                  </Button>
                ))}
              </div>
            </div>
            <VideoFeed cameraIndex={selectedCamera} />
            
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
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Recent Alerts</h3>
                  <Link href="/alerts">
                    <Button variant="ghost" size="sm" className="text-xs text-primary">View All</Button>
                  </Link>
                </div>
                <div className="space-y-3">
                  {recentAlerts.length === 0 ? (
                    <div className="text-sm text-muted-foreground text-center py-4">
                      <AlertCircle className="h-6 w-6 mx-auto mb-2 opacity-50" />
                      No recent alerts
                    </div>
                  ) : (
                    recentAlerts.map((alert) => (
                      <div key={alert.id} className={`flex gap-3 items-start text-sm border-l-2 pl-3 py-1 ${
                        alert.type === 'critical' ? 'border-red-500' : 
                        alert.type === 'warning' ? 'border-yellow-500' : 'border-primary/30'
                      }`}>
                        <span className="text-xs font-mono text-primary whitespace-nowrap">{formatAlertTime(alert.createdAt)}</span>
                        <div className="flex-1">
                          <span className="text-foreground/90">{alert.title}</span>
                          {alert.status === 'active' && (
                            <span className="ml-2 text-xs text-red-400">(Active)</span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
             </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
