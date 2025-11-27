import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Bell, CheckCircle, Clock, ShieldAlert, Search, Plus } from "lucide-react";
import { useAlerts, useResolveAlert, useCreateAlert, type Alert } from "@/hooks/useAlerts";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

function formatTime(dateString: string | null): string {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

export default function Alerts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAlert, setNewAlert] = useState({ type: "warning", title: "", message: "", location: "" });
  
  const { data: alerts = [], isLoading } = useAlerts();
  const resolveAlert = useResolveAlert();
  const createAlert = useCreateAlert();

  const activeAlertsCount = alerts.filter(a => a.status === 'active').length;

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (alert.location?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "critical") return matchesSearch && alert.type === "critical";
    if (activeTab === "warning") return matchesSearch && alert.type === "warning";
    return matchesSearch;
  });

  const handleResolve = async (alertId: number) => {
    await resolveAlert.mutateAsync(alertId);
  };

  const handleCreateAlert = async () => {
    if (newAlert.title && newAlert.message) {
      await createAlert.mutateAsync({
        type: newAlert.type,
        title: newAlert.title,
        message: newAlert.message,
        location: newAlert.location || undefined
      });
      setNewAlert({ type: "warning", title: "", message: "", location: "" });
      setIsDialogOpen(false);
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return <ShieldAlert className="h-5 w-5" />;
      case 'warning': return <AlertTriangle className="h-5 w-5" />;
      default: return <Bell className="h-5 w-5" />;
    }
  };

  const getAlertStyle = (type: string) => {
    switch (type) {
      case 'critical': return { border: 'border-red-500/30 bg-red-500/5', icon: 'bg-red-500/20 text-red-500', line: 'bg-red-500 shadow-[0_0_8px_hsl(0_84%_60%)]' };
      case 'warning': return { border: 'border-yellow-500/30 bg-yellow-500/5', icon: 'bg-yellow-500/20 text-yellow-500', line: 'bg-yellow-500' };
      default: return { border: 'border-blue-500/30 bg-blue-500/5', icon: 'bg-blue-500/20 text-blue-500', line: 'bg-blue-500' };
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
             <h1 className="text-2xl font-display font-bold text-primary neon-text">System Alerts & Notifications</h1>
             <p className="text-muted-foreground">Real-time security and operational events log.</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-primary/30">
                  <Plus className="mr-2 h-4 w-4" /> New Alert
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-primary/20">
                <DialogHeader>
                  <DialogTitle>Create New Alert</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Alert Type</Label>
                    <Select value={newAlert.type} onValueChange={(v) => setNewAlert({...newAlert, type: v})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="critical">Critical</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                        <SelectItem value="info">Info</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input 
                      value={newAlert.title} 
                      onChange={(e) => setNewAlert({...newAlert, title: e.target.value})}
                      placeholder="Alert title..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Message</Label>
                    <Textarea 
                      value={newAlert.message} 
                      onChange={(e) => setNewAlert({...newAlert, message: e.target.value})}
                      placeholder="Alert description..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Location (optional)</Label>
                    <Input 
                      value={newAlert.location} 
                      onChange={(e) => setNewAlert({...newAlert, location: e.target.value})}
                      placeholder="Zone or area..."
                    />
                  </div>
                  <Button onClick={handleCreateAlert} className="w-full" disabled={createAlert.isPending}>
                    {createAlert.isPending ? "Creating..." : "Create Alert"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="destructive" className="shadow-[0_0_10px_theme('colors.destructive')]">
              <ShieldAlert className="mr-2 h-4 w-4" /> Active Alerts ({activeAlertsCount})
            </Button>
          </div>
        </div>

        <Card className="bg-card/40 backdrop-blur border-primary/20 shadow-lg">
          <CardHeader className="pb-3">
             <div className="flex flex-col md:flex-row justify-between gap-4">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
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
             {isLoading ? (
               <div className="text-center py-8 text-muted-foreground">Loading alerts...</div>
             ) : filteredAlerts.length === 0 ? (
               <div className="text-center py-8 text-muted-foreground">
                 No alerts found. {alerts.length === 0 && "Create your first alert to get started."}
               </div>
             ) : (
               <div className="space-y-4">
                  {filteredAlerts.map((alert) => {
                    const style = getAlertStyle(alert.type);
                    return (
                      <div 
                        key={alert.id}
                        className={`relative overflow-hidden rounded-lg border p-4 transition-all duration-200 hover:bg-accent/5 ${style.border}`}
                      >
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${style.line}`}></div>

                        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center pl-3">
                           <div className="flex gap-4 items-start">
                              <div className={`p-2 rounded-full ${style.icon}`}>
                                 {getAlertIcon(alert.type)}
                              </div>
                              <div>
                                 <div className="flex items-center gap-2 mb-1">
                                    <span className="font-display font-bold text-foreground">{alert.title}</span>
                                    <Badge variant="outline" className="text-xs font-mono">ALT-{String(alert.id).padStart(3, '0')}</Badge>
                                    {alert.status === 'active' && (
                                      <Badge className="bg-red-500 animate-pulse text-white border-none">ACTIVE</Badge>
                                    )}
                                 </div>
                                 <p className="text-sm text-muted-foreground">{alert.message}</p>
                                 <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground font-mono">
                                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {formatTime(alert.createdAt)}</span>
                                    {alert.location && <span>{alert.location}</span>}
                                 </div>
                              </div>
                           </div>

                           <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0">
                              {alert.status === 'active' ? (
                                <>
                                  <Button variant="outline" size="sm" className="border-primary/30 hover:bg-primary/10 text-primary w-full md:w-auto">View Camera</Button>
                                  <Button 
                                    size="sm" 
                                    className="bg-primary text-primary-foreground w-full md:w-auto"
                                    onClick={() => handleResolve(alert.id)}
                                    disabled={resolveAlert.isPending}
                                  >
                                    {resolveAlert.isPending ? "..." : "Resolve"}
                                  </Button>
                                </>
                              ) : (
                                 <Button variant="ghost" size="sm" disabled className="text-muted-foreground w-full md:w-auto">
                                    <CheckCircle className="mr-2 h-4 w-4" /> Resolved
                                 </Button>
                              )}
                           </div>
                        </div>
                      </div>
                    );
                  })}
               </div>
             )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
