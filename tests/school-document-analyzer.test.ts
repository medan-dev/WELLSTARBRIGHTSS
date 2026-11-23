import { describe, it, expect } from "vitest";
import JSZip from "jszip";
import {
  extractBrandFromText,
  analyzeSchoolFile,
  SAMPLE_DOCUMENTS,
  generateStarterDocumentTemplate,
} from "@/lib/school-document-analyzer";

describe("School Document & ZIP Ingestion Engine", () => {
  it("should accurately extract institutional metadata from a natural text prospectus", () => {
    const lubagaSample = SAMPLE_DOCUMENTS.find((s) => s.id === "lubaga")!;
    const { brand, detected } = extractBrandFromText(lubagaSample.content);

    expect(brand.name).toBe("Uganda Martyrs High School Lubaga");
    expect(brand.shortCode).toBe("UMHS-LUBAGA");
    expect(brand.motto).toContain("Fide et Labore");
    expect(brand.unebCenterNumber).toBe("U0053");
    expect(brand.moesRegNumber).toBe("MoES/PSS/042/1967");
    expect(brand.establishedYear).toBe("1967");
    expect(brand.directorName).toBe("Rev. Bro. Charles Dominic");
    expect(brand.phone).toBe("+256 414 270 411");
    expect(brand.email).toBe("admissions@ugandamartyrslubaga.ac.ug");
    expect(brand.location).toContain("Lubaga Hill Road");
    expect(detected.length).toBeGreaterThanOrEqual(15);
  });

  it("should parse comprehensive academic and system settings from institutional documents", () => {
    const lubagaSample = SAMPLE_DOCUMENTS.find((s) => s.id === "lubaga")!;
    const { brand } = extractBrandFromText(lubagaSample.content);

    // Academics
    expect(brand.academicYear).toBe("2026/2027");
    expect(brand.currentTerm).toBe("Term 1");
    expect(brand.gradingScale).toBe("CBC");
    expect(brand.classesOffered.length).toBeGreaterThanOrEqual(4);
    expect(brand.classesOffered).toContain("S.1");
    expect(brand.subjectOfferings).toContain("Mathematics");
    expect(brand.subjectOfferings).toContain("Physics");

    // Finance & POS
    expect(brand.currency).toBe("UGX");
    expect(brand.termFeesDay).toBe("950000");
    expect(brand.termFeesBoarding).toBe("1650000");
    expect(brand.paymentBankName).toContain("Centenary Bank");
    expect(brand.paymentAccountNumber).toBe("3100028491023");
    expect(brand.momoMerchantCode).toBe("512940");
    expect(brand.airtelMerchantCode).toBe("194820");
    expect(brand.posReceiptHeader).toContain("UGANDA MARTYRS SS LUBAGA");

    // Operations & Welfare
    expect(brand.dailyStartTime).toBe("07:15 AM");
    expect(brand.dailyEndTime).toBe("05:00 PM");
    expect(brand.periodDurationMinutes).toBe(40);
    expect(brand.attendanceMode).toBe("Biometric");
    expect(brand.mealsOffered.length).toBeGreaterThanOrEqual(3);
    expect(brand.boardingHouses.length).toBeGreaterThanOrEqual(4);
  });

  it("should parse structured JSON profiles with 100% field fidelity", () => {
    const greenhillSample = SAMPLE_DOCUMENTS.find((s) => s.id === "greenhill")!;
    const { brand, detected } = extractBrandFromText(greenhillSample.content);

    expect(brand.name).toBe("Greenhill Academy Kibuli");
    expect(brand.shortCode).toBe("GHA-KBL");
    expect(brand.motto).toBe("Extend Your Horizons");
    expect(brand.unebCenterNumber).toBe("U0822");
    expect(brand.moesRegNumber).toBe("MoES/PSS/412/1994");
    expect(brand.directorName).toBe("Mrs. Joy Veronica Maraka");
    expect(brand.primaryColor).toBe("#006400");
    expect(brand.paymentBankName).toBe("Standard Chartered Uganda");
    expect(brand.termFeesDay).toBe("1,200,000");
    expect(brand.termFeesBoarding).toBe("2,100,000");
    expect(brand.classesOffered).toContain("S.1");
    expect(detected.length).toBeGreaterThanOrEqual(15);
  });

  it("should extract both badge images and document text from a ZIP archive", async () => {
    const zip = new JSZip();

    // Add a text file inside the ZIP
    const docContent = `Institution: St. Jude Secondary School
Short Name: SJSS
Motto: "Virtue and Knowledge"
UNEB Center: U0912
Location: Plot 10 High Street, Jinja
Phone: +256 701 999 888
Email: info@stjudess.ac.ug
Academic Year: 2026/2027
Current Term: Term 1
Day Fees: UGX 800,000
Bank Name: Stanbic Bank Uganda
Account Number: 903001847120`;
    zip.file("school_profile.txt", docContent);

    // Add a dummy image representing a crest
    const dummyPngBytes = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);
    zip.file("school_badge_logo.png", dummyPngBytes);

    const zipBlob = await zip.generateAsync({ type: "blob" });
    const zipFile = new File([zipBlob], "st_jude_onboarding.zip", { type: "application/zip" });

    const result = await analyzeSchoolFile(zipFile);

    expect(result.success).toBe(true);
    expect(result.fileType).toBe("zip");
    expect(result.extractedBrand.name).toBe("St. Jude Secondary School");
    expect(result.extractedBrand.shortCode).toBe("SJSS");
    expect(result.extractedBrand.motto).toContain("Virtue and Knowledge");
    expect(result.extractedBrand.unebCenterNumber).toBe("U0912");
    expect(result.extractedBrand.paymentBankName).toContain("Stanbic Bank");
    expect(result.extractedImages.length).toBe(1);
    expect(result.extractedImages[0].isBadgeCandidate).toBe(true);
    expect(result.extractedBrand.badgeUrl).toContain("data:image/png;base64");
    expect(result.categoryBreakdown.identity).toBeGreaterThan(0);
    expect(result.categoryBreakdown.finance).toBeGreaterThan(0);
  });

  it("should generate downloadable starter institutional templates in JSON and Markdown", () => {
    const jsonTemplate = generateStarterDocumentTemplate("json");
    expect(jsonTemplate.filename).toBe("EDUREXA_School_Setup_Template.json");
    expect(jsonTemplate.content).toContain("Wellstar Bright Secondary School");
    expect(JSON.parse(jsonTemplate.content).unebCenterNumber).toBe("U0482");

    const mdTemplate = generateStarterDocumentTemplate("markdown");
    expect(mdTemplate.filename).toBe("EDUREXA_School_Setup_Template.md");
    expect(mdTemplate.content).toContain("# INSTITUTIONAL SPECIFICATION & SYSTEM CONFIGURATION");
    expect(mdTemplate.content).toContain("UNEB Center Number:");
    expect(mdTemplate.content).toContain("Bank Account Number:");
  });
});
