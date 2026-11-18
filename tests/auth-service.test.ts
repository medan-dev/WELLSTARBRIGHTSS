import { describe, it, expect } from "vitest";
import {
  signSessionToken,
  verifySessionToken,
  verifyPassword,
  hashPassword,
  SessionUser,
} from "@/lib/auth-service";

describe("Cryptographic Authentication & Session Engine", () => {
  const mockUser: SessionUser = {
    id: "usr-bursar-test-01",
    name: "CPA Sarah Namubiru",
    email: "bursar@wellstarbright.sc.ug",
    role: "BURSAR",
    title: "Chief Bursar",
    permissions: ["POST_JOURNALS", "RECONCILE_BANK", "RUN_PAYROLL"],
    workstationId: "WS-BURSAR-01",
  };

  describe("JWT Signing and Verification", () => {
    it("should generate a valid JWT token that successfully decodes with identical claims", async () => {
      const token = await signSessionToken(mockUser);
      expect(typeof token).toBe("string");
      expect(token.split(".").length).toBe(3); // Header.Payload.Signature

      const decoded = await verifySessionToken(token);
      expect(decoded).not.toBeNull();
      expect(decoded?.id).toBe(mockUser.id);
      expect(decoded?.email).toBe(mockUser.email);
      expect(decoded?.role).toBe("BURSAR");
      expect(decoded?.permissions).toEqual(mockUser.permissions);
    });

    it("should reject tampered or corrupted JWT tokens", async () => {
      const token = await signSessionToken(mockUser);
      const tamperedToken = token.slice(0, -6) + "XXXXXX";

      const result = await verifySessionToken(tamperedToken);
      expect(result).toBeNull();
    });

    it("should reject malformed non-JWT strings safely", async () => {
      expect(await verifySessionToken("")).toBeNull();
      expect(await verifySessionToken("random-string-not-a-token")).toBeNull();
    });
  });

  describe("Password Hashing & Verification (Bcrypt + Seed Compatibility)", () => {
    it("should hash a plaintext password and verify it successfully with bcrypt", async () => {
      const plain = "StrongSchoolPass2026!";
      const hash = await hashPassword(plain);

      expect(hash).toMatch(/^\$2[aby]\$\d+\$/);
      expect(hash).not.toBe(plain);

      const isValid = await verifyPassword(plain, hash);
      expect(isValid).toBe(true);

      const isInvalid = await verifyPassword("WrongPassword123", hash);
      expect(isInvalid).toBe(false);
    });

    it("should support existing seed credentials during rolling migrations", async () => {
      expect(await verifyPassword("password123", "password123")).toBe(true);
      expect(await verifyPassword("demo1234", "demo1234")).toBe(true);
      expect(await verifyPassword("wrong", "password123")).toBe(false);
    });

    it("should reject empty or missing password attempts", async () => {
      expect(await verifyPassword("", "password123")).toBe(false);
      expect(await verifyPassword("password123", "")).toBe(false);
    });
  });
});
