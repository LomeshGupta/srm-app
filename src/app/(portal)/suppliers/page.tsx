"use client";
import { useState } from "react";
import { Search, Plus, Filter, Grid3x3, List, Globe, Building2, Star, ChevronRight, Phone, Mail, ExternalLink } from "lucide-react";
import Link from "next/link";
import { mockSuppliers } from "@/data/mockData";
import { formatCurrency, getScoreColor, cn } from "@/lib/utils";
import { StatusBadge, KPICard, PageShell, ScoreGauge } from "@/components/shared";
import { Card, CardContent, Button, Input, Progress, Avatar } from "@/components/ui";
import { Users, CheckCircle2, Clock, XCircle } from "lucide-react";

const STATUS_FILTERS = ["All", "Approved", "Under Review", "Submitted", "Draft", "Rejected", "Blocked"];
const CATEGORY_FILTERS = ["All", "Manufacturing", "IT & Software", "Logistics", "Raw Materials", "Professional Services", "Electronics", "Energy", "Packaging"];

export default function SuppliersPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const filtered = mockSuppliers.filter(s => {
    const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.code.toLowerCase().includes(search.toLowerCase()) || s.country.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || s.status === statusFilter;
    const matchCat = categoryFilter === "All" || s.category === categoryFilter;
    return matchSearch && matchStatus && matchCat;
  });

  const approved = mockSuppliers.filter(s => s.status === "Approved").length;
  const pending = mockSuppliers.filter(s => ["Submitted", "Under Review"].includes(s.status)).length;
  const rejected = mockSuppliers.filter(s => s.status === "Rejected").length;

  return (
    <PageShell>
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard title="Total Suppliers" value={mockSuppliers.length} icon={Users} trend={8.3} iconColor="text-blue-600" iconBg="bg-blue-50 dark:bg-blue-950" />
        <KPICard title="Approved" value={approved} icon={CheckCircle2} iconColor="text-emerald-600" iconBg="bg-emerald-50 dark:bg-emerald-950" />
        <KPICard title="Pending Review" value={pending} icon={Clock} iconColor="text-amber-600" iconBg="bg-amber-50 dark:bg-amber-950" />
        <KPICard title="Rejected" value={rejected} icon={XCircle} iconColor="text-red-600" iconBg="bg-red-50 dark:bg-red-950" />
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search suppliers by name, code, or country…" className="pl-8" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="h-9 rounded-md border border-input bg-background px-3 text-sm" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          {STATUS_FILTERS.map(f => <option key={f}>{f}</option>)}
        </select>
        <select className="h-9 rounded-md border border-input bg-background px-3 text-sm" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
          {CATEGORY_FILTERS.map(f => <option key={f}>{f}</option>)}
        </select>
        <div className="flex gap-1 border rounded-md p-1">
          <Button variant={view === "grid" ? "secondary" : "ghost"} size="sm" onClick={() => setView("grid")}><Grid3x3 size={15} /></Button>
          <Button variant={view === "list" ? "secondary" : "ghost"} size="sm" onClick={() => setView("list")}><List size={15} /></Button>
        </div>
        <Link href="/suppliers/new"><Button size="sm" className="gap-1.5"><Plus size={15} />Add Supplier</Button></Link>
      </div>

      <p className="text-xs text-muted-foreground">{filtered.length} suppliers found</p>

      {/* Grid View */}
      {view === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(s => (
            <Card key={s.id} className="hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={s.name} size="md" />
                    <div>
                      <p className="text-sm font-semibold leading-tight">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.code}</p>
                    </div>
                  </div>
                  <StatusBadge status={s.status} />
                </div>

                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                  <span className="flex items-center gap-1"><Globe size={11} />{s.country}</span>
                  <span className="flex items-center gap-1"><Building2 size={11} />{s.category}</span>
                </div>

                {s.status === "Approved" && (
                  <div className="space-y-1.5 mb-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Performance</span>
                      <span className={cn("font-semibold", getScoreColor(s.performanceScore))}>{s.performanceScore}/100</span>
                    </div>
                    <Progress value={s.performanceScore} color={s.performanceScore >= 90 ? "bg-emerald-500" : s.performanceScore >= 75 ? "bg-blue-500" : "bg-amber-500"} />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Annual Spend</span>
                      <span className="font-medium text-foreground">{formatCurrency(s.annualSpend, s.currency, true)}</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-1.5">
                  <StatusBadge status={s.riskLevel} type="risk" />
                  <StatusBadge status={s.syncStatus} />
                  <Link href={`/suppliers/${s.id}`} className="ml-auto text-xs text-primary hover:underline flex items-center gap-0.5">
                    Details <ChevronRight size={12} />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* List View */}
      {view === "list" && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/40">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Supplier</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Country</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Risk</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Score</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Spend</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">BC Sync</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s.id} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={s.name} size="sm" />
                        <div>
                          <p className="font-medium text-sm">{s.name}</p>
                          <p className="text-xs text-muted-foreground">{s.code}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{s.category}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{s.country}</td>
                    <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                    <td className="px-4 py-3"><StatusBadge status={s.riskLevel} type="risk" /></td>
                    <td className="px-4 py-3">
                      {s.performanceScore > 0 ? <span className={cn("font-bold text-sm", getScoreColor(s.performanceScore))}>{s.performanceScore}</span> : <span className="text-muted-foreground">—</span>}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">{s.annualSpend > 0 ? formatCurrency(s.annualSpend, s.currency, true) : "—"}</td>
                    <td className="px-4 py-3"><StatusBadge status={s.syncStatus} /></td>
                    <td className="px-4 py-3">
                      <Link href={`/suppliers/${s.id}`}><Button variant="ghost" size="sm"><ChevronRight size={14} /></Button></Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </PageShell>
  );
}
