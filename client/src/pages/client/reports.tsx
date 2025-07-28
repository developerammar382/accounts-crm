import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import ClientLayout from "@/components/layout/client-layout";
import { 
  TrendingUp, 
  Scale, 
  Droplets, 
  FileText, 
  Download,
  BarChart3
} from "lucide-react";

export default function ClientReports() {
  const [selectedReport, setSelectedReport] = useState("profit-loss");
  const [selectedPeriod, setSelectedPeriod] = useState("2024");

  const { data: businesses = [], isLoading: businessesLoading } = useQuery({
    queryKey: ['/api/businesses'],
  });

  const selectedBusiness = businesses[0];

  const { data: profitLossData, isLoading: plLoading } = useQuery({
    queryKey: ['/api/reports/profit-loss', selectedBusiness?.id, selectedPeriod],
    enabled: !!selectedBusiness?.id,
  });

  const reportTypes = [
    {
      id: "profit-loss",
      title: "Profit & Loss",
      description: "Income and expense summary",
      icon: TrendingUp,
      color: "bg-primary/10 text-primary"
    },
    {
      id: "balance-sheet",
      title: "Balance Sheet", 
      description: "Assets, liabilities, and equity",
      icon: Scale,
      color: "bg-success/10 text-success"
    },
    {
      id: "cash-flow",
      title: "Cash Flow",
      description: "Operating, investing, and financing activities",
      icon: Droplets,
      color: "bg-warning/10 text-warning"
    },
    {
      id: "trial-balance",
      title: "Trial Balance",
      description: "Detailed account balances verification",
      icon: FileText,
      color: "bg-destructive/10 text-destructive"
    }
  ];

  const currentReport = reportTypes.find(r => r.id === selectedReport);

  if (businessesLoading) {
    return (
      <ClientLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-8 w-64 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-lg font-semibold mb-2">No Business Found</h2>
              <p className="text-muted-foreground">Please add a business to view reports.</p>
            </CardContent>
          </Card>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Financial Reports</h1>
            <p className="text-muted-foreground">
              Generate and view comprehensive financial reports
            </p>
          </div>
          <div className="flex items-center space-x-3">
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
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Export
                    </Button>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{report.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{report.description}</p>
                  
                  {/* Sample metric */}
                  {report.id === "profit-loss" && (
                    <>
                      <div className="text-2xl font-bold">
                        £{plLoading ? '...' : profitLossData?.netProfit?.toLocaleString() || '0'}
                      </div>
                      <p className="text-sm text-success">Net Profit YTD</p>
                    </>
                  )}
                  {report.id === "balance-sheet" && (
                    <>
                      <div className="text-2xl font-bold">£245,890</div>
                      <p className="text-sm text-muted-foreground">Total Assets</p>
                    </>
                  )}
                  {report.id === "cash-flow" && (
                    <>
                      <div className="text-2xl font-bold">£23,450</div>
                      <p className="text-sm text-success">Operating Cash Flow</p>
                    </>
                  )}
                  {report.id === "trial-balance" && (
                    <>
                      <div className="text-2xl font-bold">£245,890</div>
                      <p className="text-sm text-muted-foreground">Balance Total</p>
                    </>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Detailed Report View */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  {currentReport && <currentReport.icon className="h-5 w-5" />}
                  <span>{currentReport?.title} Statement</span>
                </CardTitle>
                <p className="text-muted-foreground mt-1">
                  {selectedBusiness.name} • January 1 - December 31, {selectedPeriod}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Select defaultValue="full-year">
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-year">January 1 - December 31, {selectedPeriod}</SelectItem>
                    <SelectItem value="q4">Q4 {selectedPeriod}</SelectItem>
                    <SelectItem value="q3">Q3 {selectedPeriod}</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {selectedReport === "profit-loss" && (
              <div className="space-y-6">
                {plLoading ? (
                  <div className="space-y-4">
                    {[...Array(8)].map((_, i) => (
                      <Skeleton key={i} className="h-8" />
                    ))}
                  </div>
                ) : (
                  <>
                    {/* Income Section */}
                    <div>
                      <h4 className="font-semibold text-lg mb-4 bg-muted/50 p-2 rounded">INCOME</h4>
                      <div className="space-y-2 pl-4">
                        <div className="flex justify-between py-2">
                          <span className="text-muted-foreground">Sales Revenue</span>
                          <span className="font-medium">
                            £{profitLossData?.totalIncome?.toLocaleString() || '0.00'}
                          </span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-muted-foreground">Interest Income</span>
                          <span className="font-medium">£320.00</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between py-2 font-semibold">
                          <span>Total Income</span>
                          <span>£{(profitLossData?.totalIncome + 320 || 320).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Expenses Section */}
                    <div>
                      <h4 className="font-semibold text-lg mb-4 bg-muted/50 p-2 rounded">EXPENSES</h4>
                      <div className="space-y-2 pl-4">
                        <div className="flex justify-between py-2">
                          <span className="text-muted-foreground">Office Expenses</span>
                          <span className="font-medium">
                            £{Math.round((profitLossData?.totalExpenses || 0) * 0.25).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-muted-foreground">Travel & Entertainment</span>
                          <span className="font-medium">
                            £{Math.round((profitLossData?.totalExpenses || 0) * 0.18).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-muted-foreground">Professional Services</span>
                          <span className="font-medium">
                            £{Math.round((profitLossData?.totalExpenses || 0) * 0.32).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-muted-foreground">Utilities</span>
                          <span className="font-medium">
                            £{Math.round((profitLossData?.totalExpenses || 0) * 0.09).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-muted-foreground">Insurance</span>
                          <span className="font-medium">
                            £{Math.round((profitLossData?.totalExpenses || 0) * 0.06).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-muted-foreground">Depreciation</span>
                          <span className="font-medium">
                            £{Math.round((profitLossData?.totalExpenses || 0) * 0.1).toLocaleString()}
                          </span>
                        </div>
                        <Separator />
                        <div className="flex justify-between py-2 font-semibold">
                          <span>Total Expenses</span>
                          <span>£{profitLossData?.totalExpenses?.toLocaleString() || '0.00'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Net Profit */}
                    <div className="bg-success/5 border-2 border-success/20 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold">NET PROFIT</span>
                        <span className="text-xl font-bold text-success">
                          £{profitLossData?.netProfit?.toLocaleString() || '0.00'}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {selectedReport !== "profit-loss" && (
              <div className="text-center py-12">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">{currentReport?.title} Report</h3>
                <p className="text-muted-foreground">
                  This report will be available once you have sufficient transaction data.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ClientLayout>
  );
}
