import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Camera, Eye, Save, Plus, Trash2, Settings2, Users, 
  Wifi, Bell, Shield, Database, Cpu, Globe, TestTube,
  CheckCircle, XCircle, RefreshCw, MapPin, Video
} from "lucide-react";
import { useCameras, useAddCamera, useDeleteCamera, useUpdateCamera, useTestCameraConnection } from "@/hooks/useCameras";
import { useSettings, useSaveSettings, useSystemStatus, useNotificationSettings, useSaveNotificationSettings } from "@/hooks/useSettings";
import { useZones } from "@/hooks/useZones";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

export default function Settings() {
  const { data: cameras = [], isLoading: camerasLoading } = useCameras();
  const { data: zones = [] } = useZones();
  const { data: systemStatus } = useSystemStatus();
  const { data: savedSettings = {} } = useSettings();
  const { data: notificationSettings = [] } = useNotificationSettings();
  
  const addCamera = useAddCamera();
  const deleteCamera = useDeleteCamera();
  const updateCamera = useUpdateCamera();
  const testConnection = useTestCameraConnection();
  const saveSettings = useSaveSettings();
  const saveNotificationSettings = useSaveNotificationSettings();
  
  const [activeTab, setActiveTab] = useState("cameras");
  const [isAddCameraOpen, setIsAddCameraOpen] = useState(false);
  const [isEditCameraOpen, setIsEditCameraOpen] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState<any>(null);
  const [newCamera, setNewCamera] = useState({ 
    name: "", 
    cameraIndex: 0, 
    location: "", 
    rtspUrl: "",
    cameraType: "local"
  });

  const [aiSettings, setAiSettings] = useState({
    detectionConfidence: 65,
    reIdSimilarity: 85,
    faceBlurring: true,
    staffExclusion: true,
    trajectorySmoothing: true
  });

  const [generalSettings, setGeneralSettings] = useState({
    systemName: "Mr.OSKAR",
    timezone: "Asia/Riyadh",
    language: "ar",
    darkMode: true,
    autoRefresh: true,
    refreshInterval: 5
  });

  const [notifications, setNotifications] = useState([
    { alertType: "critical", enabled: true, soundEnabled: true, emailEnabled: false },
    { alertType: "warning", enabled: true, soundEnabled: true, emailEnabled: false },
    { alertType: "info", enabled: true, soundEnabled: false, emailEnabled: false }
  ]);

  useEffect(() => {
    if (savedSettings.ai) {
      setAiSettings({
        detectionConfidence: parseInt(savedSettings.ai.detectionConfidence || "65"),
        reIdSimilarity: parseInt(savedSettings.ai.reIdSimilarity || "85"),
        faceBlurring: savedSettings.ai.faceBlurring === "true",
        staffExclusion: savedSettings.ai.staffExclusion === "true",
        trajectorySmoothing: savedSettings.ai.trajectorySmoothing === "true"
      });
    }
    if (savedSettings.general) {
      setGeneralSettings({
        systemName: savedSettings.general.systemName || "Mr.OSKAR",
        timezone: savedSettings.general.timezone || "Asia/Riyadh",
        language: savedSettings.general.language || "ar",
        darkMode: savedSettings.general.darkMode !== "false",
        autoRefresh: savedSettings.general.autoRefresh !== "false",
        refreshInterval: parseInt(savedSettings.general.refreshInterval || "5")
      });
    }
  }, [savedSettings]);

  useEffect(() => {
    if (notificationSettings.length > 0) {
      setNotifications(notificationSettings);
    }
  }, [notificationSettings]);

  const handleAddCamera = async () => {
    if (!newCamera.name) {
      toast.error("الرجاء إدخال اسم الكاميرا");
      return;
    }
    
    const cameraData = {
      name: newCamera.name,
      cameraIndex: newCamera.cameraIndex,
      location: newCamera.location || undefined,
      rtspUrl: newCamera.cameraType === "rtsp" ? newCamera.rtspUrl : undefined
    };

    await addCamera.mutateAsync(cameraData);
    setNewCamera({ name: "", cameraIndex: 0, location: "", rtspUrl: "", cameraType: "local" });
    setIsAddCameraOpen(false);
  };

  const handleEditCamera = async () => {
    if (!selectedCamera) return;
    
    await updateCamera.mutateAsync({
      cameraId: selectedCamera.id,
      data: {
        name: selectedCamera.name,
        location: selectedCamera.location,
        status: selectedCamera.status
      }
    });
    setIsEditCameraOpen(false);
    setSelectedCamera(null);
  };

  const handleDeleteCamera = async (cameraId: number) => {
    if (confirm("هل أنت متأكد من حذف هذه الكاميرا؟")) {
      await deleteCamera.mutateAsync(cameraId);
    }
  };

  const handleTestConnection = async (cameraId: number) => {
    await testConnection.mutateAsync(cameraId);
  };

  const handleSaveAllSettings = async () => {
    await saveSettings.mutateAsync({
      ai: {
        detectionConfidence: aiSettings.detectionConfidence.toString(),
        reIdSimilarity: aiSettings.reIdSimilarity.toString(),
        faceBlurring: aiSettings.faceBlurring.toString(),
        staffExclusion: aiSettings.staffExclusion.toString(),
        trajectorySmoothing: aiSettings.trajectorySmoothing.toString()
      },
      general: {
        systemName: generalSettings.systemName,
        timezone: generalSettings.timezone,
        language: generalSettings.language,
        darkMode: generalSettings.darkMode.toString(),
        autoRefresh: generalSettings.autoRefresh.toString(),
        refreshInterval: generalSettings.refreshInterval.toString()
      }
    });
    
    await saveNotificationSettings.mutateAsync(notifications);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-primary neon-text">إعدادات النظام</h1>
            <p className="text-muted-foreground">إدارة الكاميرات والإشعارات ومعايير الذكاء الاصطناعي</p>
          </div>
          <Button 
            onClick={handleSaveAllSettings}
            disabled={saveSettings.isPending}
            className="bg-primary text-primary-foreground shadow-[0_0_15px_theme('colors.primary')/30]"
          >
            <Save className="ml-2 h-4 w-4" /> 
            {saveSettings.isPending ? "جاري الحفظ..." : "حفظ الإعدادات"}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="space-y-4">
            <Card className="bg-card/40 backdrop-blur border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm uppercase text-muted-foreground">حالة النظام</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm flex items-center gap-2">
                    <Camera className="h-4 w-4" /> الكاميرات
                  </span>
                  <span className="text-sm font-mono text-primary">
                    {systemStatus?.activeCameras || 0}/{systemStatus?.totalCameras || cameras.length}
                  </span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 transition-all" 
                    style={{
                      width: cameras.length > 0 
                        ? `${(cameras.filter(c => c.isActive).length / cameras.length) * 100}%` 
                        : '0%'
                    }}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm flex items-center gap-2">
                    <Database className="h-4 w-4" /> قاعدة البيانات
                  </span>
                  <Badge variant={systemStatus?.databaseConnected ? "default" : "destructive"} className="text-xs">
                    {systemStatus?.databaseConnected ? "متصل" : "غير متصل"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm flex items-center gap-2">
                    <Cpu className="h-4 w-4" /> الذكاء الاصطناعي
                  </span>
                  <Badge variant={systemStatus?.aiReady ? "default" : "secondary"} className="text-xs">
                    {systemStatus?.aiReady ? "جاهز" : "غير جاهز"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/40 backdrop-blur border-primary/20">
              <CardContent className="p-2">
                <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical">
                  <TabsList className="flex flex-col h-auto bg-transparent space-y-1">
                    <TabsTrigger value="general" className="w-full justify-start data-[state=active]:bg-primary/20">
                      <Settings2 className="ml-2 h-4 w-4" /> الإعدادات العامة
                    </TabsTrigger>
                    <TabsTrigger value="ai" className="w-full justify-start data-[state=active]:bg-primary/20">
                      <Eye className="ml-2 h-4 w-4" /> الذكاء الاصطناعي
                    </TabsTrigger>
                    <TabsTrigger value="cameras" className="w-full justify-start data-[state=active]:bg-primary/20">
                      <Camera className="ml-2 h-4 w-4" /> إدارة الكاميرات
                    </TabsTrigger>
                    <TabsTrigger value="zones" className="w-full justify-start data-[state=active]:bg-primary/20">
                      <MapPin className="ml-2 h-4 w-4" /> المناطق
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="w-full justify-start data-[state=active]:bg-primary/20">
                      <Bell className="ml-2 h-4 w-4" /> الإشعارات
                    </TabsTrigger>
                    <TabsTrigger value="security" className="w-full justify-start data-[state=active]:bg-primary/20">
                      <Shield className="ml-2 h-4 w-4" /> الأمان
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3 space-y-6">
            {activeTab === "general" && (
              <Card className="bg-card/40 backdrop-blur border-primary/20">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Settings2 className="h-5 w-5 text-primary" />
                    <CardTitle>الإعدادات العامة</CardTitle>
                  </div>
                  <CardDescription>تخصيص إعدادات النظام الأساسية</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>اسم النظام</Label>
                      <Input 
                        value={generalSettings.systemName}
                        onChange={(e) => setGeneralSettings({...generalSettings, systemName: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>المنطقة الزمنية</Label>
                      <Select 
                        value={generalSettings.timezone}
                        onValueChange={(value) => setGeneralSettings({...generalSettings, timezone: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Asia/Riyadh">الرياض (GMT+3)</SelectItem>
                          <SelectItem value="Asia/Dubai">دبي (GMT+4)</SelectItem>
                          <SelectItem value="Africa/Cairo">القاهرة (GMT+2)</SelectItem>
                          <SelectItem value="Europe/London">لندن (GMT+0)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator className="bg-primary/10" />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>الوضع الليلي</Label>
                        <p className="text-xs text-muted-foreground">تفعيل المظهر الداكن للواجهة</p>
                      </div>
                      <Switch 
                        checked={generalSettings.darkMode}
                        onCheckedChange={(checked) => setGeneralSettings({...generalSettings, darkMode: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>التحديث التلقائي</Label>
                        <p className="text-xs text-muted-foreground">تحديث البيانات تلقائياً</p>
                      </div>
                      <Switch 
                        checked={generalSettings.autoRefresh}
                        onCheckedChange={(checked) => setGeneralSettings({...generalSettings, autoRefresh: checked})}
                      />
                    </div>
                    {generalSettings.autoRefresh && (
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label>فترة التحديث (ثواني)</Label>
                          <span className="font-mono text-xs text-primary">{generalSettings.refreshInterval}s</span>
                        </div>
                        <Slider 
                          value={[generalSettings.refreshInterval]} 
                          onValueChange={([value]) => setGeneralSettings({...generalSettings, refreshInterval: value})}
                          min={1}
                          max={30}
                          step={1}
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "ai" && (
              <Card className="bg-card/40 backdrop-blur border-primary/20">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-primary" />
                    <CardTitle>معايير الرؤية الحاسوبية</CardTitle>
                  </div>
                  <CardDescription>ضبط حساسية الكشف ودقة التتبع</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>عتبة ثقة الكشف</Label>
                        <span className="font-mono text-xs text-primary">{(aiSettings.detectionConfidence / 100).toFixed(2)}</span>
                      </div>
                      <Slider 
                        value={[aiSettings.detectionConfidence]} 
                        onValueChange={([value]) => setAiSettings({...aiSettings, detectionConfidence: value})}
                        max={100} 
                        step={1} 
                      />
                      <p className="text-xs text-muted-foreground">الحد الأدنى لنسبة الثقة لتسجيل الكشف</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>تشابه إعادة التعريف (Re-ID)</Label>
                        <span className="font-mono text-xs text-primary">{(aiSettings.reIdSimilarity / 100).toFixed(2)}</span>
                      </div>
                      <Slider 
                        value={[aiSettings.reIdSimilarity]} 
                        onValueChange={([value]) => setAiSettings({...aiSettings, reIdSimilarity: value})}
                        max={100} 
                        step={1} 
                      />
                      <p className="text-xs text-muted-foreground">عتبة مطابقة الشخص عبر الكاميرات المختلفة</p>
                    </div>
                  </div>

                  <Separator className="bg-primary/10" />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>تمويه الوجوه (وضع الخصوصية)</Label>
                        <p className="text-xs text-muted-foreground">تمويه الوجوه تلقائياً في اللقطات المحفوظة</p>
                      </div>
                      <Switch 
                        checked={aiSettings.faceBlurring}
                        onCheckedChange={(checked) => setAiSettings({...aiSettings, faceBlurring: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>استثناء الموظفين</Label>
                        <p className="text-xs text-muted-foreground">تجاهل الأشخاص الذين يرتدون زي الموظفين</p>
                      </div>
                      <Switch 
                        checked={aiSettings.staffExclusion}
                        onCheckedChange={(checked) => setAiSettings({...aiSettings, staffExclusion: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>تنعيم المسار</Label>
                        <p className="text-xs text-muted-foreground">تطبيق فلتر كالمان لتنعيم مسارات الحركة</p>
                      </div>
                      <Switch 
                        checked={aiSettings.trajectorySmoothing}
                        onCheckedChange={(checked) => setAiSettings({...aiSettings, trajectorySmoothing: checked})}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "cameras" && (
              <Card className="bg-card/40 backdrop-blur border-primary/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Camera className="h-5 w-5 text-primary" />
                      <CardTitle>إدارة الكاميرات</CardTitle>
                    </div>
                    <Dialog open={isAddCameraOpen} onOpenChange={setIsAddCameraOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" className="border-primary/30">
                          <Plus className="ml-2 h-4 w-4" /> إضافة كاميرا
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-card border-primary/20">
                        <DialogHeader>
                          <DialogTitle>إضافة كاميرا جديدة</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label>نوع الكاميرا</Label>
                            <Select 
                              value={newCamera.cameraType}
                              onValueChange={(value) => setNewCamera({...newCamera, cameraType: value})}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="local">
                                  <div className="flex items-center gap-2">
                                    <Video className="h-4 w-4" /> كاميرا محلية (USB/Webcam)
                                  </div>
                                </SelectItem>
                                <SelectItem value="rtsp">
                                  <div className="flex items-center gap-2">
                                    <Globe className="h-4 w-4" /> كاميرا شبكية (RTSP/IP)
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>اسم الكاميرا *</Label>
                            <Input 
                              value={newCamera.name} 
                              onChange={(e) => setNewCamera({...newCamera, name: e.target.value})}
                              placeholder="مثال: المدخل الرئيسي"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label>رقم الكاميرا (Index)</Label>
                            <Input 
                              type="number"
                              value={newCamera.cameraIndex} 
                              onChange={(e) => setNewCamera({...newCamera, cameraIndex: parseInt(e.target.value) || 0})}
                              placeholder="0"
                            />
                            <p className="text-xs text-muted-foreground">
                              {newCamera.cameraType === "local" 
                                ? "رقم الكاميرا المتصلة (0 للكاميرا الأولى، 1 للثانية...)" 
                                : "معرف فريد للكاميرا"}
                            </p>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>الموقع (اختياري)</Label>
                            <Input 
                              value={newCamera.location} 
                              onChange={(e) => setNewCamera({...newCamera, location: e.target.value})}
                              placeholder="مثال: الطابق الأول - المدخل"
                            />
                          </div>
                          
                          {newCamera.cameraType === "rtsp" && (
                            <div className="space-y-2">
                              <Label>رابط RTSP *</Label>
                              <Input 
                                value={newCamera.rtspUrl} 
                                onChange={(e) => setNewCamera({...newCamera, rtspUrl: e.target.value})}
                                placeholder="rtsp://192.168.1.100:554/stream"
                                dir="ltr"
                              />
                              <p className="text-xs text-muted-foreground">
                                رابط البث المباشر للكاميرا الشبكية
                              </p>
                            </div>
                          )}
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsAddCameraOpen(false)}>
                            إلغاء
                          </Button>
                          <Button 
                            onClick={handleAddCamera} 
                            disabled={addCamera.isPending || !newCamera.name || (newCamera.cameraType === "rtsp" && !newCamera.rtspUrl)}
                          >
                            {addCamera.isPending ? "جاري الإضافة..." : "إضافة الكاميرا"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <CardDescription>إضافة وإدارة كاميرات المراقبة</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {camerasLoading ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                        جاري تحميل الكاميرات...
                      </div>
                    ) : cameras.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground border-2 border-dashed border-primary/20 rounded-lg">
                        <Camera className="h-12 w-12 mx-auto mb-3 opacity-30" />
                        <p>لم يتم إضافة كاميرات بعد</p>
                        <p className="text-sm">اضغط على "إضافة كاميرا" للبدء</p>
                      </div>
                    ) : (
                      cameras.map((cam) => (
                        <div key={cam.id} className="flex items-center justify-between p-4 border border-border rounded-lg bg-background/30 hover:bg-background/50 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className={`h-3 w-3 rounded-full ${cam.isActive ? 'bg-green-500 shadow-[0_0_8px_theme(colors.green.500)]' : 'bg-red-500'}`} />
                            <div>
                              <div className="font-medium flex items-center gap-2">
                                {cam.name}
                                {cam.rtspUrl ? (
                                  <Badge variant="outline" className="text-xs">
                                    <Globe className="h-3 w-3 ml-1" /> شبكية
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="text-xs">
                                    <Video className="h-3 w-3 ml-1" /> محلية
                                  </Badge>
                                )}
                              </div>
                              <div className="font-mono text-xs text-muted-foreground">
                                Index: {cam.cameraIndex} {cam.location && `• ${cam.location}`}
                              </div>
                              {cam.rtspUrl && (
                                <div className="font-mono text-xs text-muted-foreground/70 truncate max-w-[300px]" dir="ltr">
                                  {cam.rtspUrl}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 text-xs"
                              onClick={() => handleTestConnection(cam.id)}
                              disabled={testConnection.isPending}
                            >
                              <TestTube className="h-3 w-3 ml-1" />
                              اختبار
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 text-xs"
                              onClick={() => {
                                setSelectedCamera({...cam});
                                setIsEditCameraOpen(true);
                              }}
                            >
                              تعديل
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 text-xs text-red-500 hover:text-red-400 hover:bg-red-500/10"
                              onClick={() => handleDeleteCamera(cam.id)}
                              disabled={deleteCamera.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "zones" && (
              <Card className="bg-card/40 backdrop-blur border-primary/20">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <CardTitle>إدارة المناطق</CardTitle>
                  </div>
                  <CardDescription>تعريف وإدارة مناطق المراقبة</CardDescription>
                </CardHeader>
                <CardContent>
                  {zones.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground border-2 border-dashed border-primary/20 rounded-lg">
                      <MapPin className="h-12 w-12 mx-auto mb-3 opacity-30" />
                      <p>لم يتم تعريف مناطق بعد</p>
                      <p className="text-sm">يمكنك إضافة مناطق من صفحة الخرائط الحرارية</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {zones.map((zone: any) => (
                        <div key={zone.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                          <div>
                            <div className="font-medium">{zone.name}</div>
                            <div className="text-xs text-muted-foreground">
                              النوع: {zone.type} • السعة: {zone.capacity}
                            </div>
                          </div>
                          <Badge>{zone.type}</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === "notifications" && (
              <Card className="bg-card/40 backdrop-blur border-primary/20">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-primary" />
                    <CardTitle>إعدادات الإشعارات</CardTitle>
                  </div>
                  <CardDescription>التحكم في التنبيهات والإشعارات</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {notifications.map((notification, index) => (
                    <div key={notification.alertType} className="space-y-4 p-4 border border-border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`h-3 w-3 rounded-full ${
                            notification.alertType === 'critical' ? 'bg-red-500' :
                            notification.alertType === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                          }`} />
                          <div>
                            <Label className="text-base">
                              {notification.alertType === 'critical' ? 'التنبيهات الحرجة' :
                               notification.alertType === 'warning' ? 'التحذيرات' : 'المعلومات'}
                            </Label>
                          </div>
                        </div>
                        <Switch 
                          checked={notification.enabled}
                          onCheckedChange={(checked) => {
                            const updated = [...notifications];
                            updated[index].enabled = checked;
                            setNotifications(updated);
                          }}
                        />
                      </div>
                      
                      {notification.enabled && (
                        <div className="mr-6 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">الصوت</span>
                            <Switch 
                              checked={notification.soundEnabled}
                              onCheckedChange={(checked) => {
                                const updated = [...notifications];
                                updated[index].soundEnabled = checked;
                                setNotifications(updated);
                              }}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">البريد الإلكتروني</span>
                            <Switch 
                              checked={notification.emailEnabled}
                              onCheckedChange={(checked) => {
                                const updated = [...notifications];
                                updated[index].emailEnabled = checked;
                                setNotifications(updated);
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {activeTab === "security" && (
              <Card className="bg-card/40 backdrop-blur border-primary/20">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <CardTitle>إعدادات الأمان</CardTitle>
                  </div>
                  <CardDescription>إدارة الأمان والصلاحيات</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>تسجيل الدخول الثنائي</Label>
                        <p className="text-xs text-muted-foreground">تأمين إضافي للحساب</p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>تسجيل الأنشطة</Label>
                        <p className="text-xs text-muted-foreground">تسجيل جميع العمليات في النظام</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>تشفير البيانات</Label>
                        <p className="text-xs text-muted-foreground">تشفير البيانات المحفوظة</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>

                  <Separator className="bg-primary/10" />

                  <div className="space-y-2">
                    <Label>مهلة الجلسة (دقائق)</Label>
                    <Select defaultValue="30">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 دقيقة</SelectItem>
                        <SelectItem value="30">30 دقيقة</SelectItem>
                        <SelectItem value="60">ساعة</SelectItem>
                        <SelectItem value="120">ساعتين</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <Dialog open={isEditCameraOpen} onOpenChange={setIsEditCameraOpen}>
          <DialogContent className="bg-card border-primary/20">
            <DialogHeader>
              <DialogTitle>تعديل الكاميرا</DialogTitle>
            </DialogHeader>
            {selectedCamera && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>اسم الكاميرا</Label>
                  <Input 
                    value={selectedCamera.name} 
                    onChange={(e) => setSelectedCamera({...selectedCamera, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>الموقع</Label>
                  <Input 
                    value={selectedCamera.location || ""} 
                    onChange={(e) => setSelectedCamera({...selectedCamera, location: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>الحالة</Label>
                  <Select 
                    value={selectedCamera.status}
                    onValueChange={(value) => setSelectedCamera({...selectedCamera, status: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">نشط</SelectItem>
                      <SelectItem value="inactive">غير نشط</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditCameraOpen(false)}>
                إلغاء
              </Button>
              <Button onClick={handleEditCamera} disabled={updateCamera.isPending}>
                {updateCamera.isPending ? "جاري الحفظ..." : "حفظ التغييرات"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
