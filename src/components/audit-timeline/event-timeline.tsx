import { formatDate } from "@/lib/format";
import type { TimelineEvent } from "@/services/risk-provider/types";
import { Panel } from "@/components/ui/panel";

export function EventTimeline({ events }: { events: TimelineEvent[] }) {
  return (
    <Panel title="Event timeline">
      <ol className="relative space-y-4 border-l border-slate-200 pl-4">
        {events.map((event) => (
          <li key={event.id} className="relative">
            <span
              className="absolute -left-[calc(1rem+5px)] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-slate-400"
              aria-hidden
            />
            <time className="text-xs text-slate-500">{formatDate(event.timestamp)}</time>
            <p className="mt-0.5 text-sm font-medium text-slate-900">{event.title}</p>
            {event.detail ? <p className="mt-0.5 text-sm text-slate-600">{event.detail}</p> : null}
            {event.actor ? (
              <p className="mt-0.5 text-xs text-slate-500">{event.actor}</p>
            ) : null}
          </li>
        ))}
      </ol>
    </Panel>
  );
}
