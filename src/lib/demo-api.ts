import type { DemoScenario, DemoSessionState, DemoSimSettings } from "@/mocks/demo/types";
import { createScenarioSession } from "@/mocks/demo/scenarios";

async function parseSessionResponse(res: Response): Promise<DemoSessionState> {
  if (!res.ok) {
    throw new Error("Demo session request failed");
  }
  const body = (await res.json()) as { session: DemoSessionState };
  return body.session;
}

export async function fetchDemoSession(): Promise<DemoSessionState> {
  const res = await fetch("/api/demo/session");
  return parseSessionResponse(res);
}

export async function hydrateDemoSession(session: DemoSessionState): Promise<DemoSessionState> {
  const res = await fetch("/api/demo/session", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session }),
  });
  return parseSessionResponse(res);
}

export async function loadDemoScenario(scenario: DemoScenario): Promise<DemoSessionState> {
  const res = await fetch("/api/demo/load-scenario", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ scenario }),
  });
  return parseSessionResponse(res);
}

export async function resetDemoData(): Promise<DemoSessionState> {
  const res = await fetch("/api/demo/reset", { method: "POST" });
  return parseSessionResponse(res);
}

export async function addIncomingDemoCases(): Promise<{ session: DemoSessionState; addedCount: number }> {
  const res = await fetch("/api/demo/incoming", { method: "POST" });
  if (!res.ok) throw new Error("Failed to add incoming cases");
  return res.json();
}

export async function updateDemoSim(sim: Partial<DemoSimSettings>): Promise<DemoSessionState> {
  const res = await fetch("/api/demo/sim", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sim),
  });
  return parseSessionResponse(res);
}

export function defaultDemoSession(): DemoSessionState {
  return createScenarioSession("standard");
}
