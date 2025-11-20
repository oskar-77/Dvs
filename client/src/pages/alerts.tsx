import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Bell, CheckCircle, Clock, ShieldAlert, Search, XCircle } from "lucide-react";

interface Alert {
  id: string;
  type: "critical" | "warning" | "info";
  title: string;
  message: string;
  time: string;
  location: string;
  status: "active" | "resolved";
}

const mockAlerts: Alert[] = [
  { id: "ALT-001", type: "critical", title: "Crowd Density Limit Exceeded", message: "Zone 'Apparel' has exceeded maximum capacity (45/40 people).", time: "10:42 AM", location: "Zone A - Apparel", status: "active" },
  { id: "ALT-002", type: "warning", title: "Long Queue Detected", message: "Checkout line waiting time > 5 minutes.", time: "10:30 AM", location: "Zone C - Checkout", status: "active" },
  { id: "ALT-003", type: "info", title: "Staff Entered Restricted Area", message: "Staff ID #442 detected in Server Room.", time: "09:15 AM", location: "Back Office", status: "resolved" },
  { id: "ALT-004", type: "warning", title: "Loitering Detected", message: "Person detected dwelling > 20 mins without interaction.", time: "09:05 AM", location: "Zone B - Electronics", status: "resolved" },
  { id: "ALT-005", type: "critical", title: "Blacklisted Person Identified", message: "Match found in database with 92% confidence.", time: "08:45 AM", location: "Main Entrance", status: "resolved" },
];

export default function Alerts() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
             <h1 className="text-2xl font-display font-bold text-primary neon-text">System Alerts & Notifications</h1>
             <p className="text-muted-foreground">Real-time security and operational events log.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="destructive" className="shadow-[0_0_10px_theme('colors.destructive')]">
              <ShieldAlert className="mr-2 h-4 w-4" /> Active Alerts (2)
            </Button>
          </div>
        </div>

        <Card className="bg-card/40 backdrop-blur border-primary/20 shadow-lg">
          <CardHeader className="pb-3">
             <div className="flex flex-col md:flex-row justify-between gap-4">
                <Tabs defaultValue="all" className="w-[400px]">
                  <TabsList className="bg-muted/30 border border-primary/10">
                    <TabsTrigger value="all">All Events</TabsTrigger>
                    <TabsTrigger value="critical" className="text-red-400 data-[state=active]:text-red-400">Critical</TabsTrigger>
                    <TabsTrigger value="warning" className="text-yellow-400 data-[state=active]:text-yellow-400">Warning</TabsTrigger>
                  </TabsList>
                </Tabs>
                <div className="relative w-full md:w-72">
                   <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                   <Input 
                     placeholder="Search logs..." 
                     className="pl-9 bg-background/50 border-primary/20" 
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                   />
                </div>
             </div>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
                {mockAlerts.map((alert) => (
                  <div 
                    key={alert.id}
                    className={`
                      relative overflow-hidden rounded-lg border p-4 transition-all duration-200 hover:bg-accent/5
                      ${alert.type === 'critical' ? 'border-red-500/30 bg-red-500/5' : 
                        alert.type === 'warning' ? 'border-yellow-500/30 bg-yellow-500/5' : 
                        'border-blue-500/30 bg-blue-500/5'}
                    `}
                  >
                    {/* Status Indicator Line */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                      alert.type === 'critical' ? 'bg-red-500 shadow-[0_0_8px_hsl(0_84%_60%)]' : 
                      alert.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}></div>

                    <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center pl-3">
                       <div className="flex gap-4 items-start">
                          <div className={`p-2 rounded-full ${
                            alert.type === 'critical' ? 'bg-red-500/20 text-red-500' : 
                            alert.type === 'warning' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-blue-500/20 text-blue-500'
                          }`}>
                             {alert.type === 'critical' ? <ShieldAlert className="h-5 w-5" /> : 
                              alert.type === 'warning' ? <AlertTriangle className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
                          </div>
                          <div>
                             <div className="flex items-center gap-2 mb-1">
                                <span className="font-display font-bold text-foreground">{alert.title}</span>
                                <Badge variant="outline" className="text-xs font-mono">{alert.id}</Badge>
                                {alert.status === 'active' && (
                                  <Badge className="bg-red-500 animate-pulse text-white border-none">ACTIVE</Badge>
                                )}
                             </div>
                             <p className="text-sm text-muted-foreground">{alert.message}</p>
                             <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground font-mono">
                                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {alert.time}</span>
                                <span>{alert.location}</span>
                             </div>
                          </div>
                       </div>

                       <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0">
                          {alert.status === 'active' ? (
                            <>
                              <Button variant="outline" size="sm" className="border-primary/30 hover:bg-primary/10 text-primary w-full md:w-auto">View Camera</Button>
                              <Button size="sm" className="bg-primary text-primary-foreground w-full md:w-auto">Resolve</Button>
                            </>
                          ) : (
                             <Button variant="ghost" size="sm" disabled className="text-muted-foreground w-full md:w-auto">
                                <CheckCircle className="mr-2 h-4 w-4" /> Resolved
                             </Button>
                          )}
                       </div>
                    </div>
                  </div>
                ))}
             </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
