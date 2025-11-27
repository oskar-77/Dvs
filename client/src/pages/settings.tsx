import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Camera, Eye, Save, Plus, Trash2 } from "lucide-react";
import { useCameras, useAddCamera, useDeleteCamera } from "@/hooks/useCameras";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function Settings() {
  const { data: cameras = [], isLoading: camerasLoading } = useCameras();
  const addCamera = useAddCamera();
  const deleteCamera = useDeleteCamera();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCamera, setNewCamera] = useState({ name: "", cameraIndex: 0, location: "", rtspUrl: "" });

  const handleAddCamera = async () => {
    if (newCamera.name) {
      await addCamera.mutateAsync({
        name: newCamera.name,
        cameraIndex: newCamera.cameraIndex,
        location: newCamera.location || undefined,
        rtspUrl: newCamera.rtspUrl || undefined
      });
      setNewCamera({ name: "", cameraIndex: 0, location: "", rtspUrl: "" });
      setIsDialogOpen(false);
    }
  };

  const handleDeleteCamera = async (cameraId: number) => {
    if (confirm("Are you sure you want to delete this camera?")) {
      await deleteCamera.mutateAsync(cameraId);
    }
  };

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
              <Card className="bg-card/40 backdrop-blur border-primary/20">
                 <CardContent className="p-4 space-y-1">
                    {['General Settings', 'AI Model Parameters', 'Camera Management', 'Zone Configuration', 'User Roles', 'API & Integrations'].map((item, i) => (
                       <Button key={item} variant={i === 2 ? "secondary" : "ghost"} className="w-full justify-start">
                          {item}
                       </Button>
                    ))}
                 </CardContent>
              </Card>

              <Card className="bg-card/40 backdrop-blur border-primary/20">
                 <CardHeader>
                    <CardTitle className="text-sm uppercase text-muted-foreground">System Status</CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                       <span className="text-sm">Active Cameras</span>
                       <span className="text-sm font-mono text-primary">{cameras.filter(c => c.isActive).length}/{cameras.length}</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                       <div className="h-full bg-green-500" style={{width: cameras.length > 0 ? `${(cameras.filter(c => c.isActive).length / cameras.length) * 100}%` : '0%'}}></div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                       <span className="text-sm">Database</span>
                       <span className="text-sm font-mono text-green-500">Connected</span>
                    </div>

                    <div className="flex items-center justify-between">
                       <span className="text-sm">AI Detection</span>
                       <span className="text-sm font-mono text-primary">Ready</span>
                    </div>
                 </CardContent>
              </Card>
           </div>

           <div className="lg:col-span-2 space-y-6">
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

              <Card className="bg-card/40 backdrop-blur border-primary/20">
                 <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                         <Camera className="h-5 w-5 text-primary" />
                         <CardTitle>Camera Streams</CardTitle>
                      </div>
                      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" className="border-primary/30">
                            <Plus className="mr-2 h-4 w-4" /> Add Camera
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-card border-primary/20">
                          <DialogHeader>
                            <DialogTitle>Add New Camera</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label>Camera Name</Label>
                              <Input 
                                value={newCamera.name} 
                                onChange={(e) => setNewCamera({...newCamera, name: e.target.value})}
                                placeholder="Main Entrance"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Camera Index</Label>
                              <Input 
                                type="number"
                                value={newCamera.cameraIndex} 
                                onChange={(e) => setNewCamera({...newCamera, cameraIndex: parseInt(e.target.value) || 0})}
                                placeholder="0"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Location (optional)</Label>
                              <Input 
                                value={newCamera.location} 
                                onChange={(e) => setNewCamera({...newCamera, location: e.target.value})}
                                placeholder="Zone A - Entrance"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>RTSP URL (optional)</Label>
                              <Input 
                                value={newCamera.rtspUrl} 
                                onChange={(e) => setNewCamera({...newCamera, rtspUrl: e.target.value})}
                                placeholder="rtsp://192.168.1.100:554/stream"
                              />
                            </div>
                            <Button onClick={handleAddCamera} className="w-full" disabled={addCamera.isPending}>
                              {addCamera.isPending ? "Adding..." : "Add Camera"}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                 </CardHeader>
                 <CardContent>
                    <div className="space-y-4">
                       {camerasLoading ? (
                         <div className="text-center py-4 text-muted-foreground">Loading cameras...</div>
                       ) : cameras.length === 0 ? (
                         <div className="text-center py-4 text-muted-foreground">
                           No cameras configured. Add a camera to get started.
                         </div>
                       ) : (
                         cameras.map((cam) => (
                            <div key={cam.id} className="flex items-center justify-between p-3 border border-border rounded-lg bg-background/30">
                               <div className="flex items-center gap-3">
                                  <div className={`h-2 w-2 rounded-full ${cam.isActive ? 'bg-green-500 shadow-[0_0_5px_theme(colors.green.500)]' : 'bg-red-500'}`}></div>
                                  <div>
                                     <div className="font-medium text-sm">{cam.name}</div>
                                     <div className="font-mono text-xs text-muted-foreground">
                                       Index: {cam.cameraIndex} {cam.location && `| ${cam.location}`}
                                     </div>
                                  </div>
                               </div>
                               <div className="flex gap-2">
                                 <Button variant="outline" size="sm" className="h-7 text-xs">Config</Button>
                                 <Button 
                                   variant="ghost" 
                                   size="sm" 
                                   className="h-7 text-xs text-red-500 hover:text-red-400 hover:bg-red-500/10"
                                   onClick={() => handleDeleteCamera(cam.id)}
                                   disabled={deleteCamera.isPending}
                                 >
                                   <Trash2 className="h-4 w-4" />
                                 </Button>
                               </div>
                            </div>
                         ))
                       )}
                       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                         <DialogTrigger asChild>
                           <Button variant="ghost" className="w-full border border-dashed border-primary/30 text-primary hover:bg-primary/5">
                              + Add New RTSP Stream
                           </Button>
                         </DialogTrigger>
                       </Dialog>
                    </div>
                 </CardContent>
              </Card>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
