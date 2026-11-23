import JSZip from "jszip";
import { SchoolBrandConfig, DEFAULT_SCHOOL_BRAND } from "@/lib/school-brand-types";

export interface DetectedField {
  field: keyof SchoolBrandConfig;
  label: string;
  value: string;
  confidence: "high" | "medium" | "low";
}

export interface ExtractedImage {
  name: string;
  dataUrl: string;
  isBadgeCandidate: boolean;
}

export interface DocumentAnalysisResult {
  success: boolean;
  fileName: string;
  fileType: "zip" | "json" | "document" | "text";
  detectedFieldsCount: number;
  confidenceScore: number; // 0 - 100%
  extractedBrand: SchoolBrandConfig;
  detectedItems: DetectedField[];
  extractedImages: ExtractedImage[];
  rawTextPreview: string;
  summary: string;
}

/**
 * Built-in real-world sample institutional documents for instant 1-click testing.
 */
export const SAMPLE_DOCUMENTS = [
  {
    id: "lubaga",
    title: "Uganda Martyrs High School Lubaga - Institutional Prospectus",
    filename: "UMHS_Lubaga_Profile_2026.txt",
    type: "Secondary School Profile",
    content: `UGANDA MARTYRS HIGH SCHOOL LUBAGA
Official Institutional Prospectus & School Profile 2026/2027

Institution: Uganda Martyrs High School Lubaga
Short Name / Code: UMHS-LUBAGA
Motto: "Fide et Labore" (By Faith and Hard Work)
UNEB Examination Center Number: U0053
Curriculum Standards: Uganda National Examinations Board (UCE & UACE) & Competence-Based Curriculum (CBC)
School Category: Catholic Founded Mixed Day & Boarding Secondary School (S.1 - S.6)

Campus Location: Lubaga Hill Road, Lubaga Division, Kampala District, Uganda
Admissions & Administrative Hotline: +256 414 270 411
Admissions WhatsApp Helpdesk: +256 702 458 920
Official Email: admissions@ugandamartyrslubaga.ac.ug
Institutional Portal: https://ugandamartyrslubaga.ac.ug

Administration & Leadership:
Head of School: Rev. Bro. Charles Dominic
Director Title: Headmaster / Principal Director
Headmaster Bio: Leading Uganda Martyrs High School with a 50-year heritage of academic pre-eminence, spiritual grounding, and moral discipline.

Core Academic Programs:
- Pure Sciences & ICT Innovation Laboratories
- Fine Arts, Industrial Graphics & Communication
- Humanities, History & Global Economics
- Acclaimed Brass Band, Choir & Sacred Music

Admissions & Bursaries:
S.1 cut-off: Aggregate 4 to 8 in PLE. S.5 entry: Division 1 in UCE.
Brand Identity Colors: Royal Navy Blue (#0a1e42) and Warm Gold Accent (#d4af37).`
  },
  {
    id: "budo",
    title: "King's College Budo - Historic Centennial Profile",
    filename: "Kings_College_Budo_Charter.txt",
    type: "Collegiate Charter",
    content: `KING'S COLLEGE BUDO
Official School Charter & Institutional Overview

School Name: King's College Budo
Short Name / Code: BUDO-1906
Motto: "Gakyali Mabaga" (The Work Has Just Begun)
UNEB Center No: U0025
Curriculum: UNEB Standard O-Level & A-Level Curriculum
Institution Level: First-Class Anglican Co-Educational Boarding Secondary School

Physical Campus: Budo Hill, Wakiso District, P.O. Box 7121 Kampala, Uganda
Telephone Hotline: +256 414 772 100
WhatsApp Line: +256 772 884 120
Inquiries Email: administration@kcbudo.sc.ug
Website: https://kcbudo.sc.ug

Executive Leadership:
Head of School: Dr. Patrick Bakka Male
Title: Headmaster & Institutional Executive
Director Bio: Inspiring academic integrity, statecraft, and global leadership since 1906 for future generations.

Primary Colors: Deep Crimson Red (#800000) and Gold (#c5a059).`
  },
  {
    id: "greenhill",
    title: "Greenhill Academy Kibuli - Modern Academic Profile",
    filename: "Greenhill_Academy_Profile.json",
    type: "JSON Data Profile",
    content: JSON.stringify({
      name: "Greenhill Academy Kibuli",
      shortCode: "GHA-KBL",
      motto: "Extend Your Horizons",
      unebCenterNumber: "U0822",
      curriculum: "Integrated National CBC Curriculum & Advanced UNEB Standards",
      level: "Private Day & Boarding Secondary School",
      location: "Mbogo Road, Kibuli Hill, Kampala, Uganda",
      phone: "+256 414 342 684",
      whatsapp: "+256 752 342 684",
      email: "info@greenhillacademy.ac.ug",
      website: "https://greenhillacademy.ac.ug",
      directorName: "Mrs. Joy Veronica Maraka",
      directorTitle: "Rector & Chief Executive",
      directorBio: "Championing technology-led education, inclusive learning, and moral fortitude.",
      primaryColor: "#006400",
      accentColor: "#ffd700"
    }, null, 2)
  }
];

/**
 * Parses raw text or structured document to extract institutional metadata.
 */
export function extractBrandFromText(text: string, baseBrand: SchoolBrandConfig = DEFAULT_SCHOOL_BRAND): {
  brand: SchoolBrandConfig;
  detected: DetectedField[];
} {
  const brand: SchoolBrandConfig = { ...baseBrand };
  const detected: DetectedField[] = [];

  const addField = (field: keyof SchoolBrandConfig, label: string, value: string, confidence: "high" | "medium" | "low") => {
    if (value && value.trim()) {
      (brand as any)[field] = value.trim();
      detected.push({ field, label, value: value.trim(), confidence });
    }
  };

  // 1. Try JSON parsing first
  const trimmed = text.trim();
  if ((trimmed.startsWith("{") && trimmed.endsWith("}")) || (trimmed.startsWith("[") && trimmed.endsWith("]"))) {
    try {
      const data = JSON.parse(trimmed);
      const obj = Array.isArray(data) ? data[0] : data;
      if (obj && typeof obj === "object") {
        if (obj.name || obj.schoolName || obj.institution) {
          addField("name", "School Name", obj.name || obj.schoolName || obj.institution, "high");
        }
        if (obj.shortCode || obj.shortName || obj.code) {
          addField("shortCode", "Short Code", obj.shortCode || obj.shortName || obj.code, "high");
        }
        if (obj.motto || obj.slogan) {
          addField("motto", "Motto", obj.motto || obj.slogan, "high");
        }
        if (obj.unebCenterNumber || obj.uneb || obj.centerNo || obj.centerNumber) {
          addField("unebCenterNumber", "UNEB Center #", obj.unebCenterNumber || obj.uneb || obj.centerNo || obj.centerNumber, "high");
        }
        if (obj.curriculum) {
          addField("curriculum", "Curriculum", obj.curriculum, "high");
        }
        if (obj.level || obj.category) {
          addField("level", "School Category", obj.level || obj.category, "high");
        }
        if (obj.location || obj.address || obj.campus) {
          addField("location", "Campus Location", obj.location || obj.address || obj.campus, "high");
        }
        if (obj.phone || obj.tel || obj.contact) {
          addField("phone", "Telephone Hotline", obj.phone || obj.tel || obj.contact, "high");
        }
        if (obj.whatsapp) {
          addField("whatsapp", "WhatsApp Number", obj.whatsapp, "high");
        }
        if (obj.email) {
          addField("email", "Admissions Email", obj.email, "high");
        }
        if (obj.website || obj.portal || obj.url) {
          addField("website", "Website URL", obj.website || obj.portal || obj.url, "high");
        }
        if (obj.directorName || obj.headOfSchool || obj.headmaster || obj.principal) {
          addField("directorName", "Head of School", obj.directorName || obj.headOfSchool || obj.headmaster || obj.principal, "high");
        }
        if (obj.directorTitle || obj.title) {
          addField("directorTitle", "Leadership Title", obj.directorTitle || obj.title, "high");
        }
        if (obj.directorBio || obj.bio || obj.message) {
          addField("directorBio", "Director Bio", obj.directorBio || obj.bio || obj.message, "high");
        }
        if (obj.primaryColor) {
          addField("primaryColor", "Primary Color", obj.primaryColor, "high");
        }
        if (obj.accentColor) {
          addField("accentColor", "Accent Color", obj.accentColor, "high");
        }
        if (detected.length >= 2) {
          return { brand, detected };
        }
      }
    } catch {
      // Not valid JSON, continue to regex parser
    }
  }

  // 2. Regex heuristics for natural text, prospectus, brochures, letterheads
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

  // School Name
  const nameMatch = text.match(/(?:School Name|Institution|Name of School|School|College|Academy):\s*([^\n\r]+)/i);
  if (nameMatch) {
    addField("name", "School Name", nameMatch[1], "high");
  } else {
    // Look at first 3 non-empty lines for typical school names
    for (const line of lines.slice(0, 4)) {
      if (/secondary school|high school|college|academy|international school|grammar school|comprehensive school/i.test(line)) {
        addField("name", "School Name", line.replace(/^[#*\-•\s]+/, ""), "medium");
        break;
      }
    }
  }

  // Short Name / Code
  const codeMatch = text.match(/(?:Short Name|Code|Initials|Short Code|Acronym):\s*([^\n\r]+)/i);
  if (codeMatch) {
    addField("shortCode", "Short Code", codeMatch[1], "high");
  } else if (brand.name) {
    const words = brand.name.replace(/[^a-zA-Z\s]/g, "").split(/\s+/).filter((w) => w.length > 2);
    if (words.length >= 2) {
      const initials = words.slice(0, 4).map((w) => w[0].toUpperCase()).join("");
      addField("shortCode", "Generated Short Code", `${initials}-2026`, "low");
    }
  }

  // Motto
  const mottoMatch = text.match(/(?:Motto|Slogan|Theme|Mission):\s*(?:"|“)?([^"”\n\r]+)(?:"|”)?/i);
  if (mottoMatch) {
    addField("motto", "Motto", mottoMatch[1].trim(), "high");
  }

  // UNEB Center Number
  const unebMatch = text.match(/(?:UNEB Center|Center No|Center Number|UNEB No|UNEB Center Number|Center):\s*#?\s*(U\d{3,4}[A-Za-z]?|\d{4,6})/i);
  if (unebMatch) {
    addField("unebCenterNumber", "UNEB Center #", unebMatch[1], "high");
  } else {
    const unebAlt = text.match(/\b(U\d{4})\b/i);
    if (unebAlt) {
      addField("unebCenterNumber", "UNEB Center #", unebAlt[1].toUpperCase(), "medium");
    }
  }

  // Curriculum
  const currMatch = text.match(/(?:Curriculum Standards|Curriculum|Syllabus|Examination Body):\s*([^\n\r]+)/i);
  if (currMatch) {
    addField("curriculum", "Curriculum", currMatch[1], "high");
  }

  // School Level / Category
  const levelMatch = text.match(/(?:School Category|Category|Level|Institution Level):\s*([^\n\r]+)/i);
  if (levelMatch) {
    addField("level", "School Category", levelMatch[1], "high");
  }

  // Campus Location
  const locMatch = text.match(/(?:Campus Location|Location|Physical Address|Address|Campus):\s*([^\n\r]+)/i);
  if (locMatch) {
    addField("location", "Campus Location", locMatch[1], "high");
  } else {
    for (const line of lines) {
      if (/mukono|kampala|wakiso|jinja|entebbe|gulu|mbarara|district,\s*uganda/i.test(line)) {
        addField("location", "Campus Location", line, "medium");
        break;
      }
    }
  }

  // Phone Hotline
  const phoneMatch = text.match(/(?:Admissions & Administrative Hotline|Telephone Hotline|Phone|Tel|Hotline|Contact):\s*([+0-9\s()-]{9,25})/i);
  if (phoneMatch) {
    addField("phone", "Telephone Hotline", phoneMatch[1], "high");
  } else {
    const rawPhone = text.match(/\b(\+256[\s-]?[0-9]{3}[\s-]?[0-9]{3}[\s-]?[0-9]{3}|07[0-9]{2}[\s-]?[0-9]{3}[\s-]?[0-9]{3})\b/);
    if (rawPhone) {
      addField("phone", "Telephone Hotline", rawPhone[1], "medium");
    }
  }

  // WhatsApp
  const waMatch = text.match(/(?:Admissions WhatsApp|WhatsApp Line|WhatsApp Helpdesk|WhatsApp|WA):\s*([+0-9\s()-]{9,25})/i);
  if (waMatch) {
    addField("whatsapp", "WhatsApp Number", waMatch[1], "high");
  } else if (brand.phone) {
    addField("whatsapp", "WhatsApp Number", brand.phone, "low");
  }

  // Email
  const emailMatch = text.match(/(?:Official Email|Inquiries Email|Email|Admissions Email|Mail):\s*([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i);
  if (emailMatch) {
    addField("email", "Admissions Email", emailMatch[1], "high");
  } else {
    const rawEmail = text.match(/\b([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})\b/);
    if (rawEmail) {
      addField("email", "Admissions Email", rawEmail[1], "medium");
    }
  }

  // Website
  const webMatch = text.match(/(?:Institutional Portal|Website|Portal|URL):\s*(https?:\/\/[^\s\n\r]+)/i);
  if (webMatch) {
    addField("website", "Website URL", webMatch[1], "high");
  }

  // Head of School / Director
  const dirMatch = text.match(/(?:Head of School|Headmaster|Head Teacher|Principal|Director|Rector):\s*([^\n\r]+)/i);
  if (dirMatch) {
    addField("directorName", "Head of School", dirMatch[1], "high");
  }

  // Director Title
  const titleMatch = text.match(/(?:Director Title|Leadership Title|Title):\s*([^\n\r]+)/i);
  if (titleMatch) {
    addField("directorTitle", "Leadership Title", titleMatch[1], "high");
  }

  // Director Bio
  const bioMatch = text.match(/(?:Headmaster Bio|Director Bio|Bio|Welcome Message|Message):\s*([^\n\r]+(?:\n[^\n\r]+){0,2})/i);
  if (bioMatch) {
    addField("directorBio", "Director Bio", bioMatch[1].replace(/\n+/g, " "), "high");
  }

  // Colors
  const hexMatches = text.match(/#([0-9a-fA-F]{6})\b/g);
  if (hexMatches && hexMatches.length > 0) {
    addField("primaryColor", "Primary Color", hexMatches[0], "medium");
    if (hexMatches.length > 1) {
      addField("accentColor", "Accent Color", hexMatches[1], "medium");
    }
  }

  // Badge Initials
  if (brand.name) {
    const initials = brand.name.split(/\s+/).slice(0, 2).map((s) => s[0]).join("").toUpperCase();
    brand.badgeInitials = initials;
  }

  return { brand, detected };
}

/**
 * High-level analyzer function capable of handling File objects (ZIP, JSON, TXT, DOCX, CSV) or raw text.
 */
export async function analyzeSchoolFile(file: File): Promise<DocumentAnalysisResult> {
  const fileName = file.name;
  const isZip = fileName.endsWith(".zip");
  const isJson = fileName.endsWith(".json");

  // 1. Handle ZIP Archives
  if (isZip) {
    try {
      const zip = new JSZip();
      const zipData = await zip.loadAsync(file);

      const extractedImages: ExtractedImage[] = [];
      let combinedText = "";

      for (const [path, entry] of Object.entries(zipData.files)) {
        if (entry.dir) continue;
        const lower = path.toLowerCase();

        // Image extraction (badge / crest candidate)
        if (lower.endsWith(".png") || lower.endsWith(".jpg") || lower.endsWith(".jpeg") || lower.endsWith(".webp") || lower.endsWith(".svg")) {
          let mime = "image/png";
          if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) mime = "image/jpeg";
          if (lower.endsWith(".webp")) mime = "image/webp";
          if (lower.endsWith(".svg")) mime = "image/svg+xml";

          const base64 = await entry.async("base64");
          const dataUrl = `data:${mime};base64,${base64}`;

          const isBadge =
            lower.includes("logo") ||
            lower.includes("badge") ||
            lower.includes("crest") ||
            lower.includes("emblem") ||
            lower.includes("shield") ||
            extractedImages.length === 0;

          extractedImages.push({
            name: path.split("/").pop() || path,
            dataUrl,
            isBadgeCandidate: isBadge,
          });
        }

        // Text / document extraction inside ZIP
        if (lower.endsWith(".txt") || lower.endsWith(".json") || lower.endsWith(".csv") || lower.endsWith(".md") || lower.endsWith(".html")) {
          const text = await entry.async("text");
          combinedText += `\n--- File: ${path} ---\n${text}\n`;
        }
      }

      // Analyze combined text
      const { brand, detected } = extractBrandFromText(combinedText || fileName);

      // Attach extracted badge if found
      const bestBadge = extractedImages.find((img) => img.isBadgeCandidate) || extractedImages[0];
      if (bestBadge) {
        brand.badgeUrl = bestBadge.dataUrl;
        detected.push({
          field: "badgeUrl",
          label: "School Badge / Crest (from ZIP)",
          value: bestBadge.name,
          confidence: "high",
        });
      }

      const score = Math.min(100, Math.round((detected.length / 10) * 100));

      return {
        success: true,
        fileName,
        fileType: "zip",
        detectedFieldsCount: detected.length,
        confidenceScore: Math.max(score, 50),
        extractedBrand: brand,
        detectedItems: detected,
        extractedImages,
        rawTextPreview: combinedText.slice(0, 1500) || `Extracted ${extractedImages.length} images from ZIP archive.`,
        summary: `Successfully parsed ZIP archive "${fileName}". Extracted ${extractedImages.length} images and auto-detected ${detected.length} institutional preference fields.`,
      };
    } catch (err: any) {
      throw new Error(`Failed to extract ZIP archive: ${err.message || "Invalid archive format"}`);
    }
  }

  // 2. Handle Document Files (.txt, .json, .csv, .md, .html)
  const rawText = await file.text();
  const { brand, detected } = extractBrandFromText(rawText);
  const score = Math.min(100, Math.round((detected.length / 10) * 100));

  return {
    success: true,
    fileName,
    fileType: isJson ? "json" : "document",
    detectedFieldsCount: detected.length,
    confidenceScore: Math.max(score, 40),
    extractedBrand: brand,
    detectedItems: detected,
    extractedImages: [],
    rawTextPreview: rawText.slice(0, 1500),
    summary: `Analyzed document "${fileName}". Detected ${detected.length} preferences with ${score}% structural confidence.`,
  };
}
