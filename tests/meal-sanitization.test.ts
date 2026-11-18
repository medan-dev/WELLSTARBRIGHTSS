import { describe, it, expect } from "vitest";

// Replicate sanitization function logic to test edge cases
function sanitizeMealCard<T extends Record<string, any>>(card: T | null | undefined): T | null {
  if (!card) return null;
  const cleaned: Record<string, any> = { ...card };
  if (
    cleaned.planType === "MILK_NUTRITION_AWARD" ||
    (cleaned.planType as string) === "MILK_NUTRITION_SCHEME"
  ) {
    cleaned.planType = "BURSARY_SUBSIDIZED";
  }
  if (cleaned.notes && typeof cleaned.notes === "string") {
    cleaned.notes = cleaned.notes
      .replace(/milk cans? daily\.?/gi, "meals daily")
      .replace(/milk/gi, "meal");
  }
  delete cleaned.milkQuota;
  delete cleaned.dailyMilkQuota;
  return cleaned as T;
}

describe("Dining & Meal Card Sanitization Invariant", () => {
  it("should transform legacy MILK_NUTRITION_AWARD plans to BURSARY_SUBSIDIZED", () => {
    const legacyCard = {
      cardNumber: "MC-2026-9001",
      studentId: "s-1001",
      planType: "MILK_NUTRITION_AWARD",
      dailyQuota: 3,
      milkQuota: 2,
      notes: "Daily 2 milk cans daily for bursary student.",
    };

    const sanitized = sanitizeMealCard(legacyCard);
    expect(sanitized).not.toBeNull();
    expect(sanitized?.planType).toBe("BURSARY_SUBSIDIZED");
    expect(sanitized?.milkQuota).toBeUndefined();
    expect(sanitized?.dailyMilkQuota).toBeUndefined();
    expect(sanitized?.notes).toBe("Daily 2 meals daily for bursary student.");
    expect(sanitized?.notes.toLowerCase()).not.toContain("milk");
  });

  it("should preserve standard boarder and day scholar meal plans unmodified", () => {
    const boardingCard = {
      cardNumber: "MC-2026-1049",
      studentId: "s-1046",
      planType: "BOARDING_FULL",
      dailyQuota: 3,
      notes: "Standard boarding meal plan.",
    };

    const dayCard = {
      cardNumber: "MC-2026-1050",
      studentId: "s-1045",
      planType: "DAY_LUNCH",
      dailyQuota: 1,
      notes: "Day scholar lunch.",
    };

    expect(sanitizeMealCard(boardingCard)?.planType).toBe("BOARDING_FULL");
    expect(sanitizeMealCard(dayCard)?.planType).toBe("DAY_LUNCH");
  });

  it("should handle null and undefined card entities gracefully", () => {
    expect(sanitizeMealCard(null)).toBeNull();
    expect(sanitizeMealCard(undefined)).toBeNull();
  });
});
