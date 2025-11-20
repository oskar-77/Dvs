import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Camera, Server, Shield, Users, Eye, Save } from "lucide-react";

export default function Settings() {
  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-[1200px] mx-auto">
        <div className="flex items-center justify-between">
          <div>
             <h1 className="text-2xl font-display font-bold text-primary neon-text">System Configuration</h1>
             <p className="text-muted-foreground">Manage AI parameters, camera streams, and system preferences.</p>
          </div>
          <Button className="bg-primary text-primary-foreground shadow-[0_0_15px_theme('colors.primary')/30]">
            <Save className="mr-2 h-4 w-4" /> Save Changes
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="space-y-6">
              {/* Navigation Card */}
              <Card className="bg-card/40 backdrop-blur border-primary/20">
                 <CardContent className="p-4 space-y-1">
                    {['General Settings', 'AI Model Parameters', 'Camera Management', 'Zone Configuration', 'User Roles', 'API & Integrations'].map((item, i) => (
                       <Button key={item} variant={i === 1 ? "secondary" : "ghost"} className="w-full justify-start">
                          {item}
                       </Button>
                    ))}
                 </CardContent>
              </Card>

              {/* System Health */}
              <Card className="bg-card/40 backdrop-blur border-primary/20">
                 <CardHeader>
                    <CardTitle className="text-sm uppercase text-muted-foreground">System Status</CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                       <span className="text-sm">CPU Usage</span>
                       <span className="text-sm font-mono text-primary">32%</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                       <div className="h-full bg-green-500 w-[32%]"></div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                       <span className="text-sm">GPU Load (CUDA)</span>
                       <span className="text-sm font-mono text-primary">78%</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                       <div className="h-full bg-yellow-500 w-[78%]"></div>
                    </div>

                    <div className="flex items-center justify-between">
                       <span className="text-sm">Memory</span>
                       <span className="text-sm font-mono text-primary">12.4GB / 16GB</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                       <div className="h-full bg-blue-500 w-[65%]"></div>
                    </div>
                 </CardContent>
              </Card>
           </div>

           <div className="lg:col-span-2 space-y-6">
              {/* AI Parameters */}
              <Card className="bg-card/40 backdrop-blur border-primary/20">
                 <CardHeader>
                    <div className="flex items-center gap-2">
                       <Eye className="h-5 w-5 text-primary" />
                       <CardTitle>Computer Vision Parameters</CardTitle>
                    </div>
                    <CardDescription>Fine-tune detection sensitivity and tracking accuracy.</CardDescription>
                 </CardHeader>
                 <CardContent className="space-y-6">
                    <div className="space-y-4">
                       <div className="space-y-2">
                          <div className="flex justify-between">
                             <Label>Detection Confidence Threshold</Label>
                             <span className="font-mono text-xs text-primary">0.65</span>
                          </div>
                          <Slider defaultValue={[65]} max={100} step={1} className="w-full" />
                          <p className="text-xs text-muted-foreground">Minimum confidence score to register a detection.</p>
                       </div>

                       <div className="space-y-2">
                          <div className="flex justify-between">
                             <Label>Re-Identification (Re-ID) Similarity</Label>
                             <span className="font-mono text-xs text-primary">0.85</span>
                          </div>
                          <Slider defaultValue={[85]} max={100} step={1} className="w-full" />
                          <p className="text-xs text-muted-foreground">Threshold for matching a person across different cameras.</p>
                       </div>
                    </div>

                    <Separator className="bg-primary/10" />

                    <div className="space-y-4">
                       <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                             <Label>Face Blurring (Privacy Mode)</Label>
                             <p className="text-xs text-muted-foreground">Automatically blur faces in stored footage.</p>
                          </div>
                          <Switch defaultChecked />
                       </div>
                       <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                             <Label>Staff Exclusion</Label>
                             <p className="text-xs text-muted-foreground">Ignore people wearing staff uniforms/IDs.</p>
                          </div>
                          <Switch defaultChecked />
                       </div>
                       <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                             <Label>Trajectory Smoothing</Label>
                             <p className="text-xs text-muted-foreground">Apply Kalman Filter to smooth movement paths.</p>
                          </div>
                          <Switch defaultChecked />
                       </div>
                    </div>
                 </CardContent>
              </Card>

              {/* Camera Streams */}
              <Card className="bg-card/40 backdrop-blur border-primary/20">
                 <CardHeader>
                    <div className="flex items-center gap-2">
                       <Camera className="h-5 w-5 text-primary" />
                       <CardTitle>Camera Streams</CardTitle>
                    </div>
                 </CardHeader>
                 <CardContent>
                    <div className="space-y-4">
                       {[
                          { name: "Main Entrance", ip: "192.168.1.101", status: "Online" },
                          { name: "Aisle 4 (Electronics)", ip: "192.168.1.102", status: "Online" },
                          { name: "Checkout Zone", ip: "192.168.1.103", status: "Offline" },
                       ].map((cam, i) => (
                          <div key={i} className="flex items-center justify-between p-3 border border-border rounded-lg bg-background/30">
                             <div className="flex items-center gap-3">
                                <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_5px_theme('colors.green.500')]"></div>
                                <div>
                                   <div className="font-medium text-sm">{cam.name}</div>
                                   <div className="font-mono text-xs text-muted-foreground">{cam.ip}</div>
                                </div>
                             </div>
                             <Button variant="outline" size="sm" className="h-7 text-xs">Config</Button>
                          </div>
                       ))}
                       <Button variant="ghost" className="w-full border border-dashed border-primary/30 text-primary hover:bg-primary/5">
                          + Add New RTSP Stream
                       </Button>
                    </div>
                 </CardContent>
              </Card>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
