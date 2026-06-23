"use client";

import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/cn";

export type DropdownOption = {
  value: string;
  label: string;
};

type DropdownSelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  compact?: boolean;
  disabled?: boolean;
  id?: string;
  className?: string;
  menuPlacement?: "bottom" | "top";
  "aria-label"?: string;
};

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function DropdownSelect({
  value,
  onChange,
  options,
  compact = false,
  disabled = false,
  id,
  className,
  menuPlacement = "bottom",
  "aria-label": ariaLabel,
}: DropdownSelectProps) {
  const [open, setOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const selectedIndex = options.findIndex((option) => option.value === value);
  const selected = options[selectedIndex >= 0 ? selectedIndex : 0];

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setHighlightIndex(-1);
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  function closeMenu() {
    setOpen(false);
    setHighlightIndex(-1);
  }

  function selectOption(option: DropdownOption) {
    onChange(option.value);
    closeMenu();
  }

  function onTriggerKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (disabled) return;

    if (event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (!open) {
        setOpen(true);
        setHighlightIndex(selectedIndex >= 0 ? selectedIndex : 0);
        return;
      }
    }

    if (!open) return;

    if (event.key === "Escape") {
      event.preventDefault();
      closeMenu();
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightIndex((index) => (index + 1) % options.length);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightIndex((index) => (index <= 0 ? options.length - 1 : index - 1));
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      const option = options[highlightIndex >= 0 ? highlightIndex : selectedIndex];
      if (option) selectOption(option);
    }
  }

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        id={id}
        type="button"
        disabled={disabled}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => {
          if (disabled) return;
          if (open) {
            closeMenu();
            return;
          }
          setOpen(true);
          setHighlightIndex(selectedIndex >= 0 ? selectedIndex : 0);
        }}
        onKeyDown={onTriggerKeyDown}
        className={cn(
          "inline-flex w-full items-center justify-between gap-2 rounded-md border border-slate-300 bg-white font-normal text-slate-900 transition-colors",
          "hover:border-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400",
          "active:bg-white disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400",
          open && "border-slate-400 ring-2 ring-slate-400",
          compact ? "h-7 min-w-[8.5rem] px-2.5 text-xs" : "h-9 px-3 text-sm",
        )}
      >
        <span className="truncate">{selected?.label}</span>
        <ChevronDown
          className={cn(
            "shrink-0 text-slate-500 transition-transform",
            menuPlacement === "top" && !open && "rotate-180",
            menuPlacement === "bottom" && open && "rotate-180",
          )}
        />
      </button>

      {open ? (
        <ul
          id={listId}
          role="listbox"
          aria-label={ariaLabel}
          className={cn(
            "absolute z-30 max-h-60 min-w-full overflow-auto rounded-lg border border-slate-200 bg-white p-1 shadow-lg",
            menuPlacement === "top" ? "bottom-full left-0 mb-1.5" : "left-0 mt-1.5",
          )}
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            const isHighlighted = index === highlightIndex;

            return (
              <li key={option.value} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setHighlightIndex(index)}
                  onClick={() => selectOption(option)}
                  className={cn(
                    "flex w-full rounded-md px-2.5 py-1.5 text-left text-xs transition-colors",
                    isSelected
                      ? "bg-slate-800 text-white"
                      : "text-slate-800 hover:bg-blue-50 hover:text-slate-900",
                    isHighlighted && !isSelected && "bg-blue-50 text-slate-900",
                  )}
                >
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
