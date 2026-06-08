"use client";
import {
  Users, ShoppingCart, FileText, AlertTriangle, TrendingUp,
  Receipt, Building2, CheckCircle2, Clock, Star, ArrowRight,
  Package, Zap
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer
} from "recharts";
import Link from "next/link";

import { mockKPISummary, mockMonthlySpend, mockSpendByCategory, mockScorecards, mockNotifications, mockWorkflows, mockPurchaseOrders, mockSuppliers } from "@/data/mockData";
import { formatCurrency, formatDate, getStatusColor, cn } from "@/lib/utils";
import { KPICard, StatusBadge, PageShell, SectionHeader } from "@/components/shared";
import { Card, CardHeader, CardTitle, CardContent, Progress, Avatar, Badge } from "@/components/ui";

const COLORS = ["#2563eb", "#7c3aed", "#db2777", "#ea580c", "#16a34a", "#0891b2", "#9333ea"];

export default function DashboardPage() {
  const kpi = mockKPISummary;

  return (
    <PageShell>
      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        <KPICard title="Total Suppliers" value={kpi.totalSuppliers} icon={Users} trend={8.3} iconColor="text-blue-600" iconBg="bg-blue-50 dark:bg-blue-950" />
        <KPICard title="Active Vendors (BC)" value={kpi.activeVendors} icon={Building2} trend={5.2} iconColor="text-violet-600" iconBg="bg-violet-50 dark:bg-violet-950" />
        <KPICard title="Pending Approvals" value={kpi.pendingApprovals} icon={Clock} trend={-12.5} iconColor="text-amber-600" iconBg="bg-amber-50 dark:bg-amber-950" />
        <KPICard title="Open RFQs" value={kpi.openRFQs} icon={FileText} trend={20} iconColor="text-cyan-600" iconBg="bg-cyan-50 dark:bg-cyan-950" />
        <KPICard title="Open POs" value={kpi.openPOs} icon={ShoppingCart} trend={-4.1} iconColor="text-pink-600" iconBg="bg-pink-50 dark:bg-pink-950" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard title="Pending Invoices" value={kpi.pendingInvoices} icon={Receipt} trend={-8} iconColor="text-orange-600" iconBg="bg-orange-50 dark:bg-orange-950" />
        <KPICard title="Total Spend YTD" value={formatCurrency(kpi.totalSpend, "USD", true)} icon={TrendingUp} trend={7.4} iconColor="text-emerald-600" iconBg="bg-emerald-50 dark:bg-emerald-950" subtitle="vs budget" />
        <KPICard title="Procurement Savings" value={formatCurrency(kpi.procurementSavings, "USD", true)} icon={Star} trend={14.2} iconColor="text-indigo-600" iconBg="bg-indigo-50 dark:bg-indigo-950" />
        <KPICard title="Expiring Contracts" value={kpi.contractsExpiringSoon} icon={AlertTriangle} trend={100} iconColor="text-red-600" iconBg="bg-red-50 dark:bg-red-950" subtitle="action required" />
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Monthly Spend */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Monthly Spend vs Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={mockMonthlySpend} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
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
                <Tooltip formatter={(v: number) => [formatCurrency(v, "USD", true), ""]} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="actual" name="Actual Spend" stroke="#2563eb" fill="url(#spendGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="budget" name="Budget" stroke="#7c3aed" fill="url(#budgetGrad)" strokeWidth={2} strokeDasharray="5 3" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Spend by Category Pie */}
        <Card>
          <CardHeader><CardTitle>Spend by Category</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={mockSpendByCategory} cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                  dataKey="amount" nameKey="category" paddingAngle={2}>
                  {mockSpendByCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v: number) => [formatCurrency(v, "USD", true)]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-2">
              {mockSpendByCategory.slice(0, 4).map((item, i) => (
                <div key={item.category} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                    <span className="text-muted-foreground">{item.category}</span>
                  </div>
                  <span className="font-medium">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Supplier Performance Bar */}
        <Card>
          <CardHeader><CardTitle>Top Supplier Performance Scores</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={mockScorecards.sort((a, b) => b.overallScore - a.overallScore).slice(0, 5)} layout="vertical" margin={{ left: 10, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="supplierName" width={130} tick={{ fontSize: 10 }} tickFormatter={v => v.length > 16 ? v.slice(0, 16) + "…" : v} />
                <Tooltip />
                <Bar dataKey="overallScore" name="Score" fill="#2563eb" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Savings Line */}
        <Card>
          <CardHeader><CardTitle>Procurement Savings Trend</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={mockMonthlySpend.filter(m => m.savings !== 0)} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `$${(v / 1e3).toFixed(0)}K`} />
                <Tooltip formatter={(v: number) => [formatCurrency(v, "USD", true), "Savings"]} />
                <Line type="monotone" dataKey="savings" name="Savings" stroke="#16a34a" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Recent POs */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Purchase Orders</CardTitle>
              <Link href="/purchase-orders" className="text-xs text-primary hover:underline flex items-center gap-1">
                View all <ArrowRight size={12} />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockPurchaseOrders.slice(0, 4).map(po => (
                <div key={po.id} className="flex items-center gap-3 py-2 border-b last:border-0">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Package size={14} className="text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{po.poNumber}</p>
                    <p className="text-xs text-muted-foreground">{po.supplierName}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold">{formatCurrency(po.totalAmount, po.currency, true)}</p>
                    <StatusBadge status={po.status} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Alerts & Notifications</CardTitle>
              <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-semibold text-destructive">
                {mockNotifications.filter(n => !n.read).length} new
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockNotifications.slice(0, 5).map(n => (
                <div key={n.id} className={cn("flex items-start gap-2 rounded-lg p-2.5 transition-colors", !n.read ? "bg-primary/5" : "hover:bg-muted/50")}>
                  <span className={cn("mt-1 h-2 w-2 rounded-full shrink-0",
                    n.type === "error" ? "bg-red-500" : n.type === "warning" ? "bg-amber-500" :
                    n.type === "success" ? "bg-emerald-500" : "bg-blue-500"
                  )} />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold">{n.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Workflows */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Active Workflows</CardTitle>
            <Link href="/workflow" className="text-xs text-primary hover:underline flex items-center gap-1">View all <ArrowRight size={12} /></Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {mockWorkflows.map(wf => (
              <div key={wf.id} className="rounded-lg border p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs font-semibold">{wf.type}</p>
                    <p className="text-xs text-muted-foreground">{wf.entityName}</p>
                  </div>
                  <StatusBadge status={wf.status} />
                </div>
                <div className="space-y-1.5">
                  {wf.steps.map((step, i) => (
                    <div key={step.id} className="flex items-center gap-2 text-xs">
                      <div className={cn("h-4 w-4 rounded-full flex items-center justify-center shrink-0",
                        step.status === "Completed" ? "bg-emerald-500 text-white" :
                        step.status === "In Progress" ? "bg-primary text-white" :
                        step.status === "Failed" ? "bg-red-500 text-white" : "bg-muted"
                      )}>
                        {step.status === "Completed" ? <CheckCircle2 size={10} /> :
                         step.status === "In Progress" ? <Zap size={10} /> :
                         <span className="text-[8px] font-bold">{i + 1}</span>}
                      </div>
                      <span className={cn(step.status === "Pending" ? "text-muted-foreground" : "text-foreground")}>
                        {step.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </PageShell>
  );
}
