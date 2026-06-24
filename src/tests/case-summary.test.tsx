import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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
      vi.fn().mockImplementation((url: string, init?: RequestInit) => {
        if (url.includes("/summary") && init?.method === "POST") {
          return Promise.resolve({ ok: true, body: stream });
        }
        if (url.includes("/summary")) {
          return Promise.resolve({ ok: false });
        }
        if (url.includes("/api/cases/")) {
          return Promise.resolve({
            ok: true,
            json: async () => ({ id: "DD-2026-01482", generatedSummary: null }),
          });
        }
        return Promise.resolve({ ok: false });
      }),
    );

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <CaseSummaryPanel caseId="DD-2026-01482" />
      </QueryClientProvider>,
    );
    await user.click(screen.getByRole("button", { name: "Generate summary" }));

    await waitFor(() => {
      expect(screen.getByText("Flagged for review.")).toBeInTheDocument();
    });
    expect(screen.getByText("Address mismatch")).toBeInTheDocument();

    vi.unstubAllGlobals();
  });

  it("allows generating again after clear", async () => {
    const user = userEvent.setup();

    let hasPersistedSummary = true;
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ key: "executiveSummary", value: "Second summary." })}\n\n`,
          ),
        );
        controller.close();
      },
    });

    const fetchMock = vi.fn().mockImplementation((url: string, init?: RequestInit) => {
      if (url.includes("/summary") && init?.method === "DELETE") {
        hasPersistedSummary = false;
        return Promise.resolve({ ok: true, json: async () => ({ session: {} }) });
      }
      if (url.includes("/summary") && init?.method === "POST") {
        return Promise.resolve({ ok: true, body: stream });
      }
      if (url.includes("/summary")) {
        return Promise.resolve({ ok: false });
      }
      if (url.includes("/api/cases/")) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            id: "DD-2026-01482",
            generatedSummary: hasPersistedSummary
              ? {
                  caseId: "DD-2026-01482",
                  executiveSummary: "First summary.",
                  contributingSignals: [],
                  gapsOrConflicts: [],
                  suggestedNextAction: "Review",
                  generatedAt: "2026-06-20T12:00:00.000Z",
                  modelVersion: "summary-model-1.4.0",
                }
              : null,
          }),
        });
      }
      return Promise.resolve({ ok: false });
    });

    vi.stubGlobal("fetch", fetchMock);

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <CaseSummaryPanel caseId="DD-2026-01482" />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText("First summary.")).toBeInTheDocument();
    });

    await user.click(screen.getAllByRole("button", { name: "Clear" })[0]);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Generate summary" })).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "Generate summary" }));

    await waitFor(() => {
      expect(screen.getByText("Second summary.")).toBeInTheDocument();
    });

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/summary"),
      expect.objectContaining({ method: "DELETE" }),
    );

    vi.unstubAllGlobals();
  });
});
