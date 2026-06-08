"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Star } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, Button, Label, Select } from "@/components/ui";
import { PageShell } from "@/components/shared";
import { mockSuppliers } from "@/data/mockData";
import { getScoreColor, cn } from "@/lib/utils";
import { toast } from "sonner";

const KPI_DEFINITIONS = [
  { key: "onTimeDelivery", label: "On-Time Delivery", desc: "% of orders delivered on or before the agreed date", target: 95 },
  { key: "qualityRating", label: "Quality Rating", desc: "% of deliveries meeting quality specifications", target: 90 },
  { key: "defectRate", label: "Defect Rate (inverse)", desc: "Lower is better — % of units with defects", target: 2 },
  { key: "invoiceAccuracy", label: "Invoice Accuracy", desc: "% of invoices submitted without errors", target: 98 },
  { key: "responseTime", label: "Response Time", desc: "% of queries answered within SLA period", target: 90 },
  { key: "complianceScore", label: "Compliance Score", desc: "Overall regulatory and contractual compliance %", target: 95 },
];

const PERIODS = ["Q1 2025", "Q4 2024", "Q3 2024", "Q2 2024", "Q1 2024"];

function ScoreSlider({ label, desc, value, target, onChange }: { label: string; desc: string; value: number; target: number; onChange: (v: number) => void }) {
  const color = value >= target ? "bg-emerald-500" : value >= target * 0.85 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="rounded-lg border p-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="text-sm font-semibold">{label}</p>
          <p className="text-xs text-muted-foreground">{desc}</p>
        </div>
        <div className="text-right shrink-0 ml-4">
          <span className={cn("text-xl font-bold", getScoreColor(value))}>{value}</span>
          <p className="text-[10px] text-muted-foreground">Target: {target}</p>
        </div>
      </div>
      <input
        type="range" min="0" max="100" value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full accent-primary"
      />
      <div className="mt-1 h-2 rounded-full bg-muted overflow-hidden">
        <div className={cn("h-full rounded-full transition-all duration-300", color)} style={{ width: `${value}%` }} />
      </div>
      <div className="flex justify-between text-[10px] text-muted-foreground mt-0.5">
        <span>0</span>
        <span className={value >= target ? "text-emerald-600 font-medium" : "text-amber-600 font-medium"}>
          {value >= target ? `✓ Meets target (${target})` : `${target - value} pts below target`}
        </span>
        <span>100</span>
      </div>
    </div>
  );
}

export default function CreateScorecardPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [supplierId, setSupplierId] = useState("");
  const [period, setPeriod] = useState("Q4 2024");
  const [scores, setScores] = useState<Record<string, number>>({
    onTimeDelivery: 85, qualityRating: 85, defectRate: 85,
    invoiceAccuracy: 85, responseTime: 85, complianceScore: 85,
  });

  const approvedSuppliers = mockSuppliers.filter(s => s.status === "Approved");
  const selectedSupplier = approvedSuppliers.find(s => s.id === supplierId);

  const overallScore = Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / Object.keys(scores).length);

  const updateScore = (key: string, val: number) => setScores(s => ({ ...s, [key]: val }));

  const handleSave = async () => {
    if (!supplierId) { toast.error("Please select a supplier"); return; }
    setSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setSaving(false);
    toast.success(`Scorecard for ${selectedSupplier?.name} — ${period} saved and published!`);
    router.push("/performance");
  };

  return (
    <PageShell>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/performance" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={15} />Back
          </Link>
          <div>
            <h1 className="text-base font-semibold">Create Performance Scorecard</h1>
            <p className="text-xs text-muted-foreground">Rate supplier KPIs for the selected period</p>
          </div>
        </div>
        <Button size="sm" onClick={handleSave} disabled={saving} className="gap-1.5">
          <Save size={14} />{saving ? "Saving…" : "Save Scorecard"}
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {/* Setup */}
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Scorecard Setup</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs">Supplier *</Label>
                <Select className="mt-1" value={supplierId} onChange={e => setSupplierId(e.target.value)}>
                  <option value="">Select supplier…</option>
                  {approvedSuppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </Select>
              </div>
              <div>
                <Label className="text-xs">Evaluation Period *</Label>
                <Select className="mt-1" value={period} onChange={e => setPeriod(e.target.value)}>
                  {PERIODS.map(p => <option key={p}>{p}</option>)}
                </Select>
              </div>
              {selectedSupplier && (
                <div className="rounded-lg bg-muted/50 p-3 text-xs space-y-1.5">
                  <div className="flex justify-between"><span className="text-muted-foreground">Category</span><span>{selectedSupplier.category}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Country</span><span>{selectedSupplier.country}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Lead Time</span><span>{selectedSupplier.leadTimeDays} days</span></div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Overall score card */}
          <Card>
            <CardContent className="p-5 text-center">
              <p className="text-xs text-muted-foreground mb-2">Overall Score</p>
              <div className={cn(
                "mx-auto h-24 w-24 rounded-full border-4 flex items-center justify-center text-3xl font-extrabold",
                overallScore >= 90 ? "border-emerald-500 text-emerald-600" :
                overallScore >= 75 ? "border-blue-500 text-blue-600" :
                overallScore >= 60 ? "border-amber-500 text-amber-600" :
                "border-red-500 text-red-600"
              )}>
                {overallScore}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {overallScore >= 90 ? "Excellent" : overallScore >= 75 ? "Good" : overallScore >= 60 ? "Needs Improvement" : "Poor"}
              </p>

              <div className="mt-4 space-y-1.5 text-left">
                {KPI_DEFINITIONS.map(kpi => (
                  <div key={kpi.key} className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{kpi.label}</span>
                    <span className={cn("font-semibold", getScoreColor(scores[kpi.key] ?? 0))}>{scores[kpi.key] ?? 0}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* KPI Sliders */}
        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardHeader><CardTitle>KPI Ratings</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {KPI_DEFINITIONS.map(kpi => (
                <ScoreSlider
                  key={kpi.key}
                  label={kpi.label}
                  desc={kpi.desc}
                  value={scores[kpi.key] ?? 0}
                  target={kpi.target}
                  onChange={val => updateScore(kpi.key, val)}
                />
              ))}
            </CardContent>
          </Card>

          <div className="rounded-xl border bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 p-4">
            <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1">What happens next?</p>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              After saving, the scorecard will be published and the supplier will be notified with their scores and feedback.
              The overall score updates the supplier&apos;s performance ranking on the dashboard.
            </p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
