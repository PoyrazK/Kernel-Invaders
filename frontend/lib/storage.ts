import type { ValuationResult } from "@/lib/types";

export const HISTORY_KEY = "valuationHistory";
export const COMPARE_KEY = "compareSelection";

export type SavedValuationResult = Omit<ValuationResult, "timestamp"> & {
  id: string;
  timestamp: string; // ISO
};

function safeParseJSON<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function makeId(): string {
  // browser only
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cryptoAny = globalThis.crypto as any;
  if (cryptoAny?.randomUUID) return cryptoAny.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function loadHistory(): SavedValuationResult[] {
  if (typeof window === "undefined") return [];
  return safeParseJSON<SavedValuationResult[]>(localStorage.getItem(HISTORY_KEY), []);
}

export function saveHistory(items: SavedValuationResult[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(HISTORY_KEY, JSON.stringify(items));
}

export function addToHistory(result: ValuationResult, maxItems = 30): SavedValuationResult {
  const saved: SavedValuationResult = {
    ...result,
    id: makeId(),
    timestamp: (result.timestamp instanceof Date ? result.timestamp : new Date()).toISOString(),
  };

  const existing = loadHistory();
  const next = [saved, ...existing].slice(0, maxItems);
  saveHistory(next);
  return saved;
}

export function removeFromHistory(id: string) {
  const existing = loadHistory();
  saveHistory(existing.filter((x) => x.id !== id));
}

export function clearHistory() {
  saveHistory([]);
}

export function loadCompareSelection(): string[] {
  if (typeof window === "undefined") return [];
  return safeParseJSON<string[]>(localStorage.getItem(COMPARE_KEY), []);
}

export function saveCompareSelection(ids: string[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(COMPARE_KEY, JSON.stringify(ids));
}
