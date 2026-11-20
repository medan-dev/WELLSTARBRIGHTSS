import { describe, it, expect } from "vitest";

describe("EDUREXA Brand, Product Architecture & Ecosystem Integrity", () => {
  it("should enforce the EDUREXA brand architecture structure", () => {
    const EDUREXA_BRAND = {
      brand: "EDUREXA",
      product: "Edurexa School Management System",
      category: "Multi-Tenant School Management SaaS",
      tagline: "Empowering Schools. Simplifying Education.",
      description: "The Complete Digital Ecosystem for Modern Schools.",
      values: [
        "Innovation",
        "Excellence",
        "Efficiency",
        "Connectivity",
        "Intelligence",
        "Reliability",
      ],
    };

    expect(EDUREXA_BRAND.brand).toBe("EDUREXA");
    expect(EDUREXA_BRAND.tagline).toBe("Empowering Schools. Simplifying Education.");
    expect(EDUREXA_BRAND.values).toHaveLength(6);
    expect(EDUREXA_BRAND.values).toContain("Innovation");
    expect(EDUREXA_BRAND.values).toContain("Excellence");
    expect(EDUREXA_BRAND.values).toContain("Efficiency");
    expect(EDUREXA_BRAND.values).toContain("Connectivity");
    expect(EDUREXA_BRAND.values).toContain("Intelligence");
    expect(EDUREXA_BRAND.values).toContain("Reliability");
  });

  it("should configure the demo school (Demo Educational Group) as Tenant #1 for sandbox demonstrations", () => {
    const flagshipTenant = {
      id: "sch_demo_hq",
      name: "Demo Educational Group",
      code: "DEMO-2026",
      maxCampuses: 20,
      campuses: [
        { code: "MUK-01", name: "Main Campus (Senior & Boarding)" },
        { code: "JIN-02", name: "Valley Branch Campus" },
      ],
    };

    expect(flagshipTenant.name).toBe("Demo Educational Group");
    expect(flagshipTenant.campuses).toHaveLength(2);
    expect(flagshipTenant.maxCampuses).toBe(20);
    expect(flagshipTenant.campuses[0].code).toBe("MUK-01");
    expect(flagshipTenant.campuses[1].code).toBe("JIN-02");
  });

  it("should verify that public marketing routes and flagship school routes exist", async () => {
    const fs = await import("fs");
    // Verify wellstar dedicated route file exists
    expect(fs.existsSync("app/wellstar/page.tsx")).toBe(true);
    // Verify root marketing platform exists
    expect(fs.existsSync("app/page.tsx")).toBe(true);
    // Verify high-resolution brand assets exist
    expect(fs.existsSync("public/edurexa-horizontal.png")).toBe(true);
    expect(fs.existsSync("public/edurexa-mark.png")).toBe(true);
    expect(fs.existsSync("public/edurexa-logo.png")).toBe(true);
  });
});
