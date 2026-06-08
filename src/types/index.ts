// ─── Core Enums ──────────────────────────────────────────────────────────────

export type SupplierStatus = "Draft" | "Submitted" | "Under Review" | "Approved" | "Rejected" | "Blocked";
export type RiskLevel = "Low" | "Medium" | "High" | "Critical";
export type POStatus = "Draft" | "Pending Approval" | "Approved" | "Released" | "Closed";
export type InvoiceStatus = "Pending" | "Matched" | "Approved" | "Paid" | "Rejected";
export type ContractStatus = "Active" | "Expiring" | "Expired" | "Draft";
export type RFQStatus = "Draft" | "Published" | "Closed" | "Awarded";
export type UserRole = "Admin" | "Procurement Manager" | "Supplier" | "Finance User" | "Executive";
export type SyncStatus = "Synced" | "Pending" | "Failed" | "Not Synced";

// ─── Supplier ─────────────────────────────────────────────────────────────────

export interface Contact {
  id: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  isPrimary: boolean;
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  routingNumber: string;
  currency: string;
  isDefault: boolean;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate: string;
  status: "Valid" | "Expiring" | "Expired";
}

export interface Supplier {
  id: string;
  name: string;
  code: string;
  status: SupplierStatus;
  category: string;
  subCategory: string;
  country: string;
  region: string;
  city: string;
  address: string;
  website: string;
  email: string;
  phone: string;
  taxId: string;
  annualSpend: number;
  riskLevel: RiskLevel;
  performanceScore: number;
  contacts: Contact[];
  bankAccounts: BankAccount[];
  certifications: Certification[];
  bcVendorId?: string;
  syncStatus: SyncStatus;
  lastSyncDate?: string;
  createdAt: string;
  updatedAt: string;
  onboardedAt?: string;
  description: string;
  employeeCount: number;
  revenue: number;
  paymentTerms: string;
  currency: string;
  leadTimeDays: number;
  onTimeDelivery: number;
  qualityRating: number;
  defectRate: number;
  invoiceAccuracy: number;
  responseTime: number;
  complianceScore: number;
}

// ─── Vendor ───────────────────────────────────────────────────────────────────

export interface Vendor {
  id: string;
  supplierId: string;
  supplierName: string;
  bcVendorNumber: string;
  bcCompanyId: string;
  syncStatus: SyncStatus;
  lastSyncDate: string;
  syncErrors: string[];
  paymentTermsCode: string;
  currencyCode: string;
  blocked: boolean;
  createdInBC: string;
}

// ─── RFQ ──────────────────────────────────────────────────────────────────────

export interface RFQItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  estimatedUnitPrice: number;
}

export interface Bid {
  id: string;
  rfqId: string;
  supplierId: string;
  supplierName: string;
  submittedAt: string;
  totalAmount: number;
  currency: string;
  leadTimeDays: number;
  validityDays: number;
  notes: string;
  status: "Submitted" | "Under Review" | "Shortlisted" | "Awarded" | "Rejected";
  items: { rfqItemId: string; unitPrice: number; totalPrice: number }[];
  technicalScore: number;
  commercialScore: number;
  overallScore: number;
}

export interface RFQ {
  id: string;
  title: string;
  description: string;
  status: RFQStatus;
  category: string;
  publishedDate: string;
  closingDate: string;
  awardedDate?: string;
  estimatedValue: number;
  currency: string;
  invitedSuppliers: string[];
  items: RFQItem[];
  bids: Bid[];
  awardedSupplierId?: string;
  createdBy: string;
  createdAt: string;
}

// ─── Purchase Order ────────────────────────────────────────────────────────────

export interface POLine {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  deliveryDate: string;
  glAccount: string;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  status: POStatus;
  orderDate: string;
  expectedDelivery: string;
  actualDelivery?: string;
  totalAmount: number;
  currency: string;
  lines: POLine[];
  approvers: { userId: string; name: string; status: "Pending" | "Approved" | "Rejected"; date?: string }[];
  bcPoNumber?: string;
  notes: string;
  createdBy: string;
  createdAt: string;
}

// ─── Contract ─────────────────────────────────────────────────────────────────

export interface Contract {
  id: string;
  contractNumber: string;
  title: string;
  supplierId: string;
  supplierName: string;
  status: ContractStatus;
  type: string;
  startDate: string;
  endDate: string;
  totalValue: number;
  currency: string;
  autoRenew: boolean;
  renewalNotificationDays: number;
  complianceScore: number;
  documents: { name: string; url: string; uploadedAt: string }[];
  keyTerms: string[];
  createdAt: string;
}

// ─── Invoice ──────────────────────────────────────────────────────────────────

export interface Invoice {
  id: string;
  invoiceNumber: string;
  supplierId: string;
  supplierName: string;
  poId?: string;
  poNumber?: string;
  status: InvoiceStatus;
  invoiceDate: string;
  dueDate: string;
  paidDate?: string;
  totalAmount: number;
  currency: string;
  taxAmount: number;
  matchingStatus: "Not Matched" | "Partially Matched" | "Fully Matched";
  approvedBy?: string;
  bcDocumentNumber?: string;
  lines: { description: string; quantity: number; unitPrice: number; totalPrice: number }[];
  createdAt: string;
}

// ─── Risk Assessment ──────────────────────────────────────────────────────────

export interface RiskAssessment {
  id: string;
  supplierId: string;
  supplierName: string;
  assessmentDate: string;
  nextAssessmentDate: string;
  overallRisk: RiskLevel;
  financialRisk: RiskLevel;
  operationalRisk: RiskLevel;
  complianceRisk: RiskLevel;
  geopoliticalRisk: RiskLevel;
  esgScore: number;
  environmentalScore: number;
  socialScore: number;
  governanceScore: number;
  findings: string[];
  mitigations: string[];
  assessedBy: string;
}

// ─── Scorecard ────────────────────────────────────────────────────────────────

export interface Scorecard {
  id: string;
  supplierId: string;
  supplierName: string;
  period: string;
  onTimeDelivery: number;
  qualityRating: number;
  defectRate: number;
  invoiceAccuracy: number;
  responseTime: number;
  complianceScore: number;
  overallScore: number;
  trend: "Improving" | "Stable" | "Declining";
  rank: number;
  previousScore: number;
}

// ─── Workflow ──────────────────────────────────────────────────────────────────

export interface WorkflowStep {
  id: string;
  name: string;
  status: "Completed" | "In Progress" | "Pending" | "Failed";
  assignee?: string;
  completedAt?: string;
  dueDate?: string;
  notes?: string;
}

export interface Workflow {
  id: string;
  type: "Supplier Onboarding" | "PO Approval" | "Invoice Approval" | "RFQ" | "Contract Renewal";
  entityId: string;
  entityName: string;
  status: "Active" | "Completed" | "Failed" | "On Hold";
  startedAt: string;
  completedAt?: string;
  steps: WorkflowStep[];
  currentStep: number;
}

// ─── Notification ─────────────────────────────────────────────────────────────

export interface Notification {
  id: string;
  type: "info" | "warning" | "error" | "success";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
  module: string;
}

// ─── User ─────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department: string;
  lastLogin: string;
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export interface SpendByCategory {
  category: string;
  amount: number;
  percentage: number;
  change: number;
}

export interface MonthlySpend {
  month: string;
  actual: number;
  budget: number;
  savings: number;
}

export interface KPISummary {
  totalSuppliers: number;
  activeVendors: number;
  pendingApprovals: number;
  openRFQs: number;
  openPOs: number;
  pendingInvoices: number;
  avgRiskScore: number;
  totalSpend: number;
  procurementSavings: number;
  contractsExpiringSoon: number;
}
