import { formatDate } from "@/lib/format";
import type { TimelineEvent } from "@/services/risk-provider/types";
import { Panel } from "@/components/ui/panel";

export function EventTimeline({ events }: { events: TimelineEvent[] }) {
  return (
    <Panel title="Event timeline">
      <ol className="space-y-3">
        {events.map((event) => (
          <li key={event.id} className="border-l-2 border-slate-200 pl-3">
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-sm font-medium text-slate-900">{event.title}</span>
              <span className="text-xs text-slate-500">{formatDate(event.timestamp)}</span>
            </div>
            {event.detail ? <p className="mt-0.5 text-sm text-slate-600">{event.detail}</p> : null}
            {event.actor ? (
              <p className="mt-0.5 text-xs text-slate-500">Actor: {event.actor}</p>
            ) : null}
          </li>
        ))}
      </ol>
    </Panel>
  );
}
