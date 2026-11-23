import JSZip from "jszip";
import { SchoolBrandConfig, DEFAULT_SCHOOL_BRAND } from "@/lib/school-brand-types";
import { sanitizeText } from "@/lib/sanitization";

export interface DetectedField {
  field: keyof SchoolBrandConfig | string;
  category: "identity" | "academics" | "finance" | "operations" | "leadership" | "branding";
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
  categoryBreakdown: {
    identity: number;
    academics: number;
    finance: number;
    operations: number;
    leadership: number;
    branding: number;
  };
}

/**
 * Built-in real-world sample institutional documents with full system configuration for 1-click testing.
 */
export const SAMPLE_DOCUMENTS = [
  {
    id: "lubaga",
    title: "Uganda Martyrs High School Lubaga - Institutional Prospectus & Configuration",
    filename: "UMHS_Lubaga_Profile_2026.txt",
    type: "Secondary School Profile & Setup",
    content: `UGANDA MARTYRS HIGH SCHOOL LUBAGA
Official Institutional Prospectus, System Configuration & School Profile 2026/2027

=== 1. INSTITUTIONAL IDENTITY & LEGAL REGISTRATION ===
Institution Name: Uganda Martyrs High School Lubaga
Short Name / Code: UMHS-LUBAGA
Motto: "Fide et Labore" (By Faith and Hard Work)
UNEB Examination Center Number: U0053
Ministry of Education Registration (MoES): MoES/PSS/042/1967
Year Established: 1967
School Category: Catholic Founded Mixed Day & Boarding Secondary School (S.1 - S.6)
Curriculum Standards: Uganda National Examinations Board (UCE & UACE) & Competence-Based Curriculum (CBC)
Mission Statement: To provide holistic Catholic-grounded education that forms morally upright, intellectually outstanding, and socially responsible global leaders.
Vision Statement: To be Uganda's leading secondary institution of excellence in sciences, arts, and spiritual development.
Core Values: Faith, Integrity, Diligence, Intellectual Humility, Charity

=== 2. CAMPUS LOCATION & OFFICIAL CONTACTS ===
Campus Location: Lubaga Hill Road, Lubaga Division, Kampala District, Uganda
District: Kampala District
Postal Address: P.O. Box 20124 Kampala, Uganda
Admissions & Administrative Hotline: +256 414 270 411
Admissions WhatsApp Helpdesk: +256 702 458 920
Official Email: admissions@ugandamartyrslubaga.ac.ug
Institutional Portal: https://ugandamartyrslubaga.ac.ug

=== 3. ADMINISTRATION & EXECUTIVE LEADERSHIP ===
Head of School: Rev. Bro. Charles Dominic
Leadership Title: Headmaster & Provincial Superior
Headmaster Bio: Leading Uganda Martyrs High School with a 50-year heritage of academic pre-eminence, spiritual grounding, and moral discipline.
Deputy Headteacher (Academics): Mr. Ssenkaali Joseph
Deputy Headteacher (Administration): Sister Mary Consolata
Bursar / Financial Controller: Mr. Mukasa Francis

=== 4. ACADEMIC & GRADING SYSTEM CONFIGURATION ===
Academic Year: 2026/2027
Current Active Term: Term 1
Term Dates: 02 February 2026 — 08 May 2026
Grading Scale System: CBC (New Lower Secondary Competence Framework) & UNEB Standard
Classes & Streams Offered: S.1, S.2, S.3, S.4, S.5 Arts, S.5 Sciences, S.6 Arts, S.6 Sciences
Academic Subjects Offered: Mathematics, English Language, Physics, Chemistry, Biology, Geography, History & Political Education, ICT & Computer Studies, Entrepreneurship, Literature in English, Christian Religious Education, French, Luganda, Fine Art, Physical Education

=== 5. FINANCE, FEES & ANTI-LEAKAGE POS CONFIGURATION ===
Billing Currency: UGX
Tuition Fees per Term (Day Scholar): UGX 950,000
Tuition Fees per Term (Boarding Student): UGX 1,650,000
Official Bank Name: Centenary Bank Uganda
Bank Account Number: 3100028491023
MTN MoMo Pay Merchant Code: 512940
Airtel Money Merchant Code: 194820
POS Thermal Receipt Header: UGANDA MARTYRS SS LUBAGA — BURSARY CASH COMMAND
POS Thermal Receipt Footer: Official Payment Receipt. Non-Refundable once issued.

=== 6. OPERATIONAL SCHEDULES, WELFARE & MEALS ===
Daily School Reporting Time: 07:15 AM
Daily Dismissal Time: 05:00 PM
Standard Period Duration: 40 Minutes
Attendance Tracking Mode: Biometric (NFC Smart Badge & RFID Turnstile)
Smart Meal Pass System: Enabled
Meals Offered Daily: Breakfast (Hot Porridge & Milk Rolls), Nutritious Lunch (Posho, Rice, Beans & Beef Stew), Evening Refreshment, Boarders Dinner
Boarding Houses & Dormitories: St. Charles Lwanga House, St. Kizito House, St. Maria Goretti House, St. Jude Thaddeus House, Uganda Martyrs Block

=== 7. ADMISSIONS & PUBLIC FRONTSITE METRICS ===
Admissions Status: Open for 2026 Academic Year
Application Form Fee: UGX 60,000
Total School Capacity: 2,400 Students
Key Frontsite Stats: 2,250+ Students | 99.4% UNEB Div 1-2 Pass Rate | 78 Expert Faculty | 2 Campuses
Visual Brand Colors: Deep Royal Navy (#0a1e42) and Warm Gold Accent (#d4af37)`
  },
  {
    id: "budo",
    title: "King's College Budo - Historic Centennial Profile & Configuration",
    filename: "Kings_College_Budo_Charter.txt",
    type: "Collegiate Charter & Setup",
    content: `KING'S COLLEGE BUDO
Official School Charter & Institutional Overview 2026

=== 1. INSTITUTIONAL IDENTITY ===
School Name: King's College Budo
Short Name / Code: BUDO-1906
Motto: "Gakyali Mabaga" (The Work Has Just Begun)
UNEB Examination Center Number: U0025
MoES Registration: MoES/PSS/001/1906
Year Established: 1906
Curriculum: UNEB Standard O-Level & A-Level Curriculum
Institution Level: First-Class Anglican Co-Educational Boarding Secondary School (S.1 — S.6)
Mission: To produce men and women of high moral integrity, intellectual acuity, and statesmanship for national and international service.
Vision: To remain the premier secondary school producing transformative global leaders.
Core Values: Christian Faith, Integrity, Academic Supremacy, Chivalry, Humility in Service

=== 2. LOCATION & CONTACTS ===
Physical Campus: Budo Hill, Wakiso District, P.O. Box 7121 Kampala, Uganda
District: Wakiso District
Telephone Hotline: +256 414 772 100
WhatsApp Line: +256 772 884 120
Inquiries Email: administration@kcbudo.sc.ug
Website: https://kcbudo.sc.ug

=== 3. EXECUTIVE LEADERSHIP ===
Head of School: Dr. Patrick Bakka Male
Title: Headmaster & Institutional Executive
Director Bio: Inspiring academic integrity, statecraft, and global leadership since 1906 for future generations.
Deputy Headteacher (Academics): Mr. Semakula George
Deputy Headteacher (Administration): Mrs. Christine Kigozi
Bursar: Mr. David Luyima

=== 4. ACADEMICS & CURRICULUM ===
Academic Year: 2026/2027
Current Term: Term 1
Term Dates: 02 Feb 2026 — 01 May 2026
Grading Scale: UNEB Standard Division 1-4 System
Classes Offered: S.1, S.2, S.3, S.4, S.5 Arts, S.5 Sciences, S.6 Arts, S.6 Sciences
Subjects Offered: Pure Mathematics, English Language, Physics, Chemistry, Biology, History, Geography, Economics, Literature in English, French, German, Technical Drawing, ICT

=== 5. FINANCE & FEES ===
Currency: UGX
Tuition Fees per Term (Day): UGX 1,100,000
Tuition Fees per Term (Boarding): UGX 1,950,000
Bank Name: Stanbic Bank Uganda
Bank Account Number: 9030005829100
MTN MoMo Pay Merchant Code: 409128
Airtel Money Merchant Code: 310928
POS Receipt Header: KING'S COLLEGE BUDO — BURSARY TREASURY
POS Receipt Footer: Gakyali Mabaga. Verified by Budo Financial Command.

=== 6. SCHEDULES & MEALS ===
Daily Start Time: 07:00 AM
Daily Dismissal Time: 05:30 PM
Period Duration: 45 Minutes
Attendance Mode: Biometric RFID System
Meal Plan: Enabled
Meals Offered: Morning Porridge, Full Hot Lunch, Afternoon Tea, Evening Supper
Boarding Houses: England House, South Africa House, Nigeria House, Ghana House, Mutesa House, Grace House, Sabaganzi House

=== 7. METRICS & BRAND COLORS ===
Admissions: Open for S.1 and S.5
Application Fee: UGX 80,000
Student Capacity: 2,000
Frontsite Stats: 1,850+ Students | 100% University Admission | 84 Teachers | Historic Hill Campus
Primary Color: Deep Crimson Red (#800000)
Accent Color: Heritage Gold (#c5a059)`
  },
  {
    id: "greenhill",
    title: "Greenhill Academy Kibuli - Full System JSON Specification",
    filename: "Greenhill_Academy_Profile.json",
    type: "Structured System Profile",
    content: JSON.stringify({
      name: "Greenhill Academy Kibuli",
      shortCode: "GHA-KBL",
      motto: "Extend Your Horizons",
      unebCenterNumber: "U0822",
      moesRegNumber: "MoES/PSS/412/1994",
      establishedYear: "1994",
      curriculum: "Integrated National CBC Curriculum & Advanced UNEB Standards",
      level: "Private Mixed Day & Boarding Secondary School",
      mission: "To provide quality education in a nurturing environment fostering creative innovation, critical thinking, and social responsibility.",
      vision: "To be the leading center of academic excellence and holistic child development in East Africa.",
      coreValues: ["Godliness", "Excellence", "Integrity", "Courtesy", "Creativity"],
      location: "Mbogo Road, Kibuli Hill, Kampala, Uganda",
      district: "Kampala",
      postalAddress: "P.O. Box 7490, Kampala, Uganda",
      phone: "+256 414 342 684",
      whatsapp: "+256 752 342 684",
      email: "info@greenhillacademy.ac.ug",
      website: "https://greenhillacademy.ac.ug",
      directorName: "Mrs. Joy Veronica Maraka",
      directorTitle: "Rector & Chief Executive",
      directorBio: "Championing technology-led education, inclusive learning, and moral fortitude.",
      deputyAcademics: "Mr. Wilberforce Kamya",
      deputyAdmin: "Mrs. Brenda Nabawanuka",
      bursarName: "Mr. Patrick Mwesigwa",
      academicYear: "2026/2027",
      currentTerm: "Term 1",
      termDates: "26 Jan 2026 — 24 Apr 2026",
      gradingScale: "CBC",
      classesOffered: ["S.1", "S.2", "S.3", "S.4", "S.5", "S.6"],
      subjectOfferings: ["Mathematics", "English", "Physics", "Chemistry", "Biology", "French", "German", "ICT", "Art & Design", "Music", "Economics"],
      currency: "UGX",
      termFeesDay: "1,200,000",
      termFeesBoarding: "2,100,000",
      paymentBankName: "Standard Chartered Uganda",
      paymentAccountNumber: "0100238491000",
      momoMerchantCode: "492018",
      airtelMerchantCode: "301928",
      posReceiptHeader: "GREENHILL ACADEMY — REVENUE & BILLING COMMAND",
      posReceiptFooter: "Fees once paid are non-refundable. Verified by EDUREXA.",
      dailyStartTime: "07:30 AM",
      dailyEndTime: "04:30 PM",
      periodDurationMinutes: 40,
      attendanceMode: "Biometric",
      mealPlanEnabled: true,
      mealsOffered: ["Full English Breakfast", "Buffet Lunch", "Nutritional Afternoon Snack", "Evening Supper"],
      boardingHouses: ["Horizon House", "Pinnacle House", "Summit House"],
      admissionsOpen: true,
      applicationFee: "100,000",
      studentCapacity: "2,200",
      frontSiteStats: {
        students: "2,100+",
        passRate: "99.8%",
        teachers: "92",
        campuses: "3"
      },
      primaryColor: "#006400",
      accentColor: "#ffd700"
    }, null, 2)
  },
  {
    id: "kitende",
    title: "St. Mary's Kitende - Multi-Campus Sports & Academic Powerhouse",
    filename: "St_Marys_Kitende_Configuration.txt",
    type: "Comprehensive Setup",
    content: `ST. MARY'S BOARDING SECONDARY SCHOOL KITENDE
Official Institutional Configuration & Operational Manual 2026

Institution: St. Mary's Boarding Secondary School Kitende
Short Name: SMSS-KITENDE
Motto: "Per Aspera Ad Astra" (Through Hardship to the Stars)
UNEB Examination Center Number: U0080
MoES Registration: MoES/PSS/023/1995
Year Established: 1995
Category: Premier Co-Educational Boarding Secondary School
Curriculum: UNEB Standard O-Level & A-Level Academic Powerhouse

Campus Location: Entebbe Road, Kitende, Wakiso District, Uganda
District: Wakiso District
Phone: +256 414 382 110
WhatsApp: +256 702 382 110
Email: admissions@stmaryskitende.ac.ug
Website: https://stmaryskitende.ac.ug

Executive Leadership:
Head of School: Dr. Lawrence Mulindwa
Title: Executive Director & Proprietor
Bio: Championing unmatched academic supremacy, sports development, and disciplined national leadership.
Deputy Academics: Mr. Ssentongo Godfrey
Deputy Admin: Mr. Male Patrick
Bursar: Mr. Mugisha Robert

Academic Setup:
Academic Year: 2026/2027
Current Term: Term 1
Term Dates: 01 Feb 2026 — 02 May 2026
Grading Scale: UNEB
Classes: S.1, S.2, S.3, S.4, S.5 Arts, S.5 Sci, S.6 Arts, S.6 Sci
Subjects: Pure Mathematics, English Language, Physics, Chemistry, Biology, History, Geography, Economics, Sub-Maths, ICT, Divinity

Finance & Bursary:
Currency: UGX
Tuition Fees (Day): UGX 950,000
Tuition Fees (Boarding): UGX 1,850,000
Bank Name: Dfcu Bank Uganda
Bank Account Number: 0182104928100
MTN MoMo Merchant: 710294
Airtel Money Merchant: 492011
POS Header: ST. MARY'S SS KITENDE — ACCOUNTS & TREASURY
POS Footer: Excellence Guaranteed. Non-Refundable.

Operations:
Hours: 07:00 AM — 05:30 PM
Period Duration: 45 Minutes
Attendance Mode: Biometric
Meal Plan: Enabled
Meals: Morning Milk Porridge, Posho & Meat, Afternoon Tea, Dinner
Dorms: Mulindwa Complex, St. Jude Hostel, St. Mary's Wing, Kizito Block
Admissions: Open
Application Fee: UGX 75,000
Capacity: 3,500 Students
Stats: 3,200+ Students | 100% UNEB Division 1-2 | 120 Teachers | 2 Campuses
Colors: Wine Red (#800020) and Gold (#d4af37)`
  }
];

/**
 * Generates an official starter template document (JSON or Markdown) that can be downloaded by the user,
 * filled in with school specifications, and uploaded straight into the wizard.
 */
export function generateStarterDocumentTemplate(format: "json" | "markdown"): { filename: string; content: string } {
  if (format === "json") {
    return {
      filename: "EDUREXA_School_Setup_Template.json",
      content: JSON.stringify(DEFAULT_SCHOOL_BRAND, null, 2)
    };
  }

  return {
    filename: "EDUREXA_School_Setup_Template.md",
    content: `# INSTITUTIONAL SPECIFICATION & SYSTEM CONFIGURATION
# Fill in your school details below and upload this file (or inside a ZIP archive with your badge logo) into the System Setup Wizard.

## 1. INSTITUTIONAL IDENTITY & REGISTRATION
School Name: ${DEFAULT_SCHOOL_BRAND.name}
Short Code: ${DEFAULT_SCHOOL_BRAND.shortCode}
Motto: "${DEFAULT_SCHOOL_BRAND.motto}"
UNEB Center Number: ${DEFAULT_SCHOOL_BRAND.unebCenterNumber}
Ministry of Education (MoES) Reg Number: ${DEFAULT_SCHOOL_BRAND.moesRegNumber}
Year Established: ${DEFAULT_SCHOOL_BRAND.establishedYear}
School Level / Category: ${DEFAULT_SCHOOL_BRAND.level}
Curriculum: ${DEFAULT_SCHOOL_BRAND.curriculum}
Mission Statement: ${DEFAULT_SCHOOL_BRAND.mission}
Vision Statement: ${DEFAULT_SCHOOL_BRAND.vision}
Core Values: ${DEFAULT_SCHOOL_BRAND.coreValues.join(", ")}

## 2. LOCATION & OFFICIAL CONTACTS
Campus Location: ${DEFAULT_SCHOOL_BRAND.location}
District: ${DEFAULT_SCHOOL_BRAND.district}
Postal Address: ${DEFAULT_SCHOOL_BRAND.postalAddress}
Phone Hotline: ${DEFAULT_SCHOOL_BRAND.phone}
WhatsApp Helpdesk: ${DEFAULT_SCHOOL_BRAND.whatsapp}
Admissions Email: ${DEFAULT_SCHOOL_BRAND.email}
Official Website: ${DEFAULT_SCHOOL_BRAND.website}

## 3. EXECUTIVE LEADERSHIP
Head of School: ${DEFAULT_SCHOOL_BRAND.directorName}
Leadership Title: ${DEFAULT_SCHOOL_BRAND.directorTitle}
Director Bio: ${DEFAULT_SCHOOL_BRAND.directorBio}
Deputy Headteacher (Academics): ${DEFAULT_SCHOOL_BRAND.deputyAcademics}
Deputy Headteacher (Administration): ${DEFAULT_SCHOOL_BRAND.deputyAdmin}
Bursar: ${DEFAULT_SCHOOL_BRAND.bursarName}

## 4. ACADEMIC & GRADING SYSTEM SETTINGS
Academic Year: ${DEFAULT_SCHOOL_BRAND.academicYear}
Current Term: ${DEFAULT_SCHOOL_BRAND.currentTerm}
Term Dates: ${DEFAULT_SCHOOL_BRAND.termDates}
Grading Scale: ${DEFAULT_SCHOOL_BRAND.gradingScale}
Classes Offered: ${DEFAULT_SCHOOL_BRAND.classesOffered.join(", ")}
Subjects Offered: ${DEFAULT_SCHOOL_BRAND.subjectOfferings.join(", ")}

## 5. FINANCE, FEES & POS SETTINGS
Currency: ${DEFAULT_SCHOOL_BRAND.currency}
Tuition Fees (Day Scholar): UGX ${DEFAULT_SCHOOL_BRAND.termFeesDay}
Tuition Fees (Boarding Student): UGX ${DEFAULT_SCHOOL_BRAND.termFeesBoarding}
Bank Name: ${DEFAULT_SCHOOL_BRAND.paymentBankName}
Bank Account Number: ${DEFAULT_SCHOOL_BRAND.paymentAccountNumber}
MTN MoMo Pay Merchant Code: ${DEFAULT_SCHOOL_BRAND.momoMerchantCode}
Airtel Money Merchant Code: ${DEFAULT_SCHOOL_BRAND.airtelMerchantCode}
POS Receipt Header: ${DEFAULT_SCHOOL_BRAND.posReceiptHeader}
POS Receipt Footer: ${DEFAULT_SCHOOL_BRAND.posReceiptFooter}

## 6. OPERATIONAL SCHEDULES & MEALS
Daily Start Time: ${DEFAULT_SCHOOL_BRAND.dailyStartTime}
Daily Dismissal Time: ${DEFAULT_SCHOOL_BRAND.dailyEndTime}
Period Duration: ${DEFAULT_SCHOOL_BRAND.periodDurationMinutes} Minutes
Attendance Tracking Mode: ${DEFAULT_SCHOOL_BRAND.attendanceMode}
Smart Meal Plan: ${DEFAULT_SCHOOL_BRAND.mealPlanEnabled ? "Enabled" : "Disabled"}
Meals Offered: ${DEFAULT_SCHOOL_BRAND.mealsOffered.join("; ")}
Boarding Houses / Dormitories: ${DEFAULT_SCHOOL_BRAND.boardingHouses.join(", ")}

## 7. ADMISSIONS & FRONTSITE STATS
Admissions Open: ${DEFAULT_SCHOOL_BRAND.admissionsOpen ? "Yes" : "No"}
Application Form Fee: UGX ${DEFAULT_SCHOOL_BRAND.applicationFee}
Total Student Capacity: ${DEFAULT_SCHOOL_BRAND.studentCapacity}
Key Highlights / Stats: ${DEFAULT_SCHOOL_BRAND.frontSiteStats.students} Students | ${DEFAULT_SCHOOL_BRAND.frontSiteStats.passRate} Pass Rate | ${DEFAULT_SCHOOL_BRAND.frontSiteStats.teachers} Teachers | ${DEFAULT_SCHOOL_BRAND.frontSiteStats.campuses} Campuses

## 8. VISUAL BRAND COLORS
Primary Color: ${DEFAULT_SCHOOL_BRAND.primaryColor}
Accent Color: ${DEFAULT_SCHOOL_BRAND.accentColor}
Uniform Colors: ${DEFAULT_SCHOOL_BRAND.uniformColors}
`
  };
}

/**
 * Deep text and JSON parser to extract institutional identity, academic settings, finance configurations,
 * and operational rules.
 */
export function extractBrandFromText(text: string, baseBrand: SchoolBrandConfig = DEFAULT_SCHOOL_BRAND): {
  brand: SchoolBrandConfig;
  detected: DetectedField[];
} {
  const brand: SchoolBrandConfig = {
    ...baseBrand,
    coreValues: [...baseBrand.coreValues],
    classesOffered: [...baseBrand.classesOffered],
    subjectOfferings: [...baseBrand.subjectOfferings],
    mealsOffered: [...baseBrand.mealsOffered],
    boardingHouses: [...baseBrand.boardingHouses],
    frontSiteStats: { ...baseBrand.frontSiteStats }
  };
  const detected: DetectedField[] = [];

  const addField = (
    field: keyof SchoolBrandConfig | string,
    category: DetectedField["category"],
    label: string,
    value: string,
    confidence: "high" | "medium" | "low"
  ) => {
    const cleanValue = sanitizeText(value);
    if (cleanValue) {
      if (field === "periodDurationMinutes") {
        brand.periodDurationMinutes = parseInt(cleanValue, 10);
      } else {
        (brand as any)[field] = cleanValue;
      }
      detected.push({ field, category, label, value: cleanValue, confidence });
    }
  };

  // 1. Try JSON parsing first
  const trimmed = text.trim();
  if ((trimmed.startsWith("{") && trimmed.endsWith("}")) || (trimmed.startsWith("[") && trimmed.endsWith("]"))) {
    try {
      const data = JSON.parse(trimmed);
      const obj = Array.isArray(data) ? data[0] : data;
      if (obj && typeof obj === "object") {
        // Identity
        if (obj.name || obj.schoolName || obj.institution) addField("name", "identity", "School Name", obj.name || obj.schoolName || obj.institution, "high");
        if (obj.shortCode || obj.shortName || obj.code) addField("shortCode", "identity", "Short Code", obj.shortCode || obj.shortName || obj.code, "high");
        if (obj.motto || obj.slogan) addField("motto", "identity", "Motto", obj.motto || obj.slogan, "high");
        if (obj.unebCenterNumber || obj.uneb || obj.centerNo || obj.centerNumber) addField("unebCenterNumber", "identity", "UNEB Center #", obj.unebCenterNumber || obj.uneb || obj.centerNo || obj.centerNumber, "high");
        if (obj.moesRegNumber || obj.moes) addField("moesRegNumber", "identity", "MoES Reg #", obj.moesRegNumber || obj.moes, "high");
        if (obj.establishedYear || obj.founded || obj.yearEstablished) addField("establishedYear", "identity", "Established Year", String(obj.establishedYear || obj.founded || obj.yearEstablished), "high");
        if (obj.curriculum) addField("curriculum", "academics", "Curriculum", obj.curriculum, "high");
        if (obj.level || obj.category) addField("level", "identity", "School Category", obj.level || obj.category, "high");
        if (obj.mission) addField("mission", "identity", "Mission Statement", obj.mission, "high");
        if (obj.vision) addField("vision", "identity", "Vision Statement", obj.vision, "high");
        if (Array.isArray(obj.coreValues)) {
          brand.coreValues = obj.coreValues;
          addField("coreValues", "identity", "Core Values", obj.coreValues.join(", "), "high");
        }

        // Contact & Location
        if (obj.location || obj.address || obj.campus) addField("location", "identity", "Campus Location", obj.location || obj.address || obj.campus, "high");
        if (obj.district) addField("district", "identity", "District", obj.district, "high");
        if (obj.postalAddress) addField("postalAddress", "identity", "Postal Address", obj.postalAddress, "high");
        if (obj.phone || obj.tel || obj.contact) addField("phone", "identity", "Telephone Hotline", obj.phone || obj.tel || obj.contact, "high");
        if (obj.whatsapp) addField("whatsapp", "identity", "WhatsApp Number", obj.whatsapp, "high");
        if (obj.email) addField("email", "identity", "Admissions Email", obj.email, "high");
        if (obj.website || obj.portal || obj.url) addField("website", "identity", "Website URL", obj.website || obj.portal || obj.url, "high");

        // Leadership
        if (obj.directorName || obj.headOfSchool || obj.headmaster || obj.principal) addField("directorName", "leadership", "Head of School", obj.directorName || obj.headOfSchool || obj.headmaster || obj.principal, "high");
        if (obj.directorTitle || obj.title) addField("directorTitle", "leadership", "Leadership Title", obj.directorTitle || obj.title, "high");
        if (obj.directorBio || obj.bio || obj.message) addField("directorBio", "leadership", "Director Bio", obj.directorBio || obj.bio || obj.message, "high");
        if (obj.deputyAcademics) addField("deputyAcademics", "leadership", "Deputy (Academics)", obj.deputyAcademics, "high");
        if (obj.deputyAdmin) addField("deputyAdmin", "leadership", "Deputy (Admin)", obj.deputyAdmin, "high");
        if (obj.bursarName || obj.bursar) addField("bursarName", "leadership", "Bursar", obj.bursarName || obj.bursar, "high");

        // Academic settings
        if (obj.academicYear) addField("academicYear", "academics", "Academic Year", obj.academicYear, "high");
        if (obj.currentTerm) addField("currentTerm", "academics", "Current Term", obj.currentTerm, "high");
        if (obj.termDates) addField("termDates", "academics", "Term Dates", obj.termDates, "high");
        if (obj.gradingScale) addField("gradingScale", "academics", "Grading Scale", obj.gradingScale, "high");
        if (Array.isArray(obj.classesOffered)) {
          brand.classesOffered = obj.classesOffered;
          addField("classesOffered", "academics", "Classes Offered", obj.classesOffered.join(", "), "high");
        }
        if (Array.isArray(obj.subjectOfferings)) {
          brand.subjectOfferings = obj.subjectOfferings;
          addField("subjectOfferings", "academics", "Subject Offerings", obj.subjectOfferings.join(", "), "high");
        }

        // Finance settings
        if (obj.currency) addField("currency", "finance", "Currency", obj.currency, "high");
        if (obj.termFeesDay) addField("termFeesDay", "finance", "Day Fees", String(obj.termFeesDay), "high");
        if (obj.termFeesBoarding) addField("termFeesBoarding", "finance", "Boarding Fees", String(obj.termFeesBoarding), "high");
        if (obj.paymentBankName || obj.bankName) addField("paymentBankName", "finance", "Bank Name", obj.paymentBankName || obj.bankName, "high");
        if (obj.paymentAccountNumber || obj.accountNumber) addField("paymentAccountNumber", "finance", "Bank Account #", obj.paymentAccountNumber || obj.accountNumber, "high");
        if (obj.momoMerchantCode || obj.momoCode) addField("momoMerchantCode", "finance", "MTN MoMo Code", String(obj.momoMerchantCode || obj.momoCode), "high");
        if (obj.airtelMerchantCode || obj.airtelCode) addField("airtelMerchantCode", "finance", "Airtel Money Code", String(obj.airtelMerchantCode || obj.airtelCode), "high");
        if (obj.posReceiptHeader) addField("posReceiptHeader", "finance", "POS Header", obj.posReceiptHeader, "high");
        if (obj.posReceiptFooter) addField("posReceiptFooter", "finance", "POS Footer", obj.posReceiptFooter, "high");

        // Operations
        if (obj.dailyStartTime) addField("dailyStartTime", "operations", "Start Time", obj.dailyStartTime, "high");
        if (obj.dailyEndTime) addField("dailyEndTime", "operations", "Dismissal Time", obj.dailyEndTime, "high");
        if (obj.periodDurationMinutes) addField("periodDurationMinutes", "operations", "Period Duration", `${obj.periodDurationMinutes} mins`, "high");
        if (obj.attendanceMode) addField("attendanceMode", "operations", "Attendance Mode", obj.attendanceMode, "high");
        if (Array.isArray(obj.mealsOffered)) {
          brand.mealsOffered = obj.mealsOffered;
          addField("mealsOffered", "operations", "Meals Offered", obj.mealsOffered.join(", "), "high");
        }
        if (Array.isArray(obj.boardingHouses)) {
          brand.boardingHouses = obj.boardingHouses;
          addField("boardingHouses", "operations", "Boarding Houses", obj.boardingHouses.join(", "), "high");
        }
        if (obj.applicationFee) addField("applicationFee", "operations", "Application Fee", String(obj.applicationFee), "high");
        if (obj.studentCapacity) addField("studentCapacity", "operations", "Student Capacity", String(obj.studentCapacity), "high");
        if (obj.frontSiteStats && typeof obj.frontSiteStats === "object") {
          brand.frontSiteStats = { ...brand.frontSiteStats, ...obj.frontSiteStats };
          addField("frontSiteStats", "operations", "Front Site Stats", `${brand.frontSiteStats.students} students, ${brand.frontSiteStats.passRate} pass rate`, "high");
        }

        // Colors
        if (obj.primaryColor) addField("primaryColor", "branding", "Primary Color", obj.primaryColor, "high");
        if (obj.accentColor) addField("accentColor", "branding", "Accent Color", obj.accentColor, "high");
        if (obj.uniformColors) addField("uniformColors", "branding", "Uniform Colors", obj.uniformColors, "high");

        if (detected.length >= 3) {
          return { brand, detected };
        }
      }
    } catch {
      // Not valid JSON, continue to regex heuristics
    }
  }

  // 2. Comprehensive Regex Heuristics across all institutional documents
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

  // --- IDENTITY & REGISTRATION ---
  const nameMatch = text.match(/(?:School Name|Institution Name|Institution|Name of School|School|College|Academy):\s*([^\n\r]+)/i);
  if (nameMatch) {
    addField("name", "identity", "School Name", nameMatch[1], "high");
  } else {
    for (const line of lines.slice(0, 5)) {
      if (/secondary school|high school|college|academy|grammar school|comprehensive school/i.test(line)) {
        addField("name", "identity", "School Name", line.replace(/^[#*\-•\s=]+/, "").replace(/[=]+$/, "").trim(), "medium");
        break;
      }
    }
  }

  const codeMatch = text.match(/(?:Short Name|Short Code|Code|Initials|Acronym):\s*([^\n\r]+)/i);
  if (codeMatch) {
    addField("shortCode", "identity", "Short Code", codeMatch[1], "high");
  } else if (brand.name) {
    const words = brand.name.replace(/[^a-zA-Z\s]/g, "").split(/\s+/).filter((w) => w.length > 2);
    if (words.length >= 2) {
      const initials = words.slice(0, 4).map((w) => w[0].toUpperCase()).join("");
      addField("shortCode", "identity", "Generated Short Code", `${initials}-2026`, "low");
    }
  }

  const mottoMatch = text.match(/(?:Motto|Slogan|Tagline):\s*(?:"|“)?([^"”\n\r]+)(?:"|”)?/i);
  if (mottoMatch) {
    addField("motto", "identity", "Motto", mottoMatch[1].trim(), "high");
  }

  const unebMatch = text.match(/(?:UNEB Examination Center Number|UNEB Center Number|UNEB Center|Center No|Center Number|UNEB No):\s*#?\s*(U\d{3,4}[A-Za-z]?|\d{4,6})/i);
  if (unebMatch) {
    addField("unebCenterNumber", "identity", "UNEB Center #", unebMatch[1], "high");
  } else {
    const unebAlt = text.match(/\b(U\d{4})\b/i);
    if (unebAlt) {
      addField("unebCenterNumber", "identity", "UNEB Center #", unebAlt[1].toUpperCase(), "medium");
    }
  }

  const moesMatch = text.match(/(?:Ministry of Education Registration(?:\s*\([^)]*\))?|MoES Registration|MoES Reg Number|MoES Reg|MoES No):\s*([^\n\r]+)/i);
  if (moesMatch) {
    addField("moesRegNumber", "identity", "MoES Registration", moesMatch[1], "high");
  }

  const estMatch = text.match(/(?:Year Established|Established Year|Founded in|Founded|Established):\s*(\d{4})/i);
  if (estMatch) {
    addField("establishedYear", "identity", "Established Year", estMatch[1], "high");
  }

  const currMatch = text.match(/(?:Curriculum Standards|Curriculum|Syllabus|Examination Body):\s*([^\n\r]+)/i);
  if (currMatch) {
    addField("curriculum", "academics", "Curriculum", currMatch[1], "high");
    if (/CBC|Competence/i.test(currMatch[1])) {
      brand.gradingScale = "CBC";
    } else if (/Cambridge|IGCSE/i.test(currMatch[1])) {
      brand.gradingScale = "CAMBRIDGE";
    } else {
      brand.gradingScale = "UNEB";
    }
  }

  const levelMatch = text.match(/(?:School Category|Category|Level|Institution Level):\s*([^\n\r]+)/i);
  if (levelMatch) {
    addField("level", "identity", "School Category", levelMatch[1], "high");
  }

  const missionMatch = text.match(/(?:Mission Statement|Mission):\s*([^\n\r]+)/i);
  if (missionMatch) addField("mission", "identity", "Mission Statement", missionMatch[1], "high");

  const visionMatch = text.match(/(?:Vision Statement|Vision):\s*([^\n\r]+)/i);
  if (visionMatch) addField("vision", "identity", "Vision Statement", visionMatch[1], "high");

  const valuesMatch = text.match(/(?:Core Values|Values):\s*([^\n\r]+)/i);
  if (valuesMatch) {
    const values = valuesMatch[1].split(/[,;•|]/).map((v) => v.trim()).filter(Boolean);
    if (values.length > 0) {
      brand.coreValues = values;
      addField("coreValues", "identity", "Core Values", values.join(", "), "high");
    }
  }

  // --- LOCATION & CONTACTS ---
  const locMatch = text.match(/(?:Campus Location|Physical Campus|Location|Physical Address|Address|Campus):\s*([^\n\r]+)/i);
  if (locMatch) {
    addField("location", "identity", "Campus Location", locMatch[1], "high");
  }

  const districtMatch = text.match(/(?:District):\s*([^\n\r,]+)/i);
  if (districtMatch) {
    addField("district", "identity", "District", districtMatch[1].trim(), "high");
  }

  const phoneMatch = text.match(/(?:Admissions & Administrative Hotline|Telephone Hotline|Phone|Tel|Hotline|Contact):\s*([+0-9\s()-]{9,25})/i);
  if (phoneMatch) {
    addField("phone", "identity", "Telephone Hotline", phoneMatch[1], "high");
  } else {
    const rawPhone = text.match(/\b(\+256[\s-]?[0-9]{3}[\s-]?[0-9]{3}[\s-]?[0-9]{3}|07[0-9]{2}[\s-]?[0-9]{3}[\s-]?[0-9]{3})\b/);
    if (rawPhone) {
      addField("phone", "identity", "Telephone Hotline", rawPhone[1], "medium");
    }
  }

  const waMatch = text.match(/(?:Admissions WhatsApp Helpdesk|WhatsApp Line|WhatsApp Helpdesk|WhatsApp|WA):\s*([+0-9\s()-]{9,25})/i);
  if (waMatch) {
    addField("whatsapp", "identity", "WhatsApp Number", waMatch[1], "high");
  } else if (brand.phone) {
    brand.whatsapp = brand.phone;
  }

  const emailMatch = text.match(/(?:Official Email|Inquiries Email|Email|Admissions Email|Mail):\s*([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i);
  if (emailMatch) {
    addField("email", "identity", "Admissions Email", emailMatch[1], "high");
  }

  const webMatch = text.match(/(?:Institutional Portal|Website|Portal|URL):\s*(https?:\/\/[^\s\n\r]+)/i);
  if (webMatch) {
    addField("website", "identity", "Website URL", webMatch[1], "high");
  }

  // --- LEADERSHIP ---
  const dirMatch = text.match(/(?:Head of School|Headmaster|Head Teacher|Principal|Director|Rector|Provost):\s*([^\n\r]+)/i);
  if (dirMatch) {
    addField("directorName", "leadership", "Head of School", dirMatch[1], "high");
  }

  const titleMatch = text.match(/(?:Leadership Title|Director Title|Title):\s*([^\n\r]+)/i);
  if (titleMatch) {
    addField("directorTitle", "leadership", "Leadership Title", titleMatch[1], "high");
  }

  const bioMatch = text.match(/(?:Headmaster Bio|Director Bio|Bio|Welcome Message):\s*([^\n\r]+(?:\n[^\n\r]+){0,2})/i);
  if (bioMatch) {
    addField("directorBio", "leadership", "Director Bio", bioMatch[1].replace(/\n+/g, " "), "high");
  }

  const depAcadMatch = text.match(/(?:Deputy Headteacher \(Academics\)|Deputy Academics|Academic Dean):\s*([^\n\r]+)/i);
  if (depAcadMatch) addField("deputyAcademics", "leadership", "Deputy (Academics)", depAcadMatch[1], "high");

  const depAdminMatch = text.match(/(?:Deputy Headteacher \(Administration\)|Deputy Admin):\s*([^\n\r]+)/i);
  if (depAdminMatch) addField("deputyAdmin", "leadership", "Deputy (Admin)", depAdminMatch[1], "high");

  const bursarMatch = text.match(/(?:Bursar|Financial Controller|Accountant):\s*([^\n\r]+)/i);
  if (bursarMatch) addField("bursarName", "leadership", "Bursar", bursarMatch[1], "high");

  // --- ACADEMIC & GRADING SYSTEM ---
  const yearMatch = text.match(/(?:Academic Year):\s*(\d{4}(?:\/\d{4})?)/i);
  if (yearMatch) addField("academicYear", "academics", "Academic Year", yearMatch[1], "high");

  const termMatch = text.match(/(?:Current Active Term|Current Term|Term):\s*(Term\s*[1-3]|Semester\s*[1-2])/i);
  if (termMatch) addField("currentTerm", "academics", "Active Term", termMatch[1], "high");

  const termDatesMatch = text.match(/(?:Term Dates|Session Dates):\s*([^\n\r]+)/i);
  if (termDatesMatch) addField("termDates", "academics", "Term Dates", termDatesMatch[1], "high");

  const classesMatch = text.match(/(?:Classes & Streams Offered|Classes Offered|Classes):\s*([^\n\r]+)/i);
  if (classesMatch) {
    const cls = classesMatch[1].split(/[,;]/).map((c) => c.trim()).filter(Boolean);
    if (cls.length > 0) {
      brand.classesOffered = cls;
      addField("classesOffered", "academics", "Classes Offered", cls.join(", "), "high");
    }
  }

  const subjectsMatch = text.match(/(?:Academic Subjects Offered|Subjects Offered|Subjects):\s*([^\n\r]+)/i);
  if (subjectsMatch) {
    const subs = subjectsMatch[1].split(/[,;]/).map((s) => s.trim()).filter(Boolean);
    if (subs.length > 0) {
      brand.subjectOfferings = subs;
      addField("subjectOfferings", "academics", "Subjects Offered", subs.join(", "), "high");
    }
  }

  // --- FINANCE, FEES & POS ---
  const currCurrency = text.match(/(?:Billing Currency|Currency):\s*([A-Z]{3})/i);
  if (currCurrency) addField("currency", "finance", "Billing Currency", currCurrency[1], "high");

  const feeDayMatch = text.match(/(?:Tuition Fees per Term \(Day Scholar\)|Tuition Fees \(Day\)|Day Fees|Day Scholar Fees):\s*(?:UGX|USD|KES)?\s*([0-9,.]+)/i);
  if (feeDayMatch) addField("termFeesDay", "finance", "Day Tuition Fee", feeDayMatch[1].replace(/,/g, ""), "high");

  const feeBoardMatch = text.match(/(?:Tuition Fees per Term \(Boarding Student\)|Tuition Fees \(Boarding\)|Boarding Fees|Boarder Fees):\s*(?:UGX|USD|KES)?\s*([0-9,.]+)/i);
  if (feeBoardMatch) addField("termFeesBoarding", "finance", "Boarding Tuition Fee", feeBoardMatch[1].replace(/,/g, ""), "high");

  const bankNameMatch = text.match(/(?:Official Bank Name|Bank Name|Bank):\s*([^\n\r]+)/i);
  if (bankNameMatch) addField("paymentBankName", "finance", "Bank Name", bankNameMatch[1], "high");

  const bankAccMatch = text.match(/(?:Bank Account Number|Account Number|A\/C Number|A\/C):\s*([0-9A-Za-z]+)/i);
  if (bankAccMatch) addField("paymentAccountNumber", "finance", "Bank Account #", bankAccMatch[1], "high");

  const momoMatch = text.match(/(?:MTN MoMo Pay Merchant Code|MTN MoMo Merchant|MTN MoMo|MoMo Pay Code|MoMo):\s*([0-9]+)/i);
  if (momoMatch) addField("momoMerchantCode", "finance", "MTN MoMo Pay Code", momoMatch[1], "high");

  const airtelMatch = text.match(/(?:Airtel Money Merchant Code|Airtel Money Merchant|Airtel Money Code|Airtel):\s*([0-9]+)/i);
  if (airtelMatch) addField("airtelMerchantCode", "finance", "Airtel Money Code", airtelMatch[1], "high");

  const posHeaderMatch = text.match(/(?:POS Thermal Receipt Header|POS Receipt Header|POS Header):\s*([^\n\r]+)/i);
  if (posHeaderMatch) addField("posReceiptHeader", "finance", "POS Header", posHeaderMatch[1], "high");

  // --- OPERATIONS, WELFARE & MEALS ---
  const startTimeMatch = text.match(/(?:Daily School Reporting Time|Daily Start Time|Reporting Time):\s*([0-9:AMP\s]+)/i);
  if (startTimeMatch) addField("dailyStartTime", "operations", "Start Time", startTimeMatch[1].trim(), "high");

  const endTimeMatch = text.match(/(?:Daily Dismissal Time|Dismissal Time|Closing Time):\s*([0-9:AMP\s]+)/i);
  if (endTimeMatch) addField("dailyEndTime", "operations", "Dismissal Time", endTimeMatch[1].trim(), "high");

  const periodMatch = text.match(/(?:Standard Period Duration|Period Duration):\s*(\d+)\s*(?:Minutes|mins)?/i);
  if (periodMatch) {
    brand.periodDurationMinutes = parseInt(periodMatch[1], 10);
    addField("periodDurationMinutes", "operations", "Period Duration", `${periodMatch[1]} Minutes`, "high");
  }

  const attModeMatch = text.match(/(?:Attendance Tracking Mode|Attendance Mode):\s*([^\n\r]+)/i);
  if (attModeMatch) {
    if (/biometric|rfid|nfc/i.test(attModeMatch[1])) brand.attendanceMode = "Biometric";
    else if (/period/i.test(attModeMatch[1])) brand.attendanceMode = "Period";
    else brand.attendanceMode = "Daily";
    addField("attendanceMode", "operations", "Attendance Mode", brand.attendanceMode, "high");
  }

  const mealsMatch = text.match(/(?:Meals Offered Daily|Meals Offered|Meals):\s*([^\n\r]+)/i);
  if (mealsMatch) {
    const meals = mealsMatch[1].split(/[,;]/).map((m) => m.trim()).filter(Boolean);
    if (meals.length > 0) {
      brand.mealsOffered = meals;
      addField("mealsOffered", "operations", "Meals Offered", meals.join(", "), "high");
    }
  }

  const dormsMatch = text.match(/(?:Boarding Houses & Dormitories|Boarding Houses|Dormitories|Houses):\s*([^\n\r]+)/i);
  if (dormsMatch) {
    const dorms = dormsMatch[1].split(/[,;]/).map((d) => d.trim()).filter(Boolean);
    if (dorms.length > 0) {
      brand.boardingHouses = dorms;
      addField("boardingHouses", "operations", "Boarding Houses", dorms.join(", "), "high");
    }
  }

  const appFeeMatch = text.match(/(?:Application Form Fee|Application Fee):\s*(?:UGX|USD|KES)?\s*([0-9,.]+)/i);
  if (appFeeMatch) addField("applicationFee", "operations", "Application Fee", appFeeMatch[1].replace(/,/g, ""), "high");

  const capMatch = text.match(/(?:Total School Capacity|Student Capacity|Capacity):\s*([0-9,]+)/i);
  if (capMatch) addField("studentCapacity", "operations", "Capacity", capMatch[1].replace(/,/g, ""), "high");

  // Colors & Branding
  const hexMatches = text.match(/#([0-9a-fA-F]{6})\b/g);
  if (hexMatches && hexMatches.length > 0) {
    addField("primaryColor", "branding", "Primary Color", hexMatches[0], "medium");
    if (hexMatches.length > 1) {
      addField("accentColor", "branding", "Accent Color", hexMatches[1], "medium");
    }
  }

  // Uniform
  const uniformMatch = text.match(/(?:Uniform Colors|School Uniform):\s*([^\n\r]+)/i);
  if (uniformMatch) addField("uniformColors", "branding", "Uniform Colors", uniformMatch[1], "high");

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

  // Helper to compute category breakdown
  const computeBreakdown = (items: DetectedField[]) => ({
    identity: items.filter((i) => i.category === "identity").length,
    academics: items.filter((i) => i.category === "academics").length,
    finance: items.filter((i) => i.category === "finance").length,
    operations: items.filter((i) => i.category === "operations").length,
    leadership: items.filter((i) => i.category === "leadership").length,
    branding: items.filter((i) => i.category === "branding").length,
  });

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
          category: "branding",
          label: "School Badge / Crest (from ZIP)",
          value: bestBadge.name,
          confidence: "high",
        });
      }

      const score = Math.min(100, Math.round((detected.length / 15) * 100));

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
        summary: `Successfully parsed ZIP archive "${fileName}". Extracted ${extractedImages.length} images and configured ${detected.length} institutional & system settings.`,
        categoryBreakdown: computeBreakdown(detected),
      };
    } catch (err: any) {
      throw new Error(`Failed to extract ZIP archive: ${err.message || "Invalid archive format"}`);
    }
  }

  // 2. Handle Document Files (.txt, .json, .csv, .md, .html)
  const rawText = await file.text();
  const { brand, detected } = extractBrandFromText(rawText);
  const score = Math.min(100, Math.round((detected.length / 15) * 100));

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
    summary: `Analyzed document "${fileName}". Detected and configured ${detected.length} preferences & operational settings with ${score}% structural confidence.`,
    categoryBreakdown: computeBreakdown(detected),
  };
}
