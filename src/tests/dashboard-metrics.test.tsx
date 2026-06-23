import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DashboardMetrics } from "@/components/risk-summary/dashboard-metrics";

function renderWithClient() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <DashboardMetrics />
    </QueryClientProvider>,
  );
}

describe("DashboardMetrics", () => {
  it("renders KPI labels", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          pendingCases: 7,
          highRiskCases: 4,
          avgReviewTimeMinutes: 47,
          manualReviewRate: 58.3,
        }),
      }),
    );

    renderWithClient();

    expect(await screen.findByText("7")).toBeInTheDocument();
    expect(screen.getByText("Manual review rate")).toBeInTheDocument();
    expect(screen.getByText("58.3%")).toBeInTheDocument();

    vi.unstubAllGlobals();
  });
});
