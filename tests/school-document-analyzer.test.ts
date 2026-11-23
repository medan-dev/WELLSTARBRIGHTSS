import { describe, it, expect } from "vitest";
import JSZip from "jszip";
import {
  extractBrandFromText,
  analyzeSchoolFile,
  SAMPLE_DOCUMENTS,
} from "@/lib/school-document-analyzer";

describe("School Document & ZIP Ingestion Engine", () => {
  it("should accurately extract institutional metadata from a natural text prospectus", () => {
    const lubagaSample = SAMPLE_DOCUMENTS.find((s) => s.id === "lubaga")!;
    const { brand, detected } = extractBrandFromText(lubagaSample.content);

    expect(brand.name).toBe("Uganda Martyrs High School Lubaga");
    expect(brand.shortCode).toBe("UMHS-LUBAGA");
    expect(brand.motto).toContain("Fide et Labore");
    expect(brand.unebCenterNumber).toBe("U0053");
    expect(brand.directorName).toBe("Rev. Bro. Charles Dominic");
    expect(brand.phone).toBe("+256 414 270 411");
    expect(brand.email).toBe("admissions@ugandamartyrslubaga.ac.ug");
    expect(brand.location).toContain("Lubaga Hill Road");
    expect(detected.length).toBeGreaterThanOrEqual(8);
  });

  it("should parse structured JSON profiles with 100% field fidelity", () => {
    const greenhillSample = SAMPLE_DOCUMENTS.find((s) => s.id === "greenhill")!;
    const { brand, detected } = extractBrandFromText(greenhillSample.content);

    expect(brand.name).toBe("Greenhill Academy Kibuli");
    expect(brand.shortCode).toBe("GHA-KBL");
    expect(brand.motto).toBe("Extend Your Horizons");
    expect(brand.unebCenterNumber).toBe("U0822");
    expect(brand.directorName).toBe("Mrs. Joy Veronica Maraka");
    expect(brand.primaryColor).toBe("#006400");
    expect(detected.length).toBeGreaterThanOrEqual(10);
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
Email: info@stjudess.ac.ug`;
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
    expect(result.extractedImages.length).toBe(1);
    expect(result.extractedImages[0].isBadgeCandidate).toBe(true);
    expect(result.extractedBrand.badgeUrl).toContain("data:image/png;base64");
  });
});
