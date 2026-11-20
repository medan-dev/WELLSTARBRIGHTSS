import { describe, it, expect, vi } from "vitest";
import fs from "fs";

// Mock next/headers for server actions in test environment
vi.mock("next/headers", () => ({
  cookies: vi.fn(async () => ({
    set: vi.fn(),
    get: vi.fn(),
    delete: vi.fn(),
  })),
}));

import { quickDemoLoginAction } from "@/lib/auth-actions";
import { DOC_CATEGORIES, DOC_ARTICLES } from "@/lib/docs-data";

describe("Enterprise Company Standards & Guardrails", () => {
  it("enforces OpenAI/Linear non-curved CSS baseline in styles.css", () => {
    const css = fs.readFileSync("src/styles.css", "utf8");
    expect(css).toContain("--radius: 0px;");
    expect(css).toContain("--radius-sm: 0px;");
    expect(css).toContain("--radius-md: 0px;");
    expect(css).toContain("--radius-lg: 0px;");
    expect(css).toContain("--radius-xl: 0px;");
    expect(css).toContain("--radius-2xl: 0px;");
    expect(css).toContain("--radius-3xl: 0px;");
  });

  it("enforces canonical EDUREXA company contacts in Navbar and Marketing", () => {
    const navbar = fs.readFileSync("src/components/site/Navbar.tsx", "utf8");
    expect(navbar).toContain("+256 758 611 414");
    expect(navbar).toContain("sales@edurexa.com");

    const marketing = fs.readFileSync("app/page.tsx", "utf8");
    expect(marketing).toContain("+256 758 611 414");
    expect(marketing).not.toContain("+256 701 116 781");
  });

  it("enforces exact 6 header links requested by specification", () => {
    const navbar = fs.readFileSync("src/components/site/Navbar.tsx", "utf8");
    const requiredLinks = [
      '{ href: "/", label: "Home" }',
      '{ href: "/#features", label: "Features" }',
      '{ href: "/#pricing", label: "Pricing" }',
      '{ href: "/demo", label: "Demo" }',
      '{ href: "/documentation", label: "Documentation" }',
      '{ href: "/#support", label: "Help & Support" }',
    ];

    for (const link of requiredLinks) {
      expect(navbar).toContain(link);
    }
  });

  it("strictly bars super-admin from public client demo logins", async () => {
    const res = await quickDemoLoginAction("super-admin" as any);
    expect(res.success).toBe(false);
    expect(res.error).toBe("Unsupported client demo role requested.");
  });

  it("provisions authorized client test roles with redirect URLs", async () => {
    const cashierRes = await quickDemoLoginAction("cashier");
    expect(cashierRes.success).toBe(true);
    expect(cashierRes.redirectUrl).toBe("/admin/dashboard/finance");
    expect(cashierRes.user?.email).toBe("cashier@yourschool.com");

    const adminRes = await quickDemoLoginAction("admin");
    expect(adminRes.success).toBe(true);
    expect(adminRes.redirectUrl).toBe("/admin/dashboard");
    expect(adminRes.user?.email).toBe("admin@yourschool.com");

    const teacherRes = await quickDemoLoginAction("teacher");
    expect(teacherRes.success).toBe(true);
    expect(teacherRes.redirectUrl).toBe("/teacher/dashboard");
    expect(teacherRes.user?.email).toBe("teacher@yourschool.com");

    const studentRes = await quickDemoLoginAction("student");
    expect(studentRes.success).toBe(true);
    expect(studentRes.redirectUrl).toBe("/student/dashboard");
    expect(studentRes.user?.email).toBe("student@yourschool.com");
  });

  it("validates enterprise documentation integrity and mandatory articles", () => {
    expect(DOC_CATEGORIES.length).toBeGreaterThanOrEqual(4);

    const introArticle = DOC_ARTICLES["introduction"];
    expect(introArticle).toBeDefined();
    expect(introArticle.title).toContain("Introduction to EDUREXA");

    const financeArticle = DOC_ARTICLES["finance"];
    expect(financeArticle).toBeDefined();
    expect(financeArticle.title).toContain("Anti-Leakage POS");

    const unebArticle = DOC_ARTICLES["academics"];
    expect(unebArticle).toBeDefined();
    expect(unebArticle.title).toContain("Academic & UNEB");

    const portalsArticle = DOC_ARTICLES["portals"];
    expect(portalsArticle).toBeDefined();
    expect(portalsArticle.title).toContain("Portal Access");
  });

  it("strictly ensures demo and client dashboards contain zero Wellstar references", () => {
    const filesToCheck = [
      "app/demo/page.tsx",
      "app/admin/page.tsx",
      "app/teacher/page.tsx",
      "app/student/page.tsx",
      "app/student/dashboard/page.tsx",
      "app/student/dashboard/layout.tsx",
      "app/teacher/dashboard/layout.tsx",
      "app/student/dashboard/meal-card/page.tsx",
      "app/about/page.tsx",
      "app/admissions/page.tsx",
      "app/apply/page.tsx",
      "app/gallery/page.tsx",
      "app/media/page.tsx",
    ];

    for (const file of filesToCheck) {
      const content = fs.readFileSync(file, "utf8");
      expect(content.toLowerCase()).not.toContain("wellstar");
    }
  });
});
