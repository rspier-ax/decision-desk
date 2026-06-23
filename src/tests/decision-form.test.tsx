import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DecisionForm } from "@/features/decisions/components/decision-form";

function renderWithClient(ui: React.ReactElement) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>{ui}</QueryClientProvider>,
  );
}

describe("DecisionForm", () => {
  it("shows validation error for missing justification", async () => {
    const user = userEvent.setup();
    renderWithClient(<DecisionForm caseId="DD-2026-01482" />);

    await user.click(screen.getByRole("button", { name: "Submit decision" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /at least 10 characters/i,
    );
  });
});
