"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  addIncomingDemoCases,
  defaultDemoSession,
  fetchDemoSession,
  hydrateDemoSession,
  loadDemoScenario,
  resetDemoData,
  updateDemoSim,
} from "@/lib/demo-api";
import { readDemoSessionFromStorage, writeDemoSessionToStorage } from "@/lib/demo-storage";
import type { DemoScenario, DemoSessionState, DemoSimSettings } from "@/mocks/demo/types";
import { LoadingState } from "@/components/ui/state-messages";

type DemoContextValue = {
  ready: boolean;
  session: DemoSessionState | null;
  feedback: string | null;
  clearFeedback: () => void;
  persistSession: () => Promise<void>;
  loadScenario: (scenario: DemoScenario) => Promise<void>;
  resetDemo: () => Promise<void>;
  addIncoming: () => Promise<number>;
  setSim: (sim: Partial<DemoSimSettings>) => Promise<void>;
};

const DemoContext = createContext<DemoContextValue | null>(null);

import { queryKeys } from "@/lib/query-keys";

async function invalidateDemoQueries(queryClient: ReturnType<typeof useQueryClient>) {
  await Promise.all([
    queryClient.refetchQueries({ queryKey: queryKeys.cases() }),
    queryClient.refetchQueries({ queryKey: queryKeys.metrics() }),
    queryClient.refetchQueries({ queryKey: ["case"] }),
  ]);
}

export function DemoProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<DemoSessionState | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function boot() {
      try {
        const stored = readDemoSessionFromStorage();
        const hydrated = stored
          ? await hydrateDemoSession(stored)
          : await hydrateDemoSession(defaultDemoSession());
        if (cancelled) return;
        setSession(hydrated);
        writeDemoSessionToStorage(hydrated);
      } catch {
        if (cancelled) return;
        const fallback = await hydrateDemoSession(defaultDemoSession());
        setSession(fallback);
        writeDemoSessionToStorage(fallback);
      } finally {
        if (!cancelled) setReady(true);
      }
    }

    void boot();
    return () => {
      cancelled = true;
    };
  }, []);

  const persistSession = useCallback(async () => {
    const next = await fetchDemoSession();
    setSession(next);
    writeDemoSessionToStorage(next);
  }, []);

  const loadScenario = useCallback(
    async (scenario: DemoScenario) => {
      const next = await loadDemoScenario(scenario);
      setSession(next);
      writeDemoSessionToStorage(next);
      await invalidateDemoQueries(queryClient);
      setFeedback(`Loaded ${scenario.replace(/-/g, " ")} scenario.`);
    },
    [queryClient],
  );

  const resetDemo = useCallback(async () => {
    const next = await resetDemoData();
    setSession(next);
    writeDemoSessionToStorage(next);
    invalidateDemoQueries(queryClient);
    setFeedback("Demo data reset to the active scenario baseline.");
  }, [queryClient]);

  const addIncoming = useCallback(async () => {
    const result = await addIncomingDemoCases();
    setSession(result.session);
    writeDemoSessionToStorage(result.session);
    invalidateDemoQueries(queryClient);
    setFeedback(`${result.addedCount} new cases added to the review queue.`);
    return result.addedCount;
  }, [queryClient]);

  const setSim = useCallback(
    async (sim: Partial<DemoSimSettings>) => {
      const next = await updateDemoSim(sim);
      setSession(next);
      writeDemoSessionToStorage(next);
    },
    [],
  );

  const value = useMemo<DemoContextValue>(
    () => ({
      ready,
      session,
      feedback,
      clearFeedback: () => setFeedback(null),
      persistSession,
      loadScenario,
      resetDemo,
      addIncoming,
      setSim,
    }),
    [ready, session, feedback, persistSession, loadScenario, resetDemo, addIncoming, setSim],
  );

  if (!ready) {
    return <LoadingState label="Loading demo session" />;
  }

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const ctx = useContext(DemoContext);
  if (!ctx) {
    throw new Error("useDemo must be used within DemoProvider");
  }
  return ctx;
}

export function useDemoOptional() {
  return useContext(DemoContext);
}
