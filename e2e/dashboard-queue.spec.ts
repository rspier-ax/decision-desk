import { test, expect } from "@playwright/test";

test("dashboard metrics and queue filters", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Pending cases")).toBeVisible();
  await page.getByRole("searchbox").fill("Chen");
  await expect(page.getByRole("link", { name: "DD-2026-01482" })).toBeVisible();
  await page.getByRole("searchbox").fill("ZZZ-NO-MATCH");
  await expect(page.getByText("No cases match filters")).toBeVisible();
});
