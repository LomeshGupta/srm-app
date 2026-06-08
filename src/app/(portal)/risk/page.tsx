"use client";
import Link from "next/link";
import { mockRiskAssessments, mockSuppliers } from "@/data/mockData";
import { formatDate, getRiskColor, cn } from "@/lib/utils";
import { PageShell, KPICard, StatusBadge } from "@/components/shared";
import { Card, CardContent, CardHeader, CardTitle, Progress, Button } from "@/components/ui";
import { Shield, AlertTriangle, CheckCircle2, XCircle, Leaf, Plus } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis
} from "recharts";

const RISK_COLORS: Record<string, string> = {
  Low: "#16a34a", Medium: "#d97706", High: "#ea580c", Critical: "#dc2626",
};

export default function RiskPage() {
  const critical = mockRiskAssessments.filter(r => r.overallRisk === "Critical").length;
  const high = mockRiskAssessments.filter(r => r.overallRisk === "High").length;
  const medium = mockRiskAssessments.filter(r => r.overallRisk === "Medium").length;
  const low = mockRiskAssessments.filter(r => r.overallRisk === "Low").length;
  const avgEsg = Math.round(mockRiskAssessments.reduce((s, r) => s + r.esgScore, 0) / mockRiskAssessments.length);

  const riskBarData = mockRiskAssessments.map(r => ({
    name: r.supplierName.split(" ").slice(0, 2).join(" "),
    Financial: ["Low","Medium","High","Critical"].indexOf(r.financialRisk) * 25 + 25,
    Operational: ["Low","Medium","High","Critical"].indexOf(r.operationalRisk) * 25 + 25,
    Compliance: ["Low","Medium","High","Critical"].indexOf(r.complianceRisk) * 25 + 25,
    Geopolitical: ["Low","Medium","High","Critical"].indexOf(r.geopoliticalRisk) * 25 + 25,
  }));

  const esgRadar = mockRiskAssessments.map(r => ({
    supplier: r.supplierName.split(" ")[0],
    Environmental: r.environmentalScore,
    Social: r.socialScore,
    Governance: r.governanceScore,
  }));

  return (
    <PageShell>
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <KPICard title="Assessed Suppliers" value={mockRiskAssessments.length} icon={Shield} iconColor="text-blue-600" iconBg="bg-blue-50 dark:bg-blue-950" />        <KPICard title="Critical Risk" value={critical} icon={XCircle} iconColor="text-red-600" iconBg="bg-red-50 dark:bg-red-950" />
        <KPICard title="High Risk" value={high} icon={AlertTriangle} iconColor="text-orange-600" iconBg="bg-orange-50 dark:bg-orange-950" />
        <KPICard title="Low Risk" value={low} icon={CheckCircle2} iconColor="text-emerald-600" iconBg="bg-emerald-50 dark:bg-emerald-950" />
        <KPICard title="Avg ESG Score" value={avgEsg} icon={Leaf} iconColor="text-teal-600" iconBg="bg-teal-50 dark:bg-teal-950" subtitle="out of 100" />
      </div>

      <div className="flex justify-end">
        <Link href="/risk/new">
          <Button size="sm" className="gap-1.5"><Plus size={15} />New Assessment</Button>
        </Link>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-5">
        <Card>
          <CardHeader><CardTitle>Risk Dimension Heatmap</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={riskBarData} margin={{ right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={v => v <= 25 ? "Low" : v <= 50 ? "Med" : v <= 75 ? "High" : "Crit"} domain={[0,100]} />
                <Tooltip />
                <Bar dataKey="Financial" fill="#2563eb" radius={[3,3,0,0]} />
                <Bar dataKey="Operational" fill="#7c3aed" radius={[3,3,0,0]} />
                <Bar dataKey="Compliance" fill="#16a34a" radius={[3,3,0,0]} />
                <Bar dataKey="Geopolitical" fill="#d97706" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>ESG Scores by Supplier</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockRiskAssessments.map(r => (
                <div key={r.id} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium">{r.supplierName.split(" ").slice(0,2).join(" ")}</span>
                    <span className="font-bold text-emerald-600">{r.esgScore}/100</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    {[
                      { label: "E", value: r.environmentalScore, color: "bg-green-500" },
                      { label: "S", value: r.socialScore, color: "bg-blue-500" },
                      { label: "G", value: r.governanceScore, color: "bg-violet-500" },
                    ].map(e => (
                      <div key={e.label}>
                        <div className="flex justify-between text-[10px] mb-0.5">
                          <span className="text-muted-foreground">{e.label}</span>
                          <span>{e.value}</span>
                        </div>
                        <Progress value={e.value} color={e.color} className="h-1.5" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Assessment Cards */}
      <div className="grid md:grid-cols-2 gap-5">
        {mockRiskAssessments.map(ra => (
          <Card key={ra.id} className={cn("border-l-4", {
            "border-l-emerald-500": ra.overallRisk === "Low",
            "border-l-amber-500": ra.overallRisk === "Medium",
            "border-l-orange-500": ra.overallRisk === "High",
            "border-l-red-600": ra.overallRisk === "Critical",
          })}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-sm">{ra.supplierName}</h3>
                  <p className="text-xs text-muted-foreground">Assessed {formatDate(ra.assessmentDate)} · Next {formatDate(ra.nextAssessmentDate)}</p>
                </div>
                <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", getRiskColor(ra.overallRisk))}>
                  {ra.overallRisk} Risk
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3">
                {[
                  { label: "Financial", value: ra.financialRisk },
                  { label: "Operational", value: ra.operationalRisk },
                  { label: "Compliance", value: ra.complianceRisk },
                  { label: "Geopolitical", value: ra.geopoliticalRisk },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between rounded-lg bg-muted/50 px-2.5 py-1.5 text-xs">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className={cn("font-semibold", getRiskColor(item.value).split(" ")[0])}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>

              {ra.findings.length > 0 && (
                <div className="mb-2">
                  <p className="text-xs font-semibold text-muted-foreground mb-1">Findings:</p>
                  {ra.findings.map((f, i) => (
                    <p key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                      <AlertTriangle size={10} className="text-amber-500 mt-0.5 shrink-0" />{f}
                    </p>
                  ))}
                </div>
              )}

              {ra.mitigations.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1">Mitigations:</p>
                  {ra.mitigations.map((m, i) => (
                    <p key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                      <CheckCircle2 size={10} className="text-emerald-500 mt-0.5 shrink-0" />{m}
                    </p>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
