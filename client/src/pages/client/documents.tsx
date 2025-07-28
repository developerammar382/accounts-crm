import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ClientLayout from "@/components/layout/client-layout";
import UploadZone from "@/components/documents/upload-zone";
import OCRResults from "@/components/documents/ocr-results";
import { 
  Search,
  FileText,
  Eye,
  Edit,
  Download,
  CheckCircle,
  Clock,
  AlertTriangle
} from "lucide-react";
import type { Document } from "@shared/schema";

export default function ClientDocuments() {
  const { data: businesses = [], isLoading: businessesLoading } = useQuery({
    queryKey: ['/api/businesses'],
  });

  const selectedBusiness = businesses[0];

  const { data: documents = [], isLoading: documentsLoading } = useQuery({
    queryKey: ['/api/documents', selectedBusiness?.id],
    enabled: !!selectedBusiness?.id,
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'pending':
      case 'processing':
        return <Clock className="h-4 w-4 text-warning" />;
      case 'review_needed':
      case 'rejected':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: 'outline' as const, text: 'Pending' },
      processing: { variant: 'outline' as const, text: 'Processing' },
      processed: { variant: 'default' as const, text: 'Processed' },
      review_needed: { variant: 'destructive' as const, text: 'Review Needed' },
      approved: { variant: 'default' as const, text: 'Approved' },
      rejected: { variant: 'destructive' as const, text: 'Rejected' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <Badge variant={config.variant}>
        {config.text}
      </Badge>
    );
  };

  const recentUploads = documents
    .filter((doc: Document) => doc.status === 'processed' || doc.status === 'processing')
    .slice(0, 3);

  if (businessesLoading) {
    return (
      <ClientLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-8 w-64 mb-6" />
          <Skeleton className="h-64 mb-6" />
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
              <p className="text-muted-foreground">Please add a business to manage documents.</p>
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
        <div>
          <h1 className="text-2xl font-bold text-foreground">Document Management</h1>
          <p className="text-muted-foreground">
            Upload, organize, and manage your financial documents
          </p>
        </div>

        {/* Upload Zone */}
        <UploadZone businessId={selectedBusiness.id} />

        {/* Recent Uploads */}
        {recentUploads.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Uploads</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentUploads.map((document: Document) => (
                <OCRResults key={document.id} document={document} />
              ))}
            </CardContent>
          </Card>
        )}

        {/* Document Library */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Document Library</CardTitle>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search documents..."
                    className="pl-9 w-72"
                  />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="invoice">Invoices</SelectItem>
                    <SelectItem value="receipt">Receipts</SelectItem>
                    <SelectItem value="bank_statement">Bank Statements</SelectItem>
                    <SelectItem value="contract">Contracts</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all-dates">
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-dates">All Dates</SelectItem>
                    <SelectItem value="this-month">This Month</SelectItem>
                    <SelectItem value="last-3-months">Last 3 Months</SelectItem>
                    <SelectItem value="this-year">This Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {documentsLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16" />
                ))}
              </div>
            ) : documents.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No documents found</h3>
                <p className="text-muted-foreground">
                  Upload your first document to get started
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Document</th>
                      <th className="text-left py-3 px-4 font-medium">Type</th>
                      <th className="text-left py-3 px-4 font-medium">Amount</th>
                      <th className="text-left py-3 px-4 font-medium">Date</th>
                      <th className="text-left py-3 px-4 font-medium">Category</th>
                      <th className="text-left py-3 px-4 font-medium">Status</th>
                      <th className="text-left py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {documents.map((document: Document) => (
                      <tr key={document.id} className="hover:bg-muted/50">
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            {getStatusIcon(document.status!)}
                            <div>
                              <p className="font-medium text-sm">{document.fileName}</p>
                              <p className="text-xs text-muted-foreground">
                                {document.supplier || 'Unknown supplier'}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline">
                            {document.category?.replace('_', ' ').toUpperCase() || 'OTHER'}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 font-medium">
                          £{document.amount || '0.00'}
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {document.transactionDate 
                            ? new Date(document.transactionDate).toLocaleDateString()
                            : 'Not set'
                          }
                        </td>
                        <td className="py-3 px-4">
                          <span className="capitalize text-sm">
                            {document.category?.replace('_', ' ') || 'Uncategorized'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {getStatusBadge(document.status!)}
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
            )}
          </CardContent>
        </Card>
      </div>
    </ClientLayout>
  );
}
