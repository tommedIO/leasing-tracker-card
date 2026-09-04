export function dateAtHomeAssistantMidnight(date: string, timeZone: string): number {
  const [year, month, day] = date.split("-").map(Number);
  const utcGuess = Date.UTC(year, month - 1, day);
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(utcGuess));
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  const displayedAsUtc = Date.UTC(
    Number(values.year),
    Number(values.month) - 1,
    Number(values.day),
    Number(values.hour),
    Number(values.minute),
    Number(values.second),
  );
  return utcGuess + (utcGuess - displayedAsUtc);
}

export function calculateTargetKilometers(
  now: number,
  startDate: string,
  endDate: string,
  totalKilometers: number,
  timeZone: string,
): number | null {
  const start = dateAtHomeAssistantMidnight(startDate, timeZone);
  const end = dateAtHomeAssistantMidnight(endDate, timeZone);
  const duration = end - start;
  if (!Number.isFinite(totalKilometers) || duration <= 0) {
    return null;
  }

  if (now <= start) {
    return 0;
  }
  if (now >= end) {
    return Math.round(totalKilometers);
  }

  const elapsed = now - start;
  return Math.round((elapsed / duration) * totalKilometers);
}

export function calculateExtraMileageCost(
  currentKilometers: number,
  targetKilometers: number,
  costCentsPerKilometer: number,
): number {
  const extraKilometers = Math.max(0, currentKilometers - targetKilometers);
  return (extraKilometers * costCentsPerKilometer) / 100;
}

export function calculateMileagePercent(kilometers: number, totalKilometers: number): number | null {
  if (!Number.isFinite(kilometers) || !Number.isFinite(totalKilometers) || totalKilometers <= 0) {
    return null;
  }

  return Math.min(100, Math.max(0, (kilometers / totalKilometers) * 100));
}
