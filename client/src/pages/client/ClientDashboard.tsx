import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ClientLayout from "@/components/layouts/ClientLayout";
import { FinancialChart } from "@/components/charts/FinancialChart";
import { 
  TrendingUp, 
  TrendingDown, 
  PoundSterling, 
  FileText, 
  AlertTriangle, 
  Upload, 
  CheckCircle,
  Clock,
  ArrowRight
} from "lucide-react";
import { useLocation } from "wouter";

export default function ClientDashboard() {
  const [, setLocation] = useLocation();

  const { data: businesses = [], isLoading: businessesLoading } = useQuery({
    queryKey: ['/api/businesses'],
  });

  const selectedBusiness = businesses[0];

  // Mock chart data
  const chartData = [
    { month: 'Jan', revenue: 12500, expenses: 8200, profit: 4300 },
    { month: 'Feb', revenue: 14200, expenses: 9100, profit: 5100 },
    { month: 'Mar', revenue: 11800, expenses: 7800, profit: 4000 },
    { month: 'Apr', revenue: 16500, expenses: 10200, profit: 6300 },
    { month: 'May', revenue: 18200, expenses: 11500, profit: 6700 },
    { month: 'Jun', revenue: 19800, expenses: 12200, profit: 7600 },
  ];

  const totalRevenue = chartData.reduce((sum, month) => sum + month.revenue, 0);
  const totalExpenses = chartData.reduce((sum, month) => sum + month.expenses, 0);
  const netProfit = totalRevenue - totalExpenses;

  const pendingActions = [
    {
      id: 'vat-return',
      title: 'VAT Return Review',
      description: 'Q4 2024 return ready for approval',
      type: 'warning' as const,
      action: 'Review & Approve',
      onClick: () => setLocation('/vat')
    },
    {
      id: 'document-review',
      title: 'Document Review Required',
      description: '3 documents need attention',
      type: 'info' as const,
      action: 'Review Documents',
      onClick: () => setLocation('/documents')
    }
  ];

  if (businessesLoading) {
    return (
      <ClientLayout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </ClientLayout>
    );
  }

  if (!selectedBusiness) {
    return (
      <ClientLayout>
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-lg font-semibold mb-2">No Business Found</h2>
            <p className="text-muted-foreground">Please add a business to get started.</p>
          </CardContent>
        </Card>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Financial Overview</h1>
          <p className="text-muted-foreground">
            {selectedBusiness.companyName} • Last updated {new Date().toLocaleTimeString()}
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">£{totalRevenue.toLocaleString()}</p>
                  <p className="text-sm text-success flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12.5% from last year
                  </p>
                </div>
                <div className="h-12 w-12 bg-success/10 rounded-xl flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
                  <p className="text-2xl font-bold">£{totalExpenses.toLocaleString()}</p>
                  <p className="text-sm text-destructive flex items-center mt-1">
                    <TrendingDown className="h-3 w-3 mr-1" />
                    +8.2% from last year
                  </p>
                </div>
                <div className="h-12 w-12 bg-destructive/10 rounded-xl flex items-center justify-center">
                  <TrendingDown className="h-6 w-6 text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Net Profit</p>
                  <p className="text-2xl font-bold">£{netProfit.toLocaleString()}</p>
                  <p className="text-sm text-success flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +18.7% from last year
                  </p>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <PoundSterling className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">VAT Due</p>
                  <p className="text-2xl font-bold">£3,256</p>
                  <p className="text-sm text-warning">Due in 12 days</p>
                </div>
                <div className="h-12 w-12 bg-warning/10 rounded-xl flex items-center justify-center">
                  <FileText className="h-6 w-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Financial Chart */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Revenue vs Expenses</CardTitle>
                  <select className="text-sm border rounded px-2 py-1">
                    <option>Last 6 months</option>
                    <option>Last year</option>
                  </select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <FinancialChart data={chartData} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="h-8 w-8 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-4 w-4 text-success" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    Invoice INV-2024-001 processed
                  </p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Upload className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    Receipt uploaded for review
                  </p>
                  <p className="text-xs text-muted-foreground">5 hours ago</p>
                </div>
              </div>
              
              <Button 
                variant="ghost" 
                className="w-full text-primary hover:text-primary/80"
                onClick={() => setLocation('/documents')}
              >
                View all activity
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Pending Actions */}
        {pendingActions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Pending Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingActions.map((action) => (
                  <div
                    key={action.id}
                    className={`p-4 rounded-lg border ${
                      action.type === 'warning'
                        ? 'bg-warning/5 border-warning/20'
                        : action.type === 'error'
                        ? 'bg-destructive/5 border-destructive/20'
                        : 'bg-primary/5 border-primary/20'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                        action.type === 'warning'
                          ? 'bg-warning/10'
                          : action.type === 'error'
                          ? 'bg-destructive/10'
                          : 'bg-primary/10'
                      }`}>
                        {action.type === 'warning' ? (
                          <AlertTriangle className="h-5 w-5 text-warning" />
                        ) : (
                          <Upload className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{action.title}</p>
                        <p className="text-sm text-muted-foreground">{action.description}</p>
                        <Button
                          size="sm"
                          className={`mt-2 ${
                            action.type === 'warning'
                              ? 'bg-warning hover:bg-warning/90'
                              : 'bg-primary hover:bg-primary/90'
                          }`}
                          onClick={action.onClick}
                        >
                          {action.action}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ClientLayout>
  );
}