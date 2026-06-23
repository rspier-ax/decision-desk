"use client";

import { Button } from "@/components/ui/button";
import { DropdownSelect } from "@/components/ui/dropdown-select";

const PAGE_SIZES = [10, 25, 50] as const;

type QueuePaginationProps = {
  page: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
};

export function QueuePagination({
  page,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}: QueuePaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const from = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const to = Math.min(safePage * pageSize, totalItems);

  return (
    <div
      className="grid grid-cols-1 gap-4 border-t border-slate-200 pt-4 md:grid-cols-[1fr_auto_1fr] md:items-center"
      role="navigation"
      aria-label="Queue pagination"
    >
      <p className="text-xs tabular-nums text-slate-500 md:justify-self-start">
        Showing {from}–{to} of {totalItems}
      </p>

      <div className="flex justify-center md:justify-self-center">
        <div className="inline-flex items-center gap-1 rounded-sm border border-slate-200 bg-slate-50 p-0.5">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="h-7 min-w-8 px-2"
            disabled={safePage <= 1}
            onClick={() => onPageChange(safePage - 1)}
            aria-label="Previous page"
          >
            ‹
          </Button>
          <span className="min-w-[5.5rem] px-2 text-center text-xs tabular-nums text-slate-600">
            Page {safePage} / {totalPages}
          </span>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="h-7 min-w-8 px-2"
            disabled={safePage >= totalPages}
            onClick={() => onPageChange(safePage + 1)}
            aria-label="Next page"
          >
            ›
          </Button>
        </div>
      </div>

      <fieldset className="m-0 shrink-0 border-0 p-0 md:col-start-3 md:row-start-1 md:justify-self-end">
        <legend className="mb-1.5 text-right text-xs font-medium text-slate-500">Rows per page</legend>
        <DropdownSelect
          compact
          menuPlacement="top"
          value={String(pageSize)}
          onChange={(next) => onPageSizeChange(Number(next))}
          aria-label="Rows per page"
          className="min-w-[4.5rem]"
          options={PAGE_SIZES.map((size) => ({
            value: String(size),
            label: String(size),
          }))}
        />
      </fieldset>
    </div>
  );
}

export { PAGE_SIZES };
