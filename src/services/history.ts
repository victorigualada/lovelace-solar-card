import type { Hass } from '../types/ha';
import type { HistoryPeriodResponse } from '../types/stats';
import { formatNumberLocale } from '../utils/format';

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

type CacheEntry = { dateKey: string; inflight: boolean; value: number | null };
const todayCache: Record<string, CacheEntry> = {};

export function ensureTodayDelta(
  hass: Hass,
  entityId: string,
  onUpdated?: () => void,
): number | null {
  if (!entityId) return null;
  const dateKey = new Date().toDateString();
  const entry = todayCache[entityId];
  if (entry && entry.dateKey === dateKey && entry.value != null) return entry.value;
  if (entry && entry.inflight && entry.dateKey === dateKey) return null;
  todayCache[entityId] = { dateKey, inflight: true, value: entry?.value ?? null };
  getTodayDelta(hass, entityId)
    .then((num) => {
      todayCache[entityId] = { dateKey, inflight: false, value: num };
      onUpdated?.();
    })
    .catch(() => {
      todayCache[entityId] = { dateKey, inflight: false, value: null };
      onUpdated?.();
    });
  return null;
}

