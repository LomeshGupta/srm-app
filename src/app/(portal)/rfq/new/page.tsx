"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2, Save, FileText, Users, Package } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Label, Textarea, Select, Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui";
import { PageShell } from "@/components/shared";
import { mockSuppliers } from "@/data/mockData";
import { toast } from "sonner";

const CATEGORIES = ["Raw Materials", "Manufacturing", "IT & Software", "Logistics", "Professional Services", "Energy", "Electronics", "Packaging"];

interface RFQItem { description: string; quantity: string; unit: string; estimatedUnitPrice: string; }

export default function CreateRFQPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Raw Materials");
  const [closingDate, setClosingDate] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [terms, setTerms] = useState("");
  const [items, setItems] = useState<RFQItem[]>([{ description: "", quantity: "", unit: "kg", estimatedUnitPrice: "" }]);
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([]);

  const approvedSuppliers = mockSuppliers.filter(s => s.status === "Approved");

  const addItem = () => setItems(it => [...it, { description: "", quantity: "", unit: "pcs", estimatedUnitPrice: "" }]);
  const removeItem = (i: number) => setItems(it => it.filter((_, idx) => idx !== i));
  const updateItem = (i: number, field: keyof RFQItem, value: string) =>
    setItems(it => it.map((item, idx) => idx === i ? { ...item, [field]: value } : item));

  const toggleSupplier = (id: string) =>
    setSelectedSuppliers(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  const totalEstimated = items.reduce((sum, item) => {
    const qty = parseFloat(item.quantity) || 0;
    const price = parseFloat(item.estimatedUnitPrice) || 0;
    return sum + qty * price;
  }, 0);

  const handleSave = async (asDraft = false) => {
    if (!title.trim()) { toast.error("RFQ title is required"); setActiveTab("details"); return; }
    if (!closingDate) { toast.error("Closing date is required"); setActiveTab("details"); return; }
    if (items.some(i => !i.description.trim())) { toast.error("All line items need a description"); setActiveTab("items"); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setSaving(false);
    toast.success(`RFQ ${asDraft ? "saved as draft" : "published to selected suppliers"}!`);
    router.push("/rfq");
  };

  return (
    <PageShell>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/rfq" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"><ArrowLeft size={15} />Back</Link>
          <div>
            <h1 className="text-base font-semibold">Create Request for Quotation</h1>
            <p className="text-xs text-muted-foreground">Define requirements and invite suppliers to bid</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handleSave(true)} disabled={saving}>Save Draft</Button>
          <Button size="sm" onClick={() => handleSave(false)} disabled={saving} className="gap-1.5">
            <FileText size={14} />{saving ? "Publishing…" : "Publish RFQ"}
          </Button>
        </div>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Line Items", value: items.length },
          { label: "Invited Suppliers", value: selectedSuppliers.length },
          { label: "Estimated Value", value: totalEstimated > 0 ? `${currency} ${totalEstimated.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : "—" },
          { label: "Closing Date", value: closingDate || "Not set" },
        ].map(s => (
          <div key={s.label} className="rounded-lg border bg-card p-3 text-center">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{s.label}</p>
            <p className="text-sm font-bold mt-0.5">{s.value}</p>
          </div>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="details"><FileText size={13} />RFQ Details</TabsTrigger>
          <TabsTrigger value="items"><Package size={13} />Line Items</TabsTrigger>
          <TabsTrigger value="suppliers"><Users size={13} />Invite Suppliers</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <div className="grid md:grid-cols-2 gap-5">
            <Card>
              <CardHeader><CardTitle>RFQ Information</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div><Label className="text-xs">RFQ Title *</Label><Input className="mt-1" value={title} onChange={e => setTitle(e.target.value)} placeholder="Annual Steel Supply Contract 2025" /></div>
                <div><Label className="text-xs">Description</Label><Textarea className="mt-1" rows={3} value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the procurement need, scope, and key requirements…" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Category *</Label>
                    <Select className="mt-1" value={category} onChange={e => setCategory(e.target.value)}>
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Currency</Label>
                    <Select className="mt-1" value={currency} onChange={e => setCurrency(e.target.value)}>
                      {["USD","EUR","GBP","CAD","CHF"].map(c => <option key={c}>{c}</option>)}
                    </Select>
                  </div>
                </div>
                <div><Label className="text-xs">Closing Date *</Label><Input className="mt-1" type="date" value={closingDate} onChange={e => setClosingDate(e.target.value)} /></div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Terms & Conditions</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div><Label className="text-xs">Terms & Conditions</Label><Textarea className="mt-1" rows={6} value={terms} onChange={e => setTerms(e.target.value)} placeholder="Enter any specific terms, delivery requirements, quality standards, evaluation criteria…" /></div>
                <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3 text-xs text-amber-700 dark:text-amber-300">
                  Once published, all invited suppliers will receive an email notification to submit their bids before the closing date.
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="items">
          <div className="space-y-4">
            {items.map((item, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold">Line Item {i + 1}</span>
                    {items.length > 1 && (
                      <Button variant="ghost" size="sm" onClick={() => removeItem(i)} className="text-destructive hover:text-destructive h-7"><Trash2 size={13} /></Button>
                    )}
                  </div>
                  <div className="grid md:grid-cols-4 gap-3">
                    <div className="md:col-span-2"><Label className="text-xs">Description *</Label><Input className="mt-1" value={item.description} onChange={e => updateItem(i, "description", e.target.value)} placeholder="Carbon Steel Sheet 2mm" /></div>
                    <div>
                      <Label className="text-xs">Quantity *</Label>
                      <Input className="mt-1" type="number" value={item.quantity} onChange={e => updateItem(i, "quantity", e.target.value)} placeholder="5000" />
                    </div>
                    <div>
                      <Label className="text-xs">Unit</Label>
                      <Select className="mt-1" value={item.unit} onChange={e => updateItem(i, "unit", e.target.value)}>
                        {["kg","mt","pcs","unit","l","m","m²","m³","set","box","pallet","day","hour"].map(u => <option key={u}>{u}</option>)}
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs">Est. Unit Price ({currency})</Label>
                      <Input className="mt-1" type="number" value={item.estimatedUnitPrice} onChange={e => updateItem(i, "estimatedUnitPrice", e.target.value)} placeholder="2.80" />
                    </div>
                    {item.quantity && item.estimatedUnitPrice && (
                      <div className="flex items-end">
                        <div className="rounded-lg bg-muted/50 px-3 py-2 text-xs">
                          <span className="text-muted-foreground">Est. Total: </span>
                          <span className="font-bold">{currency} {(parseFloat(item.quantity) * parseFloat(item.estimatedUnitPrice)).toLocaleString()}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
            <Button variant="outline" size="sm" onClick={addItem} className="gap-1.5"><Plus size={14} />Add Line Item</Button>

            {totalEstimated > 0 && (
              <div className="flex justify-end">
                <div className="rounded-xl border bg-card p-4 text-right">
                  <p className="text-xs text-muted-foreground">Total Estimated Value</p>
                  <p className="text-2xl font-bold text-primary">{currency} {totalEstimated.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="suppliers">
          <Card>
            <CardHeader>
              <CardTitle>Select Suppliers to Invite ({selectedSuppliers.length} selected)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-3">
                {approvedSuppliers.map(s => (
                  <label key={s.id} className={`flex items-center gap-3 rounded-xl border p-4 cursor-pointer transition-all ${selectedSuppliers.includes(s.id) ? "border-primary bg-primary/5" : "hover:border-primary/40"}`}>
                    <input type="checkbox" checked={selectedSuppliers.includes(s.id)} onChange={() => toggleSupplier(s.id)} className="shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.category} · {s.country}</p>
                      <p className="text-xs text-muted-foreground">Performance: <span className="font-medium text-foreground">{s.performanceScore}/100</span></p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-medium">{s.currency}</p>
                      <p className="text-[10px] text-muted-foreground">Lead: {s.leadTimeDays}d</p>
                    </div>
                  </label>
                ))}
              </div>
              {selectedSuppliers.length > 0 && (
                <div className="mt-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 p-3 text-xs text-emerald-700 dark:text-emerald-300">
                  {selectedSuppliers.length} supplier(s) will be notified by email when this RFQ is published.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageShell>
  );
}
