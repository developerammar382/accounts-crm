import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import AccountantLayout from "@/components/layouts/AccountantLayout";
import { 
  Percent,
  HardHat,
  Bus,
  CheckCircle,
  Clock,
  AlertTriangle,
  Eye,
  Download,
  Send,
  FileText
} from "lucide-react";

export default function TaxFiling() {
  const { data: clientBusinesses = [], isLoading: businessesLoading } = useQuery({
    queryKey: ['/api/businesses'],
  });

  // Mock tax filing data
  const mockVatReturns = [
    {
      id: "VAT-2024-Q4-001",
      businessName: "Smith Consulting Ltd",
      period: "Q4 2024",
      vatDue: 3256.50,
      netVatDue: 2011.20,
      status: "pending_approval",
      dueDate: "2025-02-07",
      type: "vat"
    },
    {
      id: "VAT-2024-Q4-002",
      businessName: "Tech Solutions Ltd",
      period: "Q4 2024",
      vatDue: 1890.75,
      netVatDue: 1456.30,
      status: "draft",
      dueDate: "2025-02-07",
      type: "vat"
    }
  ];

  const mockCisReturns = [
    {
      id: "CIS-2024-01-001",
      businessName: "Global Construction Ltd",
      period: "January 2024",
      cisDeducted: 2500.00,
      status: "ready_for_submission",
      dueDate: "2024-02-19",
      type: "cis"
    }
  ];

  const mockSelfAssessments = [
    {
      id: "SA-2024-001",
      businessName: "John Smith (Sole Trader)",
      taxYear: "2023-24",
      taxDue: 4500.00,
      status: "in_progress",
      dueDate: "2025-01-31",
      type: "self_assessment"
    }
  ];

  const allReturns = [...mockVatReturns, ...mockCisReturns, ...mockSelfAssessments];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'pending_approval':
      case 'ready_for_submission':
        return <Clock className="h-4 w-4 text-warning" />;
      case 'draft':
      case 'in_progress':
        return <FileText className="h-4 w-4 text-muted-foreground" />;
      case 'overdue':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4 text-warning" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { variant: 'outline' as const, text: 'Draft' },
      in_progress: { variant: 'outline' as const, text: 'In Progress' },
      pending_approval: { variant: 'default' as const, text: 'Pending Approval', className: 'bg-warning hover:bg-warning/80' },
      ready_for_submission: { variant: 'default' as const, text: 'Ready to Submit', className: 'bg-primary hover:bg-primary/80' },
      submitted: { variant: 'default' as const, text: 'Submitted', className: 'bg-success hover:bg-success/80' },
      overdue: { variant: 'destructive' as const, text: 'Overdue' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.text}
      </Badge>
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'vat':
        return <Percent className="h-5 w-5 text-primary" />;
      case 'cis':
        return <HardHat className="h-5 w-5 text-warning" />;
      case 'self_assessment':
        return <Bus className="h-5 w-5 text-success" />;
      default:
        return <FileText className="h-5 w-5 text-muted-foreground" />;
    }
  };

  // Calculate stats
  const pendingApprovals = allReturns.filter(r => r.status === 'pending_approval').length;
  const readyToSubmit = allReturns.filter(r => r.status === 'ready_for_submission').length;
  const overdue = allReturns.filter(r => new Date(r.dueDate) < new Date()).length;
  const submittedThisMonth = 15; // Mock data

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
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tax Filing & Compliance</h1>
          <p className="text-muted-foreground">
            Manage VAT returns, CIS submissions, and self-assessment filings
          </p>
        </div>

        {/* Tax Filing Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Approvals</p>
                  <p className="text-2xl font-bold">{pendingApprovals}</p>
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
                  <p className="text-sm font-medium text-muted-foreground">Ready to Submit</p>
                  <p className="text-2xl font-bold">{readyToSubmit}</p>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Send className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Overdue</p>
                  <p className="text-2xl font-bold">{overdue}</p>
                </div>
                <div className="h-12 w-12 bg-destructive/10 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Submitted This Month</p>
                  <p className="text-2xl font-bold">{submittedThisMonth}</p>
                </div>
                <div className="h-12 w-12 bg-success/10 rounded-xl flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tax Returns List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Tax Returns & Submissions</CardTitle>
              <div className="flex items-center space-x-4">
                <Select defaultValue="all-types">
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-types">All Types</SelectItem>
                    <SelectItem value="vat">VAT Returns</SelectItem>
                    <SelectItem value="cis">CIS Returns</SelectItem>
                    <SelectItem value="self_assessment">Self Assessment</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all-status">
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-status">All Status</SelectItem>
                    <SelectItem value="pending_approval">Pending Approval</SelectItem>
                    <SelectItem value="ready_for_submission">Ready to Submit</SelectItem>
                    <SelectItem value="submitted">Submitted</SelectItem>
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
                    <th className="text-left py-3 px-4 font-medium">Type</th>
                    <th className="text-left py-3 px-4 font-medium">Business</th>
                    <th className="text-left py-3 px-4 font-medium">Period</th>
                    <th className="text-left py-3 px-4 font-medium">Amount Due</th>
                    <th className="text-left py-3 px-4 font-medium">Due Date</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {allReturns.map((returnItem) => (
                    <tr key={returnItem.id} className="hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(returnItem.type)}
                          <span className="font-medium text-sm capitalize">
                            {returnItem.type.replace('_', ' ')}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-medium text-sm">{returnItem.businessName}</p>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {returnItem.period || (returnItem as any).taxYear}
                      </td>
                      <td className="py-3 px-4 font-medium">
                        £{((returnItem as any).netVatDue || (returnItem as any).cisDeducted || (returnItem as any).taxDue || 0).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {new Date(returnItem.dueDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(returnItem.status)}
                          {getStatusBadge(returnItem.status)}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          {returnItem.status === 'pending_approval' && (
                            <Button variant="ghost" size="sm" className="text-success">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                          )}
                          {returnItem.status === 'ready_for_submission' && (
                            <Button variant="ghost" size="sm" className="text-primary">
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

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Percent className="h-5 w-5 text-primary" />
                <span>VAT Returns</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Manage quarterly VAT returns for all clients
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Pending Approval:</span>
                  <span className="font-medium">{mockVatReturns.filter(v => v.status === 'pending_approval').length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Draft:</span>
                  <span className="font-medium">{mockVatReturns.filter(v => v.status === 'draft').length}</span>
                </div>
              </div>
              <Button className="w-full mt-4" variant="outline">
                View All VAT Returns
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <HardHat className="h-5 w-5 text-warning" />
                <span>CIS Returns</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Construction Industry Scheme monthly returns
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Ready to Submit:</span>
                  <span className="font-medium">{mockCisReturns.filter(c => c.status === 'ready_for_submission').length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>This Month:</span>
                  <span className="font-medium">£{mockCisReturns.reduce((sum, c) => sum + c.cisDeducted, 0).toLocaleString()}</span>
                </div>
              </div>
              <Button className="w-full mt-4" variant="outline">
                View All CIS Returns
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bus className="h-5 w-5 text-success" />
                <span>Self Assessment</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Individual tax returns for sole traders and partners
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>In Progress:</span>
                  <span className="font-medium">{mockSelfAssessments.filter(s => s.status === 'in_progress').length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Due Jan 31:</span>
                  <span className="font-medium text-warning">1</span>
                </div>
              </div>
              <Button className="w-full mt-4" variant="outline">
                View All Self Assessments
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AccountantLayout>
  );
}