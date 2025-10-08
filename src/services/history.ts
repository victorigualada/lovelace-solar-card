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

