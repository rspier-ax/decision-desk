import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DemoControls } from "@/components/demo/demo-controls";
import { DemoProvider } from "@/features/demo/demo-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("@/lib/demo-api", () => ({
  fetchDemoSession: vi.fn(),
  hydrateDemoSession: vi.fn(),
  loadDemoScenario: vi.fn(),
  resetDemoData: vi.fn(),
  addIncomingDemoCases: vi.fn(),
  updateDemoSim: vi.fn(),
  defaultDemoSession: vi.fn(() => ({
    version: 1,
    scenario: "standard",
    cases: [],
    generatedSummaries: {},
    incomingBatchIndex: 0,
    sim: { apiLatency: "normal", summaryService: "available", partialDataFailure: false },
  })),
}));

import {
  addIncomingDemoCases,
  defaultDemoSession,
  hydrateDemoSession,
  resetDemoData,
} from "@/lib/demo-api";

function renderControls() {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <DemoProvider>
        <DemoControls />
      </DemoProvider>
    </QueryClientProvider>,
  );
}

describe("DemoControls", () => {
  it("requires confirmation before reset", async () => {
    const user = userEvent.setup();
    vi.mocked(hydrateDemoSession).mockResolvedValue(defaultDemoSession());
    vi.mocked(addIncomingDemoCases).mockResolvedValue({ session: defaultDemoSession(), addedCount: 4 });

    renderControls();
    await screen.findByRole("button", { name: "Configure demo data and service behavior" });

    await user.click(screen.getByRole("button", { name: "Configure demo data and service behavior" }));
    await user.click(screen.getByRole("button", { name: "Reset demo data" }));
    expect(screen.getByText(/Restore the active scenario/i)).toBeInTheDocument();
    expect(vi.mocked(resetDemoData)).not.toHaveBeenCalled();
  });
});
