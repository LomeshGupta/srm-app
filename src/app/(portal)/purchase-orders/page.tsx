"use client";
import { useState } from "react";
import Link from "next/link";
import { Plus, Search, ShoppingCart, Clock, CheckCircle2, XCircle, Package } from "lucide-react";
import { mockPurchaseOrders } from "@/data/mockData";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { StatusBadge, KPICard, PageShell } from "@/components/shared";
import { Card, CardContent, Button, Input, Avatar } from "@/components/ui";

export default function PurchaseOrdersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = mockPurchaseOrders.filter(po => {
    const ms = !search || po.poNumber.toLowerCase().includes(search.toLowerCase()) || po.supplierName.toLowerCase().includes(search.toLowerCase());
    const mf = statusFilter === "All" || po.status === statusFilter;
    return ms && mf;
  });

  const counts = { Draft: 0, "Pending Approval": 0, Approved: 0, Released: 0, Closed: 0 };
  mockPurchaseOrders.forEach(po => { if (counts[po.status as keyof typeof counts] !== undefined) counts[po.status as keyof typeof counts]++; });

  return (
    <PageShell>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <KPICard title="Total POs" value={mockPurchaseOrders.length} icon={ShoppingCart} iconColor="text-blue-600" iconBg="bg-blue-50 dark:bg-blue-950" />
        <KPICard title="Pending Approval" value={counts["Pending Approval"]} icon={Clock} iconColor="text-amber-600" iconBg="bg-amber-50 dark:bg-amber-950" />
        <KPICard title="Approved" value={counts.Approved} icon={CheckCircle2} iconColor="text-emerald-600" iconBg="bg-emerald-50 dark:bg-emerald-950" />
        <KPICard title="Released" value={counts.Released} icon={Package} iconColor="text-violet-600" iconBg="bg-violet-50 dark:bg-violet-950" />
        <KPICard title="Closed" value={counts.Closed} icon={XCircle} iconColor="text-slate-600" iconBg="bg-slate-100 dark:bg-slate-800" />
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search purchase orders…" className="pl-8" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="h-9 rounded-md border border-input bg-background px-3 text-sm" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          {["All","Draft","Pending Approval","Approved","Released","Closed"].map(s=><option key={s}>{s}</option>)}
        </select>
        <Link href="/purchase-orders/new"><Button size="sm" className="gap-1.5"><Plus size={15} />Create PO</Button></Link>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/40">
              <tr>
                {["PO Number","Supplier","Order Date","Expected Delivery","Total Amount","Status","BC Status","Approvers",""].map(h=>(
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(po => (
                <tr key={po.id} className="border-b hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs font-medium">{po.poNumber}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Avatar name={po.supplierName} size="sm" />
                      <span className="text-sm">{po.supplierName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(po.orderDate)}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(po.expectedDelivery)}</td>
                  <td className="px-4 py-3 font-semibold">{formatCurrency(po.totalAmount, po.currency, true)}</td>
                  <td className="px-4 py-3"><StatusBadge status={po.status} /></td>
                  <td className="px-4 py-3">
                    {po.bcPoNumber ? <span className="font-mono text-xs text-emerald-600">{po.bcPoNumber}</span> : <span className="text-xs text-muted-foreground">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex -space-x-1.5">
                      {po.approvers.map((a, i) => (
                        <div key={i} className={cn("h-6 w-6 rounded-full border-2 border-background flex items-center justify-center text-[9px] font-bold text-white",
                          a.status === "Approved" ? "bg-emerald-500" : a.status === "Rejected" ? "bg-red-500" : "bg-amber-500"
                        )} title={`${a.name}: ${a.status}`}>
                          {a.name.split(" ").map(w=>w[0]).join("")}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Button variant="ghost" size="sm">View</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* PO Lines Detail */}
      {filtered[0] && (
        <Card>
          <div className="p-5 border-b flex items-center justify-between">
            <div>
              <h3 className="font-semibold">{filtered[0].poNumber} — Line Items</h3>
              <p className="text-xs text-muted-foreground">{filtered[0].supplierName}</p>
            </div>
            <StatusBadge status={filtered[0].status} />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/40">
                <tr>
                  {["Description","Qty","Unit","Unit Price","Total","Delivery Date","GL Account"].map(h=>(
                    <th key={h} className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered[0].lines.map(line => (
                  <tr key={line.id} className="border-b last:border-0">
                    <td className="px-4 py-2.5 text-sm">{line.description}</td>
                    <td className="px-4 py-2.5 text-sm">{line.quantity.toLocaleString()}</td>
                    <td className="px-4 py-2.5 text-xs text-muted-foreground">{line.unit}</td>
                    <td className="px-4 py-2.5 text-sm">{formatCurrency(line.unitPrice, filtered[0].currency)}</td>
                    <td className="px-4 py-2.5 text-sm font-semibold">{formatCurrency(line.totalPrice, filtered[0].currency, true)}</td>
                    <td className="px-4 py-2.5 text-xs text-muted-foreground">{formatDate(line.deliveryDate)}</td>
                    <td className="px-4 py-2.5 text-xs font-mono">{line.glAccount}</td>
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
