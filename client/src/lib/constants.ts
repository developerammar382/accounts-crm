export const VAT_SCHEMES = [
  { value: "standard", label: "Standard Rate (20%)" },
  { value: "flat_rate", label: "Flat Rate Scheme" },
  { value: "cash_accounting", label: "Cash Accounting" },
  { value: "not_registered", label: "Not VAT Registered" },
] as const;

export const BUSINESS_TYPES = [
  { value: "sole_trader", label: "Sole Trader" },
  { value: "partnership", label: "Partnership" },
  { value: "limited_company", label: "Limited Company" },
] as const;

export const DOCUMENT_TYPES = [
  { value: "invoice", label: "Invoice" },
  { value: "receipt", label: "Receipt" },
  { value: "bank_statement", label: "Bank Statement" },
  { value: "contract", label: "Contract" },
] as const;

export const EXPENSE_CATEGORIES = [
  "Office Expenses",
  "Travel & Transport",
  "Professional Services", 
  "Utilities",
  "Insurance",
  "Marketing & Advertising",
  "Equipment & Software",
  "Training & Development",
  "Bank Charges",
  "Legal & Professional",
  "Rent & Rates",
  "Repairs & Maintenance",
  "Telephone",
  "Other",
] as const;

export const INCOME_CATEGORIES = [
  "Sales Revenue",
  "Service Income", 
  "Interest Income",
  "Investment Income",
  "Rental Income",
  "Commission Income",
  "Other Income",
] as const;

export const INVOICE_STATUSES = [
  { value: "draft", label: "Draft", color: "bg-gray-100 text-gray-800" },
  { value: "sent", label: "Sent", color: "bg-blue-100 text-blue-800" },
  { value: "paid", label: "Paid", color: "bg-green-100 text-green-800" },
  { value: "overdue", label: "Overdue", color: "bg-red-100 text-red-800" },
] as const;

export const VAT_RETURN_STATUSES = [
  { value: "draft", label: "Draft", color: "bg-gray-100 text-gray-800" },
  { value: "pending_approval", label: "Pending Approval", color: "bg-yellow-100 text-yellow-800" },
  { value: "approved", label: "Approved", color: "bg-green-100 text-green-800" },
  { value: "submitted", label: "Submitted", color: "bg-blue-100 text-blue-800" },
] as const;

export const DOCUMENT_STATUSES = [
  { value: "pending", label: "Pending", color: "bg-gray-100 text-gray-800" },
  { value: "processing", label: "Processing", color: "bg-yellow-100 text-yellow-800" },
  { value: "processed", label: "Processed", color: "bg-green-100 text-green-800" },
  { value: "rejected", label: "Rejected", color: "bg-red-100 text-red-800" },
] as const;

export const UK_CHART_OF_ACCOUNTS = [
  // Assets
  { code: "1000", name: "Bank Current Account", type: "asset" },
  { code: "1001", name: "Bank Deposit Account", type: "asset" },
  { code: "1002", name: "Petty Cash", type: "asset" },
  { code: "1100", name: "Accounts Receivable", type: "asset" },
  { code: "1200", name: "Stock/Inventory", type: "asset" },
  { code: "1500", name: "Computer Equipment", type: "asset" },
  { code: "1501", name: "Office Equipment", type: "asset" },
  { code: "1502", name: "Furniture & Fixtures", type: "asset" },

  // Liabilities
  { code: "2000", name: "Accounts Payable", type: "liability" },
  { code: "2001", name: "VAT on Purchases", type: "liability" },
  { code: "2002", name: "VAT on Sales", type: "liability" },
  { code: "2003", name: "PAYE/NIC Payable", type: "liability" },
  { code: "2004", name: "Corporation Tax", type: "liability" },
  { code: "2100", name: "Bank Loan", type: "liability" },
  { code: "2200", name: "Directors' Loan Account", type: "liability" },

  // Equity
  { code: "3000", name: "Share Capital", type: "equity" },
  { code: "3001", name: "Retained Earnings", type: "equity" },

  // Income
  { code: "4000", name: "Sales", type: "income" },
  { code: "4001", name: "Service Income", type: "income" },
  { code: "4002", name: "Interest Received", type: "income" },
  { code: "4003", name: "Other Income", type: "income" },

  // Expenses
  { code: "5000", name: "Cost of Sales", type: "expense" },
  { code: "6000", name: "Advertising", type: "expense" },
  { code: "6001", name: "Bank Charges", type: "expense" },
  { code: "6002", name: "Computer Expenses", type: "expense" },
  { code: "6003", name: "Depreciation", type: "expense" },
  { code: "6004", name: "Insurance", type: "expense" },
  { code: "6005", name: "Legal & Professional", type: "expense" },
  { code: "6006", name: "Motor Expenses", type: "expense" },
  { code: "6007", name: "Office Expenses", type: "expense" },
  { code: "6008", name: "Printing & Stationery", type: "expense" },
  { code: "6009", name: "Rent", type: "expense" },
  { code: "6010", name: "Repairs & Maintenance", type: "expense" },
  { code: "6011", name: "Telephone", type: "expense" },
  { code: "6012", name: "Travel", type: "expense" },
  { code: "6013", name: "Utilities", type: "expense" },
  { code: "6014", name: "Wages & Salaries", type: "expense" },
  { code: "6015", name: "Training", type: "expense" },
] as const;

export const NOTIFICATION_TYPES = [
  "document_uploaded",
  "document_processed", 
  "vat_return_due",
  "invoice_overdue",
  "payment_received",
  "client_invitation_sent",
  "approval_required",
] as const;

export const PRIORITY_LEVELS = [
  { value: "low", label: "Low", color: "bg-green-100 text-green-800" },
  { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-800" },
  { value: "high", label: "High", color: "bg-red-100 text-red-800" },
] as const;
