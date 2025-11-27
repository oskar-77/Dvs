import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "sonner";

interface Camera {
  id: number;
  name: string;
  cameraIndex: number;
  location?: string;
  status: string;
  isActive: boolean;
  rtspUrl?: string;
  createdAt?: string;
}

export function useCameras() {
  return useQuery<Camera[]>({
    queryKey: ["api", "cameras"],
    queryFn: async () => {
      const res = await fetch("/api/cameras", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch cameras");
      return res.json();
    },
    refetchInterval: 5000,
    staleTime: 0,
  });
}

export function useAddCamera() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { name: string; cameraIndex: number; location?: string; rtspUrl?: string }) => {
      const response = await apiRequest("POST", "/api/cameras", data);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["api", "cameras"] });
      toast.success("تمت إضافة الكاميرا بنجاح", {
        description: `الكاميرا "${data.name}" جاهزة للاستخدام`
      });
    },
    onError: (error: Error) => {
      toast.error("فشل إضافة الكاميرا", {
        description: error.message || "تأكد من صحة البيانات والاتصال"
      });
    }
  });
}

export function useUpdateCamera() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ cameraId, data }: { cameraId: number; data: Partial<Camera> }) => {
      const response = await apiRequest("PUT", `/api/cameras/${cameraId}`, data);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["api", "cameras"] });
      toast.success("تم تحديث الكاميرا", {
        description: data.message || "تم حفظ التغييرات بنجاح"
      });
    },
    onError: (error: Error) => {
      toast.error("فشل تحديث الكاميرا", {
        description: error.message
      });
    }
  });
}

export function useDeleteCamera() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (cameraId: number) => {
      await apiRequest("DELETE", `/api/cameras/${cameraId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api", "cameras"] });
      toast.success("تم حذف الكاميرا بنجاح");
    },
    onError: (error: Error) => {
      toast.error("فشل حذف الكاميرا", {
        description: error.message
      });
    }
  });
}

export function useTestCameraConnection() {
  return useMutation({
    mutationFn: async (cameraId: number) => {
      const response = await apiRequest("POST", `/api/cameras/${cameraId}/test`);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.connected) {
        toast.success("الاتصال ناجح", {
          description: "الكاميرا متصلة وتعمل بشكل صحيح"
        });
      } else {
        toast.error("فشل الاتصال", {
          description: "تعذر الاتصال بالكاميرا"
        });
      }
    },
    onError: (error: Error) => {
      toast.error("خطأ في الاختبار", {
        description: error.message
      });
    }
  });
}
