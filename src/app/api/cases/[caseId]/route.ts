import { NextResponse } from "next/server";
import { applySimulatedLatency, getCaseFromStore, getGeneratedSummary } from "@/mocks/store";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ caseId: string }> },
) {
  await applySimulatedLatency();
  const { caseId } = await params;
  const caseDetail = getCaseFromStore(caseId);

  if (!caseDetail) {
    return NextResponse.json({ error: "Case not found" }, { status: 404 });
  }

  const generatedSummary = getGeneratedSummary(caseId);
  return NextResponse.json({
    ...caseDetail,
    generatedSummary: generatedSummary ?? null,
  });
}
