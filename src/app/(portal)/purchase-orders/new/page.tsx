"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2, Save, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Label, Textarea, Select } from "@/components/ui";
import { PageShell } from "@/components/shared";
import { mockSuppliers } from "@/data/mockData";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

interface POLine { description: string; quantity: string; unit: string; unitPrice: string; deliveryDate: string; glAccount: string; }

const GL_ACCOUNTS = ["5010 — Raw Materials", "5020 — Components", "6030 — Software & Licenses", "6040 — Professional Services", "7010 — Freight & Logistics", "7020 — Travel & Expenses", "8010 — Capital Equipment"];

export default function CreatePOPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [supplierId, setSupplierId] = useState("");
  const [expectedDelivery, setExpectedDelivery] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [notes, setNotes] = useState("");
  const [lines, setLines] = useState<POLine[]>([{ description: "", quantity: "", unit: "pcs", unitPrice: "", deliveryDate: "", glAccount: "5010 — Raw Materials" }]);

  const approvedSuppliers = mockSuppliers.filter(s => s.status === "Approved");
  const selectedSupplier = approvedSuppliers.find(s => s.id === supplierId);

  const addLine = () => setLines(l => [...l, { description: "", quantity: "", unit: "pcs", unitPrice: "", deliveryDate: "", glAccount: "5010 — Raw Materials" }]);
  const removeLine = (i: number) => setLines(l => l.filter((_, idx) => idx !== i));
  const updateLine = (i: number, field: keyof POLine, value: string) =>
    setLines(l => l.map((line, idx) => idx === i ? { ...line, [field]: value } : line));

  const totalAmount = lines.reduce((sum, line) => sum + (parseFloat(line.quantity) || 0) * (parseFloat(line.unitPrice) || 0), 0);

  const handleSave = async (asDraft = false) => {
    if (!supplierId) { toast.error("Please select a supplier"); return; }
    if (lines.some(l => !l.description.trim())) { toast.error("All line items need a description"); return; }
    if (lines.some(l => !l.quantity || !l.unitPrice)) { toast.error("All line items need quantity and unit price"); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setSaving(false);
    const poNum = `PO-2024-${String(Math.floor(Math.random() * 900) + 100).padStart(5, "0")}`;
    toast.success(`Purchase Order ${poNum} ${asDraft ? "saved as draft" : "submitted for approval"}!`);
    router.push("/purchase-orders");
  };

  return (
    <PageShell>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/purchase-orders" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"><ArrowLeft size={15} />Back</Link>
          <div>
            <h1 className="text-base font-semibold">Create Purchase Order</h1>
            <p className="text-xs text-muted-foreground">Fill in details and submit for approval workflow</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handleSave(true)} disabled={saving}>Save Draft</Button>
          <Button size="sm" onClick={() => handleSave(false)} disabled={saving} className="gap-1.5">
            <ShoppingCart size={14} />{saving ? "Submitting…" : "Submit for Approval"}
          </Button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Supplier", value: selectedSupplier?.name ?? "Not selected" },
          { label: "Line Items", value: lines.length },
          { label: "Total Amount", value: totalAmount > 0 ? formatCurrency(totalAmount, currency, true) : "—" },
          { label: "Expected Delivery", value: expectedDelivery || "Not set" },
        ].map(s => (
          <div key={s.label} className="rounded-lg border bg-card p-3 text-center">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{s.label}</p>
            <p className="text-sm font-bold mt-0.5 truncate">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {/* Header */}
        <div className="md:col-span-1 space-y-4">
          <Card>
            <CardHeader><CardTitle>PO Header</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs">Supplier *</Label>
                <Select className="mt-1" value={supplierId} onChange={e => { setSupplierId(e.target.value); const s = approvedSuppliers.find(x => x.id === e.target.value); if (s) setCurrency(s.currency); }}>
                  <option value="">Select supplier…</option>
                  {approvedSuppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </Select>
              </div>

              {selectedSupplier && (
                <div className="rounded-lg bg-muted/50 p-3 text-xs space-y-1">
                  <div className="flex justify-between"><span className="text-muted-foreground">Country</span><span>{selectedSupplier.country}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Payment Terms</span><span>{selectedSupplier.paymentTerms}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Lead Time</span><span>{selectedSupplier.leadTimeDays}d</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">BC Vendor</span><span className="font-mono">{selectedSupplier.bcVendorId ?? "Not linked"}</span></div>
                </div>
              )}

              <div>
                <Label className="text-xs">Currency</Label>
                <Select className="mt-1" value={currency} onChange={e => setCurrency(e.target.value)}>
                  {["USD","EUR","GBP","CAD","CHF","JPY"].map(c => <option key={c}>{c}</option>)}
                </Select>
              </div>
              <div><Label className="text-xs">Expected Delivery Date *</Label><Input className="mt-1" type="date" value={expectedDelivery} onChange={e => setExpectedDelivery(e.target.value)} /></div>
              <div><Label className="text-xs">Internal Notes</Label><Textarea className="mt-1" rows={3} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any special instructions or notes…" /></div>
            </CardContent>
          </Card>

          {/* Approval info */}
          <Card>
            <CardContent className="p-4">
              <p className="text-xs font-semibold mb-2">Approval Thresholds</p>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between"><span className="text-muted-foreground">Up to $10K</span><span>Department Head</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">$10K–$50K</span><span>Procurement Manager</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">$50K–$200K</span><span>Finance Director</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Over $200K</span><span>CFO Approval</span></div>
              </div>
              {totalAmount > 0 && (
                <div className="mt-3 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 p-2 text-xs text-blue-700 dark:text-blue-300">
                  This PO ({formatCurrency(totalAmount, currency, true)}) requires{" "}
                  <strong>{totalAmount <= 10000 ? "Department Head" : totalAmount <= 50000 ? "Procurement Manager" : totalAmount <= 200000 ? "Finance Director" : "CFO"}</strong> approval.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Line Items */}
        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Line Items</CardTitle>
                <Button variant="outline" size="sm" onClick={addLine} className="gap-1.5"><Plus size={13} />Add Line</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {lines.map((line, i) => (
                <div key={i} className="rounded-lg border p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground">Line {i + 1}</span>
                    {lines.length > 1 && (
                      <Button variant="ghost" size="sm" onClick={() => removeLine(i)} className="text-destructive hover:text-destructive h-6 px-2"><Trash2 size={12} /></Button>
                    )}
                  </div>
                  <div><Label className="text-xs">Description *</Label><Input className="mt-1" value={line.description} onChange={e => updateLine(i, "description", e.target.value)} placeholder="Item description" /></div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div><Label className="text-xs">Quantity *</Label><Input className="mt-1" type="number" value={line.quantity} onChange={e => updateLine(i, "quantity", e.target.value)} placeholder="100" /></div>
                    <div>
                      <Label className="text-xs">Unit</Label>
                      <Select className="mt-1" value={line.unit} onChange={e => updateLine(i, "unit", e.target.value)}>
                        {["pcs","kg","mt","l","m","m²","set","box","pallet","day","hour","license"].map(u => <option key={u}>{u}</option>)}
                      </Select>
                    </div>
                    <div><Label className="text-xs">Unit Price ({currency}) *</Label><Input className="mt-1" type="number" value={line.unitPrice} onChange={e => updateLine(i, "unitPrice", e.target.value)} placeholder="0.00" /></div>
                    <div className="flex items-end">
                      <div className="w-full rounded-lg bg-muted/50 px-3 py-2 text-center">
                        <p className="text-[10px] text-muted-foreground">Total</p>
                        <p className="text-sm font-bold">
                          {formatCurrency((parseFloat(line.quantity) || 0) * (parseFloat(line.unitPrice) || 0), currency, true)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><Label className="text-xs">Delivery Date</Label><Input className="mt-1" type="date" value={line.deliveryDate} onChange={e => updateLine(i, "deliveryDate", e.target.value)} /></div>
                    <div>
                      <Label className="text-xs">GL Account</Label>
                      <Select className="mt-1" value={line.glAccount} onChange={e => updateLine(i, "glAccount", e.target.value)}>
                        {GL_ACCOUNTS.map(g => <option key={g}>{g}</option>)}
                      </Select>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Total */}
          {totalAmount > 0 && (
            <div className="flex justify-end">
              <div className="rounded-xl border bg-card p-5 text-right min-w-[200px]">
                <p className="text-xs text-muted-foreground mb-0.5">Subtotal</p>
                <p className="text-xs text-muted-foreground">Tax (estimate)</p>
                <div className="border-t mt-2 pt-2">
                  <p className="text-xs text-muted-foreground">Total PO Value</p>
                  <p className="text-2xl font-bold text-primary">{formatCurrency(totalAmount, currency, true)}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
