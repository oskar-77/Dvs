import React from "react";
import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  BarChart2, 
  Map, 
  AlertTriangle, 
  Settings, 
  LogOut,
  Bell,
  Search,
  User
} from "lucide-react";
import logo from "@assets/generated_images/neon_futuristic_logo_icon.png";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [location] = useLocation();

  const navItems = [
    { icon: LayoutDashboard, label: "Live Monitor", path: "/" },
    { icon: BarChart2, label: "Analytics", path: "/analytics" },
    { icon: Map, label: "Zone Heatmaps", path: "/heatmaps" },
    { icon: AlertTriangle, label: "Alerts", path: "/alerts" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <div className="flex h-screen w-full bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-sidebar-border bg-sidebar/95 backdrop-blur flex flex-col z-20">
        <div className="h-16 flex items-center gap-3 px-6 border-b border-sidebar-border">
          <img src={logo} alt="Mr.OSKAR Logo" className="h-8 w-8 rounded shadow-[0_0_10px_theme('colors.primary')]" />
          <span className="text-xl font-display font-bold tracking-wider text-primary neon-text">
            Mr.OSKAR
          </span>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location === item.path;
            return (
              <Link href={item.path} key={item.path}>
                <div
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 cursor-pointer group
                    ${isActive 
                      ? "bg-sidebar-primary/10 text-sidebar-primary border-l-2 border-sidebar-primary shadow-[inset_10px_0_20px_-10px_theme('colors.primary')/20]" 
                      : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
                    }
                  `}
                >
                  <item.icon className={`h-5 w-5 ${isActive ? "neon-text" : "group-hover:text-primary transition-colors"}`} />
                  <span className={`font-sans font-medium ${isActive ? "font-bold" : ""}`}>
                    {item.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-sidebar-accent/50 border border-sidebar-border">
            <Avatar className="h-10 w-10 border border-primary/50">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate font-display text-primary">Admin User</p>
              <p className="text-xs text-muted-foreground truncate">Store Manager</p>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-background relative">
        {/* Grid Background Effect */}
        <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none"></div>

        {/* Top Header */}
        <header className="h-16 border-b border-border/40 bg-background/80 backdrop-blur flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-4 w-96">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search cameras, zones, or customers..." 
                className="pl-9 bg-muted/20 border-border/50 focus:border-primary/50 focus:ring-primary/20 h-9 text-sm font-sans"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_theme('colors.green.500')]"></div>
                <span className="text-xs font-medium text-green-500 font-mono">SYSTEM ONLINE</span>
             </div>
             <div className="h-6 w-px bg-border/50"></div>
             <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5 text-foreground/80" />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive shadow-[0_0_5px_theme('colors.destructive')]"></span>
             </Button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-6 z-10">
          {children}
        </div>
      </main>
    </div>
  );
}
