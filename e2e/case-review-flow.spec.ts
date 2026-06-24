import { test, expect } from "@playwright/test";

test("analyst reviews case and records approval", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Review dashboard" })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Configure demo data and service behavior" }),
  ).toBeVisible();

  await page.getByRole("searchbox").fill("DD-2026-01482");
  await page.getByRole("link", { name: "Open case DD-2026-01482" }).click();
  await expect(page.getByRole("heading", { name: "DD-2026-01482" })).toBeVisible();

  await page.getByRole("button", { name: "Generate summary" }).click();
  await expect(page.getByText("Executive summary")).toBeVisible({ timeout: 10_000 });

  await page.locator("#action").click();
  await page.getByRole("option", { name: "Approve" }).click();
  await page.locator("#justification").fill(
    "Identity signals reviewed; employment verified via payroll provider match.",
  );
  await page.getByRole("button", { name: "Submit decision" }).click();
  await page.getByRole("button", { name: "Confirm" }).click();

  await expect(
    page.getByLabel("Audit history").getByText("Approved", { exact: true }),
  ).toBeVisible({ timeout: 10_000 });
  await expect(
    page.getByLabel("Audit history").getByText(/Identity signals reviewed/),
  ).toBeVisible();
});
