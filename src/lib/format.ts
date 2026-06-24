import type { CaseStatus, RiskLevel, SuggestedAction } from "@/services/risk-provider/types";

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export function formatRelativeSla(iso: string, now: number = Date.now()): string {
  const diff = new Date(iso).getTime() - now;
  const hours = Math.round(diff / (1000 * 60 * 60));
  if (hours < 0) return `${Math.abs(hours)}h overdue`;
  if (hours < 24) return `${hours}h remaining`;
  return `${Math.round(hours / 24)}d remaining`;
}

export function isSlaOverdue(iso: string, now: number = Date.now()): boolean {
  return new Date(iso).getTime() < now;
}

export function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

export function formatMinutes(value: number): string {
  return `${value}m`;
}

export function formatRate(value: number): string {
  return `${value}%`;
}

const riskLabels: Record<RiskLevel, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

const statusLabels: Record<CaseStatus, string> = {
  pending: "Pending",
  in_review: "In review",
  approved: "Approved",
  rejected: "Rejected",
  escalated: "Escalated",
};

const actionLabels: Record<SuggestedAction, string> = {
  approve: "Approve",
  reject: "Reject",
  escalate: "Escalate",
  review: "Manual review",
};

export function riskLabel(level: RiskLevel): string {
  return riskLabels[level];
}

export function statusLabel(status: CaseStatus): string {
  return statusLabels[status];
}

export function suggestedActionLabel(action: SuggestedAction): string {
  return actionLabels[action];
}

export function riskTone(level: RiskLevel): string {
  const tones: Record<RiskLevel, string> = {
    low: "bg-emerald-50 text-emerald-800 border-emerald-200",
    medium: "bg-amber-50 text-amber-900 border-amber-200",
    high: "bg-orange-50 text-orange-900 border-orange-200",
    critical: "bg-red-50 text-red-900 border-red-200",
  };
  return tones[level];
}

export function statusTone(status: CaseStatus): string {
  const tones: Record<CaseStatus, string> = {
    pending: "bg-slate-100 text-slate-700 border-slate-200",
    in_review: "bg-blue-50 text-blue-800 border-blue-200",
    approved: "bg-emerald-50 text-emerald-800 border-emerald-200",
    rejected: "bg-red-50 text-red-800 border-red-200",
    escalated: "bg-indigo-50 text-indigo-900 border-indigo-200",
  };
  return tones[status];
}
