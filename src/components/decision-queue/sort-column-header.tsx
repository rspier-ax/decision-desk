import { cn } from "@/lib/cn";
import type { CaseTableSortColumn } from "@/lib/sort-cases";

type SortColumnHeaderProps = {
  label: string;
  column: CaseTableSortColumn;
  direction: "asc" | "desc" | null;
  onSort: (column: CaseTableSortColumn) => void;
};

function SortArrow({ direction }: { direction: "asc" | "desc" }) {
  return (
    <span
      className={cn(
        "inline-flex h-[1cap] w-4 shrink-0 -translate-y-px items-center justify-center text-current transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none motion-reduce:duration-0",
        direction === "asc" && "-rotate-180",
      )}
      aria-hidden
    >
      <span key={direction} className="queue-sort-header-arrow inline-flex leading-none">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 5v14" />
          <path d="m19 12-7 7-7-7" />
        </svg>
      </span>
    </span>
  );
}

export function SortColumnHeader({ label, column, direction, onSort }: SortColumnHeaderProps) {
  return (
    <th
      scope="col"
      className="h-9 px-4 py-2 text-left text-[11px] font-medium"
      aria-sort={direction === "asc" ? "ascending" : direction === "desc" ? "descending" : "none"}
    >
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onSort(column);
        }}
        className={cn(
          "inline-flex min-h-0 items-center font-medium uppercase tracking-wide transition-colors hover:text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600",
          direction != null ? "gap-1.5 text-slate-700" : "text-slate-500",
        )}
      >
        <span className="leading-none tracking-wide">{label}</span>
        {direction != null ? <SortArrow direction={direction} /> : null}
      </button>
    </th>
  );
}
