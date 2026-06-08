"use client";
import { mockWorkflows } from "@/data/mockData";
import { formatDate, cn } from "@/lib/utils";
import { PageShell, KPICard, StatusBadge } from "@/components/shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { Workflow, CheckCircle2, Clock, Zap, XCircle, ArrowRight, Users, ShoppingCart, Receipt, Star } from "lucide-react";

const WORKFLOW_TEMPLATES = [
  {
    name: "Supplier Onboarding",
    icon: Users,
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-950",
    steps: ["Registration", "Doc Verification", "Financial Review", "Risk Assessment", "Mgmt Approval", "Vendor Creation"],
  },
  {
    name: "PR → Purchase Order",
    icon: ShoppingCart,
    color: "text-violet-600",
    bg: "bg-violet-50 dark:bg-violet-950",
    steps: ["PR Created", "Dept Head Approval", "Finance Review", "RFQ/Sourcing", "PO Creation", "BC Sync"],
  },
  {
    name: "Invoice to Payment",
    icon: Receipt,
    color: "text-emerald-600",
    bg: "bg-emerald-50 dark:bg-emerald-950",
    steps: ["Invoice Received", "3-Way Match", "Exception Handling", "Finance Approval", "Payment Schedule", "BC Payment"],
  },
  {
    name: "KPI → Scorecard",
    icon: Star,
    color: "text-amber-600",
    bg: "bg-amber-50 dark:bg-amber-950",
    steps: ["Data Collection", "KPI Calculation", "Scorecard Generation", "Review & Validate", "Supplier Briefing", "Archive"],
  },
];

export default function WorkflowPage() {
  const active = mockWorkflows.filter(w => w.status === "Active").length;
  const completed = mockWorkflows.filter(w => w.status === "Completed").length;

  return (
    <PageShell>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard title="Active Workflows" value={active} icon={Zap} iconColor="text-blue-600" iconBg="bg-blue-50 dark:bg-blue-950" />
        <KPICard title="Completed" value={completed} icon={CheckCircle2} iconColor="text-emerald-600" iconBg="bg-emerald-50 dark:bg-emerald-950" />
        <KPICard title="Pending Action" value={3} icon={Clock} iconColor="text-amber-600" iconBg="bg-amber-50 dark:bg-amber-950" />
        <KPICard title="Automation Rate" value="78%" icon={Workflow} iconColor="text-violet-600" iconBg="bg-violet-50 dark:bg-violet-950" subtitle="steps auto-completed" />
      </div>

      {/* Workflow Pipeline Templates */}
      <Card>
        <CardHeader><CardTitle>Workflow Pipeline Templates</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-6">
            {WORKFLOW_TEMPLATES.map(tpl => (
              <div key={tpl.name}>
                <div className="flex items-center gap-2 mb-3">
                  <div className={cn("flex h-7 w-7 items-center justify-center rounded-lg", tpl.bg)}>
                    <tpl.icon size={14} className={tpl.color} />
                  </div>
                  <span className="font-semibold text-sm">{tpl.name}</span>
                </div>
                <div className="flex items-center gap-1 flex-wrap">
                  {tpl.steps.map((step, i) => (
                    <div key={step} className="flex items-center gap-1">
                      <div className="flex items-center gap-1.5 rounded-lg border bg-card px-3 py-1.5 text-xs font-medium">
                        <span className={cn("h-4 w-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white", tpl.bg.replace("bg-","bg-").replace("50","500").replace("dark:bg-","").split(" ")[0])} style={{backgroundColor: tpl.color.replace("text-","").includes("blue") ? "#2563eb" : tpl.color.includes("violet") ? "#7c3aed" : tpl.color.includes("emerald") ? "#16a34a" : "#d97706"}}>
                          {i + 1}
                        </span>
                        {step}
                      </div>
                      {i < tpl.steps.length - 1 && <ArrowRight size={12} className="text-muted-foreground shrink-0" />}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Workflow Instances */}
      <div className="space-y-4">
        <h2 className="text-base font-semibold">Active Workflow Instances</h2>
        {mockWorkflows.map(wf => (
          <Card key={wf.id}>
            <CardContent className="p-5">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm">{wf.entityName}</span>
                    <span className="text-xs text-muted-foreground">— {wf.type}</span>
                    <StatusBadge status={wf.status} />
                  </div>
                  <p className="text-xs text-muted-foreground">Started {formatDate(wf.startedAt, "long")}</p>
                </div>

                {/* Progress bar */}
                <div className="md:w-72">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Step {wf.currentStep + 1} of {wf.steps.length}</span>
                    <span>{Math.round(((wf.currentStep) / wf.steps.length) * 100)}% complete</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-700"
                      style={{ width: `${(wf.currentStep / wf.steps.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Steps visualization */}
              <div className="mt-4 flex items-start gap-0">
                {wf.steps.map((step, i) => (
                  <div key={step.id} className="flex-1 flex flex-col items-center">
                    {/* Connector line */}
                    <div className="flex items-center w-full">
                      {i > 0 && (
                        <div className={cn("flex-1 h-0.5", step.status === "Completed" ? "bg-emerald-500" : "bg-border")} />
                      )}
                      <div className={cn("h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold z-10 border-2 shrink-0",
                        step.status === "Completed" ? "bg-emerald-500 border-emerald-500 text-white" :
                        step.status === "In Progress" ? "bg-primary border-primary text-white" :
                        step.status === "Failed" ? "bg-red-500 border-red-500 text-white" :
                        "bg-background border-border text-muted-foreground"
                      )}>
                        {step.status === "Completed" ? <CheckCircle2 size={13} /> :
                         step.status === "In Progress" ? <Zap size={13} /> :
                         step.status === "Failed" ? <XCircle size={13} /> :
                         <span className="text-[10px]">{i+1}</span>}
                      </div>
                      {i < wf.steps.length - 1 && (
                        <div className={cn("flex-1 h-0.5", step.status === "Completed" ? "bg-emerald-500" : "bg-border")} />
                      )}
                    </div>
                    <div className="mt-1.5 text-center px-1">
                      <p className={cn("text-[10px] font-medium leading-tight", step.status === "In Progress" ? "text-primary" : step.status === "Completed" ? "text-emerald-600" : "text-muted-foreground")}>
                        {step.name}
                      </p>
                      {step.assignee && <p className="text-[9px] text-muted-foreground mt-0.5 hidden md:block">{step.assignee}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
