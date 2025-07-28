import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import ClientLayout from "@/components/layout/client-layout";
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
import type { Invoice } from "@shared/schema";

export default function ClientInvoicing() {
  const { data: businesses = [], isLoading: businessesLoading } = useQuery({
    queryKey: ['/api/businesses'],
  });

  const selectedBusiness = businesses[0];

  const { data: invoices = [], isLoading: invoicesLoading } = useQuery({
    queryKey: ['/api/invoices', selectedBusiness?.id],
    enabled: !!selectedBusiness?.id,
  });

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
  const totalOutstanding = invoices
    .filter((inv: Invoice) => inv.status === 'sent' || inv.status === 'overdue')
    .reduce((sum: number, inv: Invoice) => sum + parseFloat(inv.amount || '0'), 0);

  const paidThisMonth = invoices
    .filter((inv: Invoice) => inv.status === 'paid')
    .reduce((sum: number, inv: Invoice) => sum + parseFloat(inv.amount || '0'), 0);

  const overdueAmount = invoices
    .filter((inv: Invoice) => inv.status === 'overdue')
    .reduce((sum: number, inv: Invoice) => sum + parseFloat(inv.amount || '0'), 0);

  const draftCount = invoices.filter((inv: Invoice) => inv.status === 'draft').length;

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
              <p className="text-muted-foreground">Please add a business to manage invoices.</p>
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
                  <p className="text-2xl font-bold">
                    £{invoicesLoading ? '...' : totalOutstanding.toLocaleString()}
                  </p>
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
                  <p className="text-2xl font-bold">
                    £{invoicesLoading ? '...' : paidThisMonth.toLocaleString()}
                  </p>
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
                  <p className="text-2xl font-bold">
                    £{invoicesLoading ? '...' : overdueAmount.toLocaleString()}
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
                  <p className="text-sm font-medium text-muted-foreground">Draft Invoices</p>
                  <p className="text-2xl font-bold">
                    {invoicesLoading ? '...' : draftCount}
                  </p>
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
            {invoicesLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16" />
                ))}
              </div>
            ) : invoices.length === 0 ? (
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
                    {invoices.map((invoice: Invoice) => (
                      <tr key={invoice.id} className="hover:bg-muted/50">
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(invoice.status!)}
                            <span className="font-medium text-sm">
                              {invoice.invoiceNumber}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-sm">{invoice.clientName}</p>
                            <p className="text-xs text-muted-foreground">
                              {invoice.clientAddress?.split('\n')[0] || 'No address'}
                            </p>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-medium">
                          £{parseFloat(invoice.amount!).toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {new Date(invoice.dueDate!).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          {getStatusBadge(invoice.status!)}
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
