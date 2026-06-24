import { z } from "zod";
import { caseSummarySchema, riskCaseDetailSchema } from "@/schemas/case.schema";

export const demoScenarioSchema = z.enum([
  "standard",
  "high-risk-surge",
  "sla-backlog",
  "low-risk",
  "integration-instability",
]);

export const demoSimSettingsSchema = z.object({
  apiLatency: z.enum(["normal", "slow"]),
  summaryService: z.enum(["available", "unavailable"]),
  partialDataFailure: z.boolean(),
});

export const demoSessionStateSchema = z.object({
  version: z.literal(1),
  scenario: demoScenarioSchema,
  cases: z.array(riskCaseDetailSchema),
  generatedSummaries: z.record(z.string(), caseSummarySchema),
  incomingBatchIndex: z.number().int().min(0),
  sim: demoSimSettingsSchema,
});

export type DemoSessionStateInput = z.infer<typeof demoSessionStateSchema>;

export function parseDemoSessionState(raw: unknown) {
  return demoSessionStateSchema.safeParse(raw);
}
