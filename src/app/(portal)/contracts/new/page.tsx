"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2, Save, FileText, Upload } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Label, Textarea, Select, Switch } from "@/components/ui";
import { PageShell } from "@/components/shared";
import { mockSuppliers } from "@/data/mockData";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

const CONTRACT_TYPES = ["Supply Agreement", "Service Agreement", "Software License", "Professional Services", "Framework Agreement", "NDA", "Maintenance Agreement", "Consulting Agreement"];
const CURRENCIES = ["USD", "EUR", "GBP", "CAD", "CHF", "JPY", "INR"];

export default function CreateContractPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [type, setType] = useState("Supply Agreement");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalValue, setTotalValue] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [autoRenew, setAutoRenew] = useState(false);
  const [renewalDays, setRenewalDays] = useState("90");
  const [keyTerms, setKeyTerms] = useState<string[]>(["", "", ""]);
  const [description, setDescription] = useState("");

  const approvedSuppliers = mockSuppliers.filter(s => s.status === "Approved");
  const selectedSupplier = approvedSuppliers.find(s => s.id === supplierId);

  const updateTerm = (i: number, val: string) => setKeyTerms(t => t.map((term, idx) => idx === i ? val : term));
  const addTerm = () => setKeyTerms(t => [...t, ""]);
  const removeTerm = (i: number) => setKeyTerms(t => t.filter((_, idx) => idx !== i));

  const contractDurationDays = startDate && endDate
    ? Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const handleSave = async () => {
    if (!title.trim()) { toast.error("Contract title is required"); return; }
    if (!supplierId) { toast.error("Please select a supplier"); return; }
    if (!startDate || !endDate) { toast.error("Start and end dates are required"); return; }
    if (new Date(endDate) <= new Date(startDate)) { toast.error("End date must be after start date"); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setSaving(false);
    const ctrNum = `CTR-2024-${String(Math.floor(Math.random() * 900) + 100).padStart(3, "0")}`;
    toast.success(`Contract ${ctrNum} created successfully!`);
    router.push("/contracts");
  };

  return (
    <PageShell>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/contracts" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"><ArrowLeft size={15} />Back</Link>
          <div>
            <h1 className="text-base font-semibold">Create Contract</h1>
            <p className="text-xs text-muted-foreground">Define contract terms and upload documentation</p>
          </div>
        </div>
        <Button size="sm" onClick={handleSave} disabled={saving} className="gap-1.5">
          <Save size={14} />{saving ? "Creating…" : "Create Contract"}
        </Button>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Supplier", value: selectedSupplier?.name ?? "Not selected" },
          { label: "Type", value: type },
          { label: "Total Value", value: totalValue ? formatCurrency(parseFloat(totalValue), currency, true) : "—" },
          { label: "Duration", value: contractDurationDays ? `${contractDurationDays} days` : "—" },
        ].map(s => (
          <div key={s.label} className="rounded-lg border bg-card p-3 text-center">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{s.label}</p>
            <p className="text-sm font-bold mt-0.5 truncate">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {/* Left Column */}
        <div className="space-y-5">
          <Card>
            <CardHeader><CardTitle>Contract Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><Label className="text-xs">Contract Title *</Label><Input className="mt-1" value={title} onChange={e => setTitle(e.target.value)} placeholder="Steel Supply Master Agreement 2025" /></div>
              <div>
                <Label className="text-xs">Supplier *</Label>
                <Select className="mt-1" value={supplierId} onChange={e => setSupplierId(e.target.value)}>
                  <option value="">Select supplier…</option>
                  {approvedSuppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </Select>
              </div>
              <div>
                <Label className="text-xs">Contract Type</Label>
                <Select className="mt-1" value={type} onChange={e => setType(e.target.value)}>
                  {CONTRACT_TYPES.map(t => <option key={t}>{t}</option>)}
                </Select>
              </div>
              <div><Label className="text-xs">Description</Label><Textarea className="mt-1" rows={3} value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the contract scope and purpose…" /></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Financial Terms</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-xs">Total Contract Value</Label><Input className="mt-1" type="number" value={totalValue} onChange={e => setTotalValue(e.target.value)} placeholder="1000000" /></div>
                <div>
                  <Label className="text-xs">Currency</Label>
                  <Select className="mt-1" value={currency} onChange={e => setCurrency(e.target.value)}>
                    {CURRENCIES.map(c => <option key={c}>{c}</option>)}
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-xs">Start Date *</Label><Input className="mt-1" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} /></div>
                <div><Label className="text-xs">End Date *</Label><Input className="mt-1" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} /></div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <p className="text-sm font-medium">Auto-Renewal</p>
                  <p className="text-xs text-muted-foreground">Automatically renew before expiry</p>
                </div>
                <Switch checked={autoRenew} onCheckedChange={setAutoRenew} />
              </div>
              {autoRenew && (
                <div>
                  <Label className="text-xs">Renewal Notification (days before expiry)</Label>
                  <Select className="mt-1" value={renewalDays} onChange={e => setRenewalDays(e.target.value)}>
                    {["30","45","60","90","120"].map(d => <option key={d}>{d} days</option>)}
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Key Terms & Obligations</CardTitle>
                <Button variant="ghost" size="sm" onClick={addTerm} className="gap-1 text-xs"><Plus size={12} />Add</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {keyTerms.map((term, i) => (
                <div key={i} className="flex gap-2">
                  <Input value={term} onChange={e => updateTerm(i, e.target.value)} placeholder={`Key term ${i + 1}, e.g. "Net 30 payment terms"`} className="text-xs" />
                  {keyTerms.length > 1 && (
                    <Button variant="ghost" size="icon" onClick={() => removeTerm(i)} className="text-destructive shrink-0 h-9 w-9"><Trash2 size={13} /></Button>
                  )}
                </div>
              ))}
              <p className="text-xs text-muted-foreground mt-1">Add payment terms, SLA conditions, volume commitments, price escalation clauses, etc.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Document Upload</CardTitle></CardHeader>
            <CardContent>
              <div className="border-2 border-dashed rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <Upload size={24} className="mx-auto text-muted-foreground mb-2" />
                <p className="text-sm font-medium">Drop files here or click to upload</p>
                <p className="text-xs text-muted-foreground mt-1">PDF, DOCX up to 50MB</p>
                <Button variant="outline" size="sm" className="mt-3 gap-1.5"><Upload size={13} />Browse Files</Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Upload the signed contract, annexures, and supporting documents.</p>
            </CardContent>
          </Card>

          {selectedSupplier && (
            <Card>
              <CardContent className="p-4">
                <p className="text-xs font-semibold mb-2">Supplier Information</p>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between"><span className="text-muted-foreground">Country</span><span>{selectedSupplier.country}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Category</span><span>{selectedSupplier.category}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">BC Vendor ID</span><span className="font-mono">{selectedSupplier.bcVendorId ?? "—"}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Existing Contracts</span><span>Active</span></div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PageShell>
  );
}
