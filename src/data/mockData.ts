import type {
  Supplier, Vendor, RFQ, PurchaseOrder, Contract, Invoice,
  RiskAssessment, Scorecard, Workflow, Notification, KPISummary,
  MonthlySpend, SpendByCategory
} from "@/types";

export const mockSuppliers: Supplier[] = [
  {
    id: "SUP-001", name: "Contoso Manufacturing Ltd", code: "CONT-001",
    status: "Approved", category: "Manufacturing", subCategory: "Metal Parts",
    country: "United States", region: "Midwest", city: "Chicago",
    address: "1200 Industrial Blvd, Chicago, IL 60601",
    website: "https://contoso.com", email: "procurement@contoso.com",
    phone: "+1-312-555-0100", taxId: "US-45-1234567",
    annualSpend: 4200000, riskLevel: "Low", performanceScore: 92,
    contacts: [{ id: "c1", name: "Sarah Chen", title: "Account Manager", email: "s.chen@contoso.com", phone: "+1-312-555-0101", isPrimary: true }],
    bankAccounts: [{ id: "b1", bankName: "Chase Bank", accountNumber: "****4521", routingNumber: "021000021", currency: "USD", isDefault: true }],
    certifications: [
      { id: "cert1", name: "ISO 9001:2015", issuer: "Bureau Veritas", issueDate: "2023-01-15", expiryDate: "2026-01-15", status: "Valid" },
      { id: "cert2", name: "ISO 14001:2015", issuer: "Bureau Veritas", issueDate: "2023-01-15", expiryDate: "2026-01-15", status: "Valid" }
    ],
    bcVendorId: "V00010", syncStatus: "Synced", lastSyncDate: "2024-11-28T10:30:00Z",
    createdAt: "2022-03-15T09:00:00Z", updatedAt: "2024-11-28T10:30:00Z", onboardedAt: "2022-04-01T00:00:00Z",
    description: "Leading manufacturer of precision metal components for automotive and aerospace industries.",
    employeeCount: 1200, revenue: 85000000, paymentTerms: "Net 30", currency: "USD",
    leadTimeDays: 14, onTimeDelivery: 96, qualityRating: 94, defectRate: 0.8,
    invoiceAccuracy: 98, responseTime: 95, complianceScore: 97
  },
  {
    id: "SUP-002", name: "Fabrikam Technologies", code: "FAB-001",
    status: "Approved", category: "IT & Software", subCategory: "Enterprise Software",
    country: "Germany", region: "Bavaria", city: "Munich",
    address: "Technologiepark 42, 80333 Munich",
    website: "https://fabrikam.de", email: "sales@fabrikam.de",
    phone: "+49-89-555-0200", taxId: "DE-123456789",
    annualSpend: 1800000, riskLevel: "Low", performanceScore: 88,
    contacts: [{ id: "c2", name: "Hans Weber", title: "Sales Director", email: "h.weber@fabrikam.de", phone: "+49-89-555-0201", isPrimary: true }],
    bankAccounts: [{ id: "b2", bankName: "Deutsche Bank", accountNumber: "****7823", routingNumber: "DEUTDEDB", currency: "EUR", isDefault: true }],
    certifications: [{ id: "cert3", name: "ISO 27001", issuer: "TÜV Rheinland", issueDate: "2023-06-01", expiryDate: "2026-06-01", status: "Valid" }],
    bcVendorId: "V00011", syncStatus: "Synced", lastSyncDate: "2024-11-27T08:00:00Z",
    createdAt: "2021-07-20T09:00:00Z", updatedAt: "2024-11-27T08:00:00Z", onboardedAt: "2021-08-01T00:00:00Z",
    description: "Enterprise technology solutions provider specializing in ERP and cloud integration.",
    employeeCount: 850, revenue: 120000000, paymentTerms: "Net 45", currency: "EUR",
    leadTimeDays: 30, onTimeDelivery: 91, qualityRating: 89, defectRate: 1.2,
    invoiceAccuracy: 97, responseTime: 88, complianceScore: 95
  },
  {
    id: "SUP-003", name: "Northwind Logistics", code: "NW-001",
    status: "Approved", category: "Logistics", subCategory: "Freight & Shipping",
    country: "United Kingdom", region: "England", city: "London",
    address: "42 Logistics Way, London EC2A 4BX",
    website: "https://northwindlogistics.co.uk", email: "ops@northwindlogistics.co.uk",
    phone: "+44-20-555-0300", taxId: "GB-123456789",
    annualSpend: 3100000, riskLevel: "Medium", performanceScore: 79,
    contacts: [{ id: "c3", name: "Emma Thompson", title: "Operations Manager", email: "e.thompson@northwind.co.uk", phone: "+44-20-555-0301", isPrimary: true }],
    bankAccounts: [{ id: "b3", bankName: "Barclays", accountNumber: "****2341", routingNumber: "20-00-00", currency: "GBP", isDefault: true }],
    certifications: [{ id: "cert4", name: "AEO Certification", issuer: "HMRC", issueDate: "2022-11-01", expiryDate: "2025-11-01", status: "Expiring" }],
    bcVendorId: "V00012", syncStatus: "Synced", lastSyncDate: "2024-11-26T14:00:00Z",
    createdAt: "2020-01-10T09:00:00Z", updatedAt: "2024-11-26T14:00:00Z", onboardedAt: "2020-02-01T00:00:00Z",
    description: "Pan-European logistics and supply chain management company.",
    employeeCount: 2300, revenue: 450000000, paymentTerms: "Net 30", currency: "GBP",
    leadTimeDays: 7, onTimeDelivery: 83, qualityRating: 78, defectRate: 2.1,
    invoiceAccuracy: 94, responseTime: 82, complianceScore: 88
  },
  {
    id: "SUP-004", name: "Alpine Electronics GmbH", code: "ALP-001",
    status: "Under Review", category: "Electronics", subCategory: "PCB & Components",
    country: "Switzerland", region: "Zurich", city: "Zurich",
    address: "Industriestrasse 88, 8005 Zürich",
    website: "https://alpine-electronics.ch", email: "contact@alpine-elec.ch",
    phone: "+41-44-555-0400", taxId: "CHE-123.456.789",
    annualSpend: 920000, riskLevel: "High", performanceScore: 68,
    contacts: [{ id: "c4", name: "Klaus Müller", title: "Sales Manager", email: "k.muller@alpine-elec.ch", phone: "+41-44-555-0401", isPrimary: true }],
    bankAccounts: [{ id: "b4", bankName: "UBS", accountNumber: "****5521", routingNumber: "230-12345", currency: "CHF", isDefault: true }],
    certifications: [],
    bcVendorId: undefined, syncStatus: "Not Synced",
    createdAt: "2024-08-15T09:00:00Z", updatedAt: "2024-11-20T10:00:00Z",
    description: "Swiss precision electronics manufacturer for industrial and automotive sectors.",
    employeeCount: 180, revenue: 32000000, paymentTerms: "Net 60", currency: "CHF",
    leadTimeDays: 21, onTimeDelivery: 72, qualityRating: 70, defectRate: 3.5,
    invoiceAccuracy: 88, responseTime: 71, complianceScore: 75
  },
  {
    id: "SUP-005", name: "Tailwind Raw Materials", code: "TRM-001",
    status: "Approved", category: "Raw Materials", subCategory: "Metals & Alloys",
    country: "Canada", region: "Ontario", city: "Toronto",
    address: "500 Materials Drive, Toronto, ON M5V 2T6",
    website: "https://tailwindmaterials.ca", email: "supply@tailwind.ca",
    phone: "+1-416-555-0500", taxId: "CA-123456789RT",
    annualSpend: 5600000, riskLevel: "Low", performanceScore: 94,
    contacts: [{ id: "c5", name: "Michael Foster", title: "Key Account Manager", email: "m.foster@tailwind.ca", phone: "+1-416-555-0501", isPrimary: true }],
    bankAccounts: [{ id: "b5", bankName: "RBC", accountNumber: "****8821", routingNumber: "003-12345", currency: "CAD", isDefault: true }],
    certifications: [
      { id: "cert5", name: "ISO 9001:2015", issuer: "SGS", issueDate: "2022-05-10", expiryDate: "2025-05-10", status: "Expiring" },
      { id: "cert6", name: "Responsible Minerals Initiative", issuer: "RMI", issueDate: "2023-09-01", expiryDate: "2026-09-01", status: "Valid" }
    ],
    bcVendorId: "V00015", syncStatus: "Synced", lastSyncDate: "2024-11-29T06:00:00Z",
    createdAt: "2019-11-01T09:00:00Z", updatedAt: "2024-11-29T06:00:00Z", onboardedAt: "2019-12-01T00:00:00Z",
    description: "North America's leading supplier of specialty metals and alloys for manufacturing.",
    employeeCount: 680, revenue: 280000000, paymentTerms: "Net 30", currency: "CAD",
    leadTimeDays: 10, onTimeDelivery: 97, qualityRating: 96, defectRate: 0.4,
    invoiceAccuracy: 99, responseTime: 98, complianceScore: 99
  },
  {
    id: "SUP-006", name: "Pacific Rim Packaging", code: "PRP-001",
    status: "Submitted", category: "Packaging", subCategory: "Industrial Packaging",
    country: "Japan", region: "Kanto", city: "Tokyo",
    address: "1-1-1 Shibuya, Tokyo 150-0002",
    website: "https://prpackaging.co.jp", email: "global@prpackaging.co.jp",
    phone: "+81-3-555-0600", taxId: "JP-1234567890123",
    annualSpend: 0, riskLevel: "Medium", performanceScore: 0,
    contacts: [{ id: "c6", name: "Yuki Tanaka", title: "Export Manager", email: "y.tanaka@prpackaging.co.jp", phone: "+81-3-555-0601", isPrimary: true }],
    bankAccounts: [],
    certifications: [{ id: "cert7", name: "FSC Certification", issuer: "Forest Stewardship Council", issueDate: "2024-01-15", expiryDate: "2027-01-15", status: "Valid" }],
    bcVendorId: undefined, syncStatus: "Not Synced",
    createdAt: "2024-10-01T09:00:00Z", updatedAt: "2024-11-15T10:00:00Z",
    description: "Sustainable packaging solutions for FMCG and e-commerce industries.",
    employeeCount: 420, revenue: 95000000, paymentTerms: "Net 30", currency: "JPY",
    leadTimeDays: 28, onTimeDelivery: 0, qualityRating: 0, defectRate: 0,
    invoiceAccuracy: 0, responseTime: 0, complianceScore: 0
  },
  {
    id: "SUP-007", name: "Meridian Consulting Group", code: "MCG-001",
    status: "Approved", category: "Professional Services", subCategory: "Management Consulting",
    country: "United States", region: "Northeast", city: "New York",
    address: "One World Trade Center, New York, NY 10007",
    website: "https://meridiancg.com", email: "procurement@meridiancg.com",
    phone: "+1-212-555-0700", taxId: "US-77-1234567",
    annualSpend: 2400000, riskLevel: "Low", performanceScore: 91,
    contacts: [{ id: "c7", name: "Rachel Kim", title: "Partner", email: "r.kim@meridiancg.com", phone: "+1-212-555-0701", isPrimary: true }],
    bankAccounts: [{ id: "b6", bankName: "Citibank", accountNumber: "****3312", routingNumber: "021000089", currency: "USD", isDefault: true }],
    certifications: [],
    bcVendorId: "V00018", syncStatus: "Failed", lastSyncDate: "2024-11-25T12:00:00Z",
    createdAt: "2021-03-10T09:00:00Z", updatedAt: "2024-11-25T12:00:00Z", onboardedAt: "2021-04-01T00:00:00Z",
    description: "Premier management and strategy consulting firm with global operations.",
    employeeCount: 3500, revenue: 720000000, paymentTerms: "Net 30", currency: "USD",
    leadTimeDays: 5, onTimeDelivery: 94, qualityRating: 92, defectRate: 0.5,
    invoiceAccuracy: 96, responseTime: 92, complianceScore: 98
  },
  {
    id: "SUP-008", name: "SolarTech Energy Solutions", code: "STE-001",
    status: "Approved", category: "Energy", subCategory: "Renewable Energy",
    country: "India", region: "Maharashtra", city: "Mumbai",
    address: "BKC Complex, Bandra Kurla, Mumbai 400051",
    website: "https://solartech.in", email: "b2b@solartech.in",
    phone: "+91-22-555-0800", taxId: "IN-AABCS1234A",
    annualSpend: 780000, riskLevel: "Medium", performanceScore: 82,
    contacts: [{ id: "c8", name: "Priya Sharma", title: "Business Development Head", email: "p.sharma@solartech.in", phone: "+91-22-555-0801", isPrimary: true }],
    bankAccounts: [{ id: "b7", bankName: "HDFC Bank", accountNumber: "****9934", routingNumber: "HDFC0001", currency: "INR", isDefault: true }],
    certifications: [{ id: "cert8", name: "BIS Certification", issuer: "Bureau of Indian Standards", issueDate: "2023-03-01", expiryDate: "2026-03-01", status: "Valid" }],
    bcVendorId: "V00020", syncStatus: "Synced", lastSyncDate: "2024-11-28T04:00:00Z",
    createdAt: "2023-01-15T09:00:00Z", updatedAt: "2024-11-28T04:00:00Z", onboardedAt: "2023-02-01T00:00:00Z",
    description: "Leading solar energy solutions provider for commercial and industrial applications.",
    employeeCount: 320, revenue: 48000000, paymentTerms: "Net 45", currency: "INR",
    leadTimeDays: 45, onTimeDelivery: 85, qualityRating: 83, defectRate: 1.8,
    invoiceAccuracy: 93, responseTime: 80, complianceScore: 89
  }
];

export const mockVendors: Vendor[] = [
  { id: "V-001", supplierId: "SUP-001", supplierName: "Contoso Manufacturing Ltd", bcVendorNumber: "V00010", bcCompanyId: "CRONUS", syncStatus: "Synced", lastSyncDate: "2024-11-28T10:30:00Z", syncErrors: [], paymentTermsCode: "1M(8D)", currencyCode: "USD", blocked: false, createdInBC: "2022-04-01T00:00:00Z" },
  { id: "V-002", supplierId: "SUP-002", supplierName: "Fabrikam Technologies", bcVendorNumber: "V00011", bcCompanyId: "CRONUS", syncStatus: "Synced", lastSyncDate: "2024-11-27T08:00:00Z", syncErrors: [], paymentTermsCode: "2M(8D)", currencyCode: "EUR", blocked: false, createdInBC: "2021-08-01T00:00:00Z" },
  { id: "V-003", supplierId: "SUP-003", supplierName: "Northwind Logistics", bcVendorNumber: "V00012", bcCompanyId: "CRONUS", syncStatus: "Synced", lastSyncDate: "2024-11-26T14:00:00Z", syncErrors: [], paymentTermsCode: "1M(8D)", currencyCode: "GBP", blocked: false, createdInBC: "2020-02-01T00:00:00Z" },
  { id: "V-004", supplierId: "SUP-007", supplierName: "Meridian Consulting Group", bcVendorNumber: "V00018", bcCompanyId: "CRONUS", syncStatus: "Failed", lastSyncDate: "2024-11-25T12:00:00Z", syncErrors: ["Duplicate vendor number detected", "Currency code mismatch: USD vs GBP"], paymentTermsCode: "1M(8D)", currencyCode: "USD", blocked: false, createdInBC: "2021-04-01T00:00:00Z" },
  { id: "V-005", supplierId: "SUP-005", supplierName: "Tailwind Raw Materials", bcVendorNumber: "V00015", bcCompanyId: "CRONUS", syncStatus: "Synced", lastSyncDate: "2024-11-29T06:00:00Z", syncErrors: [], paymentTermsCode: "1M(8D)", currencyCode: "CAD", blocked: false, createdInBC: "2019-12-01T00:00:00Z" },
  { id: "V-006", supplierId: "SUP-008", supplierName: "SolarTech Energy Solutions", bcVendorNumber: "V00020", bcCompanyId: "CRONUS", syncStatus: "Synced", lastSyncDate: "2024-11-28T04:00:00Z", syncErrors: [], paymentTermsCode: "2M(8D)", currencyCode: "USD", blocked: false, createdInBC: "2023-02-01T00:00:00Z" },
];

export const mockRFQs: RFQ[] = [
  {
    id: "RFQ-2024-001", title: "Annual Steel Supply Contract 2025", description: "Procurement of high-grade steel alloys for manufacturing operations",
    status: "Published", category: "Raw Materials", publishedDate: "2024-11-01", closingDate: "2024-12-15",
    estimatedValue: 2500000, currency: "USD", invitedSuppliers: ["SUP-001", "SUP-005"],
    items: [{ id: "i1", description: "Carbon Steel Sheet 2mm", quantity: 50000, unit: "kg", estimatedUnitPrice: 2.8 }, { id: "i2", description: "Stainless Steel Rod 10mm", quantity: 20000, unit: "kg", estimatedUnitPrice: 8.5 }],
    bids: [
      { id: "BID-001", rfqId: "RFQ-2024-001", supplierId: "SUP-001", supplierName: "Contoso Manufacturing Ltd", submittedAt: "2024-11-20T10:00:00Z", totalAmount: 2280000, currency: "USD", leadTimeDays: 12, validityDays: 90, notes: "Volume discount applied", status: "Shortlisted", items: [{ rfqItemId: "i1", unitPrice: 2.6, totalPrice: 130000 }, { rfqItemId: "i2", unitPrice: 8.2, totalPrice: 164000 }], technicalScore: 92, commercialScore: 88, overallScore: 90 },
      { id: "BID-002", rfqId: "RFQ-2024-001", supplierId: "SUP-005", supplierName: "Tailwind Raw Materials", submittedAt: "2024-11-18T14:00:00Z", totalAmount: 2350000, currency: "USD", leadTimeDays: 10, validityDays: 90, notes: "Premium quality guaranteed", status: "Under Review", items: [{ rfqItemId: "i1", unitPrice: 2.7, totalPrice: 135000 }, { rfqItemId: "i2", unitPrice: 8.6, totalPrice: 172000 }], technicalScore: 95, commercialScore: 82, overallScore: 88 }
    ],
    createdBy: "john.smith@company.com", createdAt: "2024-10-28T09:00:00Z"
  },
  {
    id: "RFQ-2024-002", title: "ERP Software Implementation Services", description: "Professional services for Business Central implementation and customization",
    status: "Awarded", category: "IT & Software", publishedDate: "2024-09-01", closingDate: "2024-10-01", awardedDate: "2024-10-20",
    estimatedValue: 800000, currency: "EUR", invitedSuppliers: ["SUP-002"],
    items: [{ id: "i3", description: "Implementation Consulting Days", quantity: 500, unit: "days", estimatedUnitPrice: 1500 }],
    bids: [{ id: "BID-003", rfqId: "RFQ-2024-002", supplierId: "SUP-002", supplierName: "Fabrikam Technologies", submittedAt: "2024-09-25T10:00:00Z", totalAmount: 760000, currency: "EUR", leadTimeDays: 30, validityDays: 60, notes: "Fixed price engagement", status: "Awarded", items: [{ rfqItemId: "i3", unitPrice: 1520, totalPrice: 760000 }], technicalScore: 94, commercialScore: 91, overallScore: 92 }],
    awardedSupplierId: "SUP-002", createdBy: "anna.jones@company.com", createdAt: "2024-08-28T09:00:00Z"
  },
  {
    id: "RFQ-2024-003", title: "Global Freight Services Q1 2025", description: "International freight and logistics services for Q1 2025",
    status: "Draft", category: "Logistics", publishedDate: "", closingDate: "2025-01-15",
    estimatedValue: 1200000, currency: "USD", invitedSuppliers: [],
    items: [{ id: "i4", description: "Air Freight Shipments", quantity: 200, unit: "shipment", estimatedUnitPrice: 3500 }, { id: "i5", description: "Sea Freight 20ft Container", quantity: 50, unit: "container", estimatedUnitPrice: 4500 }],
    bids: [], createdBy: "john.smith@company.com", createdAt: "2024-11-25T09:00:00Z"
  }
];

export const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: "PO-001", poNumber: "PO-2024-00142", supplierId: "SUP-001", supplierName: "Contoso Manufacturing Ltd",
    status: "Released", orderDate: "2024-11-01", expectedDelivery: "2024-11-20",
    totalAmount: 185000, currency: "USD",
    lines: [{ id: "l1", description: "Carbon Steel Sheet 2mm - 50T", quantity: 50000, unit: "kg", unitPrice: 2.6, totalPrice: 130000, deliveryDate: "2024-11-20", glAccount: "5010" }, { id: "l2", description: "Stainless Steel Rod 10mm - 5T", quantity: 5000, unit: "kg", unitPrice: 11, totalPrice: 55000, deliveryDate: "2024-11-20", glAccount: "5010" }],
    approvers: [{ userId: "u1", name: "Lisa Brown", status: "Approved", date: "2024-11-02T14:00:00Z" }, { userId: "u2", name: "Mark Davis", status: "Approved", date: "2024-11-03T09:00:00Z" }],
    bcPoNumber: "BC-PO-2024-00142", notes: "Urgent order - production line dependency", createdBy: "john.smith@company.com", createdAt: "2024-11-01T09:00:00Z"
  },
  {
    id: "PO-002", poNumber: "PO-2024-00143", supplierId: "SUP-002", supplierName: "Fabrikam Technologies",
    status: "Pending Approval", orderDate: "2024-11-10", expectedDelivery: "2024-12-10",
    totalAmount: 95000, currency: "EUR",
    lines: [{ id: "l3", description: "Business Central Licenses - 50 Users", quantity: 50, unit: "license", unitPrice: 1900, totalPrice: 95000, deliveryDate: "2024-12-10", glAccount: "6030" }],
    approvers: [{ userId: "u1", name: "Lisa Brown", status: "Pending" }, { userId: "u3", name: "CFO Office", status: "Pending" }],
    notes: "Annual software renewal", createdBy: "it.admin@company.com", createdAt: "2024-11-10T11:00:00Z"
  },
  {
    id: "PO-003", poNumber: "PO-2024-00140", supplierId: "SUP-005", supplierName: "Tailwind Raw Materials",
    status: "Closed", orderDate: "2024-10-01", expectedDelivery: "2024-10-15", actualDelivery: "2024-10-14",
    totalAmount: 340000, currency: "CAD",
    lines: [{ id: "l4", description: "Aluminum Alloy 6061 - 80T", quantity: 80000, unit: "kg", unitPrice: 4.25, totalPrice: 340000, deliveryDate: "2024-10-15", glAccount: "5010" }],
    approvers: [{ userId: "u1", name: "Lisa Brown", status: "Approved", date: "2024-10-02T10:00:00Z" }],
    bcPoNumber: "BC-PO-2024-00140", notes: "", createdBy: "john.smith@company.com", createdAt: "2024-10-01T09:00:00Z"
  },
  {
    id: "PO-004", poNumber: "PO-2024-00145", supplierId: "SUP-003", supplierName: "Northwind Logistics",
    status: "Approved", orderDate: "2024-11-15", expectedDelivery: "2024-11-22",
    totalAmount: 28500, currency: "GBP",
    lines: [{ id: "l5", description: "Express Air Freight EU Zone", quantity: 15, unit: "shipment", unitPrice: 1900, totalPrice: 28500, deliveryDate: "2024-11-22", glAccount: "7020" }],
    approvers: [{ userId: "u4", name: "Anna Jones", status: "Approved", date: "2024-11-16T09:00:00Z" }],
    notes: "Quarter-end stock replenishment", createdBy: "warehouse@company.com", createdAt: "2024-11-15T14:00:00Z"
  },
  {
    id: "PO-005", poNumber: "PO-2024-00138", supplierId: "SUP-007", supplierName: "Meridian Consulting Group",
    status: "Draft", orderDate: "2024-11-28", expectedDelivery: "2025-01-31",
    totalAmount: 180000, currency: "USD",
    lines: [{ id: "l6", description: "Strategy Consulting - 120 Days", quantity: 120, unit: "day", unitPrice: 1500, totalPrice: 180000, deliveryDate: "2025-01-31", glAccount: "6040" }],
    approvers: [], notes: "2025 Digital Transformation Project", createdBy: "cdo@company.com", createdAt: "2024-11-28T10:00:00Z"
  }
];

export const mockContracts: Contract[] = [
  { id: "CTR-001", contractNumber: "CTR-2023-001", title: "Steel Supply Master Agreement", supplierId: "SUP-001", supplierName: "Contoso Manufacturing Ltd", status: "Active", type: "Supply Agreement", startDate: "2023-01-01", endDate: "2025-12-31", totalValue: 12000000, currency: "USD", autoRenew: true, renewalNotificationDays: 90, complianceScore: 98, documents: [{ name: "Master Agreement v2.pdf", url: "#", uploadedAt: "2023-01-01T00:00:00Z" }], keyTerms: ["Net 30 payment", "Volume rebates", "Price escalation clause", "90-day notice period"], createdAt: "2022-12-15T00:00:00Z" },
  { id: "CTR-002", contractNumber: "CTR-2022-008", title: "Logistics Framework Agreement", supplierId: "SUP-003", supplierName: "Northwind Logistics", status: "Expiring", type: "Service Agreement", startDate: "2022-01-01", endDate: "2025-01-31", totalValue: 9300000, currency: "GBP", autoRenew: false, renewalNotificationDays: 60, complianceScore: 85, documents: [], keyTerms: ["KPI-based performance", "Monthly reporting", "SLA penalties"], createdAt: "2021-12-10T00:00:00Z" },
  { id: "CTR-003", contractNumber: "CTR-2024-003", title: "Software License & Support Agreement", supplierId: "SUP-002", supplierName: "Fabrikam Technologies", status: "Active", type: "Software License", startDate: "2024-01-01", endDate: "2026-12-31", totalValue: 3600000, currency: "EUR", autoRenew: true, renewalNotificationDays: 60, complianceScore: 100, documents: [{ name: "License Agreement.pdf", url: "#", uploadedAt: "2024-01-01T00:00:00Z" }], keyTerms: ["Unlimited support", "Annual maintenance", "Usage-based pricing"], createdAt: "2023-12-20T00:00:00Z" },
  { id: "CTR-004", contractNumber: "CTR-2024-007", title: "Raw Materials Supply Contract 2024", supplierId: "SUP-005", supplierName: "Tailwind Raw Materials", status: "Active", type: "Supply Agreement", startDate: "2024-01-01", endDate: "2024-12-31", totalValue: 5600000, currency: "CAD", autoRenew: false, renewalNotificationDays: 90, complianceScore: 99, documents: [], keyTerms: ["Fixed price for H1", "Market-indexed H2", "Priority supply guarantee"], createdAt: "2023-12-28T00:00:00Z" },
  { id: "CTR-005", contractNumber: "CTR-2021-015", title: "Consulting Services Retainer", supplierId: "SUP-007", supplierName: "Meridian Consulting Group", status: "Expiring", type: "Professional Services", startDate: "2022-01-01", endDate: "2025-03-31", totalValue: 7200000, currency: "USD", autoRenew: false, renewalNotificationDays: 90, complianceScore: 95, documents: [], keyTerms: ["Monthly retainer", "Project-based billing", "IP ownership clause"], createdAt: "2021-12-15T00:00:00Z" },
];

export const mockInvoices: Invoice[] = [
  { id: "INV-001", invoiceNumber: "CONT-2024-1124", supplierId: "SUP-001", supplierName: "Contoso Manufacturing Ltd", poId: "PO-001", poNumber: "PO-2024-00142", status: "Approved", invoiceDate: "2024-11-21", dueDate: "2024-12-21", totalAmount: 185000, currency: "USD", taxAmount: 18500, matchingStatus: "Fully Matched", approvedBy: "Lisa Brown", bcDocumentNumber: "PI-2024-1124", lines: [{ description: "Carbon Steel Sheet", quantity: 50000, unitPrice: 2.6, totalPrice: 130000 }, { description: "Stainless Steel Rod", quantity: 5000, unitPrice: 11, totalPrice: 55000 }], createdAt: "2024-11-21T10:00:00Z" },
  { id: "INV-002", invoiceNumber: "NW-2024-INV-0892", supplierId: "SUP-003", supplierName: "Northwind Logistics", poId: "PO-004", poNumber: "PO-2024-00145", status: "Pending", invoiceDate: "2024-11-23", dueDate: "2024-12-23", totalAmount: 28500, currency: "GBP", taxAmount: 5700, matchingStatus: "Partially Matched", lines: [{ description: "Express Air Freight", quantity: 15, unitPrice: 1900, totalPrice: 28500 }], createdAt: "2024-11-23T14:00:00Z" },
  { id: "INV-003", invoiceNumber: "TRM-2024-00445", supplierId: "SUP-005", supplierName: "Tailwind Raw Materials", poId: "PO-003", poNumber: "PO-2024-00140", status: "Paid", invoiceDate: "2024-10-15", dueDate: "2024-11-15", paidDate: "2024-11-12", totalAmount: 340000, currency: "CAD", taxAmount: 44200, matchingStatus: "Fully Matched", approvedBy: "Mark Davis", bcDocumentNumber: "PI-2024-0889", lines: [{ description: "Aluminum Alloy 6061", quantity: 80000, unitPrice: 4.25, totalPrice: 340000 }], createdAt: "2024-10-15T10:00:00Z" },
  { id: "INV-004", invoiceNumber: "FAB-2024-EUR-0091", supplierId: "SUP-002", supplierName: "Fabrikam Technologies", status: "Rejected", invoiceDate: "2024-11-10", dueDate: "2024-12-25", totalAmount: 95000, currency: "EUR", taxAmount: 15200, matchingStatus: "Not Matched", lines: [{ description: "Software Licenses", quantity: 50, unitPrice: 1900, totalPrice: 95000 }], createdAt: "2024-11-10T11:00:00Z" },
  { id: "INV-005", invoiceNumber: "MCG-2024-0512", supplierId: "SUP-007", supplierName: "Meridian Consulting Group", status: "Matched", invoiceDate: "2024-11-28", dueDate: "2024-12-28", totalAmount: 45000, currency: "USD", taxAmount: 0, matchingStatus: "Fully Matched", lines: [{ description: "November Consulting Retainer", quantity: 1, unitPrice: 45000, totalPrice: 45000 }], createdAt: "2024-11-28T09:00:00Z" },
];

export const mockRiskAssessments: RiskAssessment[] = [
  { id: "RA-001", supplierId: "SUP-001", supplierName: "Contoso Manufacturing Ltd", assessmentDate: "2024-09-01", nextAssessmentDate: "2025-09-01", overallRisk: "Low", financialRisk: "Low", operationalRisk: "Low", complianceRisk: "Low", geopoliticalRisk: "Low", esgScore: 82, environmentalScore: 78, socialScore: 85, governanceScore: 83, findings: ["Minor supply chain concentration risk"], mitigations: ["Dual-sourcing strategy in place", "Buffer stock maintained"], assessedBy: "Risk Team" },
  { id: "RA-002", supplierId: "SUP-003", supplierName: "Northwind Logistics", assessmentDate: "2024-10-15", nextAssessmentDate: "2025-04-15", overallRisk: "Medium", financialRisk: "Medium", operationalRisk: "High", complianceRisk: "Low", geopoliticalRisk: "Medium", esgScore: 68, environmentalScore: 62, socialScore: 71, governanceScore: 71, findings: ["High dependency on single shipping lane", "Aging fleet - 40% over 10 years", "Brexit impact on EU routes"], mitigations: ["Alternative carrier identified", "Fleet renewal program Q2 2025"], assessedBy: "Risk Team" },
  { id: "RA-003", supplierId: "SUP-004", supplierName: "Alpine Electronics GmbH", assessmentDate: "2024-11-01", nextAssessmentDate: "2025-02-01", overallRisk: "High", financialRisk: "High", operationalRisk: "High", complianceRisk: "Medium", geopoliticalRisk: "Low", esgScore: 55, environmentalScore: 52, socialScore: 58, governanceScore: 55, findings: ["Declining revenue trend - 3 consecutive quarters", "Single production facility", "No ISO certifications", "High staff turnover"], mitigations: ["Quarterly financial review required", "Alternative supplier qualification initiated"], assessedBy: "Risk Team" },
  { id: "RA-004", supplierId: "SUP-005", supplierName: "Tailwind Raw Materials", assessmentDate: "2024-08-01", nextAssessmentDate: "2025-08-01", overallRisk: "Low", financialRisk: "Low", operationalRisk: "Low", complianceRisk: "Low", geopoliticalRisk: "Low", esgScore: 91, environmentalScore: 88, socialScore: 93, governanceScore: 92, findings: [], mitigations: ["Preferred supplier status maintained"], assessedBy: "Risk Team" },
];

export const mockScorecards: Scorecard[] = [
  { id: "SC-001", supplierId: "SUP-001", supplierName: "Contoso Manufacturing Ltd", period: "Q3 2024", onTimeDelivery: 96, qualityRating: 94, defectRate: 0.8, invoiceAccuracy: 98, responseTime: 95, complianceScore: 97, overallScore: 94, trend: "Improving", rank: 2, previousScore: 91 },
  { id: "SC-002", supplierId: "SUP-002", supplierName: "Fabrikam Technologies", period: "Q3 2024", onTimeDelivery: 91, qualityRating: 89, defectRate: 1.2, invoiceAccuracy: 97, responseTime: 88, complianceScore: 95, overallScore: 89, trend: "Stable", rank: 3, previousScore: 89 },
  { id: "SC-003", supplierId: "SUP-003", supplierName: "Northwind Logistics", period: "Q3 2024", onTimeDelivery: 83, qualityRating: 78, defectRate: 2.1, invoiceAccuracy: 94, responseTime: 82, complianceScore: 88, overallScore: 79, trend: "Declining", rank: 5, previousScore: 83 },
  { id: "SC-004", supplierId: "SUP-005", supplierName: "Tailwind Raw Materials", period: "Q3 2024", onTimeDelivery: 97, qualityRating: 96, defectRate: 0.4, invoiceAccuracy: 99, responseTime: 98, complianceScore: 99, overallScore: 97, trend: "Improving", rank: 1, previousScore: 95 },
  { id: "SC-005", supplierId: "SUP-007", supplierName: "Meridian Consulting Group", period: "Q3 2024", onTimeDelivery: 94, qualityRating: 92, defectRate: 0.5, invoiceAccuracy: 96, responseTime: 92, complianceScore: 98, overallScore: 93, trend: "Stable", rank: 4, previousScore: 92 },
  { id: "SC-006", supplierId: "SUP-008", supplierName: "SolarTech Energy Solutions", period: "Q3 2024", onTimeDelivery: 85, qualityRating: 83, defectRate: 1.8, invoiceAccuracy: 93, responseTime: 80, complianceScore: 89, overallScore: 83, trend: "Improving", rank: 6, previousScore: 78 },
];

export const mockNotifications: Notification[] = [
  { id: "N-001", type: "warning", title: "Contract Expiring Soon", message: "Northwind Logistics framework agreement expires in 62 days. Renewal action required.", read: false, createdAt: "2024-11-29T09:00:00Z", link: "/contracts", module: "Contracts" },
  { id: "N-002", type: "error", title: "Vendor Sync Failed", message: "Meridian Consulting Group vendor sync failed: Duplicate vendor number detected in Business Central.", read: false, createdAt: "2024-11-29T08:30:00Z", link: "/vendor-master", module: "Integration" },
  { id: "N-003", type: "info", title: "New Bid Received", message: "Contoso Manufacturing Ltd submitted a bid for RFQ-2024-001 (Annual Steel Supply Contract).", read: false, createdAt: "2024-11-29T07:00:00Z", link: "/rfq", module: "RFQ" },
  { id: "N-004", type: "success", title: "PO Approved", message: "Purchase Order PO-2024-00142 has been approved and released to Contoso Manufacturing.", read: true, createdAt: "2024-11-28T15:00:00Z", link: "/purchase-orders", module: "Purchase Orders" },
  { id: "N-005", type: "warning", title: "High Risk Supplier Alert", message: "Alpine Electronics GmbH risk assessment updated to HIGH. Financial stability concerns identified.", read: false, createdAt: "2024-11-28T11:00:00Z", link: "/risk", module: "Risk" },
  { id: "N-006", type: "info", title: "Supplier Registration", message: "Pacific Rim Packaging has submitted their onboarding application for review.", read: true, createdAt: "2024-11-27T14:00:00Z", link: "/suppliers", module: "Suppliers" },
  { id: "N-007", type: "success", title: "Invoice Paid", message: "Invoice TRM-2024-00445 from Tailwind Raw Materials ($340,000 CAD) has been processed for payment.", read: true, createdAt: "2024-11-27T10:00:00Z", link: "/invoices", module: "Invoices" },
];

export const mockKPISummary: KPISummary = {
  totalSuppliers: 8,
  activeVendors: 6,
  pendingApprovals: 3,
  openRFQs: 2,
  openPOs: 3,
  pendingInvoices: 2,
  avgRiskScore: 35,
  totalSpend: 18800000,
  procurementSavings: 1240000,
  contractsExpiringSoon: 2
};

export const mockMonthlySpend: MonthlySpend[] = [
  { month: "Jan", actual: 1420000, budget: 1500000, savings: 80000 },
  { month: "Feb", actual: 1380000, budget: 1500000, savings: 120000 },
  { month: "Mar", actual: 1650000, budget: 1600000, savings: -50000 },
  { month: "Apr", actual: 1520000, budget: 1550000, savings: 30000 },
  { month: "May", actual: 1480000, budget: 1550000, savings: 70000 },
  { month: "Jun", actual: 1720000, budget: 1700000, savings: -20000 },
  { month: "Jul", actual: 1580000, budget: 1650000, savings: 70000 },
  { month: "Aug", actual: 1490000, budget: 1600000, savings: 110000 },
  { month: "Sep", actual: 1630000, budget: 1650000, savings: 20000 },
  { month: "Oct", actual: 1750000, budget: 1800000, savings: 50000 },
  { month: "Nov", actual: 1580000, budget: 1700000, savings: 120000 },
  { month: "Dec", actual: 0, budget: 1750000, savings: 0 },
];

export const mockSpendByCategory: SpendByCategory[] = [
  { category: "Raw Materials", amount: 8900000, percentage: 47.3, change: 12.4 },
  { category: "Manufacturing", amount: 3200000, percentage: 17.0, change: -2.1 },
  { category: "Logistics", amount: 2600000, percentage: 13.8, change: 5.8 },
  { category: "IT & Software", amount: 1800000, percentage: 9.6, change: 22.3 },
  { category: "Professional Services", amount: 1200000, percentage: 6.4, change: 8.1 },
  { category: "Energy", amount: 700000, percentage: 3.7, change: 31.2 },
  { category: "Other", amount: 400000, percentage: 2.1, change: -5.3 },
];

export const mockWorkflows: Workflow[] = [
  {
    id: "WF-001", type: "Supplier Onboarding", entityId: "SUP-006", entityName: "Pacific Rim Packaging",
    status: "Active", startedAt: "2024-10-01T09:00:00Z", currentStep: 2,
    steps: [
      { id: "s1", name: "Application Submitted", status: "Completed", completedAt: "2024-10-01T09:00:00Z" },
      { id: "s2", name: "Document Verification", status: "In Progress", assignee: "Compliance Team", dueDate: "2024-12-05" },
      { id: "s3", name: "Financial Review", status: "Pending", assignee: "Finance Team" },
      { id: "s4", name: "Management Approval", status: "Pending", assignee: "Procurement Director" },
      { id: "s5", name: "Vendor Creation in BC", status: "Pending", assignee: "IT Admin" },
    ]
  },
  {
    id: "WF-002", type: "PO Approval", entityId: "PO-002", entityName: "PO-2024-00143",
    status: "Active", startedAt: "2024-11-10T11:00:00Z", currentStep: 1,
    steps: [
      { id: "s1", name: "PO Created", status: "Completed", completedAt: "2024-11-10T11:00:00Z" },
      { id: "s2", name: "Department Head Approval", status: "In Progress", assignee: "Lisa Brown", dueDate: "2024-12-02" },
      { id: "s3", name: "CFO Approval (>$50K)", status: "Pending", assignee: "CFO Office" },
      { id: "s4", name: "Release to Supplier", status: "Pending", assignee: "System" },
    ]
  },
  {
    id: "WF-003", type: "Invoice Approval", entityId: "INV-002", entityName: "NW-2024-INV-0892",
    status: "Active", startedAt: "2024-11-23T14:00:00Z", currentStep: 1,
    steps: [
      { id: "s1", name: "Invoice Received", status: "Completed", completedAt: "2024-11-23T14:00:00Z" },
      { id: "s2", name: "3-Way Match Verification", status: "In Progress", assignee: "AP Team", dueDate: "2024-12-01" },
      { id: "s3", name: "Finance Approval", status: "Pending", assignee: "Finance Manager" },
      { id: "s4", name: "Payment Processing", status: "Pending", assignee: "Treasury" },
    ]
  },
];
