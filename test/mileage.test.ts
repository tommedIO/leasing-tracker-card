import { describe, expect, it } from "vitest";
import { calculateExtraMileageCost, calculateTargetKilometers } from "../src/mileage";

describe("calculateTargetKilometers", () => {
  it("calculates the linear target for the middle of a lease", () => {
    const start = Date.parse("2025-01-01T00:00:00Z");
    const end = Date.parse("2026-01-01T00:00:00Z");
    const now = Date.parse("2025-07-02T00:00:00Z");
    expect(calculateTargetKilometers(now, "2025-01-01", "2026-01-01", 12000, "UTC")).toBe(5984);
    expect(end).toBeGreaterThan(start);
  });

  it("returns null when the date range is invalid", () => {
    expect(calculateTargetKilometers(Date.now(), "2026-01-01", "2025-01-01", 12000, "UTC")).toBeNull();
  });

  it("calculates extra mileage cost in euros and never charges under target", () => {
    expect(calculateExtraMileageCost(12500, 12000, 15)).toBe(75);
    expect(calculateExtraMileageCost(12000, 12500, 15)).toBe(0);
  });
});
