import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import RootLayout from "@/app/layout";
import { UnsupportedViewport } from "@/components/unsupported-viewport";

describe("UnsupportedViewport", () => {
  it("renders the minimum width message", () => {
    render(<UnsupportedViewport />);

    expect(screen.getByRole("heading", { name: "Larger screen required" })).toBeInTheDocument();
    expect(screen.getByText("Minimum supported width: 768px")).toBeInTheDocument();
  });
});

describe("RootLayout viewport boundary", () => {
  it("applies CSS-only visibility classes at 768px", () => {
    const html = renderToStaticMarkup(
      <RootLayout>
        <div>App content</div>
      </RootLayout>,
    );

    expect(html).toContain("min-[768px]:hidden");
    expect(html).toContain("hidden min-h-dvh min-[768px]:flex");
    expect(html).toContain("Larger screen required");
  });
});
