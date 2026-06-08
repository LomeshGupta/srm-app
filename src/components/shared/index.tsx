"use client";
import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  trend?: number;
  trendLabel?: string;
  className?: string;
  onClick?: () => void;
}

export function KPICard({
  title, value, subtitle, icon: Icon,
  iconColor = "text-primary", iconBg = "bg-primary/10",
  trend, trendLabel, className, onClick
}: KPICardProps) {
  const isPositive = trend !== undefined && trend > 0;
  const isNegative = trend !== undefined && trend < 0;

  return (
    <Card
      className={cn("transition-all duration-200 hover:shadow-md", onClick && "cursor-pointer hover:-translate-y-0.5", className)}
      onClick={onClick}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{title}</p>
            <p className="mt-1.5 text-2xl font-bold tracking-tight">{value}</p>
            {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
            {trend !== undefined && (
              <div className={cn("mt-2 flex items-center gap-1 text-xs font-medium",
                isPositive ? "text-emerald-600" : isNegative ? "text-red-600" : "text-muted-foreground"
              )}>
                {isPositive ? <TrendingUp size={13} /> : isNegative ? <TrendingDown size={13} /> : <Minus size={13} />}
                <span>{Math.abs(trend)}% {trendLabel ?? "vs last month"}</span>
              </div>
            )}
          </div>
          <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", iconBg)}>
            <Icon size={20} className={iconColor} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
import { getStatusColor, getRiskColor } from "@/lib/utils";

export function StatusBadge({ status, type = "status" }: { status: string; type?: "status" | "risk" }) {
  const cls = type === "risk" ? getRiskColor(status) : getStatusColor(status);
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", cls)}>
      {status}
    </span>
  );
}

// ─── Score Gauge ──────────────────────────────────────────────────────────────
import { getScoreColor } from "@/lib/utils";

export function ScoreGauge({ score, size = "md" }: { score: number; size?: "sm" | "md" | "lg" }) {
  const sz = size === "sm" ? "h-10 w-10 text-sm" : size === "lg" ? "h-16 w-16 text-xl" : "h-12 w-12 text-base";
  const color = score >= 90 ? "border-emerald-500" : score >= 75 ? "border-blue-500" : score >= 60 ? "border-amber-500" : "border-red-500";
  return (
    <div className={cn("rounded-full border-4 flex items-center justify-center font-bold", sz, color, getScoreColor(score))}>
      {score}
    </div>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
export function SectionHeader({
  title, description, action
}: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-5">
      <div>
        <h2 className="text-base font-semibold">{title}</h2>
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
import type { LucideProps } from "lucide-react";
export function EmptyState({
  icon: Icon, title, description, action
}: { icon: (props: LucideProps) => JSX.Element; title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted mb-4">
        <Icon size={24} className="text-muted-foreground" />
      </div>
      <h3 className="text-sm font-semibold">{title}</h3>
      {description && <p className="mt-1 text-xs text-muted-foreground max-w-xs">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// ─── Trend Chip ────────────────────────────────────────────────────────────────
export function TrendChip({ value }: { value: number }) {
  const positive = value > 0;
  return (
    <span className={cn("inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold",
      positive ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
               : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"
    )}>
      {positive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
      {Math.abs(value).toFixed(1)}%
    </span>
  );
}

// ─── Page Shell ──────────────────────────────────────────────────────────────
export function PageShell({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("space-y-5 animate-fade-in-up", className)}>
      {children}
    </div>
  );
}

// ─── Loading Skeleton Grid ────────────────────────────────────────────────────
import { Skeleton } from "@/components/ui";
export function SkeletonGrid({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i}><CardContent className="p-5"><Skeleton className="h-4 w-24 mb-3" /><Skeleton className="h-8 w-16 mb-2" /><Skeleton className="h-3 w-32" /></CardContent></Card>
      ))}
    </div>
  );
}
