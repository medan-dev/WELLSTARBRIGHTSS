import { describe, it, expect } from "vitest";
import {
  sanitizeMealCard,
  sanitizeText,
  sanitizeFileName,
  sanitizeNumber,
  sanitizePhoneNumber,
  sanitizeObject,
  escapeHtml,
} from "@/lib/sanitization";

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

  describe("System Security & Input Sanitization Invariants", () => {
    it("should strip malicious script tags, event handlers and dangerous HTML", () => {
      const malicious = "<script>alert('xss')</script><b>Hello</b> <img src=x onerror=alert(1)>";
      const cleaned = sanitizeText(malicious);
      expect(cleaned).toBe("Hello");
      expect(cleaned).not.toContain("<script>");
      expect(cleaned).not.toContain("onerror");
    });

    it("should neutralize directory traversal attacks in filenames", () => {
      expect(sanitizeFileName("../../../etc/passwd")).toBe("etc_passwd");
      expect(sanitizeFileName("..\\..\\windows\\system32")).toBe("windows_system32");
      expect(sanitizeFileName("valid_school_logo.png")).toBe("valid_school_logo.png");
    });

    it("should securely parse numbers and protect against prototype pollution in objects", () => {
      expect(sanitizeNumber("1,450,000")).toBe(1450000);
      expect(sanitizeNumber("invalid", 0, 100, 40)).toBe(40);

      const maliciousPayload = JSON.parse('{"__proto__": {"polluted": true}, "name": "<script>test</script>School"}');
      const sanitizedObj = sanitizeObject(maliciousPayload);
      expect((sanitizedObj as any).polluted).toBeUndefined();
      expect(sanitizedObj.name).toBe("School");
    });

    it("should escape special characters into safe HTML entities", () => {
      const dangerous = `<div class="test" data-id='1'>& "quote"</div>`;
      const escaped = escapeHtml(dangerous);
      expect(escaped).toContain("&lt;div");
      expect(escaped).toContain("&amp;");
      expect(escaped).toContain("&quot;quote&quot;");
    });
  });
});
