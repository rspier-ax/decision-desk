import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CaseSummaryPanel } from "@/components/case-summary/case-summary-panel";

describe("CaseSummaryPanel", () => {
  it("streams summary sections progressively", async () => {
    const user = userEvent.setup();

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ key: "executiveSummary", value: "Flagged for review." })}\n\n`,
          ),
        );
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ key: "contributingSignals", value: ["Address mismatch"] })}\n\n`,
          ),
        );
        controller.close();
      },
    });

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        body: stream,
      }),
    );

    render(<CaseSummaryPanel caseId="DD-2026-01482" />);
    await user.click(screen.getByRole("button", { name: "Generate summary" }));

    await waitFor(() => {
      expect(screen.getByText("Flagged for review.")).toBeInTheDocument();
    });
    expect(screen.getByText("Address mismatch")).toBeInTheDocument();

    vi.unstubAllGlobals();
  });
});
