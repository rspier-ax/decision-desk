import { z } from "zod";

export const riskLevelSchema = z.enum(["low", "medium", "high", "critical"]);
export const caseStatusSchema = z.enum([
  "pending",
  "in_review",
  "approved",
  "rejected",
  "escalated",
]);
export const suggestedActionSchema = z.enum([
  "approve",
  "reject",
  "escalate",
  "review",
]);
export const decisionActionSchema = z.enum(["approve", "reject", "escalate"]);

export const caseFiltersSchema = z.object({
  search: z.string().optional(),
  riskLevel: z.array(riskLevelSchema).optional(),
  status: z.array(caseStatusSchema).optional(),
  assignee: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
});

export const riskSignalSchema = z.object({
  id: z.string(),
  code: z.string(),
  label: z.string(),
  severity: riskLevelSchema,
  evidence: z.string(),
  source: z.string(),
});

export const timelineEventSchema = z.object({
  id: z.string(),
  timestamp: z.string(),
  type: z.enum(["system", "transaction", "decision", "assignment"]),
  title: z.string(),
  detail: z.string().optional(),
  actor: z.string().optional(),
});

export const auditEntrySchema = z.object({
  id: z.string(),
  timestamp: z.string(),
  action: z.string(),
  actor: z.string(),
  justification: z.string().optional(),
  metadata: z.record(z.string(), z.string()).optional(),
});

export const riskCaseSchema = z.object({
  id: z.string(),
  applicantName: z.string(),
  productType: z.string(),
  submittedAt: z.string(),
  riskLevel: riskLevelSchema,
  riskScore: z.number().min(0).max(100),
  status: caseStatusSchema,
  assignee: z.string().nullable(),
  slaDueAt: z.string(),
  suggestedAction: suggestedActionSchema,
  modelConfidence: z.number().min(0).max(1),
  signalCount: z.number().int().min(0),
});

export const riskCaseDetailSchema = riskCaseSchema.extend({
  applicant: z.object({
    accountId: z.string(),
    dateOfBirth: z.string(),
    address: z.string(),
    email: z.string(),
    phone: z.string(),
    employmentStatus: z.string(),
  }),
  signals: z.array(riskSignalSchema),
  decisionRationale: z.string(),
  timeline: z.array(timelineEventSchema),
  auditHistory: z.array(auditEntrySchema),
  rulesetVersion: z.string(),
});

export const decisionInputSchema = z.object({
  caseId: z.string(),
  action: decisionActionSchema,
  justification: z
    .string()
    .min(10, "Justification must be at least 10 characters"),
  analystId: z.string(),
});

export const caseSummarySchema = z.object({
  caseId: z.string(),
  executiveSummary: z.string(),
  contributingSignals: z.array(z.string()),
  gapsOrConflicts: z.array(z.string()),
  suggestedNextAction: z.string(),
  generatedAt: z.string(),
  modelVersion: z.string(),
});

export type DecisionInputValues = z.infer<typeof decisionInputSchema>;
