export type WeeklyStats = {
  co2SavedKg: number;
  wasteAvoidedKg: number;
  energySavedKwh: number;
};

// Lightweight derived metrics from points — purely illustrative.
export function getWeeklyStats(points: number): WeeklyStats {
  const p = Math.max(0, points);
  return {
    co2SavedKg: +(p * 0.0035).toFixed(1), // ~8.6 kg @ 2450 pts
    wasteAvoidedKg: +(p * 0.00085).toFixed(1), // ~2.1 kg @ 2450 pts
    energySavedKwh: +(p * 0.005).toFixed(1), // ~12.3 kWh @ 2450 pts
  };
}

export function formatNumber(n: number) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 1 }).format(n);
}

