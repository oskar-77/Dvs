import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "sonner";

interface SystemSettings {
  [category: string]: {
    [key: string]: string | null;
  };
}

interface NotificationSetting {
  id?: number;
  alertType: string;
  enabled: boolean;
  soundEnabled: boolean;
  emailEnabled: boolean;
}

interface SystemStatus {
  totalCameras: number;
  activeCameras: number;
  databaseConnected: boolean;
  aiReady: boolean;
}

export function useSettings(category?: string) {
  return useQuery<SystemSettings>({
    queryKey: category ? ["api", "settings", category] : ["api", "settings"],
    queryFn: async () => {
      const url = category ? `/api/settings?category=${category}` : "/api/settings";
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("فشل تحميل الإعدادات");
      return res.json();
    },
    staleTime: 30000,
  });
}

export function useSaveSettings() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: SystemSettings) => {
      const response = await apiRequest("POST", "/api/settings", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api", "settings"] });
      toast.success("تم حفظ الإعدادات", {
        description: "تم تحديث إعدادات النظام بنجاح"
      });
    },
    onError: (error: Error) => {
      toast.error("فشل حفظ الإعدادات", {
        description: error.message
      });
    }
  });
}

export function useNotificationSettings() {
  return useQuery<NotificationSetting[]>({
    queryKey: ["api", "notifications", "settings"],
    queryFn: async () => {
      const res = await fetch("/api/notifications/settings", { credentials: "include" });
      if (!res.ok) throw new Error("فشل تحميل إعدادات الإشعارات");
      return res.json();
    },
    staleTime: 30000,
  });
}

export function useSaveNotificationSettings() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: NotificationSetting[]) => {
      const response = await apiRequest("POST", "/api/notifications/settings", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api", "notifications", "settings"] });
      toast.success("تم حفظ إعدادات الإشعارات");
    },
    onError: (error: Error) => {
      toast.error("فشل حفظ إعدادات الإشعارات", {
        description: error.message
      });
    }
  });
}

export function useSystemStatus() {
  return useQuery<SystemStatus>({
    queryKey: ["api", "system", "status"],
    queryFn: async () => {
      const res = await fetch("/api/system/status", { credentials: "include" });
      if (!res.ok) throw new Error("فشل تحميل حالة النظام");
      return res.json();
    },
    refetchInterval: 10000,
    staleTime: 0,
  });
}
