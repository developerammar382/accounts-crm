import { queryClient } from "./queryClient";

class ApiClient {
  private getHeaders(): HeadersInit {
    const user = JSON.parse(localStorage.getItem("uk-tax-user") || "null");
    return {
      "Content-Type": "application/json",
      ...(user && { "X-User-Id": user.id }),
    };
  }

  async get<T>(url: string): Promise<T> {
    const response = await fetch(url, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async post<T>(url: string, data: any): Promise<T> {
    const response = await fetch(url, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async put<T>(url: string, data: any): Promise<T> {
    const response = await fetch(url, {
      method: "PUT",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async delete<T>(url: string): Promise<T> {
    const response = await fetch(url, {
      method: "DELETE",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}

export const api = new ApiClient();

// API hooks
export const useBusinesses = () => {
  return {
    queryKey: ["/api/businesses"],
    queryFn: () => api.get("/api/businesses"),
  };
};

export const useDashboardStats = (businessId?: string) => {
  return {
    queryKey: ["/api/dashboard/stats", businessId],
    queryFn: () => api.get(`/api/dashboard/stats${businessId ? `?businessId=${businessId}` : ""}`),
  };
};

export const useDocuments = (businessId: string) => {
  return {
    queryKey: ["/api/businesses", businessId, "documents"],
    queryFn: () => api.get(`/api/businesses/${businessId}/documents`),
  };
};

export const useTransactions = (businessId: string) => {
  return {
    queryKey: ["/api/businesses", businessId, "transactions"],
    queryFn: () => api.get(`/api/businesses/${businessId}/transactions`),
  };
};

export const useInvoices = (businessId: string) => {
  return {
    queryKey: ["/api/businesses", businessId, "invoices"],
    queryFn: () => api.get(`/api/businesses/${businessId}/invoices`),
  };
};

export const useVatReturns = (businessId: string) => {
  return {
    queryKey: ["/api/businesses", businessId, "vat-returns"],
    queryFn: () => api.get(`/api/businesses/${businessId}/vat-returns`),
  };
};

export const useActivityLogs = (businessId?: string) => {
  return {
    queryKey: ["/api/activity-logs", businessId],
    queryFn: () => api.get(`/api/activity-logs${businessId ? `?businessId=${businessId}` : ""}`),
  };
};

export const useAccountantClients = () => {
  return {
    queryKey: ["/api/accountant/clients"],
    queryFn: () => api.get("/api/accountant/clients"),
  };
};

// Mutation helpers
export const createDocument = (businessId: string, document: any) => {
  return api.post(`/api/businesses/${businessId}/documents`, document);
};

export const updateDocument = (documentId: string, document: any) => {
  return api.put(`/api/documents/${documentId}`, document);
};

export const createTransaction = (businessId: string, transaction: any) => {
  return api.post(`/api/businesses/${businessId}/transactions`, transaction);
};

export const createInvoice = (businessId: string, invoice: any) => {
  return api.post(`/api/businesses/${businessId}/invoices`, invoice);
};

export const updateInvoice = (invoiceId: string, invoice: any) => {
  return api.put(`/api/invoices/${invoiceId}`, invoice);
};

export const createVatReturn = (businessId: string, vatReturn: any) => {
  return api.post(`/api/businesses/${businessId}/vat-returns`, vatReturn);
};

export const updateVatReturn = (vatReturnId: string, vatReturn: any) => {
  return api.put(`/api/vat-returns/${vatReturnId}`, vatReturn);
};

export const createBusiness = (business: any) => {
  return api.post("/api/businesses", business);
};

export const updateBusiness = (businessId: string, business: any) => {
  return api.put(`/api/businesses/${businessId}`, business);
};

export const inviteClient = (email: string) => {
  return api.post("/api/accountant/invite-client", { email });
};
