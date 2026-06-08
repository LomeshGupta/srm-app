"use client";
import { useState } from "react";
import Link from "next/link";
import { mockVendors, mockSuppliers } from "@/data/mockData";
import { formatDate, cn } from "@/lib/utils";
import { PageShell, KPICard, StatusBadge } from "@/components/shared";
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from "@/components/ui";
import { Database, RefreshCw, CheckCircle2, XCircle, Clock, AlertTriangle, RotateCcw, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export default function VendorMasterPage() {
  const [syncing, setSyncing] = useState<string | null>(null);

  const synced = mockVendors.filter(v => v.syncStatus === "Synced").length;
  const failed = mockVendors.filter(v => v.syncStatus === "Failed").length;
  const pending = mockVendors.filter(v => v.syncStatus === "Pending").length;
  const notLinked = mockSuppliers.filter(s => !s.bcVendorId).length;

  const handleSync = (vendorId: string, name: string) => {
    setSyncing(vendorId);
    setTimeout(() => {
      setSyncing(null);
      toast.success(`Sync successful for ${name}`);
    }, 2000);
  };

  const handleRetry = (vendorId: string, name: string) => {
    setSyncing(vendorId);
    setTimeout(() => {
      setSyncing(null);
      toast.error(`Sync still failing for ${name} — check BC connection`);
    }, 2500);
  };

  return (
    <PageShell>
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard title="Total Vendors" value={mockVendors.length} icon={Database} iconColor="text-blue-600" iconBg="bg-blue-50 dark:bg-blue-950" />
        <KPICard title="Synced with BC" value={synced} icon={CheckCircle2} iconColor="text-emerald-600" iconBg="bg-emerald-50 dark:bg-emerald-950" />
        <KPICard title="Sync Failed" value={failed} icon={XCircle} iconColor="text-red-600" iconBg="bg-red-50 dark:bg-red-950" />
        <KPICard title="Not Linked" value={notLinked} icon={AlertTriangle} iconColor="text-amber-600" iconBg="bg-amber-50 dark:bg-amber-950" subtitle="suppliers without BC vendor" />
      </div>

      {/* Sync Status Overview */}
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { label: "Sync Success Rate", value: `${Math.round((synced / mockVendors.length) * 100)}%`, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950" },
          { label: "Last Bulk Sync", value: "Nov 29, 2024 06:00", color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950" },
          { label: "BC Environment", value: "CRONUS — Production", color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-950" },
        ].map(item => (
          <div key={item.label} className={cn("rounded-xl p-4 border", item.bg)}>
            <p className="text-xs text-muted-foreground">{item.label}</p>
            <p className={cn("text-xl font-bold mt-1", item.color)}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* Vendor Table */}
      <Card>
        <div className="p-5 border-b flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Vendor Master — Business Central</h3>
            <p className="text-xs text-muted-foreground">Bidirectional sync with BC Vendor Module via OData v4</p>
          </div>
          <Link href="/vendor-master/new">
            <Button size="sm" className="gap-1.5"><RefreshCw size={14} /> Create Vendor in BC</Button>
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/40">
              <tr>
                {["Supplier","BC Vendor #","BC Company","Currency","Payment Terms","Blocked","Sync Status","Last Sync","Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockVendors.map(v => (
                <tr key={v.id} className="border-b hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-sm">{v.supplierName}</td>
                  <td className="px-4 py-3 font-mono text-xs font-medium text-primary">{v.bcVendorNumber}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{v.bcCompanyId}</td>
                  <td className="px-4 py-3 text-xs">{v.currencyCode}</td>
                  <td className="px-4 py-3 text-xs font-mono">{v.paymentTermsCode}</td>
                  <td className="px-4 py-3">
                    <span className={cn("text-xs font-medium", v.blocked ? "text-red-600" : "text-emerald-600")}>
                      {v.blocked ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={v.syncStatus} /></td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(v.lastSyncDate)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      {v.syncStatus === "Failed" ? (
                        <Button variant="outline" size="sm" className="gap-1 text-xs"
                          onClick={() => handleRetry(v.id, v.supplierName)}
                          disabled={syncing === v.id}>
                          {syncing === v.id ? <RefreshCw size={12} className="animate-spin" /> : <RotateCcw size={12} />}
                          Retry
                        </Button>
                      ) : (
                        <Button variant="ghost" size="sm" className="gap-1 text-xs"
                          onClick={() => handleSync(v.id, v.supplierName)}
                          disabled={syncing === v.id}>
                          {syncing === v.id ? <RefreshCw size={12} className="animate-spin" /> : <RefreshCw size={12} />}
                          Sync
                        </Button>
                      )}
                      <Button variant="ghost" size="sm"><ExternalLink size={12} /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Failed Sync Errors */}
      {mockVendors.filter(v => v.syncStatus === "Failed").map(v => (
        <Card key={v.id} className="border-red-200 dark:border-red-900">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <XCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-sm text-red-700 dark:text-red-400">Sync Failed: {v.supplierName}</p>
                <p className="text-xs text-muted-foreground mb-2">BC Vendor: {v.bcVendorNumber} · Last attempt: {formatDate(v.lastSyncDate)}</p>
                <div className="space-y-1">
                  {v.syncErrors.map((err, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/50 rounded px-2.5 py-1.5">
                      <AlertTriangle size={11} className="shrink-0" /> {err}
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="outline" className="gap-1.5 text-xs border-red-300 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-400">
                    <RotateCcw size={12} /> Retry Sync
                  </Button>
                  <Button size="sm" variant="ghost" className="text-xs">View Logs</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Unlinked Suppliers */}
      <Card>
        <CardHeader>
          <CardTitle>Suppliers Without BC Vendor Link</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockSuppliers.filter(s => !s.bcVendorId).map(s => (
              <div key={s.id} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-medium text-sm">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.code} · {s.status}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={s.status} />
                  {s.status === "Approved" && (
                    <Button size="sm" className="gap-1.5 text-xs">
                      <Database size={12} /> Create in BC
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </PageShell>
  );
}
