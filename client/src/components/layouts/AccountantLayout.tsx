import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Users, 
  Clock, 
  Eye, 
  Archive, 
  Percent, 
  HardHat, 
  Bus, 
  BarChart3, 
  ClipboardList, 
  Settings,
  UserCog,
  Bell,
  Moon,
  Sun,
  LogOut,
  Plus
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/contexts/ThemeContext";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AccountantLayoutProps {
  children: ReactNode;
}

export default function AccountantLayout({ children }: AccountantLayoutProps) {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const { data: notifications } = useQuery({
    queryKey: ["/api/notifications"],
    queryFn: async () => {
      const res = await api.notifications.list();
      return res.json();
    },
  });

  const unreadCount = notifications?.filter((n: any) => !n.isRead).length || 0;

  const navigationItems = [
    {
      title: "Main",
      items: [
        { href: "/accountant", icon: LayoutDashboard, label: "Dashboard", active: location === "/accountant" },
      ],
    },
    {
      title: "Clients",
      items: [
        { href: "/accountant/clients", icon: Users, label: "All Clients", badge: "24", active: location === "/accountant/clients" },
        { href: "/accountant/tasks", icon: Clock, label: "Pending Tasks", badge: "8", active: location === "/accountant/tasks" },
      ],
    },
    {
      title: "Documents",
      items: [
        { href: "/accountant/documents", icon: Eye, label: "Review Queue", badge: "12", active: location === "/accountant/documents" },
        { href: "/accountant/document-library", icon: Archive, label: "Document Library", active: location === "/accountant/document-library" },
      ],
    },
    {
      title: "Tax & Compliance",
      items: [
        { href: "/accountant/vat", icon: Percent, label: "VAT Returns", badge: "5", active: location === "/accountant/vat" },
        { href: "/accountant/cis", icon: HardHat, label: "CIS Returns", active: location === "/accountant/cis" },
        { href: "/accountant/self-assessment", icon: Bus, label: "Self Assessment", active: location === "/accountant/self-assessment" },
      ],
    },
    {
      title: "Reports",
      items: [
        { href: "/accountant/reports", icon: BarChart3, label: "Reports Center", active: location === "/accountant/reports" },
        { href: "/accountant/audit-logs", icon: ClipboardList, label: "Audit Logs", active: location === "/accountant/audit-logs" },
      ],
    },
    {
      title: "Settings",
      items: [
        { href: "/accountant/platform-settings", icon: Settings, label: "Platform Settings", active: location === "/accountant/platform-settings" },
        { href: "/accountant/profile", icon: UserCog, label: "Profile", active: location === "/accountant/profile" },
      ],
    },
  ];

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <LayoutDashboard className="h-4 w-4 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-semibold">UK Tax Pro - Accountant</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Invite Client
              </Button>
              
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                      <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <div className="p-2 border-b">
                    <h4 className="font-semibold">Notifications</h4>
                  </div>
                  {notifications?.slice(0, 5).map((notification: any) => (
                    <DropdownMenuItem key={notification.id} className="p-3">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{notification.title}</p>
                        <p className="text-xs text-muted-foreground">{notification.message}</p>
                      </div>
                    </DropdownMenuItem>
                  )) || (
                    <DropdownMenuItem className="p-3">
                      <p className="text-sm text-muted-foreground">No notifications</p>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{user?.firstName} {user?.lastName}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/accountant/profile">Profile Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-card border-r border-border min-h-[calc(100vh-73px)]">
          <div className="p-6 space-y-8">
            {navigationItems.map((section) => (
              <div key={section.title}>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.items.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href}>
                        <a className={`
                          flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors
                          ${item.active 
                            ? "bg-primary/10 text-primary dark:bg-primary/20" 
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                          }
                        `}>
                          <div className="flex items-center">
                            <item.icon className="h-4 w-4 mr-3" />
                            {item.label}
                          </div>
                          {item.badge && (
                            <Badge variant={item.badge === "24" ? "secondary" : "destructive"} className="h-5 text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </a>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
