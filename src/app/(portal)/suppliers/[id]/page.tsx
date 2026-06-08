"use client";
import { use } from "react";
import { mockSuppliers, mockScorecards, mockRiskAssessments } from "@/data/mockData";
import { formatCurrency, formatDate, getScoreColor, cn } from "@/lib/utils";
import { StatusBadge, ScoreGauge, PageShell } from "@/components/shared";
import { Card, CardHeader, CardTitle, CardContent, Progress, Badge, Tabs, TabsList, TabsTrigger, TabsContent, Button, Avatar } from "@/components/ui";
import { Globe, Phone, Mail, Building2, CreditCard, Award, FileText, ArrowLeft, RefreshCw, ExternalLink } from "lucide-react";
import Link from "next/link";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";

export default function SupplierDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const supplier = mockSuppliers.find(s => s.id === id);
  if (!supplier) return <div className="p-8 text-center text-muted-foreground">Supplier not found</div>;

  const scorecard = mockScorecards.find(sc => sc.supplierId === id);
  const risk = mockRiskAssessments.find(r => r.supplierId === id);

  const radarData = scorecard ? [
    { metric: "On-Time Delivery", value: scorecard.onTimeDelivery },
    { metric: "Quality", value: scorecard.qualityRating },
    { metric: "Response Time", value: scorecard.responseTime },
    { metric: "Invoice Accuracy", value: scorecard.invoiceAccuracy },
    { metric: "Compliance", value: scorecard.complianceScore },
  ] : [];

  return (
    <PageShell>
      {/* Back */}
      <Link href="/suppliers" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft size={15} /> Back to Suppliers
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 rounded-xl border bg-card p-5">
        <Avatar name={supplier.name} size="lg" />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h1 className="text-xl font-bold">{supplier.name}</h1>
            <StatusBadge status={supplier.status} />
            <StatusBadge status={supplier.riskLevel} type="risk" />
          </div>
          <p className="text-sm text-muted-foreground mb-2">{supplier.code} · {supplier.category} · {supplier.subCategory}</p>
          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Globe size={12} />{supplier.city}, {supplier.country}</span>
            <span className="flex items-center gap-1"><Mail size={12} />{supplier.email}</span>
            <span className="flex items-center gap-1"><Phone size={12} />{supplier.phone}</span>
            <span className="flex items-center gap-1"><ExternalLink size={12} />{supplier.website}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {supplier.performanceScore > 0 && <ScoreGauge score={supplier.performanceScore} size="lg" />}
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Annual Spend</p>
            <p className="text-lg font-bold">{formatCurrency(supplier.annualSpend, supplier.currency, true)}</p>
            <StatusBadge status={supplier.syncStatus} />
          </div>
        </div>
      </div>

      {/* KPI Row */}
      {scorecard && (
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {[
            { label: "On-Time Delivery", value: `${scorecard.onTimeDelivery}%` },
            { label: "Quality Rating", value: `${scorecard.qualityRating}%` },
            { label: "Defect Rate", value: `${scorecard.defectRate}%` },
            { label: "Invoice Accuracy", value: `${scorecard.invoiceAccuracy}%` },
            { label: "Response Time", value: `${scorecard.responseTime}%` },
            { label: "Compliance", value: `${scorecard.complianceScore}%` },
          ].map(kpi => (
            <Card key={kpi.label}><CardContent className="p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">{kpi.label}</p>
              <p className="text-lg font-bold text-primary">{kpi.value}</p>
            </CardContent></Card>
          ))}
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="banking">Banking</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          {risk && <TabsTrigger value="risk">Risk</TabsTrigger>}
        </TabsList>

        <TabsContent value="overview">
          <div className="grid md:grid-cols-2 gap-5">
            <Card><CardHeader><CardTitle>Company Information</CardTitle></CardHeader>
              <CardContent className="space-y-3 text-sm">
                {[
                  ["Description", supplier.description],
                  ["Tax ID", supplier.taxId],
                  ["Employees", supplier.employeeCount.toLocaleString()],
                  ["Annual Revenue", formatCurrency(supplier.revenue, supplier.currency, true)],
                  ["Payment Terms", supplier.paymentTerms],
                  ["Currency", supplier.currency],
                  ["Lead Time", `${supplier.leadTimeDays} days`],
                  ["Onboarded", formatDate(supplier.onboardedAt ?? "", "long")],
                ].map(([label, val]) => (
                  <div key={label as string} className="flex justify-between">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium text-right max-w-[60%]">{val}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card><CardHeader><CardTitle>Business Central Integration</CardTitle></CardHeader>
              <CardContent className="space-y-3 text-sm">
                {[
                  ["BC Vendor ID", supplier.bcVendorId ?? "Not created"],
                  ["Sync Status", supplier.syncStatus],
                  ["Last Sync", formatDate(supplier.lastSyncDate ?? "", "long")],
                ].map(([label, val]) => (
                  <div key={label as string} className="flex justify-between">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium">{val}</span>
                  </div>
                ))}
                {!supplier.bcVendorId && (
                  <Button size="sm" className="w-full mt-2"><RefreshCw size={14} />Create Vendor in BC</Button>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contacts">
          <div className="grid md:grid-cols-2 gap-4">
            {supplier.contacts.map(c => (
              <Card key={c.id}><CardContent className="p-4 flex items-start gap-3">
                <Avatar name={c.name} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-semibold text-sm">{c.name}</p>
                    {c.isPrimary && <Badge variant="success" className="text-[10px]">Primary</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{c.title}</p>
                  <p className="text-xs flex items-center gap-1"><Mail size={11} className="text-muted-foreground" />{c.email}</p>
                  <p className="text-xs flex items-center gap-1 mt-0.5"><Phone size={11} className="text-muted-foreground" />{c.phone}</p>
                </div>
              </CardContent></Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="banking">
          <div className="grid md:grid-cols-2 gap-4">
            {supplier.bankAccounts.map(b => (
              <Card key={b.id}><CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard size={16} className="text-primary" />
                  <p className="font-semibold text-sm">{b.bankName}</p>
                  {b.isDefault && <Badge variant="success" className="text-[10px]">Default</Badge>}
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between"><span className="text-muted-foreground">Account Number</span><span className="font-medium">{b.accountNumber}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Routing</span><span className="font-medium">{b.routingNumber}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Currency</span><span className="font-medium">{b.currency}</span></div>
                </div>
              </CardContent></Card>
            ))}
            {supplier.bankAccounts.length === 0 && <p className="text-sm text-muted-foreground col-span-2 py-8 text-center">No bank accounts on file</p>}
          </div>
        </TabsContent>

        <TabsContent value="certifications">
          <div className="grid md:grid-cols-2 gap-4">
            {supplier.certifications.map(cert => (
              <Card key={cert.id}><CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Award size={16} className="text-primary" />
                    <p className="font-semibold text-sm">{cert.name}</p>
                  </div>
                  <StatusBadge status={cert.status} />
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between"><span className="text-muted-foreground">Issuer</span><span className="font-medium">{cert.issuer}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Issued</span><span className="font-medium">{formatDate(cert.issueDate)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Expires</span><span className="font-medium">{formatDate(cert.expiryDate)}</span></div>
                </div>
              </CardContent></Card>
            ))}
            {supplier.certifications.length === 0 && <p className="text-sm text-muted-foreground col-span-2 py-8 text-center">No certifications on file</p>}
          </div>
        </TabsContent>

        <TabsContent value="performance">
          {scorecard ? (
            <div className="grid md:grid-cols-2 gap-5">
              <Card><CardHeader><CardTitle>Performance Radar</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={260}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="hsl(var(--border))" />
                      <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
                      <Radar name="Score" dataKey="value" stroke="#2563eb" fill="#2563eb" fillOpacity={0.2} />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card><CardHeader><CardTitle>KPI Breakdown — {scorecard.period}</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { label: "On-Time Delivery", value: scorecard.onTimeDelivery, target: 95 },
                    { label: "Quality Rating", value: scorecard.qualityRating, target: 90 },
                    { label: "Invoice Accuracy", value: scorecard.invoiceAccuracy, target: 98 },
                    { label: "Response Time", value: scorecard.responseTime, target: 90 },
                    { label: "Compliance Score", value: scorecard.complianceScore, target: 95 },
                  ].map(kpi => (
                    <div key={kpi.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span>{kpi.label}</span>
                        <span className={cn("font-semibold", getScoreColor(kpi.value))}>{kpi.value}% <span className="text-muted-foreground font-normal">/ {kpi.target}% target</span></span>
                      </div>
                      <Progress value={kpi.value} color={kpi.value >= kpi.target ? "bg-emerald-500" : "bg-amber-500"} />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          ) : <p className="text-sm text-muted-foreground py-8 text-center">No performance data available yet</p>}
        </TabsContent>

        {risk && (
          <TabsContent value="risk">
            <div className="grid md:grid-cols-2 gap-5">
              <Card><CardHeader><CardTitle>Risk Assessment</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {[
                    ["Overall Risk", risk.overallRisk],
                    ["Financial Risk", risk.financialRisk],
                    ["Operational Risk", risk.operationalRisk],
                    ["Compliance Risk", risk.complianceRisk],
                    ["Geopolitical Risk", risk.geopoliticalRisk],
                    ["Assessment Date", formatDate(risk.assessmentDate)],
                    ["Next Assessment", formatDate(risk.nextAssessmentDate)],
                  ].map(([label, val]) => (
                    <div key={label as string} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{label}</span>
                      {["Overall Risk","Financial Risk","Operational Risk","Compliance Risk","Geopolitical Risk"].includes(label as string)
                        ? <StatusBadge status={val as string} type="risk" />
                        : <span className="font-medium">{val}</span>}
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card><CardHeader><CardTitle>ESG Scores</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { label: "Overall ESG", value: risk.esgScore, color: "bg-emerald-500" },
                    { label: "Environmental", value: risk.environmentalScore, color: "bg-green-500" },
                    { label: "Social", value: risk.socialScore, color: "bg-blue-500" },
                    { label: "Governance", value: risk.governanceScore, color: "bg-violet-500" },
                  ].map(e => (
                    <div key={e.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span>{e.label}</span>
                        <span className="font-semibold">{e.value}/100</span>
                      </div>
                      <Progress value={e.value} color={e.color} />
                    </div>
                  ))}
                  <div className="mt-3 space-y-1.5">
                    <p className="text-xs font-semibold">Key Findings:</p>
                    {risk.findings.map((f, i) => <p key={i} className="text-xs text-muted-foreground">• {f}</p>)}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </PageShell>
  );
}
