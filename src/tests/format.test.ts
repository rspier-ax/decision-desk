import { describe, expect, it } from "vitest";
import { formatRelativeSla, isSlaOverdue } from "@/lib/format";

const NOW = new Date("2026-06-20T12:00:00.000Z").getTime();

describe("formatRelativeSla", () => {
  it("shows remaining hours when SLA is in the future", () => {
    const slaDueAt = new Date(NOW + 6 * 60 * 60 * 1000).toISOString();
    expect(formatRelativeSla(slaDueAt, NOW)).toBe("6h remaining");
  });

  it("shows overdue hours when SLA is in the past", () => {
    const slaDueAt = new Date(NOW - 2 * 60 * 60 * 1000).toISOString();
    expect(formatRelativeSla(slaDueAt, NOW)).toBe("2h overdue");
  });

  it("is deterministic when now is injected", () => {
    const slaDueAt = new Date(NOW + 30 * 60 * 60 * 1000).toISOString();
    expect(formatRelativeSla(slaDueAt, NOW)).toBe("1d remaining");
  });
});

describe("isSlaOverdue", () => {
  it("returns true when due date is before now", () => {
    const slaDueAt = new Date(NOW - 1).toISOString();
    expect(isSlaOverdue(slaDueAt, NOW)).toBe(true);
  });

  it("returns false when due date is after now", () => {
    const slaDueAt = new Date(NOW + 1).toISOString();
    expect(isSlaOverdue(slaDueAt, NOW)).toBe(false);
  });
});
