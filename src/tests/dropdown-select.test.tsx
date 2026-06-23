import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DropdownSelect } from "@/components/ui/dropdown-select";

describe("DropdownSelect", () => {
  const options = [
    { value: "", label: "All assignees" },
    { value: "a", label: "Analyst A" },
    { value: "b", label: "Analyst B" },
  ];

  it("opens menu and selects an option", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <DropdownSelect
        compact
        value=""
        onChange={onChange}
        options={options}
        aria-label="Assignee"
      />,
    );

    await user.click(screen.getByRole("button", { name: "Assignee" }));
    await user.click(screen.getByRole("option", { name: "Analyst A" }));

    expect(onChange).toHaveBeenCalledWith("a");
  });
});
