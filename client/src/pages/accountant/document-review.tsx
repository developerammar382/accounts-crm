import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import AccountantLayout from "@/components/layout/accountant-layout";
import OCRResults from "@/components/documents/ocr-results";
import { 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw,
  FileText,
  Eye
} from "lucide-react";
import type { Document } from "@shared/schema";

export default function AccountantDocumentReview() {
  const { data: documentsAwaitingReview = [], isLoading: documentsLoading } = useQuery({
    queryKey: ['/api/documents/review'],
  });

  // Calculate stats
  const pendingReview = documentsAwaitingReview.filter((d: Document) => d.status === 'pending' || d.status === 'review_needed').length;
  const approvedToday = 18; // Mock data
  const needsCorrection = documentsAwaitingReview.filter((d: Document) => d.status === 'rejected').length;
  const processing = documentsAwaitingReview.filter((d: Document) => d.status === 'processing').length;

  if (documentsLoading) {
    return (
      <AccountantLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <Skeleton className="h-8 w-64" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-64" />
              ))}
            </div>
          </div>
        </div>
      </AccountantLayout>
    );
  }

  return (
    <AccountantLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Document Review Queue</h1>
          <p className="text-muted-foreground">
            Review and approve client-uploaded documents
          </p>
        </div>

        {/* Review Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Review</p>
                  <p className="text-2xl font-bold">{pendingReview}</p>
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
                  <p className="text-sm font-medium text-muted-foreground">Approved Today</p>
                  <p className="text-2xl font-bold">{approvedToday}</p>
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
                  <p className="text-sm font-medium text-muted-foreground">Needs Correction</p>
                  <p className="text-2xl font-bold">{needsCorrection}</p>
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
                  <p className="text-sm font-medium text-muted-foreground">Processing</p>
                  <p className="text-2xl font-bold">{processing}</p>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <RefreshCw className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Documents Awaiting Review</CardTitle>
              <div className="flex items-center space-x-4">
                <Select defaultValue="all-clients">
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-clients">All Clients</SelectItem>
                    <SelectItem value="abc-trading">ABC Trading Ltd</SelectItem>
                    <SelectItem value="xyz-services">XYZ Services Ltd</SelectItem>
                    <SelectItem value="tech-consulting">Tech Consulting Co</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all-types">
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-types">All Types</SelectItem>
                    <SelectItem value="invoice">Invoices</SelectItem>
                    <SelectItem value="receipt">Receipts</SelectItem>
                    <SelectItem value="bank_statement">Bank Statements</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {documentsAwaitingReview.length === 0 ? (
              <div className="text-center py-12">
                <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No documents to review</h3>
                <p className="text-muted-foreground">
                  All client documents have been processed and approved
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {documentsAwaitingReview.map((document: Document) => (
                  <div key={document.id}>
                    <OCRResults document={document} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bulk Actions */}
        {documentsAwaitingReview.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Bulk Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Select defaultValue="">
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="approve-all">Approve All Processed</SelectItem>
                    <SelectItem value="reject-selected">Reject Selected</SelectItem>
                    <SelectItem value="assign-category">Assign Category</SelectItem>
                    <SelectItem value="export-data">Export Data</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Select documents above to perform bulk actions
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AccountantLayout>
  );
}
