import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueuePagination } from "@/components/decision-queue/queue-pagination";

describe("QueuePagination", () => {
  it("calls onPageChange when next is clicked", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(
      <QueuePagination
        page={1}
        pageSize={10}
        totalItems={22}
        onPageChange={onPageChange}
        onPageSizeChange={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Next page" }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("clamps page when total pages shrink", () => {
    render(
      <QueuePagination
        page={5}
        pageSize={10}
        totalItems={14}
        onPageChange={vi.fn()}
        onPageSizeChange={vi.fn()}
      />,
    );

    expect(screen.getByText("Page 2 / 2")).toBeInTheDocument();
    expect(screen.getByText("Showing 11–14 of 14")).toBeInTheDocument();
  });
});
