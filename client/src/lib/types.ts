export interface DashboardStats {
  revenue: string;
  expenses: string;
  profit: string;
  vatDue: string;
  pendingVatReturns: number;
}

export interface ChartData {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export interface ActivityItem {
  id: string;
  type: "upload" | "approval" | "invoice" | "payment" | "filing";
  description: string;
  timestamp: Date;
  user?: string;
  business?: string;
}

export interface PendingAction {
  id: string;
  type: "vat_return" | "document_upload" | "review" | "approval";
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  dueDate?: Date;
  businessId?: string;
}

export interface FileUploadResult {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  status: "pending" | "processing" | "processed" | "error";
  ocrData?: any;
  extractedAmount?: string;
  extractedDate?: Date;
  extractedVendor?: string;
  category?: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface FinancialReportData {
  income: Array<{
    category: string;
    amount: number;
  }>;
  expenses: Array<{
    category: string;
    amount: number;
  }>;
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
}

export interface VatReturnData {
  periodStart: Date;
  periodEnd: Date;
  vatDue: number;
  vatReclaimed: number;
  netVatDue: number;
  totalSales: number;
  totalPurchases: number;
  status: "draft" | "pending_approval" | "approved" | "submitted";
  dueDate: Date;
}

export type UserRole = "client" | "accountant" | "admin";
export type BusinessType = "sole_trader" | "partnership" | "limited_company";
export type VatScheme = "standard" | "flat_rate" | "cash_accounting" | "not_registered";
export type DocumentType = "invoice" | "receipt" | "bank_statement" | "contract";
export type TransactionType = "income" | "expense";
export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue";
