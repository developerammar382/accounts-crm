import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

// Auth pages
import AccountantLogin from "@/pages/auth/AccountantLogin";
import ClientLogin from "@/pages/auth/ClientLogin";
import ClientOnboarding from "@/pages/onboarding/ClientOnboarding";

// Client pages
import ClientDashboard from "@/pages/client/ClientDashboard";
import DocumentManagement from "@/pages/client/DocumentManagement";
import FinancialReports from "@/pages/client/FinancialReports";
import Invoicing from "@/pages/client/Invoicing";
import VATManagement from "@/pages/client/VATManagement";
import Transactions from "@/pages/client/Transactions";
import Settings from "@/pages/client/Settings";

// Accountant pages
import AccountantDashboard from "@/pages/accountant/AccountantDashboard";
import ClientManagement from "@/pages/accountant/ClientManagement";
import DocumentReview from "@/pages/accountant/DocumentReview";
import TaxFiling from "@/pages/accountant/TaxFiling";
import ReportsCenter from "@/pages/accountant/ReportsCenter";

import NotFound from "@/pages/not-found";

function AuthenticatedRoutes() {
  const { user } = useAuth();

  if (!user) {
    return (
      <Switch>
        <Route path="/accountant/login" component={AccountantLogin} />
        <Route path="/client/login" component={ClientLogin} />
        <Route path="/onboarding" component={ClientOnboarding} />
        <Route path="/" component={ClientLogin} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  if (user.role === "accountant") {
    return (
      <Switch>
        <Route path="/" component={AccountantDashboard} />
        <Route path="/clients" component={ClientManagement} />
        <Route path="/documents/review" component={DocumentReview} />
        <Route path="/tax-filing" component={TaxFiling} />
        <Route path="/reports" component={ReportsCenter} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  // Client routes
  return (
    <Switch>
      <Route path="/" component={ClientDashboard} />
      <Route path="/documents" component={DocumentManagement} />
      <Route path="/reports" component={FinancialReports} />
      <Route path="/invoicing" component={Invoicing} />
      <Route path="/vat" component={VATManagement} />
      <Route path="/transactions" component={Transactions} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function Router() {
  return <AuthenticatedRoutes />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
