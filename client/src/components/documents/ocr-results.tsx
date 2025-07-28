import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Edit, Eye, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Document } from '@shared/schema';

interface OCRResultsProps {
  document: Document;
}

export default function OCRResults({ document }: OCRResultsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    amount: document.amount || '',
    vatAmount: document.vatAmount || '',
    netAmount: document.netAmount || '',
    supplier: document.supplier || '',
    category: document.category || '',
    description: document.description || ''
  });

  const updateMutation = useMutation({
    mutationFn: async (updates: any) => {
      const response = await apiRequest('PUT', `/api/documents/${document.id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/documents'] });
      setIsEditing(false);
      toast({
        title: "Document updated successfully",
        description: "Changes have been saved",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update document",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const approveMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('PUT', `/api/documents/${document.id}`, {
        status: 'approved'
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/documents'] });
      toast({
        title: "Document approved",
        description: "Transaction has been posted to ledger",
      });
    }
  });

  const rejectMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('PUT', `/api/documents/${document.id}`, {
        status: 'rejected'
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/documents'] });
      toast({
        title: "Document rejected",
        description: "Document has been marked for review",
        variant: "destructive",
      });
    }
  });

  const handleSave = () => {
    updateMutation.mutate(formData);
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

  let ocrData;
  try {
    ocrData = document.ocrData ? JSON.parse(document.ocrData) : null;
  } catch {
    ocrData = null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{document.fileName}</CardTitle>
            <p className="text-sm text-muted-foreground">
              Uploaded {new Date(document.createdAt!).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusBadge(document.status!)}
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              View
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* OCR Confidence */}
        {ocrData?.confidence && (
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <span className="text-sm font-medium">OCR Confidence</span>
            <span className="text-sm">{Math.round(ocrData.confidence * 100)}%</span>
          </div>
        )}

        {/* Extracted Information */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium">Extracted Information</h4>
            {!isEditing && document.status === 'processed' && (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Amount</Label>
              {isEditing ? (
                <Input
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  placeholder="£0.00"
                />
              ) : (
                <p className="font-medium">£{document.amount || '0.00'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>VAT Amount</Label>
              {isEditing ? (
                <Input
                  value={formData.vatAmount}
                  onChange={(e) => setFormData(prev => ({ ...prev, vatAmount: e.target.value }))}
                  placeholder="£0.00"
                />
              ) : (
                <p className="font-medium">£{document.vatAmount || '0.00'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Net Amount</Label>
              {isEditing ? (
                <Input
                  value={formData.netAmount}
                  onChange={(e) => setFormData(prev => ({ ...prev, netAmount: e.target.value }))}
                  placeholder="£0.00"
                />
              ) : (
                <p className="font-medium">£{document.netAmount || '0.00'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Date</Label>
              <p className="font-medium">
                {document.transactionDate 
                  ? new Date(document.transactionDate).toLocaleDateString()
                  : 'Not set'
                }
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <Label>Supplier</Label>
              {isEditing ? (
                <Input
                  value={formData.supplier}
                  onChange={(e) => setFormData(prev => ({ ...prev, supplier: e.target.value }))}
                  placeholder="Supplier name"
                />
              ) : (
                <p className="font-medium">{document.supplier || 'Not identified'}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              {isEditing ? (
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="office_expenses">Office Expenses</SelectItem>
                    <SelectItem value="travel">Travel & Transport</SelectItem>
                    <SelectItem value="utilities">Utilities</SelectItem>
                    <SelectItem value="professional_services">Professional Services</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="equipment">Equipment</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <p className="font-medium capitalize">
                  {document.category?.replace('_', ' ') || 'Uncategorized'}
                </p>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Add description"
              />
            </div>
          )}
        </div>

        <Separator />

        {/* Actions */}
        <div className="flex justify-between items-center">
          {isEditing ? (
            <div className="flex space-x-2">
              <Button onClick={handleSave} disabled={updateMutation.isPending}>
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          ) : (
            <div className="flex space-x-2">
              {document.status === 'processed' && (
                <>
                  <Button 
                    onClick={() => approveMutation.mutate()}
                    disabled={approveMutation.isPending}
                    className="bg-success hover:bg-success/90"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve & Post
                  </Button>
                  <Button 
                    variant="destructive"
                    onClick={() => rejectMutation.mutate()}
                    disabled={rejectMutation.isPending}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
