import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
  icon: LucideIcon;
  className?: string;
  description?: string;
}

export function StatsCard({ title, value, trend, trendUp, icon: Icon, className, description }: StatsCardProps) {
  return (
    <Card className={cn("bg-card/40 backdrop-blur-md border-primary/20 shadow-lg overflow-hidden relative group", className)}>
      {/* Hover effect border */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/30 rounded-xl transition-colors duration-300 pointer-events-none"></div>
      
      {/* Background glow */}
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-500"></div>

      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground font-sans uppercase tracking-wider">
          {title}
        </CardTitle>
        <div className="p-2 bg-primary/10 rounded-md group-hover:bg-primary/20 transition-colors border border-primary/20">
          <Icon className="h-4 w-4 text-primary neon-text" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold font-display tracking-wide text-foreground">
          {value}
        </div>
        {(trend || description) && (
          <p className="text-xs mt-1 flex items-center gap-2">
            {trend && (
              <span className={cn(
                "font-medium px-1.5 py-0.5 rounded",
                trendUp ? "text-green-400 bg-green-400/10" : "text-red-400 bg-red-400/10"
              )}>
                {trend}
              </span>
            )}
            {description && (
              <span className="text-muted-foreground font-sans">{description}</span>
            )}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
