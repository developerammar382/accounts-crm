import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import ClientLayout from "@/components/layouts/ClientLayout";
import { 
  Plus,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  Eye,
  Download,
  Send,
  MoreHorizontal
} from "lucide-react";

export default function Invoicing() {
  const { data: businesses = [], isLoading: businessesLoading } = useQuery({
    queryKey: ['/api/businesses'],
  });

  const selectedBusiness = businesses[0];

  // Mock invoice data
  const mockInvoices = [
    {
      id: "INV-2024-001",
      clientName: "Acme Corp Ltd",
      amount: 2450.00,
      dueDate: "2024-01-15",
      status: "paid",
      sentDate: "2023-12-15"
    },
    {
      id: "INV-2024-002", 
      clientName: "Global Services Inc",
      amount: 1850.00,
      dueDate: "2024-01-20",
      status: "sent",
      sentDate: "2023-12-20"
    },
    {
      id: "INV-2024-003",
      clientName: "Tech Solutions Ltd",
      amount: 950.00,
      dueDate: "2023-12-28",
      status: "overdue",
      sentDate: "2023-11-28"
    },
    {
      id: "INV-2024-004",
      clientName: "Marketing Pro Agency",
      amount: 3200.00,
      dueDate: "2024-02-01",
      status: "draft",
      sentDate: null
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'sent':
        return <Send className="h-4 w-4 text-primary" />;
      case 'overdue':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case 'draft':
        return <FileText className="h-4 w-4 text-muted-foreground" />;
      default:
        return <Clock className="h-4 w-4 text-warning" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { variant: 'outline' as const, text: 'Draft' },
      sent: { variant: 'default' as const, text: 'Sent' },
      paid: { variant: 'default' as const, text: 'Paid', className: 'bg-success hover:bg-success/80' },
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
  const totalOutstanding = mockInvoices
    .filter(inv => inv.status === 'sent' || inv.status === 'overdue')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const paidThisMonth = mockInvoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const overdueAmount = mockInvoices
    .filter(inv => inv.status === 'overdue')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const draftCount = mockInvoices.filter(inv => inv.status === 'draft').length;

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
            <p className="text-muted-foreground">Please add a business to manage invoices.</p>
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
            <h1 className="text-2xl font-bold text-foreground">Invoicing</h1>
            <p className="text-muted-foreground">
              Create and manage your invoices
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            New Invoice
          </Button>
        </div>

        {/* Invoice Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Outstanding</p>
                  <p className="text-2xl font-bold">£{totalOutstanding.toLocaleString()}</p>
                </div>
                <div className="h-12 w-12 bg-destructive/10 rounded-xl flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Paid This Month</p>
                  <p className="text-2xl font-bold">£{paidThisMonth.toLocaleString()}</p>
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
                  <p className="text-sm font-medium text-muted-foreground">Overdue</p>
                  <p className="text-2xl font-bold">£{overdueAmount.toLocaleString()}</p>
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
                  <p className="text-sm font-medium text-muted-foreground">Draft Invoices</p>
                  <p className="text-2xl font-bold">{draftCount}</p>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Invoice List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Invoices</CardTitle>
              <div className="flex items-center space-x-4">
                <Select defaultValue="all">
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {mockInvoices.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No invoices found</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first invoice to get started
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Invoice
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Invoice #</th>
                      <th className="text-left py-3 px-4 font-medium">Client</th>
                      <th className="text-left py-3 px-4 font-medium">Amount</th>
                      <th className="text-left py-3 px-4 font-medium">Due Date</th>
                      <th className="text-left py-3 px-4 font-medium">Status</th>
                      <th className="text-left py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {mockInvoices.map((invoice) => (
                      <tr key={invoice.id} className="hover:bg-muted/50">
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(invoice.status)}
                            <span className="font-medium text-sm">{invoice.id}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-medium text-sm">{invoice.clientName}</p>
                        </td>
                        <td className="py-3 px-4 font-medium">
                          £{invoice.amount.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {new Date(invoice.dueDate).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          {getStatusBadge(invoice.status)}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            {invoice.status === 'draft' ? (
                              <Button variant="ghost" size="sm">
                                <Send className="h-4 w-4 mr-1" />
                                Send
                              </Button>
                            ) : invoice.status === 'sent' ? (
                              <Button variant="ghost" size="sm">
                                <Send className="h-4 w-4 mr-1" />
                                Resend
                              </Button>
                            ) : invoice.status === 'overdue' ? (
                              <Button variant="ghost" size="sm" className="text-destructive">
                                <AlertCircle className="h-4 w-4 mr-1" />
                                Remind
                              </Button>
                            ) : null}
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ClientLayout>
  );
}