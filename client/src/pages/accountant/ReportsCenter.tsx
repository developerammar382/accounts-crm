import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import AccountantLayout from "@/components/layouts/AccountantLayout";
import { 
  BarChart3,
  TrendingUp,
  Scale,
  Droplets,
  FileText,
  Download,
  Eye,
  Filter,
  Calendar
} from "lucide-react";

export default function ReportsCenter() {
  const [selectedClient, setSelectedClient] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("2024");
  const [selectedReport, setSelectedReport] = useState("profit-loss");

  const { data: clientBusinesses = [], isLoading: businessesLoading } = useQuery({
    queryKey: ['/api/businesses'],
  });

  const reportTypes = [
    {
      id: "profit-loss",
      title: "Profit & Loss",
      description: "Income and expense summary across all clients",
      icon: TrendingUp,
      color: "bg-primary/10 text-primary",
      count: clientBusinesses.length
    },
    {
      id: "balance-sheet",
      title: "Balance Sheet",
      description: "Assets, liabilities, and equity positions",
      icon: Scale,
      color: "bg-success/10 text-success",
      count: clientBusinesses.length
    },
    {
      id: "cash-flow",
      title: "Cash Flow",
      description: "Operating, investing, and financing activities",
      icon: Droplets,
      color: "bg-warning/10 text-warning",
      count: clientBusinesses.length
    },
    {
      id: "vat-summary",
      title: "VAT Summary",
      description: "VAT returns and compliance overview",
      icon: FileText,
      color: "bg-destructive/10 text-destructive",
      count: clientBusinesses.filter((b: any) => b.vatScheme !== 'not_registered').length
    }
  ];

  // Mock client summary data
  const clientSummaries = clientBusinesses.slice(0, 5).map((business: any) => ({
    id: business.id,
    name: business.companyName,
    revenue: Math.floor(Math.random() * 200000) + 50000,
    expenses: Math.floor(Math.random() * 150000) + 30000,
    profit: 0, // Will be calculated
    vatDue: Math.floor(Math.random() * 10000) + 1000,
    status: Math.random() > 0.3 ? 'up-to-date' : 'action-needed'
  })).map(client => ({
    ...client,
    profit: client.revenue - client.expenses
  }));

  const currentReport = reportTypes.find(r => r.id === selectedReport);

  if (businessesLoading) {
    return (
      <AccountantLayout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </AccountantLayout>
    );
  }

  return (
    <AccountantLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Reports Center</h1>
            <p className="text-muted-foreground">
              Generate comprehensive financial reports across all clients
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Select value={selectedClient} onValueChange={setSelectedClient}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clients</SelectItem>
                {clientBusinesses.map((business: any) => (
                  <SelectItem key={business.id} value={business.id}>
                    {business.companyName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Report Type Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reportTypes.map((report) => {
            const Icon = report.icon;
            const isSelected = selectedReport === report.id;
            
            return (
              <Card 
                key={report.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  isSelected ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedReport(report.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${report.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <Badge variant="outline">{report.count} clients</Badge>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{report.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{report.description}</p>
                  <Button variant="outline" size="sm" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Client Performance Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Client Performance Overview</CardTitle>
              <div className="flex items-center space-x-3">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Date Range
                </Button>
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  Export All
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Client</th>
                    <th className="text-left py-3 px-4 font-medium">Revenue (YTD)</th>
                    <th className="text-left py-3 px-4 font-medium">Expenses (YTD)</th>
                    <th className="text-left py-3 px-4 font-medium">Net Profit</th>
                    <th className="text-left py-3 px-4 font-medium">VAT Due</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {clientSummaries.map((client) => (
                    <tr key={client.id} className="hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <p className="font-medium text-sm">{client.name}</p>
                      </td>
                      <td className="py-3 px-4 font-medium text-success">
                        £{client.revenue.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-medium text-destructive">
                        £{client.expenses.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-medium">
                        <span className={client.profit >= 0 ? 'text-success' : 'text-destructive'}>
                          £{client.profit.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium">
                        £{client.vatDue.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={client.status === 'up-to-date' ? 'default' : 'destructive'}>
                          {client.status === 'up-to-date' ? 'Up to Date' : 'Action Needed'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            Export
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Report View */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  {currentReport && <currentReport.icon className="h-5 w-5" />}
                  <span>{currentReport?.title} Report</span>
                </CardTitle>
                <p className="text-muted-foreground mt-1">
                  {selectedClient === 'all' ? 'All Clients' : 'Selected Client'} • {selectedPeriod}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Report Preview</h3>
              <p className="text-muted-foreground mb-4">
                Select specific parameters and click "Generate Report" to view detailed financial data
              </p>
              <Button>
                <FileText className="h-4 w-4 mr-2" />
                Generate {currentReport?.title} Report
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Client Revenue</p>
                  <p className="text-2xl font-bold">
                    £{clientSummaries.reduce((sum, c) => sum + c.revenue, 0).toLocaleString()}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Client Expenses</p>
                  <p className="text-2xl font-bold">
                    £{clientSummaries.reduce((sum, c) => sum + c.expenses, 0).toLocaleString()}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-destructive" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Combined Net Profit</p>
                  <p className="text-2xl font-bold">
                    £{clientSummaries.reduce((sum, c) => sum + c.profit, 0).toLocaleString()}
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total VAT Due</p>
                  <p className="text-2xl font-bold">
                    £{clientSummaries.reduce((sum, c) => sum + c.vatDue, 0).toLocaleString()}
                  </p>
                </div>
                <FileText className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AccountantLayout>
  );
}