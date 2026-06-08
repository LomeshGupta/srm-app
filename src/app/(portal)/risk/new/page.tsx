"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Shield, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Label, Select, Textarea } from "@/components/ui";
import { PageShell } from "@/components/shared";
import { mockSuppliers } from "@/data/mockData";
import { toast } from "sonner";

type Risk = "Low" | "Medium" | "High" | "Critical";
const RISK_LEVELS: Risk[] = ["Low", "Medium", "High", "Critical"];
const RISK_COLORS: Record<Risk, string> = { Low: "text-emerald-600", Medium: "text-amber-600", High: "text-orange-600", Critical: "text-red-600" };

function RiskSelector({ label, value, onChange }: { label: string; value: Risk; onChange: (v: Risk) => void }) {
  return (
    <div>
      <Label className="text-xs">{label}</Label>
      <div className="flex gap-2 mt-1">
        {RISK_LEVELS.map(r => (
          <button key={r} onClick={() => onChange(r)}
            className={`flex-1 rounded-lg border py-1.5 text-xs font-semibold transition-all ${value === r ? "border-current bg-current/10 " + RISK_COLORS[r] : "text-muted-foreground hover:border-muted-foreground"}`}>
            {r}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function CreateRiskAssessmentPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [supplierId, setSupplierId] = useState("");
  const [nextAssessmentDate, setNextAssessmentDate] = useState("");
  const [overallRisk, setOverallRisk] = useState<Risk>("Low");
  const [financialRisk, setFinancialRisk] = useState<Risk>("Low");
  const [operationalRisk, setOperationalRisk] = useState<Risk>("Low");
  const [complianceRisk, setComplianceRisk] = useState<Risk>("Low");
  const [geopoliticalRisk, setGeopoliticalRisk] = useState<Risk>("Low");
  const [envScore, setEnvScore] = useState("70");
  const [socialScore, setSocialScore] = useState("70");
  const [govScore, setGovScore] = useState("70");
  const [findings, setFindings] = useState<string[]>([""]);
  const [mitigations, setMitigations] = useState<string[]>([""]);

  const esgScore = Math.round((parseFloat(envScore) + parseFloat(socialScore) + parseFloat(govScore)) / 3);
  const assessedSuppliers = mockSuppliers.filter(s => s.status === "Approved");
  const selectedSupplier = assessedSuppliers.find(s => s.id === supplierId);

  const addFinding = () => setFindings(f => [...f, ""]);
  const removeFinding = (i: number) => setFindings(f => f.filter((_, idx) => idx !== i));
  const updateFinding = (i: number, v: string) => setFindings(f => f.map((x, idx) => idx === i ? v : x));

  const addMitigation = () => setMitigations(m => [...m, ""]);
  const removeMitigation = (i: number) => setMitigations(m => m.filter((_, idx) => idx !== i));
  const updateMitigation = (i: number, v: string) => setMitigations(m => m.map((x, idx) => idx === i ? v : x));

  const handleSave = async () => {
    if (!supplierId) { toast.error("Please select a supplier"); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setSaving(false);
    toast.success(`Risk assessment for ${selectedSupplier?.name} saved successfully!`);
    router.push("/risk");
  };

  return (
    <PageShell>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/risk" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"><ArrowLeft size={15} />Back</Link>
          <div>
            <h1 className="text-base font-semibold">New Risk Assessment</h1>
            <p className="text-xs text-muted-foreground">Evaluate supplier risk across all dimensions</p>
          </div>
        </div>
        <Button size="sm" onClick={handleSave} disabled={saving} className="gap-1.5">
          <Save size={14} />{saving ? "Saving…" : "Save Assessment"}
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {/* Left */}
        <div className="space-y-5">
          <Card>
            <CardHeader><CardTitle>Assessment Setup</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs">Supplier *</Label>
                <Select className="mt-1" value={supplierId} onChange={e => setSupplierId(e.target.value)}>
                  <option value="">Select supplier to assess…</option>
                  {assessedSuppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </Select>
              </div>
              <div><Label className="text-xs">Next Assessment Date</Label><Input className="mt-1" type="date" value={nextAssessmentDate} onChange={e => setNextAssessmentDate(e.target.value)} /></div>
              {selectedSupplier && (
                <div className="rounded-lg bg-muted/50 p-3 text-xs space-y-1">
                  <div className="flex justify-between"><span className="text-muted-foreground">Category</span><span>{selectedSupplier.category}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Country</span><span>{selectedSupplier.country}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Annual Spend</span><span className="font-medium">{selectedSupplier.annualSpend > 0 ? `${selectedSupplier.currency} ${(selectedSupplier.annualSpend/1e6).toFixed(1)}M` : "—"}</span></div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Risk Dimensions</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <RiskSelector label="Overall Risk Rating *" value={overallRisk} onChange={setOverallRisk} />
              <RiskSelector label="Financial Risk" value={financialRisk} onChange={setFinancialRisk} />
              <RiskSelector label="Operational Risk" value={operationalRisk} onChange={setOperationalRisk} />
              <RiskSelector label="Compliance Risk" value={complianceRisk} onChange={setComplianceRisk} />
              <RiskSelector label="Geopolitical Risk" value={geopoliticalRisk} onChange={setGeopoliticalRisk} />
            </CardContent>
          </Card>
        </div>

        {/* Right */}
        <div className="space-y-5">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>ESG Scores</CardTitle>
                <div className="rounded-full bg-emerald-100 dark:bg-emerald-950 px-3 py-1 text-sm font-bold text-emerald-700 dark:text-emerald-300">
                  Overall: {isNaN(esgScore) ? "—" : esgScore}/100
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Environmental Score", value: envScore, setter: setEnvScore, color: "text-green-600" },
                { label: "Social Score", value: socialScore, setter: setSocialScore, color: "text-blue-600" },
                { label: "Governance Score", value: govScore, setter: setGovScore, color: "text-violet-600" },
              ].map(item => (
                <div key={item.label}>
                  <div className="flex justify-between items-center mb-1">
                    <Label className="text-xs">{item.label}</Label>
                    <span className={`text-sm font-bold ${item.color}`}>{item.value}/100</span>
                  </div>
                  <input type="range" min="0" max="100" value={item.value} onChange={e => item.setter(e.target.value)}
                    className="w-full accent-primary" />
                  <div className="flex justify-between text-[10px] text-muted-foreground"><span>0 — Poor</span><span>100 — Excellent</span></div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Key Findings</CardTitle>
                <Button variant="ghost" size="sm" onClick={addFinding} className="gap-1 text-xs"><Plus size={12} />Add</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {findings.map((f, i) => (
                <div key={i} className="flex gap-2">
                  <Input value={f} onChange={e => updateFinding(i, e.target.value)} placeholder={`Finding ${i + 1}…`} className="text-xs" />
                  {findings.length > 1 && <Button variant="ghost" size="icon" onClick={() => removeFinding(i)} className="text-destructive shrink-0 h-9 w-9"><Trash2 size={13} /></Button>}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Mitigation Actions</CardTitle>
                <Button variant="ghost" size="sm" onClick={addMitigation} className="gap-1 text-xs"><Plus size={12} />Add</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {mitigations.map((m, i) => (
                <div key={i} className="flex gap-2">
                  <Input value={m} onChange={e => updateMitigation(i, e.target.value)} placeholder={`Mitigation action ${i + 1}…`} className="text-xs" />
                  {mitigations.length > 1 && <Button variant="ghost" size="icon" onClick={() => removeMitigation(i)} className="text-destructive shrink-0 h-9 w-9"><Trash2 size={13} /></Button>}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
