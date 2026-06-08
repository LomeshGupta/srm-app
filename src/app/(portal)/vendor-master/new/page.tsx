"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Database, RefreshCw, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Label, Select } from "@/components/ui";
import { PageShell, StatusBadge } from "@/components/shared";
import { mockSuppliers } from "@/data/mockData";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const BC_PAYMENT_TERMS = ["1M(8D)", "2M(8D)", "NET10", "NET15", "NET30", "NET45", "NET60", "COD"];
const BC_VENDOR_POSTING_GROUPS = ["DOMESTIC", "EU", "FOREIGN", "INTERCOMPANY"];
const BC_GEN_BUS_GROUPS = ["DOMESTIC", "EU", "EXPORT"];
const BC_TAX_AREAS = ["US-FL-GAINESV", "US-CA-SANFRAN", "EU-STANDARD", "INTERNATIONAL"];

export default function CreateVendorInBCPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState<"form" | "syncing" | "success">("form");
  const [supplierId, setSupplierId] = useState("");

  // BC-specific fields
  const [bcPaymentTerms, setBcPaymentTerms] = useState("NET30");
  const [currency, setCurrency] = useState("USD");
  const [vendorPostingGroup, setVendorPostingGroup] = useState("DOMESTIC");
  const [genBusPostingGroup, setGenBusPostingGroup] = useState("DOMESTIC");
  const [taxAreaCode, setTaxAreaCode] = useState("US-FL-GAINESV");
  const [taxLiable, setTaxLiable] = useState(true);
  const [payToVendor, setPayToVendor] = useState("");
  const [bcVendorNumber, setBcVendorNumber] = useState("V" + String(Math.floor(Math.random() * 90000) + 10000));

  const unlinkedSuppliers = mockSuppliers.filter(s => s.status === "Approved" && !s.bcVendorId);
  const selectedSupplier = mockSuppliers.find(s => s.id === supplierId);

  const handleCreate = async () => {
    if (!supplierId) { toast.error("Please select a supplier"); return; }
    setSaving(true);
    setStep("syncing");
    await new Promise(r => setTimeout(r, 2500));
    setStep("success");
    setSaving(false);
  };

  if (step === "syncing") {
    return (
      <PageShell>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-6">
            <Database size={36} className="text-primary animate-pulse-soft" />
          </div>
          <h2 className="text-lg font-bold mb-2">Creating Vendor in Business Central…</h2>
          <p className="text-sm text-muted-foreground mb-6">Calling BC API v2.0 — POST /vendors</p>
          <div className="w-64 space-y-2">
            {[
              "Validating supplier data",
              "Checking for duplicate vendors",
              "Creating vendor record",
              "Setting posting groups",
              "Syncing bank accounts",
            ].map((step, i) => (
              <div key={step} className="flex items-center gap-2 text-xs text-left">
                <RefreshCw size={12} className="text-primary animate-spin shrink-0" />
                <span className="text-muted-foreground">{step}…</span>
              </div>
            ))}
          </div>
        </div>
      </PageShell>
    );
  }

  if (step === "success") {
    return (
      <PageShell>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950 mb-6">
            <CheckCircle2 size={40} className="text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold mb-2">Vendor Created Successfully!</h2>
          <p className="text-sm text-muted-foreground mb-2">{selectedSupplier?.name} is now available in Business Central.</p>
          <div className="rounded-xl border bg-card p-6 mt-4 text-left min-w-[320px] space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">BC Vendor Number</span><span className="font-mono font-bold text-primary">{bcVendorNumber}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Company</span><span>CRONUS</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Payment Terms</span><span>{bcPaymentTerms}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Currency</span><span>{currency}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Sync Status</span><StatusBadge status="Synced" /></div>
          </div>
          <div className="flex gap-3 mt-6">
            <Button variant="outline" onClick={() => router.push("/vendor-master")}>View Vendor Master</Button>
            <Button onClick={() => router.push("/suppliers")}>Back to Suppliers</Button>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/vendor-master" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={15} />Back
          </Link>
          <div>
            <h1 className="text-base font-semibold">Create Vendor in Business Central</h1>
            <p className="text-xs text-muted-foreground">Push approved supplier to BC Vendor Module via REST API</p>
          </div>
        </div>
        <Button size="sm" onClick={handleCreate} disabled={saving} className="gap-1.5">
          <Database size={14} />{saving ? "Creating…" : "Create in BC"}
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {/* Supplier Selection */}
        <div className="space-y-5">
          <Card>
            <CardHeader><CardTitle>Select Approved Supplier</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs">Supplier *</Label>
                <Select className="mt-1" value={supplierId} onChange={e => setSupplierId(e.target.value)}>
                  <option value="">Choose a supplier to link…</option>
                  {unlinkedSuppliers.map(s => <option key={s.id} value={s.id}>{s.name} ({s.country})</option>)}
                </Select>
                {unlinkedSuppliers.length === 0 && (
                  <p className="mt-2 text-xs text-muted-foreground">All approved suppliers are already linked to BC vendors.</p>
                )}
              </div>
              {selectedSupplier && (
                <div className="rounded-lg bg-muted/50 p-4 space-y-2 text-sm">
                  <p className="font-semibold">{selectedSupplier.name}</p>
                  <div className="grid grid-cols-2 gap-y-1 text-xs">
                    <span className="text-muted-foreground">Code</span><span>{selectedSupplier.code}</span>
                    <span className="text-muted-foreground">Email</span><span className="truncate">{selectedSupplier.email}</span>
                    <span className="text-muted-foreground">Country</span><span>{selectedSupplier.country}</span>
                    <span className="text-muted-foreground">Tax ID</span><span>{selectedSupplier.taxId}</span>
                    <span className="text-muted-foreground">Currency</span><span>{selectedSupplier.currency}</span>
                    <span className="text-muted-foreground">Payment</span><span>{selectedSupplier.paymentTerms}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>BC Vendor Number</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-xs">Vendor No. (auto-generated or manual)</Label>
                <Input className="mt-1 font-mono" value={bcVendorNumber} onChange={e => setBcVendorNumber(e.target.value)} />
              </div>
              <p className="text-xs text-muted-foreground">Leave as-is to use the next available vendor number in BC, or enter a specific number.</p>
            </CardContent>
          </Card>
        </div>

        {/* BC Configuration */}
        <div className="space-y-5">
          <Card>
            <CardHeader><CardTitle>Business Central Configuration</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs">Payment Terms Code</Label>
                <Select className="mt-1" value={bcPaymentTerms} onChange={e => setBcPaymentTerms(e.target.value)}>
                  {BC_PAYMENT_TERMS.map(t => <option key={t}>{t}</option>)}
                </Select>
              </div>
              <div>
                <Label className="text-xs">Currency Code</Label>
                <Select className="mt-1" value={currency} onChange={e => setCurrency(e.target.value)}>
                  {["USD","EUR","GBP","CAD","CHF","JPY","INR"].map(c => <option key={c}>{c}</option>)}
                </Select>
              </div>
              <div>
                <Label className="text-xs">Vendor Posting Group</Label>
                <Select className="mt-1" value={vendorPostingGroup} onChange={e => setVendorPostingGroup(e.target.value)}>
                  {BC_VENDOR_POSTING_GROUPS.map(g => <option key={g}>{g}</option>)}
                </Select>
              </div>
              <div>
                <Label className="text-xs">Gen. Business Posting Group</Label>
                <Select className="mt-1" value={genBusPostingGroup} onChange={e => setGenBusPostingGroup(e.target.value)}>
                  {BC_GEN_BUS_GROUPS.map(g => <option key={g}>{g}</option>)}
                </Select>
              </div>
              <div>
                <Label className="text-xs">Tax Area Code</Label>
                <Select className="mt-1" value={taxAreaCode} onChange={e => setTaxAreaCode(e.target.value)}>
                  {BC_TAX_AREAS.map(t => <option key={t}>{t}</option>)}
                </Select>
              </div>
              <div>
                <Label className="text-xs">Pay-To Vendor (optional)</Label>
                <Input className="mt-1 font-mono" value={payToVendor} onChange={e => setPayToVendor(e.target.value)} placeholder="V00001 (leave blank if same vendor)" />
              </div>
              <label className="flex items-center gap-2 text-xs cursor-pointer">
                <input type="checkbox" checked={taxLiable} onChange={e => setTaxLiable(e.target.checked)} />
                Tax Liable
              </label>
            </CardContent>
          </Card>

          <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30 p-4 text-xs text-blue-700 dark:text-blue-300 space-y-1">
            <p className="font-semibold">API Call Preview</p>
            <pre className="text-[10px] overflow-x-auto whitespace-pre-wrap font-mono bg-black/10 rounded p-2">{`POST /api/v2.0/companies/CRONUS/vendors
{
  "number": "${bcVendorNumber}",
  "displayName": "${selectedSupplier?.name ?? "…"}",
  "email": "${selectedSupplier?.email ?? "…"}",
  "currencyCode": "${currency}",
  "paymentTermsId": "${bcPaymentTerms}",
  "taxLiable": ${taxLiable},
  "vendorPostingGroup": "${vendorPostingGroup}"
}`}</pre>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
