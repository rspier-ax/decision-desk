import { parseDemoSessionState } from "@/schemas/demo.schema";
import type { DemoSessionState } from "@/mocks/demo/types";
import { DEMO_STORAGE_KEY } from "@/mocks/demo/types";

export function readDemoSessionFromStorage(): DemoSessionState | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(DEMO_STORAGE_KEY);
    if (!raw) return null;
    const parsed = parseDemoSessionState(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export function writeDemoSessionToStorage(session: DemoSessionState): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(session));
}

export function clearDemoSessionStorage(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(DEMO_STORAGE_KEY);
}
