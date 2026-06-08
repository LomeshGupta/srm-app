import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "USD", compact = false): string {
  if (compact) {
    if (amount >= 1_000_000) return `${currency} ${(amount / 1_000_000).toFixed(1)}M`;
    if (amount >= 1_000) return `${currency} ${(amount / 1_000).toFixed(0)}K`;
  }
  return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
}

export function formatDate(dateStr: string, style: "short" | "medium" | "long" = "medium"): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "—";
  const opts: Intl.DateTimeFormatOptions =
    style === "short" ? { month: "short", day: "numeric" } :
    style === "long"  ? { year: "numeric", month: "long", day: "numeric" } :
                        { year: "numeric", month: "short", day: "numeric" };
  return d.toLocaleDateString("en-US", opts);
}

export function daysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const now = new Date();
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function getInitials(name: string): string {
  return name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
}

export function getRiskColor(level: string): string {
  switch (level) {
    case "Low":      return "text-emerald-600 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-400";
    case "Medium":   return "text-amber-600 bg-amber-50 dark:bg-amber-950 dark:text-amber-400";
    case "High":     return "text-orange-600 bg-orange-50 dark:bg-orange-950 dark:text-orange-400";
    case "Critical": return "text-red-600 bg-red-50 dark:bg-red-950 dark:text-red-400";
    default:         return "text-muted-foreground bg-muted";
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "Approved": case "Active": case "Paid": case "Released": case "Synced": case "Closed": case "Awarded":
      return "text-emerald-700 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-400";
    case "Pending": case "Pending Approval": case "Submitted": case "Under Review": case "Published": case "Matched":
      return "text-blue-700 bg-blue-50 dark:bg-blue-950 dark:text-blue-400";
    case "Draft": case "Not Synced":
      return "text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-400";
    case "Rejected": case "Failed": case "Blocked": case "Critical": case "Expired":
      return "text-red-700 bg-red-50 dark:bg-red-950 dark:text-red-400";
    case "Expiring": case "High":
      return "text-amber-700 bg-amber-50 dark:bg-amber-950 dark:text-amber-400";
    default:
      return "text-muted-foreground bg-muted";
  }
}

export function getScoreColor(score: number): string {
  if (score >= 90) return "text-emerald-600";
  if (score >= 75) return "text-blue-600";
  if (score >= 60) return "text-amber-600";
  return "text-red-600";
}

export function truncate(str: string, maxLength = 40): string {
  return str.length > maxLength ? str.slice(0, maxLength) + "…" : str;
}

export const CHART_COLORS = [
  "#2563eb", "#7c3aed", "#db2777", "#ea580c", "#16a34a",
  "#0891b2", "#9333ea", "#dc2626", "#d97706", "#059669",
];
