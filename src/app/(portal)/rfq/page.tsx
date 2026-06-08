"use client";
import { useState } from "react";
import Link from "next/link";
import { Plus, Search, Eye, Award, Calendar, DollarSign, Users, FileText, ChevronRight } from "lucide-react";
import { mockRFQs } from "@/data/mockData";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { StatusBadge, KPICard, PageShell, SectionHeader } from "@/components/shared";
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Progress, Badge } from "@/components/ui";

export default function RFQPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = mockRFQs.filter(r => {
    const ms = !search || r.title.toLowerCase().includes(search.toLowerCase());
    const mf = statusFilter === "All" || r.status === statusFilter;
    return ms && mf;
  });

  const counts = { Draft: 0, Published: 0, Closed: 0, Awarded: 0 };
  mockRFQs.forEach(r => counts[r.status]++);

  return (
    <PageShell>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard title="Total RFQs" value={mockRFQs.length} icon={FileText} iconColor="text-blue-600" iconBg="bg-blue-50 dark:bg-blue-950" />
        <KPICard title="Published" value={counts.Published} icon={Eye} iconColor="text-violet-600" iconBg="bg-violet-50 dark:bg-violet-950" />
        <KPICard title="Awarded" value={counts.Awarded} icon={Award} iconColor="text-emerald-600" iconBg="bg-emerald-50 dark:bg-emerald-950" />
        <KPICard title="Draft" value={counts.Draft} icon={FileText} iconColor="text-amber-600" iconBg="bg-amber-50 dark:bg-amber-950" />
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search RFQs…" className="pl-8" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="h-9 rounded-md border border-input bg-background px-3 text-sm" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          {["All","Draft","Published","Closed","Awarded"].map(s => <option key={s}>{s}</option>)}
        </select>
        <Link href="/rfq/new"><Button size="sm" className="gap-1.5"><Plus size={15} />Create RFQ</Button></Link>
      </div>

      <div className="space-y-4">
        {filtered.map(rfq => (
          <Card key={rfq.id} className="hover:shadow-md transition-all">
            <CardContent className="p-5">
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="text-xs font-mono text-muted-foreground">{rfq.id}</span>
                    <StatusBadge status={rfq.status} />
                    <span className="text-xs bg-muted rounded-full px-2 py-0.5">{rfq.category}</span>
                  </div>
                  <h3 className="font-semibold mb-1">{rfq.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{rfq.description}</p>

                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><DollarSign size={11} />Est. {formatCurrency(rfq.estimatedValue, rfq.currency, true)}</span>
                    <span className="flex items-center gap-1"><Calendar size={11} />Closes {formatDate(rfq.closingDate)}</span>
                    <span className="flex items-center gap-1"><Users size={11} />{rfq.invitedSuppliers.length} invited</span>
                    <span className="flex items-center gap-1"><FileText size={11} />{rfq.bids.length} bids</span>
                  </div>
                </div>

                {/* Bid summary */}
                {rfq.bids.length > 0 && (
                  <div className="md:w-56 space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground">Bid Comparison</p>
                    {rfq.bids.slice(0, 2).map(bid => (
                      <div key={bid.id} className="rounded-lg border p-2.5 text-xs">
                        <div className="flex justify-between mb-1">
                          <span className="font-medium truncate max-w-[120px]">{bid.supplierName.split(" ").slice(0,2).join(" ")}</span>
                          <StatusBadge status={bid.status} />
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span>{formatCurrency(bid.totalAmount, bid.currency, true)}</span>
                          <span className="font-medium text-primary">Score: {bid.overallScore}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <Button variant="outline" size="sm" className="shrink-0">
                  View Details <ChevronRight size={14} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
