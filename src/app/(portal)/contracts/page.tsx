"use client";
import { useState } from "react";
import Link from "next/link";
import { FileText, Plus, AlertTriangle, CheckCircle2, Clock, Search } from "lucide-react";
import { mockContracts } from "@/data/mockData";
import { formatCurrency, formatDate, daysUntil, cn } from "@/lib/utils";
import { StatusBadge, KPICard, PageShell } from "@/components/shared";
import { Card, CardContent, Progress, Button, Input, Avatar } from "@/components/ui";

export default function ContractsPage() {
  const [search, setSearch] = useState("");
  const active = mockContracts.filter(c => c.status === "Active").length;
  const expiring = mockContracts.filter(c => c.status === "Expiring").length;
  const totalValue = mockContracts.reduce((sum, c) => sum + c.totalValue, 0);
  const avgCompliance = Math.round(mockContracts.reduce((sum, c) => sum + c.complianceScore, 0) / mockContracts.length);

  const filtered = mockContracts.filter(c =>
    !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.supplierName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageShell>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard title="Total Contracts" value={mockContracts.length} icon={FileText} iconColor="text-blue-600" iconBg="bg-blue-50 dark:bg-blue-950" />
        <KPICard title="Active" value={active} icon={CheckCircle2} iconColor="text-emerald-600" iconBg="bg-emerald-50 dark:bg-emerald-950" />
        <KPICard title="Expiring Soon" value={expiring} icon={AlertTriangle} iconColor="text-amber-600" iconBg="bg-amber-50 dark:bg-amber-950" />
        <KPICard title="Total Value" value={formatCurrency(totalValue, "USD", true)} icon={FileText} iconColor="text-violet-600" iconBg="bg-violet-50 dark:bg-violet-950" subtitle="across all contracts" />
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search contracts…" className="pl-8" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Link href="/contracts/new"><Button size="sm" className="gap-1.5"><Plus size={15} />New Contract</Button></Link>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(contract => {
          const days = daysUntil(contract.endDate);
          return (
            <Card key={contract.id} className={cn("hover:shadow-md transition-all", contract.status === "Expiring" && "border-amber-300 dark:border-amber-800")}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                      <FileText size={15} className="text-primary" />
                    </div>
                    <div>
                      <span className="text-xs font-mono text-muted-foreground">{contract.contractNumber}</span>
                      <div><StatusBadge status={contract.status} /></div>
                    </div>
                  </div>
                  {contract.status === "Expiring" && (
                    <div className="flex items-center gap-1 text-amber-600 text-xs font-semibold">
                      <AlertTriangle size={13} /> {days}d left
                    </div>
                  )}
                </div>

                <h3 className="font-semibold text-sm mb-1">{contract.title}</h3>
                <p className="text-xs text-muted-foreground mb-3">{contract.supplierName}</p>

                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div><span className="text-muted-foreground">Type</span><p className="font-medium">{contract.type}</p></div>
                  <div><span className="text-muted-foreground">Value</span><p className="font-medium">{formatCurrency(contract.totalValue, contract.currency, true)}</p></div>
                  <div><span className="text-muted-foreground">Start</span><p className="font-medium">{formatDate(contract.startDate)}</p></div>
                  <div><span className="text-muted-foreground">End</span><p className="font-medium">{formatDate(contract.endDate)}</p></div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Compliance Score</span>
                    <span className={cn("font-semibold", contract.complianceScore >= 95 ? "text-emerald-600" : contract.complianceScore >= 80 ? "text-amber-600" : "text-red-600")}>
                      {contract.complianceScore}%
                    </span>
                  </div>
                  <Progress value={contract.complianceScore} color={contract.complianceScore >= 95 ? "bg-emerald-500" : "bg-amber-500"} />
                </div>

                {contract.autoRenew && (
                  <div className="mt-2 text-xs text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 size={11} /> Auto-renewal enabled ({contract.renewalNotificationDays}d notice)
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </PageShell>
  );
}
