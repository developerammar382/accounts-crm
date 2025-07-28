import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Plus,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  Eye,
  Download,
  Send
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

// Mock invoice data - in real app this would come from API
const mockInvoices = [
  {
    id: "INV-2024-001",
    client: "Acme Corp Ltd",
    amount: 2450.00,
    dueDate: "2024-01-15",
    status: "paid",
    sentDate: "2023-12-15"
  },
  {
    id: "INV-2024-002",
    client: "Global Services Inc",
    amount: 1850.00,
    dueDate: "2024-01-20",
    status: "sent",
    sentDate: "2023-12-20"
  },
  {
    id: "INV-2024-003",
    client: "Tech Solutions Ltd",
    amount: 950.00,
    dueDate: "2023-12-28",
    status: "overdue",
    sentDate: "2023-11-28"
  },
  {
    id: "INV-2024-004",
    client: "Marketing Pro Agency",
    amount: 3200.00,
    dueDate: "2024-02-01",
    status: "draft",
    sentDate: null
  }
];

export default function ClientInvoices() {
  const [selectedBusiness, setSelectedBusiness] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  const { data: businesses } = useQuery({
    queryKey: ["/api/businesses"],
    queryFn: async () => {
      const res = await api.businesses.list();
      return res.json();
    },
  });

  const primaryBusiness = businesses?.find((b: any) => b.isPrimary);

  // Set primary business as default when data loads
  if (primaryBusiness && !selectedBusiness) {
    setSelectedBusiness(primaryBusiness.id);
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-success/10 text-success border-success/20">Paid</Badge>;
      case "sent":
        return <Badge className="bg-primary/10 text-primary border-primary/20">Sent</Badge>;
      case "overdue":
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Overdue</Badge>;
      case "draft":
        return <Badge className="bg-muted/10 text-muted-foreground border-muted/20">Draft</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="h-6 w-6 text-success" />;
      case "sent":
        return <Send className="h-6 w-6 text-primary" />;
      case "overdue":
        return <AlertCircle className="h-6 w-6 text-destructive" />;
      case "draft":
        return <FileText className="h-6 w-6 text-muted-foreground" />;
      default:
        return <Clock className="h-6 w-6 text-muted-foreground" />;
    }
  };

  // Calculate stats
  const totalOutstanding = mockInvoices
    .filter(inv => inv.status === "sent" || inv.status === "overdue")
    .reduce((sum, inv) => sum + inv.amount, 0);

  const paidThisMonth = mockInvoices
    .filter(inv => inv.status === "paid")
    .reduce((sum, inv) => sum + inv.amount, 0);

  const overdueAmount = mockInvoices
    .filter(inv => inv.status === "overdue")
    .reduce((sum, inv) => sum + inv.amount, 0);

  const draftCount = mockInvoices.filter(inv => inv.status === "draft").length;

  const filteredInvoices = statusFilter 
    ? mockInvoices.filter(inv => inv.status === statusFilter)
    : mockInvoices;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Invoicing</h1>
          <p className="text-muted-foreground">Create and manage your invoices</p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={selectedBusiness} onValueChange={setSelectedBusiness}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select business" />
            </SelectTrigger>
            <SelectContent>
              {businesses?.map((business: any) => (
                <SelectItem key={business.id} value={business.id}>
                  {business.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Invoice
          </Button>
        </div>
      </div>

      {/* Invoice Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Outstanding</p>
                <p className="text-2xl font-bold">{formatCurrency(totalOutstanding)}</p>
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
                <p className="text-2xl font-bold">{formatCurrency(paidThisMonth)}</p>
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
                <p className="text-2xl font-bold">{formatCurrency(overdueAmount)}</p>
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
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Statuses</SelectItem>
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
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-muted/50">
                    <td className="py-3 px-4 text-sm font-medium">{invoice.id}</td>
                    <td className="py-3 px-4 text-sm">{invoice.client}</td>
                    <td className="py-3 px-4 text-sm font-medium">{formatCurrency(invoice.amount)}</td>
                    <td className="py-3 px-4 text-sm">
                      {new Date(invoice.dueDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">{getStatusBadge(invoice.status)}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        {invoice.status === "overdue" && (
                          <Button variant="ghost" size="sm" className="text-destructive">
                            Remind
                          </Button>
                        )}
                        {invoice.status === "sent" && (
                          <Button variant="ghost" size="sm">
                            Resend
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
