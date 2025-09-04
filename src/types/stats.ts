export interface StatisticsPoint {
  start: string;
  sum?: number | null;
}

export type StatisticsDuringPeriod = Record<string, StatisticsPoint[]>;

export interface HistoryStateItem {
  state: string;
  last_changed: string;
}

export type HistoryPeriodResponse = HistoryStateItem[][];

