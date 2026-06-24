import { buildCaseDetail } from "@/mocks/demo/builders";
import { materializeCaseDetail } from "@/mocks/demo/materialize";
import type { RiskCaseDetail } from "@/services/risk-provider/types";

type IncomingCaseTiming = {
  submittedHoursAgo: number;
  slaDueInHours: number;
};

/** Placeholder dates — replaced when the batch is materialized at inject time. */
const PLACEHOLDER_SUBMITTED = "2026-01-01T12:00:00.000Z";
const PLACEHOLDER_SLA = "2026-01-01T20:00:00.000Z";

const INCOMING_BATCH_TEMPLATES: RiskCaseDetail[][] = [
  [
    buildCaseDetail(
      {
        id: "DD-INC-2401",
        applicantName: "T. Nguyen",
        productType: "Credit card",
        submittedAt: PLACEHOLDER_SUBMITTED,
        riskLevel: "medium",
        riskScore: 52,
        status: "pending",
        assignee: null,
        slaDueAt: PLACEHOLDER_SLA,
        suggestedAction: "review",
        modelConfidence: 0.66,
        signalCount: 2,
        applicant: {
          accountId: "ACC-9011223",
          dateOfBirth: "1990-04-18",
          address: "220 Cedar Ln, Austin, TX 78701",
          email: "t.nguyen@mailprovider.example",
          phone: "+1-512-555-0177",
          employmentStatus: "Employed — 2y at current employer",
        },
      },
      [
        {
          id: "inc-sig-1",
          code: "ADDR_RECENT",
          label: "Recent address change",
          severity: "medium",
          evidence: "Address updated within 30 days of application",
          source: "identity_verification",
        },
        {
          id: "inc-sig-2",
          code: "UTIL_SPIKE",
          label: "Utilization spike",
          severity: "low",
          evidence: "Revolving utilization increased 18 points in 60 days",
          source: "credit_bureau",
        },
      ],
      "Recent address change with utilization spike warrants quick verification.",
    ),
    buildCaseDetail(
      {
        id: "DD-INC-2402",
        applicantName: "L. Fischer",
        productType: "Personal loan",
        submittedAt: PLACEHOLDER_SUBMITTED,
        riskLevel: "high",
        riskScore: 74,
        status: "pending",
        assignee: "analyst.jdoe",
        slaDueAt: PLACEHOLDER_SLA,
        suggestedAction: "review",
        modelConfidence: 0.79,
        signalCount: 3,
        applicant: {
          accountId: "ACC-9011288",
          dateOfBirth: "1985-09-02",
          address: "18 Market St, Philadelphia, PA 19103",
          email: "l.fischer@mailprovider.example",
          phone: "+1-215-555-0129",
          employmentStatus: "Self-employed",
        },
      },
      [
        {
          id: "inc-sig-3",
          code: "INCOME_DOC",
          label: "Income documentation gap",
          severity: "high",
          evidence: "Self-reported income not matched to tax transcript",
          source: "income_verification",
        },
        {
          id: "inc-sig-4",
          code: "APP_VELOCITY",
          label: "Application velocity",
          severity: "medium",
          evidence: "Second unsecured application in 45 days",
          source: "application_monitor",
        },
        {
          id: "inc-sig-5",
          code: "DEVICE_NEW",
          label: "New device",
          severity: "medium",
          evidence: "First-seen device fingerprint on application channel",
          source: "device_intelligence",
        },
      ],
      "Income documentation gap and velocity require analyst review before approval.",
    ),
    buildCaseDetail(
      {
        id: "DD-INC-2403",
        applicantName: "A. Brooks",
        productType: "Auto loan",
        submittedAt: PLACEHOLDER_SUBMITTED,
        riskLevel: "low",
        riskScore: 28,
        status: "pending",
        assignee: null,
        slaDueAt: PLACEHOLDER_SLA,
        suggestedAction: "approve",
        modelConfidence: 0.84,
        signalCount: 1,
        applicant: {
          accountId: "ACC-9011310",
          dateOfBirth: "1994-12-11",
          address: "902 Pinecrest Rd, Denver, CO 80203",
          email: "a.brooks@mailprovider.example",
          phone: "+1-303-555-0164",
          employmentStatus: "Employed — full time",
        },
      },
      [
        {
          id: "inc-sig-6",
          code: "THIN_FILE",
          label: "Thin credit file",
          severity: "low",
          evidence: "Limited tradeline history under 24 months",
          source: "credit_bureau",
        },
      ],
      "Thin file only; model recommends approve with standard verification.",
    ),
  ],
  [
    buildCaseDetail(
      {
        id: "DD-INC-2404",
        applicantName: "K. Ibrahim",
        productType: "Credit card",
        submittedAt: PLACEHOLDER_SUBMITTED,
        riskLevel: "critical",
        riskScore: 89,
        status: "pending",
        assignee: null,
        slaDueAt: PLACEHOLDER_SLA,
        suggestedAction: "reject",
        modelConfidence: 0.91,
        signalCount: 4,
        applicant: {
          accountId: "ACC-9011402",
          dateOfBirth: "1981-01-27",
          address: "77 Bay St, Toronto, ON M5J 2S8",
          email: "k.ibrahim@mailprovider.example",
          phone: "+1-416-555-0191",
          employmentStatus: "Employed",
        },
      },
      [
        {
          id: "inc-sig-7",
          code: "SYN_ID",
          label: "Synthetic identity indicator",
          severity: "critical",
          evidence: "SSN issuance date inconsistent with applicant age band",
          source: "identity_verification",
        },
        {
          id: "inc-sig-8",
          code: "FRAUD_RING",
          label: "Fraud ring association",
          severity: "critical",
          evidence: "Phone number linked to 4 prior fraud alerts",
          source: "fraud_network",
        },
        {
          id: "inc-sig-9",
          code: "ADDR_VIRTUAL",
          label: "Virtual address",
          severity: "high",
          evidence: "Declared address matches commercial mail drop",
          source: "geo_intelligence",
        },
        {
          id: "inc-sig-10",
          code: "DOC_TAMPER",
          label: "Document tampering",
          severity: "high",
          evidence: "Pay stub metadata inconsistent with issuer format",
          source: "document_forensics",
        },
      ],
      "Multiple critical fraud indicators; model recommends reject pending supervisor review.",
    ),
    buildCaseDetail(
      {
        id: "DD-INC-2405",
        applicantName: "J. Morrison",
        productType: "Personal loan",
        submittedAt: PLACEHOLDER_SUBMITTED,
        riskLevel: "medium",
        riskScore: 49,
        status: "pending",
        assignee: "analyst.mwalsh",
        slaDueAt: PLACEHOLDER_SLA,
        suggestedAction: "approve",
        modelConfidence: 0.72,
        signalCount: 1,
        applicant: {
          accountId: "ACC-9011455",
          dateOfBirth: "1993-06-08",
          address: "14 Lakeview Dr, Minneapolis, MN 55401",
          email: "j.morrison@mailprovider.example",
          phone: "+1-612-555-0140",
          employmentStatus: "Employed — 4y tenure",
        },
      },
      [
        {
          id: "inc-sig-11",
          code: "DTI_EDGE",
          label: "DTI near threshold",
          severity: "medium",
          evidence: "Debt-to-income at 41% against 42% policy limit",
          source: "policy_engine",
        },
      ],
      "DTI near policy limit; approve path if income verified.",
    ),
    buildCaseDetail(
      {
        id: "DD-INC-2406",
        applicantName: "E. Walsh",
        productType: "Auto loan",
        submittedAt: PLACEHOLDER_SUBMITTED,
        riskLevel: "high",
        riskScore: 71,
        status: "pending",
        assignee: null,
        slaDueAt: PLACEHOLDER_SLA,
        suggestedAction: "escalate",
        modelConfidence: 0.68,
        signalCount: 2,
        applicant: {
          accountId: "ACC-9011499",
          dateOfBirth: "1977-11-19",
          address: "560 River Rd, Nashville, TN 37201",
          email: "e.walsh@mailprovider.example",
          phone: "+1-615-555-0188",
          employmentStatus: "Contractor",
        },
      },
      [
        {
          id: "inc-sig-12",
          code: "EMP_VAR",
          label: "Employment variance",
          severity: "high",
          evidence: "Contractor status with variable income over 40% YoY",
          source: "income_verification",
        },
        {
          id: "inc-sig-13",
          code: "COLLATERAL",
          label: "Collateral valuation gap",
          severity: "medium",
          evidence: "Vehicle valuation 12% below loan request",
          source: "collateral_service",
        },
      ],
      "Variable income and collateral gap exceed auto-approve threshold; escalate to senior review.",
    ),
    buildCaseDetail(
      {
        id: "DD-INC-2407",
        applicantName: "P. Okafor",
        productType: "Credit card",
        submittedAt: PLACEHOLDER_SUBMITTED,
        riskLevel: "low",
        riskScore: 31,
        status: "pending",
        assignee: null,
        slaDueAt: PLACEHOLDER_SLA,
        suggestedAction: "approve",
        modelConfidence: 0.86,
        signalCount: 0,
        applicant: {
          accountId: "ACC-9011520",
          dateOfBirth: "1998-02-03",
          address: "33 Elm St, Raleigh, NC 27601",
          email: "p.okafor@mailprovider.example",
          phone: "+1-919-555-0116",
          employmentStatus: "Employed — recent graduate",
        },
      },
      [],
      "No adverse signals; standard approve path.",
    ),
  ],
];

const INCOMING_BATCH_TIMINGS: IncomingCaseTiming[][] = [
  [
    { submittedHoursAgo: 0.5, slaDueInHours: 12 },
    { submittedHoursAgo: 0.4, slaDueInHours: 6 },
    { submittedHoursAgo: 0.3, slaDueInHours: 16 },
  ],
  [
    { submittedHoursAgo: 0.25, slaDueInHours: 4 },
    { submittedHoursAgo: 0.2, slaDueInHours: 10 },
    { submittedHoursAgo: 0.15, slaDueInHours: 7 },
    { submittedHoursAgo: 0.1, slaDueInHours: 14 },
  ],
];

export function getIncomingBatch(batchIndex: number, now: Date = new Date()): RiskCaseDetail[] {
  const index = batchIndex % INCOMING_BATCH_TEMPLATES.length;
  const templates = INCOMING_BATCH_TEMPLATES[index];
  const timings = INCOMING_BATCH_TIMINGS[index];

  return templates.map((template, caseIndex) =>
    materializeCaseDetail(
      template,
      timings[caseIndex].submittedHoursAgo,
      timings[caseIndex].slaDueInHours,
      now,
    ),
  );
}

export function incomingBatchCount(): number {
  return INCOMING_BATCH_TEMPLATES.length;
}

export function incomingBatchSize(batchIndex: number): number {
  return getIncomingBatch(batchIndex).length;
}
