"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useDemoOptional } from "@/features/demo/demo-provider";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import {
  DEMO_SCENARIO_LABELS,
  DEMO_SCENARIOS,
  type DemoScenario,
  type DemoSimSettings,
} from "@/mocks/demo/types";

type ConfirmAction = "load" | "reset" | null;

function SlidersIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <line x1="4" x2="4" y1="21" y2="14" />
      <line x1="4" x2="4" y1="10" y2="3" />
      <line x1="12" x2="12" y1="21" y2="12" />
      <line x1="12" x2="12" y1="8" y2="3" />
      <line x1="20" x2="20" y1="21" y2="16" />
      <line x1="20" x2="20" y1="12" y2="3" />
      <line x1="1" x2="7" y1="14" y2="14" />
      <line x1="9" x2="15" y1="8" y2="8" />
      <line x1="17" x2="23" y1="16" y2="16" />
    </svg>
  );
}

function ChevronDownIcon({ className, open }: { className?: string; open: boolean }) {
  return (
    <svg
      className={cn(
        "transition-transform duration-200 motion-reduce:transition-none",
        open && "rotate-180",
        className,
      )}
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

function SimToggle<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs text-slate-600">{label}</span>
      <fieldset className="m-0 border-0 p-0">
        <legend className="sr-only">{label}</legend>
        <div className="inline-flex rounded-sm border border-slate-300 bg-white p-0.5">
          {options.map((option) => {
            const active = value === option.value;
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={active}
                onClick={() => onChange(option.value)}
                className={cn(
                  "cursor-pointer rounded-sm px-2 py-1 text-xs font-medium",
                  active ? "bg-slate-800 text-white" : "text-slate-700 hover:bg-slate-50",
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}

export function DemoControls() {
  const demo = useDemoOptional();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<DemoScenario>("standard");
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);
  const [busy, setBusy] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setConfirmAction(null);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  if (!demo) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-sm border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-medium text-slate-500">
        <SlidersIcon />
        Demo controls
      </span>
    );
  }

  const demoCtx = demo;
  const sim = demoCtx.session?.sim;

  async function runConfirmed() {
    if (!confirmAction) return;
    setBusy(true);
    try {
      if (confirmAction === "load") {
        await demoCtx.loadScenario(selectedScenario);
        if (pathname.startsWith("/cases/")) {
          router.push("/");
        }
      } else {
        await demoCtx.resetDemo();
      }
      setConfirmAction(null);
      setOpen(false);
    } finally {
      setBusy(false);
    }
  }

  async function handleAddIncoming() {
    setBusy(true);
    try {
      await demoCtx.addIncoming();
    } finally {
      setBusy(false);
    }
  }

  async function handleSimChange(patch: Partial<DemoSimSettings>) {
    await demoCtx.setSim(patch);
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => {
          if (!open) {
            setSelectedScenario(demoCtx.session?.scenario ?? "standard");
          }
          setOpen((current) => !current);
        }}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label="Configure demo data and service behavior"
        title="Configure demo data and service behavior"
        className={cn(
          "inline-flex cursor-pointer items-center gap-1.5 rounded-sm border px-2 py-1 text-xs font-medium transition-colors",
          "border-slate-200 bg-slate-50 text-slate-700",
          "hover:border-slate-300 hover:bg-slate-100",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600",
          "active:bg-slate-200",
          open && "border-slate-300 bg-slate-100",
        )}
      >
        <SlidersIcon className="shrink-0 text-slate-500" />
        <span>Demo controls</span>
        <ChevronDownIcon open={open} className="shrink-0 text-slate-500" />
      </button>

      {demoCtx.feedback ? (
        <p className="sr-only" aria-live="polite">
          {demoCtx.feedback}
        </p>
      ) : null}

      {open ? (
        <div
          role="dialog"
          aria-modal="false"
          aria-labelledby="demo-controls-title"
          aria-describedby="demo-controls-description"
          className="absolute right-0 z-50 mt-2 w-[min(22rem,calc(100vw-2rem))] rounded-lg border border-slate-200 bg-white p-4 shadow-lg"
        >
          <h2 id="demo-controls-title" className="text-sm font-semibold text-slate-900">
            Demo environment
          </h2>
          <p id="demo-controls-description" className="mt-1 text-xs text-slate-600">
            Manage scenarios and simulated service conditions.
          </p>

          {demoCtx.feedback ? (
            <p className="mt-2 text-xs text-slate-600" aria-live="polite">
              {demoCtx.feedback}
            </p>
          ) : null}

          <div className="mt-4 space-y-4">
            <label className="block text-xs font-medium text-slate-600">
              Scenario
              <DropdownSelect
                compact
                value={selectedScenario}
                onChange={(value) => setSelectedScenario(value as DemoScenario)}
                aria-label="Demo scenario"
                className="mt-1.5 w-full"
                options={DEMO_SCENARIOS.map((scenario) => ({
                  value: scenario,
                  label: DEMO_SCENARIO_LABELS[scenario],
                }))}
              />
            </label>

            <div className="flex flex-col gap-2">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                disabled={busy}
                className="w-full justify-center"
                onClick={() => setConfirmAction("load")}
              >
                Load scenario
              </Button>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                disabled={busy}
                className="w-full justify-center"
                onClick={handleAddIncoming}
              >
                Add incoming cases
              </Button>
            </div>

            <div className="space-y-3 border-t border-slate-200 pt-4">
              <SimToggle
                label="API latency"
                value={sim?.apiLatency ?? "normal"}
                options={[
                  { value: "normal", label: "Normal" },
                  { value: "slow", label: "Slow" },
                ]}
                onChange={(value) => handleSimChange({ apiLatency: value })}
              />
              <SimToggle
                label="Summary service"
                value={sim?.summaryService ?? "available"}
                options={[
                  { value: "available", label: "Available" },
                  { value: "unavailable", label: "Unavailable" },
                ]}
                onChange={(value) => handleSimChange({ summaryService: value })}
              />
              <SimToggle
                label="Partial failure"
                value={sim?.partialDataFailure ? "on" : "off"}
                options={[
                  { value: "off", label: "Off" },
                  { value: "on", label: "On" },
                ]}
                onChange={(value) => handleSimChange({ partialDataFailure: value === "on" })}
              />
            </div>

            <Button
              type="button"
              size="sm"
              variant="secondary"
              disabled={busy}
              className="w-full justify-center"
              onClick={() => setConfirmAction("reset")}
            >
              Reset demo data
            </Button>
          </div>

          {confirmAction ? (
            <div className="mt-4 border-t border-slate-200 pt-3">
              <p className="text-sm text-slate-700">
                {confirmAction === "load"
                  ? "Replace the active demo state with the selected scenario?"
                  : "Restore the active scenario to its original baseline?"}
              </p>
              <div className="mt-3 flex justify-end gap-2">
                <Button type="button" size="sm" variant="ghost" onClick={() => setConfirmAction(null)}>
                  Cancel
                </Button>
                <Button type="button" size="sm" variant="primary" disabled={busy} onClick={runConfirmed}>
                  Confirm
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
