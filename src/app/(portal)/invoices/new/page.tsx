"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2, Save, Receipt, Upload } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Label, Select, Textarea } from "@/components/ui";
import { PageShell } from "@/components/shared";
import { mockSuppliers, mockPurchaseOrders } from "@/data/mockData";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

interface InvLine { description: string; quantity: string; unitPrice: string; taxRate: string; }

export default function CreateInvoicePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [supplierId, setSupplierId] = useState("");
  const [poId, setPoId] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [notes, setNotes] = useState("");
  const [lines, setLines] = useState<InvLine[]>([{ description: "", quantity: "", unitPrice: "", taxRate: "0" }]);

  const approvedSuppliers = mockSuppliers.filter(s => s.status === "Approved");
  const selectedSupplier = approvedSuppliers.find(s => s.id === supplierId);
  const supplierPOs = mockPurchaseOrders.filter(po => po.supplierId === supplierId && ["Released", "Approved"].includes(po.status));
  const selectedPO = supplierPOs.find(po => po.id === poId);

  const updateLine = (i: number, field: keyof InvLine, value: string) =>
    setLines(l => l.map((line, idx) => idx === i ? { ...line, [field]: value } : line));
  const addLine = () => setLines(l => [...l, { description: "", quantity: "", unitPrice: "", taxRate: "0" }]);
  const removeLine = (i: number) => setLines(l => l.filter((_, idx) => idx !== i));

  const subtotal = lines.reduce((sum, l) => sum + (parseFloat(l.quantity) || 0) * (parseFloat(l.unitPrice) || 0), 0);
  const taxTotal = lines.reduce((sum, l) => sum + (parseFloat(l.quantity) || 0) * (parseFloat(l.unitPrice) || 0) * (parseFloat(l.taxRate) || 0) / 100, 0);
  const grandTotal = subtotal + taxTotal;

  // Auto-fill from PO
  const fillFromPO = () => {
    if (!selectedPO) return;
    setCurrency(selectedPO.currency);
    setLines(selectedPO.lines.map(l => ({ description: l.description, quantity: String(l.quantity), unitPrice: String(l.unitPrice), taxRate: "0" })));
    toast.info("Line items pre-filled from PO");
  };

  const handleSave = async () => {
    if (!supplierId) { toast.error("Please select a supplier"); return; }
    if (!invoiceNumber.trim()) { toast.error("Invoice number is required"); return; }
    if (!invoiceDate) { toast.error("Invoice date is required"); return; }
    if (lines.some(l => !l.description.trim())) { toast.error("All lines need a description"); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setSaving(false);
    toast.success(`Invoice ${invoiceNumber} submitted successfully — pending 3-way match verification`);
    router.push("/invoices");
  };

  return (
    <PageShell>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/invoices" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"><ArrowLeft size={15} />Back</Link>
          <div>
            <h1 className="text-base font-semibold">Submit Invoice</h1>
            <p className="text-xs text-muted-foreground">Submit for 3-way match and approval</p>
          </div>
        </div>
        <Button size="sm" onClick={handleSave} disabled={saving} className="gap-1.5">
          <Receipt size={14} />{saving ? "Submitting…" : "Submit Invoice"}
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {/* Header */}
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Invoice Header</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs">Supplier *</Label>
                <Select className="mt-1" value={supplierId} onChange={e => { setSupplierId(e.target.value); setPoId(""); setLines([{ description: "", quantity: "", unitPrice: "", taxRate: "0" }]); }}>
                  <option value="">Select supplier…</option>
                  {approvedSuppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </Select>
              </div>

              {supplierId && (
                <div>
                  <Label className="text-xs">Reference PO (optional)</Label>
                  <Select className="mt-1" value={poId} onChange={e => setPoId(e.target.value)}>
                    <option value="">No PO reference</option>
                    {supplierPOs.map(po => <option key={po.id} value={po.id}>{po.poNumber} — {formatCurrency(po.totalAmount, po.currency, true)}</option>)}
                  </Select>
                  {poId && <Button variant="outline" size="sm" className="w-full mt-2 text-xs" onClick={fillFromPO}>Auto-fill from PO</Button>}
                </div>
              )}

              <div><Label className="text-xs">Supplier Invoice Number *</Label><Input className="mt-1" value={invoiceNumber} onChange={e => setInvoiceNumber(e.target.value)} placeholder="INV-2024-001" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-xs">Invoice Date *</Label><Input className="mt-1" type="date" value={invoiceDate} onChange={e => setInvoiceDate(e.target.value)} /></div>
                <div><Label className="text-xs">Due Date</Label><Input className="mt-1" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} /></div>
              </div>
              <div>
                <Label className="text-xs">Currency</Label>
                <Select className="mt-1" value={currency} onChange={e => setCurrency(e.target.value)}>
                  {["USD","EUR","GBP","CAD","CHF","JPY"].map(c => <option key={c}>{c}</option>)}
                </Select>
              </div>
              <div><Label className="text-xs">Notes</Label><Textarea className="mt-1" rows={2} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Optional notes…" /></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Attach Invoice Document</CardTitle></CardHeader>
            <CardContent>
              <div className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 transition-colors">
                <Upload size={20} className="mx-auto text-muted-foreground mb-2" />
                <p className="text-sm font-medium">Upload Invoice PDF</p>
                <p className="text-xs text-muted-foreground mt-1">PDF up to 10MB</p>
                <Button variant="outline" size="sm" className="mt-2 gap-1.5 text-xs"><Upload size={12} />Browse</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lines */}
        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Invoice Lines</CardTitle>
                <Button variant="outline" size="sm" onClick={addLine} className="gap-1.5"><Plus size={13} />Add Line</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {lines.map((line, i) => (
                <div key={i} className="rounded-lg border p-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground">Line {i + 1}</span>
                    {lines.length > 1 && <Button variant="ghost" size="sm" onClick={() => removeLine(i)} className="text-destructive h-6 px-2"><Trash2 size={12} /></Button>}
                  </div>
                  <div><Label className="text-xs">Description *</Label><Input className="mt-1" value={line.description} onChange={e => updateLine(i, "description", e.target.value)} placeholder="Product or service description" /></div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div><Label className="text-xs">Qty</Label><Input className="mt-1" type="number" value={line.quantity} onChange={e => updateLine(i, "quantity", e.target.value)} /></div>
                    <div><Label className="text-xs">Unit Price</Label><Input className="mt-1" type="number" value={line.unitPrice} onChange={e => updateLine(i, "unitPrice", e.target.value)} /></div>
                    <div>
                      <Label className="text-xs">Tax Rate %</Label>
                      <Select className="mt-1" value={line.taxRate} onChange={e => updateLine(i, "taxRate", e.target.value)}>
                        {["0","5","8","10","15","20","21"].map(t => <option key={t}>{t}%</option>)}
                      </Select>
                    </div>
                    <div className="flex items-end">
                      <div className="w-full rounded-lg bg-muted/50 px-2 py-1.5 text-center">
                        <p className="text-[10px] text-muted-foreground">Line Total</p>
                        <p className="text-sm font-bold">{formatCurrency((parseFloat(line.quantity)||0)*(parseFloat(line.unitPrice)||0), currency, true)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="rounded-xl border bg-card p-5 min-w-[240px] space-y-2">
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span className="font-medium">{formatCurrency(subtotal, currency)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Tax</span><span className="font-medium">{formatCurrency(taxTotal, currency)}</span></div>
              <div className="border-t pt-2 flex justify-between">
                <span className="font-semibold">Total</span>
                <span className="text-xl font-bold text-primary">{formatCurrency(grandTotal, currency, true)}</span>
              </div>
            </div>
          </div>

          {/* 3-way match info */}
          <div className="rounded-xl border bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 p-4">
            <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1">3-Way Match Verification</p>
            <p className="text-xs text-blue-600 dark:text-blue-400">After submission, the system will automatically compare this invoice against the Purchase Order and Goods Receipt. Discrepancies will be flagged for manual review before approval.</p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
