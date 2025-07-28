import {
  type User,
  type InsertUser,
  type Business,
  type InsertBusiness,
  type Document,
  type InsertDocument,
  type Transaction,
  type InsertTransaction,
  type Invoice,
  type InsertInvoice,
  type VatReturn,
  type InsertVatReturn,
  type ActivityLog,
  type InsertActivityLog,
  type ClientInvitation,
  type InsertClientInvitation,
  type AccountantClient,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined>;
  
  // Business operations
  getBusiness(id: string): Promise<Business | undefined>;
  getBusinessesByOwner(ownerId: string): Promise<Business[]>;
  createBusiness(business: InsertBusiness): Promise<Business>;
  updateBusiness(id: string, business: Partial<InsertBusiness>): Promise<Business | undefined>;
  
  // Accountant-Client relationships
  getClientsByAccountant(accountantId: string): Promise<User[]>;
  getAccountantsByClient(clientId: string): Promise<User[]>;
  assignAccountantToClient(accountantId: string, clientId: string, businessId: string): Promise<AccountantClient>;
  revokeAccountantAccess(accountantId: string, clientId: string, businessId: string): Promise<void>;
  
  // Document operations
  getDocument(id: string): Promise<Document | undefined>;
  getDocumentsByBusiness(businessId: string): Promise<Document[]>;
  getDocumentsByStatus(status: string): Promise<Document[]>;
  createDocument(document: InsertDocument): Promise<Document>;
  updateDocument(id: string, document: Partial<InsertDocument>): Promise<Document | undefined>;
  
  // Transaction operations
  getTransaction(id: string): Promise<Transaction | undefined>;
  getTransactionsByBusiness(businessId: string): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransaction(id: string, transaction: Partial<InsertTransaction>): Promise<Transaction | undefined>;
  
  // Invoice operations
  getInvoice(id: string): Promise<Invoice | undefined>;
  getInvoicesByBusiness(businessId: string): Promise<Invoice[]>;
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;
  updateInvoice(id: string, invoice: Partial<InsertInvoice>): Promise<Invoice | undefined>;
  
  // VAT Return operations
  getVatReturn(id: string): Promise<VatReturn | undefined>;
  getVatReturnsByBusiness(businessId: string): Promise<VatReturn[]>;
  createVatReturn(vatReturn: InsertVatReturn): Promise<VatReturn>;
  updateVatReturn(id: string, vatReturn: Partial<InsertVatReturn>): Promise<VatReturn | undefined>;
  
  // Activity log operations
  createActivityLog(log: InsertActivityLog): Promise<ActivityLog>;
  getActivityLogsByUser(userId: string): Promise<ActivityLog[]>;
  getActivityLogsByBusiness(businessId: string): Promise<ActivityLog[]>;
  
  // Client invitation operations
  createClientInvitation(invitation: InsertClientInvitation): Promise<ClientInvitation>;
  getClientInvitationByToken(token: string): Promise<ClientInvitation | undefined>;
  updateClientInvitation(id: string, invitation: Partial<InsertClientInvitation>): Promise<ClientInvitation | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private businesses: Map<string, Business>;
  private accountantClients: Map<string, AccountantClient>;
  private documents: Map<string, Document>;
  private transactions: Map<string, Transaction>;
  private invoices: Map<string, Invoice>;
  private vatReturns: Map<string, VatReturn>;
  private activityLogs: Map<string, ActivityLog>;
  private clientInvitations: Map<string, ClientInvitation>;

  constructor() {
    this.users = new Map();
    this.businesses = new Map();
    this.accountantClients = new Map();
    this.documents = new Map();
    this.transactions = new Map();
    this.invoices = new Map();
    this.vatReturns = new Map();
    this.activityLogs = new Map();
    this.clientInvitations = new Map();

    // Seed with demo data
    this.seedData();
  }

  private seedData() {
    // Create demo accountant
    const accountantId = randomUUID();
    const accountant: User = {
      id: accountantId,
      email: "sarah@accountingfirm.co.uk",
      password: "password123",
      firstName: "Sarah",
      lastName: "Johnson",
      phone: "0207 123 4567",
      role: "accountant",
      address: "123 Accounting Street",
      city: "London",
      postcode: "EC1A 1BB",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(accountantId, accountant);

    // Create demo client
    const clientId = randomUUID();
    const client: User = {
      id: clientId,
      email: "john.smith@example.co.uk",
      password: "password123",
      firstName: "John",
      lastName: "Smith",
      phone: "07123 456789",
      role: "client",
      address: "456 Business Avenue",
      city: "London",
      postcode: "SW1A 1AA",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(clientId, client);

    // Create demo businesses
    const business1Id = randomUUID();
    const business1: Business = {
      id: business1Id,
      ownerId: clientId,
      companyName: "Smith Consulting Ltd",
      companyNumber: "12345678",
      utr: "1234567890",
      vatNumber: "GB123456789",
      vatScheme: "standard",
      businessType: "limited_company",
      industry: "Consulting",
      address: "456 Business Avenue",
      city: "London",
      postcode: "SW1A 1AA",
      isActive: true,
      isPrimary: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.businesses.set(business1Id, business1);

    const business2Id = randomUUID();
    const business2: Business = {
      id: business2Id,
      ownerId: clientId,
      companyName: "Smith Property Holdings",
      companyNumber: "87654321",
      utr: "0987654321",
      vatNumber: null,
      vatScheme: "not_registered",
      businessType: "limited_company",
      industry: "Property",
      address: "456 Business Avenue",
      city: "London",
      postcode: "SW1A 1AA",
      isActive: true,
      isPrimary: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.businesses.set(business2Id, business2);

    // Create accountant-client relationship
    const relationshipId = randomUUID();
    const relationship: AccountantClient = {
      id: relationshipId,
      accountantId,
      clientId,
      businessId: business1Id,
      hasAccess: true,
      createdAt: new Date(),
    };
    this.accountantClients.set(relationshipId, relationship);
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updateData: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser: User = {
      ...user,
      ...updateData,
      updatedAt: new Date(),
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Business operations
  async getBusiness(id: string): Promise<Business | undefined> {
    return this.businesses.get(id);
  }

  async getBusinessesByOwner(ownerId: string): Promise<Business[]> {
    return Array.from(this.businesses.values()).filter(business => business.ownerId === ownerId);
  }

  async createBusiness(insertBusiness: InsertBusiness): Promise<Business> {
    const id = randomUUID();
    const business: Business = {
      ...insertBusiness,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.businesses.set(id, business);
    return business;
  }

  async updateBusiness(id: string, updateData: Partial<InsertBusiness>): Promise<Business | undefined> {
    const business = this.businesses.get(id);
    if (!business) return undefined;

    const updatedBusiness: Business = {
      ...business,
      ...updateData,
      updatedAt: new Date(),
    };
    this.businesses.set(id, updatedBusiness);
    return updatedBusiness;
  }

  // Accountant-Client relationships
  async getClientsByAccountant(accountantId: string): Promise<User[]> {
    const relationships = Array.from(this.accountantClients.values())
      .filter(rel => rel.accountantId === accountantId && rel.hasAccess);
    
    const clientIds = relationships.map(rel => rel.clientId);
    return Array.from(this.users.values()).filter(user => clientIds.includes(user.id));
  }

  async getAccountantsByClient(clientId: string): Promise<User[]> {
    const relationships = Array.from(this.accountantClients.values())
      .filter(rel => rel.clientId === clientId && rel.hasAccess);
    
    const accountantIds = relationships.map(rel => rel.accountantId);
    return Array.from(this.users.values()).filter(user => accountantIds.includes(user.id));
  }

  async assignAccountantToClient(accountantId: string, clientId: string, businessId: string): Promise<AccountantClient> {
    const id = randomUUID();
    const relationship: AccountantClient = {
      id,
      accountantId,
      clientId,
      businessId,
      hasAccess: true,
      createdAt: new Date(),
    };
    this.accountantClients.set(id, relationship);
    return relationship;
  }

  async revokeAccountantAccess(accountantId: string, clientId: string, businessId: string): Promise<void> {
    const relationship = Array.from(this.accountantClients.values())
      .find(rel => rel.accountantId === accountantId && rel.clientId === clientId && rel.businessId === businessId);
    
    if (relationship) {
      relationship.hasAccess = false;
      this.accountantClients.set(relationship.id, relationship);
    }
  }

  // Document operations
  async getDocument(id: string): Promise<Document | undefined> {
    return this.documents.get(id);
  }

  async getDocumentsByBusiness(businessId: string): Promise<Document[]> {
    return Array.from(this.documents.values()).filter(doc => doc.businessId === businessId);
  }

  async getDocumentsByStatus(status: string): Promise<Document[]> {
    return Array.from(this.documents.values()).filter(doc => doc.status === status);
  }

  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const id = randomUUID();
    const document: Document = {
      ...insertDocument,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.documents.set(id, document);
    return document;
  }

  async updateDocument(id: string, updateData: Partial<InsertDocument>): Promise<Document | undefined> {
    const document = this.documents.get(id);
    if (!document) return undefined;

    const updatedDocument: Document = {
      ...document,
      ...updateData,
      updatedAt: new Date(),
    };
    this.documents.set(id, updatedDocument);
    return updatedDocument;
  }

  // Transaction operations
  async getTransaction(id: string): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }

  async getTransactionsByBusiness(businessId: string): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(txn => txn.businessId === businessId);
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = randomUUID();
    const transaction: Transaction = {
      ...insertTransaction,
      id,
      createdAt: new Date(),
    };
    this.transactions.set(id, transaction);
    return transaction;
  }

  async updateTransaction(id: string, updateData: Partial<InsertTransaction>): Promise<Transaction | undefined> {
    const transaction = this.transactions.get(id);
    if (!transaction) return undefined;

    const updatedTransaction: Transaction = {
      ...transaction,
      ...updateData,
    };
    this.transactions.set(id, updatedTransaction);
    return updatedTransaction;
  }

  // Invoice operations
  async getInvoice(id: string): Promise<Invoice | undefined> {
    return this.invoices.get(id);
  }

  async getInvoicesByBusiness(businessId: string): Promise<Invoice[]> {
    return Array.from(this.invoices.values()).filter(invoice => invoice.businessId === businessId);
  }

  async createInvoice(insertInvoice: InsertInvoice): Promise<Invoice> {
    const id = randomUUID();
    const invoice: Invoice = {
      ...insertInvoice,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.invoices.set(id, invoice);
    return invoice;
  }

  async updateInvoice(id: string, updateData: Partial<InsertInvoice>): Promise<Invoice | undefined> {
    const invoice = this.invoices.get(id);
    if (!invoice) return undefined;

    const updatedInvoice: Invoice = {
      ...invoice,
      ...updateData,
      updatedAt: new Date(),
    };
    this.invoices.set(id, updatedInvoice);
    return updatedInvoice;
  }

  // VAT Return operations
  async getVatReturn(id: string): Promise<VatReturn | undefined> {
    return this.vatReturns.get(id);
  }

  async getVatReturnsByBusiness(businessId: string): Promise<VatReturn[]> {
    return Array.from(this.vatReturns.values()).filter(vatReturn => vatReturn.businessId === businessId);
  }

  async createVatReturn(insertVatReturn: InsertVatReturn): Promise<VatReturn> {
    const id = randomUUID();
    const vatReturn: VatReturn = {
      ...insertVatReturn,
      id,
      createdAt: new Date(),
    };
    this.vatReturns.set(id, vatReturn);
    return vatReturn;
  }

  async updateVatReturn(id: string, updateData: Partial<InsertVatReturn>): Promise<VatReturn | undefined> {
    const vatReturn = this.vatReturns.get(id);
    if (!vatReturn) return undefined;

    const updatedVatReturn: VatReturn = {
      ...vatReturn,
      ...updateData,
    };
    this.vatReturns.set(id, updatedVatReturn);
    return updatedVatReturn;
  }

  // Activity log operations
  async createActivityLog(insertLog: InsertActivityLog): Promise<ActivityLog> {
    const id = randomUUID();
    const log: ActivityLog = {
      ...insertLog,
      id,
      createdAt: new Date(),
    };
    this.activityLogs.set(id, log);
    return log;
  }

  async getActivityLogsByUser(userId: string): Promise<ActivityLog[]> {
    return Array.from(this.activityLogs.values()).filter(log => log.userId === userId);
  }

  async getActivityLogsByBusiness(businessId: string): Promise<ActivityLog[]> {
    return Array.from(this.activityLogs.values()).filter(log => log.businessId === businessId);
  }

  // Client invitation operations
  async createClientInvitation(insertInvitation: InsertClientInvitation): Promise<ClientInvitation> {
    const id = randomUUID();
    const invitation: ClientInvitation = {
      ...insertInvitation,
      id,
      createdAt: new Date(),
    };
    this.clientInvitations.set(id, invitation);
    return invitation;
  }

  async getClientInvitationByToken(token: string): Promise<ClientInvitation | undefined> {
    return Array.from(this.clientInvitations.values()).find(invitation => invitation.token === token);
  }

  async updateClientInvitation(id: string, updateData: Partial<InsertClientInvitation>): Promise<ClientInvitation | undefined> {
    const invitation = this.clientInvitations.get(id);
    if (!invitation) return undefined;

    const updatedInvitation: ClientInvitation = {
      ...invitation,
      ...updateData,
    };
    this.clientInvitations.set(id, updatedInvitation);
    return updatedInvitation;
  }
}

export const storage = new MemStorage();
