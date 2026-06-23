import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { AppShell } from "@/components/app-shell";

describe("AppShell", () => {
  it("renders demo environment label and main content", () => {
    render(
      <AppShell>
        <p>Dashboard content</p>
      </AppShell>,
    );

    expect(screen.getByText("Demo environment")).toBeInTheDocument();
    expect(screen.getByText("Dashboard content")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "DecisionDesk" })).toBeInTheDocument();

    const main = screen.getByRole("main");
    expect(main.className).not.toMatch(/max-w-/);
    expect(main.className).not.toContain("mx-auto");
    expect(main.className).toContain("px-8");
  });
});
