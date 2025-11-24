import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api", "cameras"] });
    },
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
    },
  });
}
