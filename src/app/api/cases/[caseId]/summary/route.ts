import { buildCaseSummary } from "@/mocks/summary-templates";
import { getCaseFromStore } from "@/mocks/store";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ caseId: string }> },
) {
  const { caseId } = await params;
  const { searchParams } = new URL(request.url);

  if (searchParams.get("simulate") === "summary_error") {
    return new Response(JSON.stringify({ error: "Summary service unavailable" }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });
  }

  const caseDetail = getCaseFromStore(caseId);
  if (!caseDetail) {
    return new Response(JSON.stringify({ error: "Case not found" }), { status: 404 });
  }

  const summary = buildCaseSummary(
    caseDetail.id,
    caseDetail.applicantName,
    caseDetail.signals.map((s) => `${s.label}: ${s.evidence}`),
    caseDetail.signals.length === 0
      ? ["No conflicting documentation on file"]
      : ["Employment documentation not yet verified for self-reported income"],
    `${caseDetail.suggestedAction} — pending analyst confirmation`,
  );

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const sections = [
        { key: "executiveSummary", value: summary.executiveSummary },
        { key: "contributingSignals", value: summary.contributingSignals },
        { key: "gapsOrConflicts", value: summary.gapsOrConflicts },
        { key: "suggestedNextAction", value: summary.suggestedNextAction },
        { key: "meta", value: { generatedAt: summary.generatedAt, modelVersion: summary.modelVersion } },
      ];

      for (const section of sections) {
        await delay(400);
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(section)}\n\n`),
        );
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
