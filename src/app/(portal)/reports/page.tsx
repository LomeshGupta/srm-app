"use client";
import { useState } from "react";
import { PageShell, KPICard, StatusBadge } from "@/components/shared";
import { Card, CardContent, CardHeader, CardTitle, Button, Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui";
import { BarChart3, Download, FileText, TrendingUp, Shield, Users, Star, Calendar, Filter } from "lucide-react";
import { mockSuppliers, mockScorecards, mockSpendByCategory, mockRiskAssessments, mockMonthlySpend } from "@/data/mockData";
import { formatCurrency, formatDate } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { toast } from "sonner";
import { CHART_COLORS } from "@/lib/utils";

const REPORT_TYPES = [
  { id: "supplier-performance", name: "Supplier Performance Report", icon: Star, desc: "KPIs, scorecards, and trend analysis for all evaluated suppliers.", lastGenerated: "2024-11-28" },
  { id: "procurement", name: "Procurement Report", icon: TrendingUp, desc: "PO activity, RFQ metrics, and procurement cycle times.", lastGenerated: "2024-11-27" },
  { id: "risk", name: "Risk & Compliance Report", icon: Shield, desc: "Risk assessments, ESG scores, certification status.", lastGenerated: "2024-11-25" },
  { id: "spend-analysis", name: "Spend Analysis Report", icon: BarChart3, desc: "Spend by category, region, supplier and savings achieved.", lastGenerated: "2024-11-29" },
  { id: "executive", name: "Executive Summary", icon: Users, desc: "Board-level KPI overview with strategic procurement insights.", lastGenerated: "2024-11-29" },
];

export default function ReportsPage() {
  const [generating, setGenerating] = useState<string | null>(null);
  const [activeReport, setActiveReport] = useState("spend-analysis");

  const handleGenerate = (id: string, name: string, format: string) => {
    setGenerating(id + format);
    setTimeout(() => {
      setGenerating(null);
      toast.success(`${name} exported as ${format}`);
    }, 1800);
  };

  return (
    <PageShell>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard title="Report Templates" value={REPORT_TYPES.length} icon={FileText} iconColor="text-blue-600" iconBg="bg-blue-50 dark:bg-blue-950" />
        <KPICard title="Generated This Month" value={12} icon={BarChart3} iconColor="text-violet-600" iconBg="bg-violet-50 dark:bg-violet-950" />
        <KPICard title="Scheduled Reports" value={3} icon={Calendar} iconColor="text-emerald-600" iconBg="bg-emerald-50 dark:bg-emerald-950" />
        <KPICard title="Saved Filters" value={8} icon={Filter} iconColor="text-amber-600" iconBg="bg-amber-50 dark:bg-amber-950" />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Report Catalog */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Available Reports</h2>
          {REPORT_TYPES.map(r => (
            <div
              key={r.id}
              onClick={() => setActiveReport(r.id)}
              className={`cursor-pointer rounded-xl border p-4 transition-all ${activeReport === r.id ? "border-primary bg-primary/5" : "hover:border-primary/40 hover:bg-muted/30"}`}
            >
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <r.icon size={15} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{r.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{r.desc}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">Last: {formatDate(r.lastGenerated)}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                {["PDF", "Excel", "CSV"].map(fmt => (
                  <Button
                    key={fmt}
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-1 text-xs"
                    disabled={generating === r.id + fmt}
                    onClick={(e) => { e.stopPropagation(); handleGenerate(r.id, r.name, fmt); }}
                  >
                    <Download size={11} />
                    {generating === r.id + fmt ? "…" : fmt}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Live Preview */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Preview — {REPORT_TYPES.find(r => r.id === activeReport)?.name}
          </h2>

          {activeReport === "spend-analysis" && (
            <div className="space-y-4">
              <Card>
                <CardHeader><CardTitle>Spend by Category</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={mockSpendByCategory} margin={{ right: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="category" tick={{ fontSize: 9 }} tickFormatter={v => v.split(" ")[0]} />
                      <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `$${(v/1e6).toFixed(1)}M`} />
                      <Tooltip formatter={(v:number) => [formatCurrency(v,"USD",true)]} />
                      <Bar dataKey="amount" fill="#2563eb" radius={[4,4,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Category Summary Table</CardTitle></CardHeader>
                <CardContent>
                  <table className="w-full text-xs">
                    <thead className="border-b"><tr>{["Category","Spend","Share","YoY Change"].map(h=><th key={h} className="pb-2 text-left text-muted-foreground font-medium">{h}</th>)}</tr></thead>
                    <tbody>
                      {mockSpendByCategory.map(c=>(
                        <tr key={c.category} className="border-b last:border-0">
                          <td className="py-2 font-medium">{c.category}</td>
                          <td className="py-2">{formatCurrency(c.amount,"USD",true)}</td>
                          <td className="py-2">{c.percentage}%</td>
                          <td className={`py-2 font-semibold ${c.change > 0 ? "text-emerald-600" : "text-red-600"}`}>{c.change > 0 ? "+" : ""}{c.change}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </div>
          )}

          {activeReport === "supplier-performance" && (
            <Card>
              <CardHeader><CardTitle>Performance Scorecard Summary</CardTitle></CardHeader>
              <CardContent>
                <table className="w-full text-xs">
                  <thead className="border-b"><tr>{["Supplier","Score","Trend","On-Time","Quality","Compliance"].map(h=><th key={h} className="pb-2 text-left text-muted-foreground font-medium">{h}</th>)}</tr></thead>
                  <tbody>
                    {mockScorecards.map(sc=>(
                      <tr key={sc.id} className="border-b last:border-0">
                        <td className="py-2 font-medium">{sc.supplierName.split(" ").slice(0,2).join(" ")}</td>
                        <td className="py-2 font-bold text-primary">{sc.overallScore}</td>
                        <td className={`py-2 font-semibold ${sc.trend==="Improving"?"text-emerald-600":sc.trend==="Declining"?"text-red-600":"text-muted-foreground"}`}>{sc.trend}</td>
                        <td className="py-2">{sc.onTimeDelivery}%</td>
                        <td className="py-2">{sc.qualityRating}%</td>
                        <td className="py-2">{sc.complianceScore}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          )}

          {activeReport === "risk" && (
            <div className="space-y-4">
              {mockRiskAssessments.map(ra=>(
                <Card key={ra.id}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm">{ra.supplierName}</p>
                      <p className="text-xs text-muted-foreground">ESG: {ra.esgScore}/100 · Assessed {formatDate(ra.assessmentDate)}</p>
                    </div>
                    <StatusBadge status={ra.overallRisk} type="risk" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {(activeReport === "procurement" || activeReport === "executive") && (
            <Card>
              <CardHeader><CardTitle>Monthly Spend Summary</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={mockMonthlySpend.filter(m=>m.actual>0)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} tickFormatter={v=>`$${(v/1e6).toFixed(1)}M`} />
                    <Tooltip formatter={(v:number)=>[formatCurrency(v,"USD",true)]} />
                    <Bar dataKey="actual" name="Actual" fill="#2563eb" radius={[4,4,0,0]} />
                    <Bar dataKey="budget" name="Budget" fill="#7c3aed" radius={[4,4,0,0]} fillOpacity={0.5} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PageShell>
  );
}
