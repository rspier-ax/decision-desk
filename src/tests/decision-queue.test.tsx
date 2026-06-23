import { describe, expect, it } from "vitest";
import { listCasesFromStore } from "@/mocks/store";
import { pageCount, paginate } from "@/lib/paginate";

describe("decision queue filters", () => {
  it("returns empty when search does not match", () => {
    const results = listCasesFromStore({ search: "ZZZ-NO-MATCH" });
    expect(results).toHaveLength(0);
  });

  it("filters by risk level", () => {
    const results = listCasesFromStore({ riskLevel: ["critical"] });
    expect(results.every((c) => c.riskLevel === "critical")).toBe(true);
  });
});

describe("decision queue pagination", () => {
  const items = Array.from({ length: 30 }, (_, i) => `item-${i + 1}`);

  it("slices items for the current page", () => {
    expect(paginate(items, 1, 25)).toHaveLength(25);
    expect(paginate(items, 1, 25)[0]).toBe("item-1");
    expect(paginate(items, 2, 25)).toEqual(["item-26", "item-27", "item-28", "item-29", "item-30"]);
  });

  it("computes page count", () => {
    expect(pageCount(30, 25)).toBe(2);
    expect(pageCount(0, 25)).toBe(1);
  });
});
