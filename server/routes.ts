import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertBusinessSchema, insertDocumentSchema, insertTransactionSchema, insertInvoiceSchema, insertVatReturnSchema } from "@shared/schema";
import { randomUUID } from "crypto";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user || user.password !== password) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // In a real app, you'd use proper session management or JWT
      res.json({
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        }
      });
    } catch (error) {
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      const user = await storage.createUser(userData);
      
      res.status(201).json({
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        }
      });
    } catch (error) {
      res.status(400).json({ error: "Registration failed" });
    }
  });

  // User routes
  app.get("/api/users/me", async (req, res) => {
    // In a real app, extract user ID from session/JWT
    const userId = req.headers["x-user-id"] as string;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      phone: user.phone,
      address: user.address,
      city: user.city,
      postcode: user.postcode,
    });
  });

  app.put("/api/users/me", async (req, res) => {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const updateData = req.body;
      const updatedUser = await storage.updateUser(userId, updateData);
      
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        role: updatedUser.role,
        phone: updatedUser.phone,
        address: updatedUser.address,
        city: updatedUser.city,
        postcode: updatedUser.postcode,
      });
    } catch (error) {
      res.status(400).json({ error: "Update failed" });
    }
  });

  // Business routes
  app.get("/api/businesses", async (req, res) => {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const businesses = await storage.getBusinessesByOwner(userId);
    res.json(businesses);
  });

  app.post("/api/businesses", async (req, res) => {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const businessData = insertBusinessSchema.parse({
        ...req.body,
        ownerId: userId,
      });

      const business = await storage.createBusiness(businessData);
      res.status(201).json(business);
    } catch (error) {
      res.status(400).json({ error: "Failed to create business" });
    }
  });

  app.get("/api/businesses/:id", async (req, res) => {
    const business = await storage.getBusiness(req.params.id);
    if (!business) {
      return res.status(404).json({ error: "Business not found" });
    }
    res.json(business);
  });

  app.put("/api/businesses/:id", async (req, res) => {
    try {
      const updatedBusiness = await storage.updateBusiness(req.params.id, req.body);
      if (!updatedBusiness) {
        return res.status(404).json({ error: "Business not found" });
      }
      res.json(updatedBusiness);
    } catch (error) {
      res.status(400).json({ error: "Failed to update business" });
    }
  });

  // Document routes
  app.get("/api/businesses/:businessId/documents", async (req, res) => {
    const documents = await storage.getDocumentsByBusiness(req.params.businessId);
    res.json(documents);
  });

  app.post("/api/businesses/:businessId/documents", async (req, res) => {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const documentData = insertDocumentSchema.parse({
        ...req.body,
        businessId: req.params.businessId,
        uploadedBy: userId,
      });

      const document = await storage.createDocument(documentData);
      res.status(201).json(document);
    } catch (error) {
      res.status(400).json({ error: "Failed to create document" });
    }
  });

  app.get("/api/documents/:id", async (req, res) => {
    const document = await storage.getDocument(req.params.id);
    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }
    res.json(document);
  });

  app.put("/api/documents/:id", async (req, res) => {
    try {
      const updatedDocument = await storage.updateDocument(req.params.id, req.body);
      if (!updatedDocument) {
        return res.status(404).json({ error: "Document not found" });
      }
      res.json(updatedDocument);
    } catch (error) {
      res.status(400).json({ error: "Failed to update document" });
    }
  });

  // Transaction routes
  app.get("/api/businesses/:businessId/transactions", async (req, res) => {
    const transactions = await storage.getTransactionsByBusiness(req.params.businessId);
    res.json(transactions);
  });

  app.post("/api/businesses/:businessId/transactions", async (req, res) => {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const transactionData = insertTransactionSchema.parse({
        ...req.body,
        businessId: req.params.businessId,
        createdBy: userId,
      });

      const transaction = await storage.createTransaction(transactionData);
      res.status(201).json(transaction);
    } catch (error) {
      res.status(400).json({ error: "Failed to create transaction" });
    }
  });

  // Invoice routes
  app.get("/api/businesses/:businessId/invoices", async (req, res) => {
    const invoices = await storage.getInvoicesByBusiness(req.params.businessId);
    res.json(invoices);
  });

  app.post("/api/businesses/:businessId/invoices", async (req, res) => {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const invoiceData = insertInvoiceSchema.parse({
        ...req.body,
        businessId: req.params.businessId,
        createdBy: userId,
        invoiceNumber: `INV-${new Date().getFullYear()}-${randomUUID().substr(0, 6).toUpperCase()}`,
      });

      const invoice = await storage.createInvoice(invoiceData);
      res.status(201).json(invoice);
    } catch (error) {
      res.status(400).json({ error: "Failed to create invoice" });
    }
  });

  app.put("/api/invoices/:id", async (req, res) => {
    try {
      const updatedInvoice = await storage.updateInvoice(req.params.id, req.body);
      if (!updatedInvoice) {
        return res.status(404).json({ error: "Invoice not found" });
      }
      res.json(updatedInvoice);
    } catch (error) {
      res.status(400).json({ error: "Failed to update invoice" });
    }
  });

  // VAT Return routes
  app.get("/api/businesses/:businessId/vat-returns", async (req, res) => {
    const vatReturns = await storage.getVatReturnsByBusiness(req.params.businessId);
    res.json(vatReturns);
  });

  app.post("/api/businesses/:businessId/vat-returns", async (req, res) => {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const vatReturnData = insertVatReturnSchema.parse({
        ...req.body,
        businessId: req.params.businessId,
        createdBy: userId,
      });

      const vatReturn = await storage.createVatReturn(vatReturnData);
      res.status(201).json(vatReturn);
    } catch (error) {
      res.status(400).json({ error: "Failed to create VAT return" });
    }
  });

  app.put("/api/vat-returns/:id", async (req, res) => {
    try {
      const updatedVatReturn = await storage.updateVatReturn(req.params.id, req.body);
      if (!updatedVatReturn) {
        return res.status(404).json({ error: "VAT return not found" });
      }
      res.json(updatedVatReturn);
    } catch (error) {
      res.status(400).json({ error: "Failed to update VAT return" });
    }
  });

  // Accountant routes
  app.get("/api/accountant/clients", async (req, res) => {
    const accountantId = req.headers["x-user-id"] as string;
    if (!accountantId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const clients = await storage.getClientsByAccountant(accountantId);
    res.json(clients);
  });

  app.post("/api/accountant/invite-client", async (req, res) => {
    const accountantId = req.headers["x-user-id"] as string;
    if (!accountantId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const { email } = req.body;
      const token = randomUUID();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 48); // 48 hour expiry

      const invitation = await storage.createClientInvitation({
        accountantId,
        email,
        token,
        expiresAt,
      });

      res.status(201).json(invitation);
    } catch (error) {
      res.status(400).json({ error: "Failed to create invitation" });
    }
  });

  // Activity logs
  app.get("/api/activity-logs", async (req, res) => {
    const userId = req.headers["x-user-id"] as string;
    const businessId = req.query.businessId as string;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    let logs;
    if (businessId) {
      logs = await storage.getActivityLogsByBusiness(businessId);
    } else {
      logs = await storage.getActivityLogsByUser(userId);
    }

    res.json(logs);
  });

  // Dashboard stats
  app.get("/api/dashboard/stats", async (req, res) => {
    const userId = req.headers["x-user-id"] as string;
    const businessId = req.query.businessId as string;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Calculate dashboard statistics
    const transactions = businessId 
      ? await storage.getTransactionsByBusiness(businessId)
      : [];

    const currentYear = new Date().getFullYear();
    const yearlyTransactions = transactions.filter(t => 
      new Date(t.transactionDate).getFullYear() === currentYear
    );

    const revenue = yearlyTransactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const expenses = yearlyTransactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const profit = revenue - expenses;

    const vatReturns = businessId 
      ? await storage.getVatReturnsByBusiness(businessId)
      : [];

    const pendingVatReturns = vatReturns.filter(vr => 
      vr.status === "draft" || vr.status === "pending_approval"
    );

    const nextVatDue = pendingVatReturns.length > 0 
      ? pendingVatReturns[0].vatDue 
      : "0";

    res.json({
      revenue: revenue.toString(),
      expenses: expenses.toString(), 
      profit: profit.toString(),
      vatDue: nextVatDue,
      pendingVatReturns: pendingVatReturns.length,
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
