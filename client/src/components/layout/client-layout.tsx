import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/lib/theme";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import CompanySwitcher from "@/components/ui/company-switcher";
import { 
  Building2, 
  LayoutDashboard, 
  Upload, 
  FileText, 
  Receipt, 
  ArrowLeftRight, 
  Percent, 
  HardHat, 
  Settings, 
  User, 
  Bell, 
  Moon, 
  Sun, 
  Menu,
  LogOut
} from "lucide-react";

const navigation = [
  {
    name: "Overview",
    items: [
      { name: "Dashboard", href: "/client/dashboard", icon: LayoutDashboard, current: true }
    ]
  },
  {
    name: "Financial",
    items: [
      { name: "Documents", href: "/client/documents", icon: Upload },
      { name: "Reports", href: "/client/reports", icon: FileText },
      { name: "Invoicing", href: "/client/invoicing", icon: Receipt },
      { name: "Transactions", href: "/client/transactions", icon: ArrowLeftRight }
    ]
  },
  {
    name: "Tax & Compliance",
    items: [
      { name: "VAT Returns", href: "/client/vat-returns", icon: Percent, badge: "2" },
      { name: "CIS Returns", href: "/client/cis-returns", icon: HardHat }
    ]
  },
  {
    name: "Settings",
    items: [
      { name: "Companies", href: "/client/companies", icon: Building2 },
      { name: "Profile", href: "/client/settings", icon: User }
    ]
  }
];

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [location, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user || user.role !== 'client') {
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
        <div className="h-8 w-8 bg-success rounded-lg flex items-center justify-center">
          <Building2 className="h-5 w-5 text-white" />
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
                          ? 'bg-success/10 text-success border-r-2 border-success' 
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
            {/* Company Switcher */}
            <CompanySwitcher />

            {/* Right side */}
            <div className="flex items-center space-x-4">
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
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs">3</Badge>
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
                  <p className="text-xs text-muted-foreground">{user.email}</p>
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
