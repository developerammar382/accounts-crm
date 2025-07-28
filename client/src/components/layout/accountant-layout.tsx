import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/lib/theme";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Calculator, 
  LayoutDashboard, 
  Users, 
  Watch, 
  Eye, 
  Archive, 
  Percent, 
  HardHat, 
  Bus, 
  BarChart3, 
  ClipboardList, 
  History, 
  Settings, 
  UserCog, 
  Bell, 
  Moon, 
  Sun, 
  Menu,
  LogOut,
  UserPlus
} from "lucide-react";

const navigation = [
  {
    name: "Main",
    items: [
      { name: "Dashboard", href: "/accountant/dashboard", icon: LayoutDashboard, current: true }
    ]
  },
  {
    name: "Clients",
    items: [
      { name: "All Clients", href: "/accountant/clients", icon: Users, badge: "24" },
      { name: "Pending Tasks", href: "/accountant/tasks", icon: Watch, badge: "8" }
    ]
  },
  {
    name: "Documents",
    items: [
      { name: "Review Queue", href: "/accountant/document-review", icon: Eye, badge: "12" },
      { name: "Document Library", href: "/accountant/documents", icon: Archive }
    ]
  },
  {
    name: "Tax & Compliance",
    items: [
      { name: "VAT Returns", href: "/accountant/vat-returns", icon: Percent, badge: "5" },
      { name: "CIS Returns", href: "/accountant/cis-returns", icon: HardHat },
      { name: "Self Assessment", href: "/accountant/self-assessment", icon: Bus }
    ]
  },
  {
    name: "Reports",
    items: [
      { name: "Reports Center", href: "/accountant/reports-center", icon: BarChart3 },
      { name: "Compliance", href: "/accountant/compliance", icon: ClipboardList },
      { name: "Audit Logs", href: "/accountant/audit-logs", icon: History }
    ]
  },
  {
    name: "Settings",
    items: [
      { name: "Platform Settings", href: "/accountant/settings", icon: Settings },
      { name: "Profile", href: "/accountant/profile", icon: UserCog }
    ]
  }
];

interface AccountantLayoutProps {
  children: React.ReactNode;
}

export default function AccountantLayout({ children }: AccountantLayoutProps) {
  const [location, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user || user.role !== 'accountant') {
    setLocation('/login');
    return null;
  }

  const handleLogout = async () => {
    await logout();
    setLocation('/login');
  };

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={`flex flex-col h-full ${mobile ? 'p-6' : 'p-0'}`}>
      {/* Logo */}
      <div className="flex items-center space-x-3 mb-8">
        <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
          <Calculator className="h-5 w-5 text-white" />
        </div>
        <h1 className="text-xl font-semibold">UK Tax Pro</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-8">
        {navigation.map((section) => (
          <div key={section.name}>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              {section.name}
            </h3>
            <ul className="space-y-2">
              {section.items.map((item) => {
                const isActive = location === item.href;
                return (
                  <li key={item.name}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className={`w-full justify-start ${
                        isActive 
                          ? 'bg-primary/10 text-primary border-r-2 border-primary' 
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                      onClick={() => {
                        setLocation(item.href);
                        if (mobile) setSidebarOpen(false);
                      }}
                    >
                      <item.icon className="h-4 w-4 mr-3" />
                      {item.name}
                      {item.badge && (
                        <Badge variant="destructive" className="ml-auto text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </Button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <Sidebar mobile />
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r bg-card px-6 py-6">
          <Sidebar />
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b bg-card px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open sidebar</span>
              </Button>
            </SheetTrigger>
          </Sheet>

          <div className="flex flex-1 items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Accountant Portal</h2>
              <p className="text-sm text-muted-foreground">Welcome back, {user.firstName}</p>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {/* Invite Client */}
              <Button className="bg-primary hover:bg-primary/90">
                <UserPlus className="h-4 w-4 mr-2" />
                Invite Client
              </Button>

              {/* Theme toggle */}
              <Button
                variant="outline"
                size="icon"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>

              {/* Notifications */}
              <Button variant="outline" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs">5</Badge>
              </Button>

              {/* User menu */}
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-avatar.jpg" />
                  <AvatarFallback>
                    {user.firstName[0]}{user.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
                  <p className="text-xs text-muted-foreground">Accountant</p>
                </div>
                <Button variant="outline" size="icon" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
