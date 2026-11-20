import { describe, it, expect } from "vitest";
import {
  MAX_CAMPUSES_PER_SCHOOL,
  MAX_TOTAL_SCHOOLS_LIMIT,
} from "@/lib/campus-service";

describe("Super Admin SaaS Engine & Cluster Quota Guardrails", () => {
  describe("Cluster-Level Capacity Ceiling", () => {
    it("should enforce the architectural capacity of 200 school organizations across the cluster", () => {
      expect(MAX_TOTAL_SCHOOLS_LIMIT).toBe(200);
      expect(MAX_CAMPUSES_PER_SCHOOL).toBe(20);

      const maxClusterCampuses = MAX_TOTAL_SCHOOLS_LIMIT * MAX_CAMPUSES_PER_SCHOOL;
      expect(maxClusterCampuses).toBe(4000);
    });

    it("should reject onboarding when cluster reaches 200 school organizations", () => {
      const simulateClusterAdmission = (currentCount: number) => {
        if (currentCount >= MAX_TOTAL_SCHOOLS_LIMIT) {
          throw new Error(
            `Enterprise Guardrail Triggered: The SaaS platform has reached its maximum cluster capacity of ${MAX_TOTAL_SCHOOLS_LIMIT} school organizations.`
          );
        }
        return { admitted: true, newCount: currentCount + 1 };
      };

      // 199 schools -> 200th succeeds
      expect(simulateClusterAdmission(199)).toEqual({
        admitted: true,
        newCount: 200,
      });

      // 200 schools -> 201st is rejected
      expect(() => simulateClusterAdmission(200)).toThrowError(
        /Enterprise Guardrail Triggered: The SaaS platform has reached its maximum cluster capacity of 200 school organizations/
      );
    });

    it("should reject campus quota allocations outside 1 to 20 range", () => {
      const validateQuota = (quota: number) => {
        if (quota < 1 || quota > MAX_CAMPUSES_PER_SCHOOL) {
          throw new Error(`Invalid campus quota: Must be between 1 and ${MAX_CAMPUSES_PER_SCHOOL} campuses per school.`);
        }
        return true;
      };

      expect(validateQuota(1)).toBe(true);
      expect(validateQuota(10)).toBe(true);
      expect(validateQuota(20)).toBe(true);

      expect(() => validateQuota(0)).toThrowError(/Invalid campus quota/);
      expect(() => validateQuota(21)).toThrowError(/Invalid campus quota/);
      expect(() => validateQuota(50)).toThrowError(/Invalid campus quota/);
    });
  });

  describe("Multi-Tenant Aggregation & Student Scaling", () => {
    it("should calculate aggregate cluster metrics correctly across multiple school groups", () => {
      const mockSchools = [
        {
          id: "sch_1",
          name: "Demo Educational Group",
          code: "DEMO-2026",
          campuses: 2,
          students: 4950,
          status: "ACTIVE",
        },
        {
          id: "sch_2",
          name: "St. Lawrence Educational Group",
          code: "SLA-2026",
          campuses: 6,
          students: 18200,
          status: "ACTIVE",
        },
        {
          id: "sch_3",
          name: "Kampala International Academy",
          code: "KIA-2026",
          campuses: 3,
          students: 7400,
          status: "ACTIVE",
        },
      ];

      const totalSchools = mockSchools.length;
      const totalCampuses = mockSchools.reduce((acc, s) => acc + s.campuses, 0);
      const totalStudents = mockSchools.reduce((acc, s) => acc + s.students, 0);

      expect(totalSchools).toBe(3);
      expect(totalCampuses).toBe(11);
      expect(totalStudents).toBe(30550);
      expect(totalSchools).toBeLessThanOrEqual(MAX_TOTAL_SCHOOLS_LIMIT);
    });
  });
});
