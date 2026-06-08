"use client";
import { useState } from "react";
import { Receipt, CheckCircle2, Clock, XCircle, DollarSign, Search, Plus } from "lucide-react";
import Link from "next/link";
import { mockInvoices } from "@/data/mockData";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { StatusBadge, KPICard, PageShell } from "@/components/shared";
import { Card, CardContent, Button, Input, Avatar } from "@/components/ui";

export default function InvoicesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = mockInvoices.filter(inv => {
    const ms = !search || inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) || inv.supplierName.toLowerCase().includes(search.toLowerCase());
    const mf = statusFilter === "All" || inv.status === statusFilter;
    return ms && mf;
  });

  const totalPending = mockInvoices.filter(i => i.status === "Pending" || i.status === "Matched").reduce((s, i) => s + i.totalAmount, 0);
  const totalPaid = mockInvoices.filter(i => i.status === "Paid").reduce((s, i) => s + i.totalAmount, 0);

  return (
    <PageShell>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard title="Total Invoices" value={mockInvoices.length} icon={Receipt} iconColor="text-blue-600" iconBg="bg-blue-50 dark:bg-blue-950" />
        <KPICard title="Pending Payment" value={`${formatCurrency(totalPending, "USD", true)}`} icon={Clock} iconColor="text-amber-600" iconBg="bg-amber-50 dark:bg-amber-950" subtitle={`${mockInvoices.filter(i=>["Pending","Matched"].includes(i.status)).length} invoices`} />
        <KPICard title="Paid YTD" value={formatCurrency(totalPaid, "CAD", true)} icon={CheckCircle2} iconColor="text-emerald-600" iconBg="bg-emerald-50 dark:bg-emerald-950" />
        <KPICard title="Rejected" value={mockInvoices.filter(i=>i.status==="Rejected").length} icon={XCircle} iconColor="text-red-600" iconBg="bg-red-50 dark:bg-red-950" />
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search invoices…" className="pl-8" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="h-9 rounded-md border border-input bg-background px-3 text-sm" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          {["All","Pending","Matched","Approved","Paid","Rejected"].map(s=><option key={s}>{s}</option>)}
        </select>
        <Link href="/invoices/new">
          <Button size="sm" className="gap-1.5"><Plus size={15} />Submit Invoice</Button>
        </Link>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/40">
              <tr>
                {["Invoice #","Supplier","PO Reference","Invoice Date","Due Date","Amount","Match Status","Status","BC Document",""].map(h=>(
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(inv => (
                <tr key={inv.id} className="border-b hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs font-medium">{inv.invoiceNumber}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Avatar name={inv.supplierName} size="sm" />
                      <span className="text-sm max-w-[120px] truncate">{inv.supplierName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{inv.poNumber ?? "—"}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(inv.invoiceDate)}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(inv.dueDate)}</td>
                  <td className="px-4 py-3 font-semibold">{formatCurrency(inv.totalAmount, inv.currency, true)}</td>
                  <td className="px-4 py-3">
                    <span className={cn("inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                      inv.matchingStatus === "Fully Matched" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400" :
                      inv.matchingStatus === "Partially Matched" ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400" :
                      "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"
                    )}>
                      {inv.matchingStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={inv.status} /></td>
                  <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{inv.bcDocumentNumber ?? "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">View</Button>
                      {inv.status === "Pending" && <Button variant="outline" size="sm">Approve</Button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </PageShell>
  );
}
