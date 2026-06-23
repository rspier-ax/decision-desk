import { NextResponse } from "next/server";
import { getCaseFromStore } from "@/mocks/store";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ caseId: string }> },
) {
  const { caseId } = await params;
  const caseDetail = getCaseFromStore(caseId);

  if (!caseDetail) {
    return NextResponse.json({ error: "Case not found" }, { status: 404 });
  }

  return NextResponse.json(caseDetail);
}
