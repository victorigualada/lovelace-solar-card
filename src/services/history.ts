import type { Hass } from '../types/ha';
import type { HistoryPeriodResponse } from '../types/stats';

// Returns today's delta for a cumulative sensor (00:00 → now)
export async function getTodayDelta(hass: Hass, entityId: string): Promise<number> {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startIso = start.toISOString();
  const endIso = now.toISOString();
  const path = `history/period/${startIso}?filter_entity_id=${encodeURIComponent(entityId)}&end_time=${endIso}&minimal_response`;
  const resp = await hass.callApi<HistoryPeriodResponse>('GET', path);
  if (!Array.isArray(resp) || !Array.isArray(resp[0]) || !resp[0].length) return 0;
  const series = resp[0];
  const nums = series
    .map((pt) => {
      const v = Number(pt.state);
      return Number.isFinite(v) ? v : null;
    })
    .filter((v) => v !== null) as number[];
  if (!nums.length) return 0;
  const first = nums[0];
  const last = nums[nums.length - 1];
  const delta = last - first;
  return delta > 0 ? delta : 0;
}

const DEBOUNCE_MS = 30_000; // 30 seconds

type CacheEntry = {
  dateKey: string;
  inflight: boolean;
  value: number | null;
  lastState: string | null;
  timerId?: number | null;
};
const todayCache: Record<string, CacheEntry> = {};

function dateKeyToday(): string {
  return new Date().toDateString();
}

function getCurrentState(hass: Hass, entityId: string): string | null {
  return hass?.states?.[entityId]?.state ?? null;
}

function clearTimer(entry?: CacheEntry) {
  if (entry?.timerId) {
    clearTimeout(entry.timerId);
    entry.timerId = null;
  }
}

function resetIfNewDay(entityId: string, entry: CacheEntry | undefined, dateKey: string) {
  if (entry && entry.dateKey !== dateKey) {
    clearTimer(entry);
    delete todayCache[entityId];
    return undefined;
  }
  return entry;
}

function scheduleDebouncedRefresh(
  hass: Hass,
  entityId: string,
  dateKey: string,
  currentState: string | null,
  onUpdated?: () => void,
) {
  const existing = todayCache[entityId];
  clearTimer(existing);
  const timerId = (setTimeout(() => {
    const active = todayCache[entityId];
    todayCache[entityId] = { ...(active || { dateKey }), inflight: true, timerId: null } as CacheEntry;
    getTodayDelta(hass, entityId)
      .then((num) => {
        todayCache[entityId] = {
          dateKey,
          inflight: false,
          value: num,
          lastState: currentState,
          timerId: null,
        };
        onUpdated?.();
      })
      .catch(() => {
        todayCache[entityId] = {
          dateKey,
          inflight: false,
          value: active?.value ?? null,
          lastState: currentState,
          timerId: null,
        };
        onUpdated?.();
      });
  }, DEBOUNCE_MS) as unknown) as number;
  todayCache[entityId] = {
    ...(existing || { dateKey, inflight: false, value: null, lastState: currentState }),
    dateKey,
    lastState: currentState,
    timerId,
  } as CacheEntry;
}

function fetchImmediate(
  hass: Hass,
  entityId: string,
  dateKey: string,
  currentState: string | null,
  seedValue: number | null,
  onUpdated?: () => void,
) {
  todayCache[entityId] = {
    dateKey,
    inflight: true,
    value: seedValue,
    lastState: currentState,
    timerId: null,
  };
  getTodayDelta(hass, entityId)
    .then((num) => {
      todayCache[entityId] = { dateKey, inflight: false, value: num, lastState: currentState, timerId: null };
      onUpdated?.();
    })
    .catch(() => {
      todayCache[entityId] = { dateKey, inflight: false, value: null, lastState: currentState, timerId: null };
      onUpdated?.();
    });
}

export function ensureTodayDelta(hass: Hass, entityId: string, onUpdated?: () => void): number | null {
  if (!entityId) return null;
  const dateKey = dateKeyToday();
  const currentState = getCurrentState(hass, entityId);
  const prevEntry = todayCache[entityId];
  const rolledOver = !!(prevEntry && prevEntry.dateKey !== dateKey);
  let entry = resetIfNewDay(entityId, prevEntry, dateKey);

  // If we already have today's computed value, return it immediately
  if (entry && entry.dateKey === dateKey && entry.value != null) {
    if (entry.lastState !== currentState && !entry.inflight) {
      // Debounce background refresh on state change
      scheduleDebouncedRefresh(hass, entityId, dateKey, currentState, onUpdated);
    }
    return entry.value;
  }

  // If a fetch is already in-flight for today, return best-known value (or null)
  if (entry && entry.inflight && entry.dateKey === dateKey) return entry.value ?? null;

  // Kick off an immediate refresh for first load of the day
  // If we just rolled over to a new day, seed with 0 so UI shows 0 instead of empty
  const sameDayCached = rolledOver ? 0 : entry && entry.dateKey === dateKey ? entry.value : null;
  fetchImmediate(hass, entityId, dateKey, currentState, sameDayCached, onUpdated);
  return sameDayCached ?? null;
}
