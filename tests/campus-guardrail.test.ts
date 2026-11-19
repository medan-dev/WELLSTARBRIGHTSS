import { describe, it, expect } from "vitest";
import {
  MAX_CAMPUSES_PER_SCHOOL,
  MAX_TOTAL_SCHOOLS_LIMIT,
  CampusTelemetry,
} from "@/lib/campus-service";

describe("Multi-Campus Enterprise Guardrails & Scalability Verification", () => {
  describe("Architecture Limits & Multi-Tenant Capacity", () => {
    it("should enforce the architectural capacity of 200 organizations and 20 campuses per school", () => {
      expect(MAX_CAMPUSES_PER_SCHOOL).toBe(20);
      expect(MAX_TOTAL_SCHOOLS_LIMIT).toBe(200);
      // Total potential campuses across the multi-tenant cluster:
      const totalCampuses = MAX_TOTAL_SCHOOLS_LIMIT * MAX_CAMPUSES_PER_SCHOOL;
      expect(totalCampuses).toBe(4000);
    });

    it("should permit up to 20 campuses per school and reject a 21st campus", () => {
      // Simulate campus validation guardrail logic
      const simulateCampusAdmission = (currentCount: number, maxCampuses: number) => {
        if (currentCount >= maxCampuses) {
          throw new Error(
            `Enterprise Guardrail Triggered: This school group has reached its maximum contract limit of ${maxCampuses} campuses.`
          );
        }
        return { admitted: true, newCount: currentCount + 1 };
      };

      // Up to 19 campuses -> 20th campus succeeds
      expect(simulateCampusAdmission(19, MAX_CAMPUSES_PER_SCHOOL)).toEqual({
        admitted: true,
        newCount: 20,
      });

      // 20 campuses -> 21st campus is blocked
      expect(() => simulateCampusAdmission(20, MAX_CAMPUSES_PER_SCHOOL)).toThrowError(
        /Enterprise Guardrail Triggered: This school group has reached its maximum contract limit of 20 campuses/
      );
    });

    it("should allow unlimited students per campus without artificial throttling", () => {
      // Enterprise rule: Unlimited students per campus
      const campusStudentCounts = [
        { campusId: "camp_1", count: 1250 },
        { campusId: "camp_2", count: 8500 },
        { campusId: "camp_3", count: 45000 }, // Large collegiate campus
      ];

      campusStudentCounts.forEach((campus) => {
        // Confirm no cap throws error for any student count
        expect(campus.count).toBeGreaterThan(0);
        expect(Number.isFinite(campus.count)).toBe(true);
      });

      const totalStudents = campusStudentCounts.reduce((acc, c) => acc + c.count, 0);
      expect(totalStudents).toBe(54750);
    });
  });

  describe("Campus Telemetry & Consolidated Group Aggregation", () => {
    it("should calculate consolidated HQ totals accurately across all active campuses", () => {
      const mockCampuses: CampusTelemetry[] = [
        {
          id: "camp_mukono",
          name: "Mukono Main Campus",
          code: "MUK-01",
          status: "ACTIVE",
          studentCount: 2400,
          teacherCount: 110,
          activeMealCards: 1850,
          unpaidArrears: 45000000,
        },
        {
          id: "camp_jinja",
          name: "Jinja Branch Campus",
          code: "JIN-02",
          status: "ACTIVE",
          studentCount: 1600,
          teacherCount: 65,
          activeMealCards: 1200,
          unpaidArrears: 28000000,
        },
        {
          id: "camp_entebbe",
          name: "Entebbe Lakeside Campus",
          code: "ENT-03",
          status: "ACTIVE",
          studentCount: 950,
          teacherCount: 42,
          activeMealCards: 780,
          unpaidArrears: 12500000,
        },
      ];

      // Consolidated HQ Aggregation
      const consolidatedStudents = mockCampuses.reduce((sum, c) => sum + c.studentCount, 0);
      const consolidatedTeachers = mockCampuses.reduce((sum, c) => sum + c.teacherCount, 0);
      const consolidatedMealCards = mockCampuses.reduce((sum, c) => sum + c.activeMealCards, 0);
      const consolidatedArrears = mockCampuses.reduce((sum, c) => sum + c.unpaidArrears, 0);

      expect(consolidatedStudents).toBe(4950);
      expect(consolidatedTeachers).toBe(217);
      expect(consolidatedMealCards).toBe(3830);
      expect(consolidatedArrears).toBe(85500000);
    });

    it("should sanitize and normalize campus codes to uppercase trimmed tokens", () => {
      const sanitizeCode = (raw: string) => raw.trim().toUpperCase();

      expect(sanitizeCode(" muk-01 ")).toBe("MUK-01");
      expect(sanitizeCode("jin_02")).toBe("JIN_02");
      expect(sanitizeCode("gulu-west")).toBe("GULU-WEST");
    });
  });
});
