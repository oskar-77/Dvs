import { useQuery } from "@tanstack/react-query";

interface OverviewStats {
  total_visitors: number;
  current_occupancy: number;
  avg_dwell_time: number;
  zone_engagement: number;
}

interface Demographics {
  male: number;
  female: number;
  age_distribution: {
    [key: string]: number;
  };
}

interface TrafficData {
  hour: string;
  visitors: number;
}

export function useOverviewStats() {
  return useQuery<OverviewStats>({
    queryKey: ["api", "stats", "overview"],
    refetchInterval: 5000,
    staleTime: 0,
  });
}

export function useDemographics() {
  return useQuery<Demographics>({
    queryKey: ["api", "analytics", "demographics"],
    refetchInterval: 10000,
    staleTime: 0,
  });
}

export function useTrafficData() {
  return useQuery<TrafficData[]>({
    queryKey: ["api", "analytics", "traffic"],
    refetchInterval: 30000,
    staleTime: 0,
  });
}

export function useLiveTracking() {
  return useQuery({
    queryKey: ["api", "tracking", "live"],
    refetchInterval: 2000,
    staleTime: 0,
  });
}
