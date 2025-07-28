import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import ClientLayout from "@/components/layouts/ClientLayout";
import { 
  Plus,
  Percent,
  CheckCircle,
  Clock,
  AlertTriangle,
  Eye,
  Download,
  Send
} from "lucide-react";

export default function VATManagement() {
  const { data: businesses = [], isLoading: businessesLoading } = useQuery({
    queryKey: ['/api/businesses'],
  });

  const selectedBusiness = businesses[0];

  // Mock VAT return data
  const mockVatReturns = [
    {
      id: "VAT-2024-Q4",
      period: "Q4 2024",
      periodStart: "2024-10-01",
      periodEnd: "2024-12-31",
      vatDue: 3256.50,
      vatReclaimed: 1245.30,
      netVatDue: 2011.20,
      totalSales: 65000,
      totalPurchases: 24906,
      status: "pending_approval",
      dueDate: "2025-02-07"
    },
    {
      id: "VAT-2024-Q3",
      period: "Q3 2024",
      periodStart: "2024-07-01",
      periodEnd: "2024-09-30",
      vatDue: 2890.75,
      vatReclaimed: 980.25,
      netVatDue: 1910.50,
      totalSales: 57815,
      totalPurchases: 19605,
      status: "submitted",
      dueDate: "2024-11-07"
    },
    {
      id: "VAT-2024-Q2",
      period: "Q2 2024",
      periodStart: "2024-04-01",
      periodEnd: "2024-06-30",
      vatDue: 3125.40,
      vatReclaimed: 1156.80,
      netVatDue: 1968.60,
      totalSales: 62508,
      totalPurchases: 23136,
      status: "submitted",
      dueDate: "2024-08-07"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'pending_approval':
        return <Clock className="h-4 w-4 text-warning" />;
      case 'draft':
        return <AlertTriangle className="h-4 w-4 text-muted-foreground" />;
      case 'overdue':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4 text-warning" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { variant: 'outline' as const, text: 'Draft' },
      pending_approval: { variant: 'default' as const, text: 'Pending Approval', className: 'bg-warning hover:bg-warning/80' },
      approved: { variant: 'default' as const, text: 'Approved', className: 'bg-success hover:bg-success/80' },
      submitted: { variant: 'default' as const, text: 'Submitted', className: 'bg-primary hover:bg-primary/80' },
      overdue: { variant: 'destructive' as const, text: 'Overdue' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.text}
      </Badge>
    );
  };

  // Calculate metrics
  const nextVatDue = mockVatReturns.find(vat => vat.status === 'pending_approval');
  const totalVatPaid = mockVatReturns
    .filter(vat => vat.status === 'submitted')
    .reduce((sum, vat) => sum + vat.netVatDue, 0);

  if (businessesLoading) {
    return (
      <ClientLayout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
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
            <p className="text-muted-foreground">Please add a business to manage VAT returns.</p>
          </CardContent>
        </Card>
      </ClientLayout>
    );
  }

  if (selectedBusiness.vatScheme === 'not_registered') {
    return (
      <ClientLayout>
        <Card>
          <CardContent className="p-8 text-center">
            <Percent className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-lg font-semibold mb-2">VAT Not Registered</h2>
            <p className="text-muted-foreground">
              This business is not registered for VAT. VAT returns are not required.
            </p>
          </CardContent>
        </Card>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">VAT Management</h1>
            <p className="text-muted-foreground">
              Manage your VAT returns and submissions
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            New VAT Return
          </Button>
        </div>

        {/* VAT Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Next VAT Due</p>
                  <p className="text-2xl font-bold">
                    £{nextVatDue ? nextVatDue.netVatDue.toLocaleString() : '0.00'}
                  </p>
                  <p className="text-sm text-warning">
                    {nextVatDue ? `Due ${new Date(nextVatDue.dueDate).toLocaleDateString()}` : 'No pending returns'}
                  </p>
                </div>
                <div className="h-12 w-12 bg-warning/10 rounded-xl flex items-center justify-center">
                  <Clock className="h-6 w-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">VAT Paid This Year</p>
                  <p className="text-2xl font-bold">£{totalVatPaid.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">3 returns submitted</p>
                </div>
                <div className="h-12 w-12 bg-success/10 rounded-xl flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">VAT Scheme</p>
                  <p className="text-2xl font-bold">
                    {selectedBusiness.vatScheme?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    VAT Number: {selectedBusiness.vatNumber || 'Not set'}
                  </p>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Percent className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* VAT Returns List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>VAT Returns</CardTitle>
              <div className="flex items-center space-x-4">
                <Select defaultValue="all">
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Returns</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Period</th>
                    <th className="text-left py-3 px-4 font-medium">VAT Due</th>
                    <th className="text-left py-3 px-4 font-medium">VAT Reclaimed</th>
                    <th className="text-left py-3 px-4 font-medium">Net VAT Due</th>
                    <th className="text-left py-3 px-4 font-medium">Due Date</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {mockVatReturns.map((vatReturn) => (
                    <tr key={vatReturn.id} className="hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(vatReturn.status)}
                          <div>
                            <p className="font-medium text-sm">{vatReturn.period}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(vatReturn.periodStart).toLocaleDateString()} - {new Date(vatReturn.periodEnd).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium">
                        £{vatReturn.vatDue.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-medium">
                        £{vatReturn.vatReclaimed.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-medium text-lg">
                        £{vatReturn.netVatDue.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {new Date(vatReturn.dueDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(vatReturn.status)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          {vatReturn.status === 'pending_approval' && (
                            <Button variant="ghost" size="sm" className="text-success">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                          )}
                          {vatReturn.status === 'draft' && (
                            <Button variant="ghost" size="sm">
                              <Send className="h-4 w-4 mr-1" />
                              Submit
                            </Button>
                          )}
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            Download
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

        {/* VAT Return Details */}
        {nextVatDue && (
          <Card>
            <CardHeader>
              <CardTitle>Current VAT Return - {nextVatDue.period}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="font-semibold">VAT Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Sales (Box 6)</span>
                      <span className="font-medium">£{nextVatDue.totalSales.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Purchases (Box 7)</span>
                      <span className="font-medium">£{nextVatDue.totalPurchases.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">VAT Due on Sales (Box 1)</span>
                      <span className="font-medium">£{nextVatDue.vatDue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">VAT Reclaimed (Box 4)</span>
                      <span className="font-medium">£{nextVatDue.vatReclaimed.toLocaleString()}</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Net VAT Due (Box 5)</span>
                        <span className="text-primary">£{nextVatDue.netVatDue.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Important Dates</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Period Start</span>
                      <span className="font-medium">{new Date(nextVatDue.periodStart).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Period End</span>
                      <span className="font-medium">{new Date(nextVatDue.periodEnd).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Due Date</span>
                      <span className="font-medium text-warning">{new Date(nextVatDue.dueDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button className="w-full bg-success hover:bg-success/90">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve & Submit Return
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ClientLayout>
  );
}