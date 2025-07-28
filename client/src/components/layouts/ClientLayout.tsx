import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Upload, 
  BarChart3, 
  FileText, 
  ArrowRightLeft, 
  Percent, 
  HardHat, 
  Building, 
  Settings,
  Bell,
  Moon,
  Sun,
  LogOut
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/contexts/ThemeContext";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { CompanySwitcher } from "@/components/ui/company-switcher";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
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
      title: "Overview",
      items: [
        { href: "/client", icon: LayoutDashboard, label: "Dashboard", active: location === "/client" },
      ],
    },
    {
      title: "Financial",
      items: [
        { href: "/client/documents", icon: Upload, label: "Documents", active: location === "/client/documents" },
        { href: "/client/reports", icon: BarChart3, label: "Reports", active: location === "/client/reports" },
        { href: "/client/invoices", icon: FileText, label: "Invoicing", active: location === "/client/invoices" },
        { href: "/client/transactions", icon: ArrowRightLeft, label: "Transactions", active: location === "/client/transactions" },
      ],
    },
    {
      title: "Tax & Compliance",
      items: [
        { href: "/client/vat", icon: Percent, label: "VAT Returns", badge: "2", active: location === "/client/vat" },
        { href: "/client/cis", icon: HardHat, label: "CIS Returns", active: location === "/client/cis" },
      ],
    },
    {
      title: "Settings",
      items: [
        { href: "/client/companies", icon: Building, label: "Companies", active: location === "/client/companies" },
        { href: "/client/settings", icon: Settings, label: "Profile", active: location === "/client/settings" },
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
              <div className="h-8 w-8 bg-success rounded-lg flex items-center justify-center">
                <Building className="h-4 w-4 text-success-foreground" />
              </div>
              <h1 className="text-xl font-semibold">UK Tax Pro</h1>
              <CompanySwitcher />
            </div>
            
            <div className="flex items-center space-x-4">
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
                      <AvatarFallback>
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{user?.firstName} {user?.lastName}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/client/settings">Profile Settings</Link>
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
                            ? "bg-success/10 text-success dark:bg-success/20" 
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                          }
                        `}>
                          <div className="flex items-center">
                            <item.icon className="h-4 w-4 mr-3" />
                            {item.label}
                          </div>
                          {item.badge && (
                            <Badge variant="destructive" className="h-5 text-xs">
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
