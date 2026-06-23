import { formatDate } from "@/lib/format";
import type { AuditEntry } from "@/services/risk-provider/types";
import { Panel } from "@/components/ui/panel";

export function AuditTimeline({ entries }: { entries: AuditEntry[] }) {
  return (
    <Panel title="Audit history">
      <ol className="space-y-3" aria-label="Audit history">
        {entries.map((entry) => (
          <li key={entry.id} className="border-b border-slate-100 pb-3 last:border-0">
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-sm font-medium text-slate-900">{entry.action}</span>
              <span className="text-xs text-slate-500">{formatDate(entry.timestamp)}</span>
            </div>
            <p className="text-xs text-slate-500">By {entry.actor}</p>
            {entry.justification ? (
              <p className="mt-1 text-sm text-slate-700">{entry.justification}</p>
            ) : null}
          </li>
        ))}
      </ol>
    </Panel>
  );
}
