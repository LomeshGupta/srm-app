"use client";
import { mockMonthlySpend, mockSpendByCategory, mockSuppliers } from "@/data/mockData";
import { formatCurrency, CHART_COLORS } from "@/lib/utils";
import { PageShell, KPICard, TrendChip } from "@/components/shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { TrendingUp, TrendingDown, DollarSign, PieChart as PieIcon, BarChart2, Globe } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, LineChart, Line, Treemap
} from "recharts";

const regionData = [
  { region: "North America", spend: 9800000, suppliers: 3 },
  { region: "Europe", spend: 5100000, suppliers: 3 },
  { region: "Asia Pacific", spend: 2400000, suppliers: 1 },
  { region: "South Asia", spend: 780000, suppliers: 1 },
];

const savingsData = mockMonthlySpend.filter(m => m.savings !== 0).map(m => ({
  ...m,
  savingsPct: +((m.savings / m.budget) * 100).toFixed(1),
}));

export default function AnalyticsPage() {
  const totalSpend = mockMonthlySpend.reduce((s, m) => s + m.actual, 0);
  const totalBudget = mockMonthlySpend.reduce((s, m) => s + m.budget, 0);
  const totalSavings = mockMonthlySpend.filter(m => m.savings > 0).reduce((s, m) => s + m.savings, 0);
  const spendVariance = +((totalSpend / totalBudget - 1) * 100).toFixed(1);

  return (
    <PageShell>
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard title="Total Spend YTD" value={formatCurrency(totalSpend, "USD", true)} icon={DollarSign} trend={spendVariance} trendLabel="vs budget" iconColor="text-blue-600" iconBg="bg-blue-50 dark:bg-blue-950" />
        <KPICard title="Budget YTD" value={formatCurrency(totalBudget, "USD", true)} icon={BarChart2} iconColor="text-violet-600" iconBg="bg-violet-50 dark:bg-violet-950" />
        <KPICard title="Savings Achieved" value={formatCurrency(totalSavings, "USD", true)} icon={TrendingDown} trend={14.2} iconColor="text-emerald-600" iconBg="bg-emerald-50 dark:bg-emerald-950" />
        <KPICard title="Active Suppliers" value={mockSuppliers.filter(s => s.status === "Approved").length} icon={Globe} iconColor="text-amber-600" iconBg="bg-amber-50 dark:bg-amber-950" subtitle="across 7 countries" />
      </div>

      {/* Main chart: Monthly Spend */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Spend vs Budget vs Savings</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={mockMonthlySpend} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="budgetGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `$${(v / 1e6).toFixed(1)}M`} />
              <Tooltip formatter={(v: number) => [formatCurrency(v, "USD", true)]} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="actual" name="Actual Spend" stroke="#2563eb" fill="url(#actualGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="budget" name="Budget" stroke="#7c3aed" fill="url(#budgetGrad)" strokeWidth={2} strokeDasharray="5 3" />
              <Bar dataKey="savings" name="Savings" fill="#16a34a" radius={[3,3,0,0]} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Category + Region */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Spend by Category */}
        <Card>
          <CardHeader><CardTitle>Spend by Category</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="50%" height={180}>
                <PieChart>
                  <Pie data={mockSpendByCategory} cx="50%" cy="50%" innerRadius={45} outerRadius={80} dataKey="amount" paddingAngle={2}>
                    {mockSpendByCategory.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => [formatCurrency(v, "USD", true)]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {mockSpendByCategory.map((item, i) => (
                  <div key={item.category} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 flex-1 min-w-0">
                      <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: CHART_COLORS[i] }} />
                      <span className="text-muted-foreground truncate">{item.category}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <span className="font-medium">{item.percentage}%</span>
                      <TrendChip value={item.change} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Spend by Region */}
        <Card>
          <CardHeader><CardTitle>Spend by Region</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={regionData} layout="vertical" margin={{ left: 10, right: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={v => `$${(v/1e6).toFixed(1)}M`} />
                <YAxis type="category" dataKey="region" tick={{ fontSize: 11 }} width={100} />
                <Tooltip formatter={(v: number) => [formatCurrency(v, "USD", true)]} />
                <Bar dataKey="spend" name="Spend" fill="#2563eb" radius={[0,4,4,0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {regionData.map((r) => (
                <div key={r.region} className="rounded-lg bg-muted/50 px-3 py-2 text-xs">
                  <p className="font-medium">{r.region}</p>
                  <p className="text-muted-foreground">{r.suppliers} supplier{r.suppliers > 1 ? "s" : ""}</p>
                  <p className="font-bold text-primary">{formatCurrency(r.spend, "USD", true)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Suppliers by Spend */}
      <Card>
        <CardHeader><CardTitle>Top Suppliers by Spend</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...mockSuppliers]
              .filter(s => s.annualSpend > 0)
              .sort((a, b) => b.annualSpend - a.annualSpend)
              .map((s, i) => {
                const maxSpend = mockSuppliers.reduce((m, x) => Math.max(m, x.annualSpend), 0);
                const pct = Math.round((s.annualSpend / maxSpend) * 100);
                return (
                  <div key={s.id} className="flex items-center gap-3">
                    <span className="w-5 text-xs text-muted-foreground text-right shrink-0">#{i+1}</span>
                    <span className="w-44 text-sm font-medium truncate shrink-0">{s.name}</span>
                    <div className="flex-1">
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-primary transition-all duration-700" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                    <span className="w-24 text-right text-sm font-semibold shrink-0">{formatCurrency(s.annualSpend, s.currency, true)}</span>
                    <span className="w-16 text-right text-xs text-muted-foreground shrink-0">{s.category}</span>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>

      {/* Savings Trend */}
      <Card>
        <CardHeader><CardTitle>Procurement Savings Rate (%)</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={savingsData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `${v}%`} />
              <Tooltip formatter={(v: number) => [`${v}%`, "Savings Rate"]} />
              <Line type="monotone" dataKey="savingsPct" stroke="#16a34a" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </PageShell>
  );
}
