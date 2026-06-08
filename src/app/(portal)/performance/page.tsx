"use client";
import Link from "next/link";
import { mockScorecards } from "@/data/mockData";
import { getScoreColor, cn } from "@/lib/utils";
import { PageShell, KPICard, ScoreGauge, TrendChip } from "@/components/shared";
import { Card, CardContent, CardHeader, CardTitle, Progress, Button } from "@/components/ui";
import { Star, TrendingUp, TrendingDown, Minus, Award, Plus } from "lucide-react";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const KPIs = [
  { key: "onTimeDelivery", label: "On-Time Delivery", target: 95 },
  { key: "qualityRating", label: "Quality Rating", target: 90 },
  { key: "invoiceAccuracy", label: "Invoice Accuracy", target: 98 },
  { key: "responseTime", label: "Response Time", target: 90 },
  { key: "complianceScore", label: "Compliance", target: 95 },
];

export default function PerformancePage() {
  const topScore = Math.max(...mockScorecards.map(s => s.overallScore));
  const avgScore = Math.round(mockScorecards.reduce((s, sc) => s + sc.overallScore, 0) / mockScorecards.length);
  const improving = mockScorecards.filter(s => s.trend === "Improving").length;

  const radarData = KPIs.map(kpi => ({
    metric: kpi.label,
    ...mockScorecards.slice(0, 3).reduce((acc, sc, i) => ({ ...acc, [`supplier${i}`]: (sc as any)[kpi.key] }), {})
  }));

  const barData = [...mockScorecards].sort((a, b) => b.overallScore - a.overallScore).map(sc => ({
    name: sc.supplierName.split(" ").slice(0, 2).join(" "),
    score: sc.overallScore,
    prev: sc.previousScore,
  }));

  return (
    <PageShell>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard title="Suppliers Evaluated" value={mockScorecards.length} icon={Star} iconColor="text-blue-600" iconBg="bg-blue-50 dark:bg-blue-950" />
        <KPICard title="Average Score" value={avgScore} icon={Star} iconColor="text-violet-600" iconBg="bg-violet-50 dark:bg-violet-950" subtitle="out of 100" />
        <KPICard title="Top Score" value={topScore} icon={Award} iconColor="text-emerald-600" iconBg="bg-emerald-50 dark:bg-emerald-950" />
        <KPICard title="Improving Trend" value={improving} icon={TrendingUp} iconColor="text-amber-600" iconBg="bg-amber-50 dark:bg-amber-950" subtitle={`of ${mockScorecards.length} suppliers`} />
      </div>

      <div className="flex justify-end">
        <Link href="/performance/new">
          <Button size="sm" className="gap-1.5"><Plus size={15} />New Scorecard</Button>
        </Link>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-5">
        <Card>
          <CardHeader><CardTitle>Score Comparison — Q3 2024</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData} margin={{ right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis domain={[60, 100]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="prev" name="Previous" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="score" name="Current" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Multi-Supplier Radar — Top 3</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10 }} />
                <Radar name={mockScorecards[0]?.supplierName.split(" ")[0]} dataKey="supplier0" stroke="#2563eb" fill="#2563eb" fillOpacity={0.15} />
                <Radar name={mockScorecards[1]?.supplierName.split(" ")[0]} dataKey="supplier1" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.15} />
                <Radar name={mockScorecards[2]?.supplierName.split(" ")[0]} dataKey="supplier2" stroke="#16a34a" fill="#16a34a" fillOpacity={0.15} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Scorecard Table */}
      <Card>
        <CardHeader><CardTitle>Supplier Scorecards — Q3 2024</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Rank</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Supplier</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">On-Time</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Quality</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Defect%</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Invoice Acc.</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Response</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Compliance</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Overall</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Trend</th>
                </tr>
              </thead>
              <tbody>
                {[...mockScorecards].sort((a, b) => a.rank - b.rank).map(sc => (
                  <tr key={sc.id} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="px-3 py-3 text-center">
                      <span className={cn("inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold",
                        sc.rank === 1 ? "bg-amber-100 text-amber-700" : sc.rank === 2 ? "bg-slate-100 text-slate-700" : "bg-orange-100 text-orange-700"
                      )}>#{sc.rank}</span>
                    </td>
                    <td className="px-3 py-3 font-medium text-sm">{sc.supplierName}</td>
                    <td className="px-3 py-3 text-xs">{sc.onTimeDelivery}%</td>
                    <td className="px-3 py-3 text-xs">{sc.qualityRating}%</td>
                    <td className="px-3 py-3 text-xs">{sc.defectRate}%</td>
                    <td className="px-3 py-3 text-xs">{sc.invoiceAccuracy}%</td>
                    <td className="px-3 py-3 text-xs">{sc.responseTime}%</td>
                    <td className="px-3 py-3 text-xs">{sc.complianceScore}%</td>
                    <td className="px-3 py-3"><ScoreGauge score={sc.overallScore} size="sm" /></td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1 text-xs">
                        {sc.trend === "Improving" ? <TrendingUp size={13} className="text-emerald-500" /> : sc.trend === "Declining" ? <TrendingDown size={13} className="text-red-500" /> : <Minus size={13} className="text-muted-foreground" />}
                        <TrendChip value={sc.overallScore - sc.previousScore} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </PageShell>
  );
}
