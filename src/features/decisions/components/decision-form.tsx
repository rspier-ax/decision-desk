"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { decisionInputSchema } from "@/schemas/case.schema";
import { useSubmitDecision } from "@/features/decisions/hooks/use-submit-decision";
import type { DecisionAction } from "@/services/risk-provider/types";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Panel } from "@/components/ui/panel";
import { DropdownSelect } from "@/components/ui/dropdown-select";
import { formControlClassName } from "@/lib/form-control";
import { cn } from "@/lib/cn";

const ANALYST_ID = "analyst.jdoe";

type FormValues = {
  action: DecisionAction;
  justification: string;
};

export function DecisionForm({
  caseId,
  disabled,
}: {
  caseId: string;
  disabled?: boolean;
}) {
  const [pendingAction, setPendingAction] = useState<DecisionAction | null>(null);
  const mutation = useSubmitDecision(caseId);

  const {
    register,
    control,
    handleSubmit,
    getValues,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(
      decisionInputSchema.pick({ action: true, justification: true }),
    ),
    defaultValues: { action: "approve", justification: "" },
  });

  async function onConfirm() {
    const values = getValues();
    await mutation.mutateAsync({
      action: values.action,
      justification: values.justification,
      analystId: ANALYST_ID,
    });
    setPendingAction(null);
    reset({ action: values.action, justification: "" });
  }

  function onSubmit(values: FormValues) {
    setPendingAction(values.action);
  }

  const isClosed = disabled || mutation.isPending;

  return (
    <>
      <Panel title="Record decision">
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Field label="Decision" htmlFor="action" error={errors.action?.message}>
            <Controller
              name="action"
              control={control}
              render={({ field }) => (
                <DropdownSelect
                  id="action"
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isClosed}
                  options={[
                    { value: "approve", label: "Approve" },
                    { value: "reject", label: "Reject" },
                    { value: "escalate", label: "Escalate" },
                  ]}
                />
              )}
            />
          </Field>

          <Field
            label="Justification (required)"
            htmlFor="justification"
            error={errors.justification?.message}
          >
            <textarea
              id="justification"
              rows={4}
              disabled={isClosed}
              className={cn(formControlClassName, "h-auto py-2")}
              aria-invalid={Boolean(errors.justification)}
              aria-describedby={errors.justification ? "justification-error" : undefined}
              {...register("justification")}
            />
          </Field>

          {mutation.isError ? (
            <p className="text-sm text-red-700" role="alert">
              Unable to record decision. Please retry.
            </p>
          ) : null}

          <Button type="submit" variant="primary" className="w-full" disabled={isClosed}>
            Submit decision
          </Button>
        </form>
      </Panel>

      {pendingAction ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
        >
          <div className="w-full max-w-md border border-slate-200 bg-white p-4 shadow-sm">
            <h2 id="confirm-title" className="text-sm font-semibold text-slate-900">
              Confirm {pendingAction}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              This action will be recorded in the audit history and cannot be undone.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setPendingAction(null)}>
                Cancel
              </Button>
              <Button
                variant={pendingAction === "reject" ? "danger" : "primary"}
                onClick={onConfirm}
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Recording…" : "Confirm"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
