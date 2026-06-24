import { describe, expect, it, beforeEach, vi } from "vitest";
import { readDemoSessionFromStorage, writeDemoSessionToStorage, clearDemoSessionStorage } from "@/lib/demo-storage";
import { createScenarioSession } from "@/mocks/demo/scenarios";
import { parseDemoSessionState } from "@/schemas/demo.schema";

describe("demo storage", () => {
  beforeEach(() => {
    clearDemoSessionStorage();
  });

  it("round-trips a valid session", () => {
    const session = createScenarioSession("standard");
    writeDemoSessionToStorage(session);
    const loaded = readDemoSessionFromStorage();
    expect(loaded?.scenario).toBe("standard");
    expect(loaded?.cases.length).toBe(session.cases.length);
  });

  it("returns null for invalid stored payload", () => {
    vi.stubGlobal("localStorage", {
      getItem: () => JSON.stringify({ version: 99 }),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    });
    expect(readDemoSessionFromStorage()).toBeNull();
    vi.unstubAllGlobals();
  });

  it("rejects malformed session via zod", () => {
    const parsed = parseDemoSessionState({ version: 1, scenario: "invalid" });
    expect(parsed.success).toBe(false);
  });
});
