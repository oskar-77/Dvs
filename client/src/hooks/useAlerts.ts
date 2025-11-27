import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export interface Alert {
  id: number;
  type: string;
  title: string;
  message: string;
  location: string | null;
  status: string;
  createdAt: string | null;
  resolvedAt: string | null;
}

export function useAlerts(status?: string) {
  return useQuery<Alert[]>({
    queryKey: status ? ["/api/alerts", { status }] : ["/api/alerts"],
    queryFn: async () => {
      const url = status ? `/api/alerts?status=${status}` : "/api/alerts";
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch alerts");
      return res.json();
    },
    refetchInterval: 10000,
    staleTime: 0,
  });
}

export function useActiveAlerts() {
  return useQuery<Alert[]>({
    queryKey: ["/api/alerts", { status: "active" }],
    queryFn: async () => {
      const res = await fetch("/api/alerts?status=active", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch active alerts");
      return res.json();
    },
    refetchInterval: 5000,
    staleTime: 0,
  });
}

export function useCreateAlert() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { type: string; title: string; message: string; location?: string }) => {
      const response = await apiRequest("POST", "/api/alerts", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/alerts"] });
    },
  });
}

export function useResolveAlert() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (alertId: number) => {
      const response = await apiRequest("PATCH", `/api/alerts/${alertId}/resolve`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/alerts"] });
    },
  });
}
