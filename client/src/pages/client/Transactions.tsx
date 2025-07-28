import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import ClientLayout from "@/components/layouts/ClientLayout";
import { 
  Plus,
  Search,
  TrendingUp,
  TrendingDown,
  ArrowUpDown,
  Filter,
  Download,
  Eye,
  Edit
} from "lucide-react";

export default function Transactions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const { data: businesses = [], isLoading: businessesLoading } = useQuery({
    queryKey: ['/api/businesses'],
  });

  const selectedBusiness = businesses[0];

  // Mock transaction data
  const mockTransactions = [
    {
      id: "TXN-001",
      type: "income",
      amount: 2500.00,
      description: "Consulting Services - Acme Corp",
      category: "Sales Revenue",
      vendor: "Acme Corp Ltd",
      reference: "INV-2024-001",
      transactionDate: "2024-01-15",
      vatAmount: 500.00,
      netAmount: 2000.00
    },
    {
      id: "TXN-002",
      type: "expense",
      amount: 450.00,
      description: "Office Supplies",
      category: "Office Expenses",
      vendor: "Office Depot",
      reference: "REC-2024-001",
      transactionDate: "2024-01-14",
      vatAmount: 90.00,
      netAmount: 360.00
    },
    {
      id: "TXN-003",
      type: "expense",
      amount: 125.50,
      description: "Travel - Client Meeting",
      category: "Travel & Transport",
      vendor: "Uber",
      reference: "REC-2024-002",
      transactionDate: "2024-01-13",
      vatAmount: 25.10,
      netAmount: 100.40
    },
    {
      id: "TXN-004",
      type: "income",
      amount: 1800.00,
      description: "Web Development Project",
      category: "Service Income",
      vendor: "Tech Solutions Ltd",
      reference: "INV-2024-002",
      transactionDate: "2024-01-12",
      vatAmount: 360.00,
      netAmount: 1440.00
    },
    {
      id: "TXN-005",
      type: "expense",
      amount: 89.99,
      description: "Software Subscription",
      category: "Equipment & Software",
      vendor: "Adobe",
      reference: "REC-2024-003",
      transactionDate: "2024-01-10",
      vatAmount: 18.00,
      netAmount: 71.99
    }
  ];

  const getTypeIcon = (type: string) => {
    return type === 'income' ? (
      <TrendingUp className="h-4 w-4 text-success" />
    ) : (
      <TrendingDown className="h-4 w-4 text-destructive" />
    );
  };

  const getTypeBadge = (type: string) => {
    return type === 'income' ? (
      <Badge className="bg-success/10 text-success border-success/20">Income</Badge>
    ) : (
      <Badge className="bg-destructive/10 text-destructive border-destructive/20">Expense</Badge>
    );
  };

  // Filter transactions
  const filteredTransactions = mockTransactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || transaction.type === typeFilter;
    const matchesCategory = categoryFilter === "all" || transaction.category === categoryFilter;
    
    return matchesSearch && matchesType && matchesCategory;
  });

  // Calculate metrics
  const totalIncome = mockTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = mockTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netPosition = totalIncome - totalExpenses;

  const categories = [...new Set(mockTransactions.map(t => t.category))];

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
            <p className="text-muted-foreground">Please add a business to manage transactions.</p>
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
            <h1 className="text-2xl font-bold text-foreground">Transactions</h1>
            <p className="text-muted-foreground">
              View and manage all your business transactions
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Add Transaction
          </Button>
        </div>

        {/* Transaction Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Income</p>
                  <p className="text-2xl font-bold">£{totalIncome.toLocaleString()}</p>
                  <p className="text-sm text-success">This month</p>
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
                  <p className="text-sm text-destructive">This month</p>
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
                  <p className="text-sm font-medium text-muted-foreground">Net Position</p>
                  <p className={`text-2xl font-bold ${netPosition >= 0 ? 'text-success' : 'text-destructive'}`}>
                    £{netPosition.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">This month</p>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <ArrowUpDown className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Transactions</CardTitle>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 w-64"
                  />
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Date</th>
                    <th className="text-left py-3 px-4 font-medium">Description</th>
                    <th className="text-left py-3 px-4 font-medium">Type</th>
                    <th className="text-left py-3 px-4 font-medium">Category</th>
                    <th className="text-left py-3 px-4 font-medium">Vendor</th>
                    <th className="text-left py-3 px-4 font-medium">Net Amount</th>
                    <th className="text-left py-3 px-4 font-medium">VAT</th>
                    <th className="text-left py-3 px-4 font-medium">Total</th>
                    <th className="text-left py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-muted/50">
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {new Date(transaction.transactionDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(transaction.type)}
                          <div>
                            <p className="font-medium text-sm">{transaction.description}</p>
                            <p className="text-xs text-muted-foreground">{transaction.reference}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {getTypeBadge(transaction.type)}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {transaction.category}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {transaction.vendor}
                      </td>
                      <td className="py-3 px-4 font-medium">
                        £{transaction.netAmount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        £{transaction.vatAmount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-medium text-lg">
                        £{transaction.amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredTransactions.length === 0 && (
              <div className="text-center py-8">
                <ArrowUpDown className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No transactions found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || typeFilter !== "all" || categoryFilter !== "all" 
                    ? "Try adjusting your search or filters"
                    : "Add your first transaction to get started"
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ClientLayout>
  );
}