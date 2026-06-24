import { NextResponse } from "next/server";
import { applySimulatedLatency, submitDecisionToStore } from "@/mocks/store";
import { decisionInputSchema } from "@/schemas/case.schema";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ caseId: string }> },
) {
  await applySimulatedLatency();
  const { caseId } = await params;
  const body = await request.json();
  const parsed = decisionInputSchema.safeParse({ ...body, caseId });

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  try {
    const result = submitDecisionToStore(parsed.data);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Case not found" }, { status: 404 });
  }
}
