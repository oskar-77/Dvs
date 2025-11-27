import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export interface Zone {
  id: number;
  name: string;
  type: string;
  capacity: number;
  createdAt: string | null;
}

export interface ZoneStat {
  zoneId: number;
  date: string | null;
  hour: number | null;
  visitorCount: number;
  avgDwellTime: number;
}

export function useZones() {
  return useQuery<Zone[]>({
    queryKey: ["/api/zones"],
    queryFn: async () => {
      const res = await fetch("/api/zones", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch zones");
      return res.json();
    },
    refetchInterval: 30000,
    staleTime: 0,
  });
}

export function useZoneStats(zoneId?: number) {
  return useQuery<ZoneStat[]>({
    queryKey: zoneId ? ["/api/zones/stats", { zoneId }] : ["/api/zones/stats"],
    queryFn: async () => {
      const url = zoneId ? `/api/zones/stats?zoneId=${zoneId}` : "/api/zones/stats";
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch zone stats");
      return res.json();
    },
    refetchInterval: 30000,
    staleTime: 0,
  });
}

export function useCreateZone() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { name: string; type: string; capacity?: number }) => {
      const response = await apiRequest("POST", "/api/zones", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/zones"] });
    },
  });
}
