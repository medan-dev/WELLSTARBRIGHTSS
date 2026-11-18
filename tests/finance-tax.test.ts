import { describe, it, expect } from "vitest";
import {
  calculateUgandaPAYE,
  calculateUgandaNSSF,
  calculateUgandaWHT,
} from "@/lib/finance-service";

describe("Uganda Statutory Tax Compliance Engine (URA & NSSF)", () => {
  describe("PAYE (Pay As You Earn) Graduated Tax Brackets", () => {
    it("should exempt gross pay of UGX 235,000 or below (Bracket 1: 0%)", () => {
      expect(calculateUgandaPAYE(0)).toBe(0);
      expect(calculateUgandaPAYE(150000)).toBe(0);
      expect(calculateUgandaPAYE(235000)).toBe(0);
    });

    it("should calculate 10% tax on excess over UGX 235,000 up to 335,000 (Bracket 2)", () => {
      // (300,000 - 235,000) * 0.10 = 6,500
      expect(calculateUgandaPAYE(300000)).toBe(6500);
      // (335,000 - 235,000) * 0.10 = 10,000
      expect(calculateUgandaPAYE(335000)).toBe(10000);
    });

    it("should calculate Bracket 3: 10,000 + 20% on excess over 335,000 up to 410,000", () => {
      // 10,000 + (400,000 - 335,000) * 0.20 = 10,000 + 13,000 = 23,000
      expect(calculateUgandaPAYE(400000)).toBe(23000);
      // 10,000 + (410,000 - 335,000) * 0.20 = 10,000 + 15,000 = 25,000
      expect(calculateUgandaPAYE(410000)).toBe(25000);
    });

    it("should calculate Bracket 4: 25,000 + 30% on excess over 410,000", () => {
      // 25,000 + (1,000,000 - 410,000) * 0.30 = 25,000 + 177,000 = 202,000
      expect(calculateUgandaPAYE(1000000)).toBe(202000);
      // 25,000 + (2,500,000 - 410,000) * 0.30 = 25,000 + 627,000 = 652,000
      expect(calculateUgandaPAYE(2500000)).toBe(652000);
    });

    it("should apply the 10% high-earner surcharge on income exceeding UGX 10,000,000", () => {
      // Base: 25,000 + (12,000,000 - 410,000) * 0.30 = 3,502,000
      // Surcharge: (12,000,000 - 10,000,000) * 0.10 = 200,000
      // Total: 3,702,000
      expect(calculateUgandaPAYE(12000000)).toBe(3702000);
    });
  });

  describe("NSSF (National Social Security Fund) Computation", () => {
    it("should accurately compute 5% employee and 10% employer statutory portions", () => {
      const nssf1M = calculateUgandaNSSF(1000000);
      expect(nssf1M.employee).toBe(50000);
      expect(nssf1M.employer).toBe(100000);
      expect(nssf1M.total).toBe(150000);

      const nssf2M = calculateUgandaNSSF(2400000);
      expect(nssf2M.employee).toBe(120000);
      expect(nssf2M.employer).toBe(240000);
      expect(nssf2M.total).toBe(360000);
    });

    it("should maintain exact 15% combined total statutory remittance", () => {
      const res = calculateUgandaNSSF(3500000);
      expect(res.total).toBe(res.employee + res.employer);
      expect(res.total).toBe(525000);
    });
  });

  describe("Withholding Tax (WHT)", () => {
    it("should exempt supplier invoices under the statutory UGX 1,000,000 threshold", () => {
      expect(calculateUgandaWHT(500000)).toBe(0);
      expect(calculateUgandaWHT(999999)).toBe(0);
    });

    it("should deduct exactly 6% on commercial payments meeting or exceeding threshold", () => {
      expect(calculateUgandaWHT(1000000)).toBe(60000);
      expect(calculateUgandaWHT(5000000)).toBe(300000);
      expect(calculateUgandaWHT(12500000)).toBe(750000);
    });
  });

  describe("Double-Entry General Ledger Balance Invariant", () => {
    function validateDoubleEntry(lines: Array<{ debit?: number; credit?: number }>) {
      const totalDebit = lines.reduce((acc, l) => acc + (l.debit || 0), 0);
      const totalCredit = lines.reduce((acc, l) => acc + (l.credit || 0), 0);
      if (Math.abs(totalDebit - totalCredit) > 0.01) {
        throw new Error(
          `Double-entry mismatch! Total Debits (${totalDebit}) must equal Total Credits (${totalCredit})`
        );
      }
      return true;
    }

    it("should approve balanced journal entries where debits equal credits", () => {
      const balancedLines = [
        { debit: 1500000, credit: 0 },
        { debit: 0, credit: 1500000 },
      ];
      expect(validateDoubleEntry(balancedLines)).toBe(true);

      const complexMultiLeg = [
        { debit: 2000000, credit: 0 },
        { debit: 500000, credit: 0 },
        { debit: 0, credit: 2100000 },
        { debit: 0, credit: 400000 },
      ];
      expect(validateDoubleEntry(complexMultiLeg)).toBe(true);
    });

    it("should reject imbalanced journal entries to safeguard the general ledger", () => {
      const imbalanced = [
        { debit: 1000000, credit: 0 },
        { debit: 0, credit: 950000 },
      ];
      expect(() => validateDoubleEntry(imbalanced)).toThrow(/Double-entry mismatch/);
    });
  });
});
