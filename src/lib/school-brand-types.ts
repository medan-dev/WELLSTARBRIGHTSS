export interface FrontSiteStats {
  students: string;
  passRate: string;
  teachers: string;
  campuses: string;
}

export interface SchoolBrandConfig {
  // 1. Core Identity & Legal Registration
  name: string;
  shortCode: string;
  motto: string;
  unebCenterNumber: string;
  moesRegNumber: string;
  establishedYear: string;
  level: string;
  curriculum: string;
  mission: string;
  vision: string;
  coreValues: string[];

  // 2. Visual Branding & Crest
  badgeUrl: string;
  badgeInitials: string;
  primaryColor: string;
  accentColor: string;
  uniformColors?: string;

  // 3. Campus Location & Contact Details
  location: string;
  district?: string;
  phone: string;
  whatsapp: string;
  email: string;
  website: string;
  postalAddress?: string;

  // 4. Institutional Leadership
  directorName: string;
  directorTitle: string;
  directorBio: string;
  deputyAcademics?: string;
  deputyAdmin?: string;
  bursarName?: string;

  // 5. Academic & Grading System Configuration
  academicYear: string;
  currentTerm: string;
  termDates: string;
  gradingScale: "CBC" | "UNEB" | "CAMBRIDGE";
  classesOffered: string[];
  subjectOfferings: string[];

  // 6. Finance, Fees & Anti-Leakage POS Configuration
  currency: string;
  termFeesDay: string;
  termFeesBoarding: string;
  paymentBankName: string;
  paymentAccountNumber: string;
  momoMerchantCode: string;
  airtelMerchantCode: string;
  posReceiptHeader: string;
  posReceiptFooter?: string;

  // 7. Operational Schedules, Attendance & Meals
  dailyStartTime: string;
  dailyEndTime: string;
  periodDurationMinutes: number;
  attendanceMode: "Daily" | "Period" | "Biometric";
  mealPlanEnabled: boolean;
  mealsOffered: string[];
  boardingHouses: string[];

  // 8. Admissions & Public Front Site Settings
  admissionsOpen: boolean;
  applicationFee: string;
  studentCapacity: string;
  frontSiteStats: FrontSiteStats;
}

export const DEFAULT_SCHOOL_BRAND: SchoolBrandConfig = {
  // Identity
  name: "Wellstar Bright Secondary School",
  shortCode: "WBSS-2026",
  motto: "A holistic school built for character & intellect.",
  unebCenterNumber: "U0482",
  moesRegNumber: "MoES/PSS/892/2018",
  establishedYear: "2018",
  level: "Mixed Day & Boarding Secondary School (S.1 — S.6)",
  curriculum: "Competence-Based Curriculum (CBC) & UNEB Standard",
  mission: "To provide transformative, value-centered education that empowers students to lead with excellence, innovation, and integrity.",
  vision: "To be East Africa's benchmark institution for academic rigor, character development, and holistic innovation.",
  coreValues: ["God-Fearing", "Integrity", "Academic Rigor", "Innovation", "Discipline"],

  // Visual Branding
  badgeUrl: "/logo.png",
  badgeInitials: "WB",
  primaryColor: "#0b2256",
  accentColor: "#f26522",
  uniformColors: "Navy Blue Blazers, White Shirts & Khaki Trousers / Skirts",

  // Location & Contact
  location: "off Kayunga Road, Kabembe, Mukono District, Uganda",
  district: "Mukono District",
  phone: "+256 701 116 781",
  whatsapp: "+256 701 116 781",
  email: "info@wellstarbright.sc.ug",
  website: "https://wellstarbright.sc.ug",
  postalAddress: "P.O. Box 482, Mukono, Uganda",

  // Leadership
  directorName: "Nshuti Medan",
  directorTitle: "Head of School / Director",
  directorBio: "Leading our educational institutions with a holistic whole-child approach to academic and moral excellence.",
  deputyAcademics: "Mr. Kigozi Emmanuel",
  deputyAdmin: "Ms. Namubiru Sarah",
  bursarName: "Mr. Kasule Brian",

  // Academic System Settings
  academicYear: "2026/2027",
  currentTerm: "Term 1",
  termDates: "02 Feb 2026 — 08 May 2026",
  gradingScale: "CBC",
  classesOffered: ["S.1", "S.2", "S.3", "S.4", "S.5 Arts", "S.5 Sci", "S.6 Arts", "S.6 Sci"],
  subjectOfferings: [
    "Mathematics", "English Language", "Physics", "Chemistry", "Biology",
    "Geography", "History & Political Ed", "ICT & Computer Studies",
    "Entrepreneurship", "Literature in English", "Christian Religious Ed", "Fine Art"
  ],

  // Finance & POS Settings
  currency: "UGX",
  termFeesDay: "850,000",
  termFeesBoarding: "1,450,000",
  paymentBankName: "Stanbic Bank Uganda",
  paymentAccountNumber: "9030018829401",
  momoMerchantCode: "612450",
  airtelMerchantCode: "189420",
  posReceiptHeader: "WELLSTAR BRIGHT SS — BURSARY & POS COMMAND",
  posReceiptFooter: "Fees once paid are non-refundable. Verified by EDUREXA Ledger.",

  // Operational Schedules & Welfare
  dailyStartTime: "07:30 AM",
  dailyEndTime: "04:30 PM",
  periodDurationMinutes: 40,
  attendanceMode: "Biometric",
  mealPlanEnabled: true,
  mealsOffered: ["Breakfast (Porridge & Bread)", "Lunch (Posho, Beans & Beef)", "Evening Tea", "Supper (Rice & Beans)"],
  boardingHouses: ["Mandela House", "Kabaka Mutebi House", "Lumumba House", "Nightingale House"],

  // Admissions & Public Settings
  admissionsOpen: true,
  applicationFee: "50,000",
  studentCapacity: "1,500",
  frontSiteStats: {
    students: "1,250+",
    passRate: "98.4%",
    teachers: "56",
    campuses: "2"
  }
};

export const PRESET_SCHOOLS: Record<string, Partial<SchoolBrandConfig>> = {
  demo: {
    ...DEFAULT_SCHOOL_BRAND,
  },
  st_pauls: {
    name: "St. Paul's College",
    shortCode: "SPC-2026",
    motto: "Laborare et Orare • In Pursuit of Wisdom",
    unebCenterNumber: "U0115",
    moesRegNumber: "MoES/PSS/104/1962",
    establishedYear: "1962",
    curriculum: "Uganda National Examination Board (UCE & UACE)",
    badgeUrl: "/gallery/stem-lab.png",
    badgeInitials: "SP",
    location: "Main Hill Road, Wakiso District",
    district: "Wakiso District",
    phone: "+256 701 445 522",
    whatsapp: "+256 701 445 522",
    email: "admissions@stpaulscollege.ac.ug",
    website: "https://stpaulscollege.ac.ug",
    directorName: "Canon David Ssebunya",
    directorTitle: "Headmaster & College Provost",
    directorBio: "Fostering academic rigor, traditional discipline, and holistic Christian leadership.",
    deputyAcademics: "Dr. Arthur Musoke",
    deputyAdmin: "Rev. Sister Mary Goretti",
    bursarName: "Mrs. Florence Nalwadda",
    primaryColor: "#065f46",
    accentColor: "#d97706",
    level: "Boarding Secondary School (S.1 — S.6)",
    academicYear: "2026/2027",
    currentTerm: "Term 1",
    termDates: "02 Feb 2026 — 01 May 2026",
    gradingScale: "UNEB",
    classesOffered: ["S.1", "S.2", "S.3", "S.4", "S.5", "S.6"],
    subjectOfferings: ["Mathematics", "English", "Physics", "Chemistry", "Biology", "History", "Geography", "Divinity", "Economics", "Literature"],
    currency: "UGX",
    termFeesDay: "920,000",
    termFeesBoarding: "1,650,000",
    paymentBankName: "Centenary Bank",
    paymentAccountNumber: "3100084729101",
    momoMerchantCode: "508219",
    airtelMerchantCode: "220194",
    posReceiptHeader: "ST. PAUL'S COLLEGE — BURSARY DEPT",
    attendanceMode: "Daily",
    dailyStartTime: "07:15 AM",
    dailyEndTime: "05:00 PM",
    periodDurationMinutes: 45,
    mealPlanEnabled: true,
    mealsOffered: ["Morning Breakfast", "Midday Lunch", "Supper"],
    boardingHouses: ["St. Paul House", "St. Peter House", "St. Luke House", "Archbishop Luwum House"],
    admissionsOpen: true,
    applicationFee: "60,000",
    studentCapacity: "1,800",
    frontSiteStats: {
      students: "1,600+",
      passRate: "99.1%",
      teachers: "68",
      campuses: "1"
    }
  },
  greenhill: {
    name: "Greenhill Secondary",
    shortCode: "GHS-2026",
    motto: "Extend Your Horizons",
    unebCenterNumber: "U0840",
    moesRegNumber: "MoES/PSS/412/1994",
    establishedYear: "1994",
    curriculum: "Competence-Based Curriculum (CBC) & UNEB Standard",
    badgeUrl: "/gallery/arts-studio.png",
    badgeInitials: "GH",
    location: "Mbogo Road, Kibuli, Kampala",
    district: "Kampala",
    phone: "+256 772 300 400",
    whatsapp: "+256 772 300 400",
    email: "info@greenhillsecondary.ac.ug",
    website: "https://greenhillsecondary.ac.ug",
    directorName: "Mrs. Joy Veronica Maraka",
    directorTitle: "Rector / Managing Director",
    directorBio: "Empowering every learner with innovative digital tools, practical sciences, and creative arts.",
    deputyAcademics: "Mr. Wilberforce Kamya",
    deputyAdmin: "Mrs. Brenda Nabawanuka",
    bursarName: "Mr. Patrick Mwesigwa",
    primaryColor: "#1d4ed8",
    accentColor: "#ea580c",
    level: "Mixed Day & Boarding Secondary School",
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
    attendanceMode: "Biometric",
    dailyStartTime: "07:30 AM",
    dailyEndTime: "04:30 PM",
    periodDurationMinutes: 40,
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
    }
  },
  kitende: {
    name: "St. Mary's Boarding Secondary School Kitende",
    shortCode: "SMSS-KITENDE",
    motto: "Per Aspera Ad Astra • Through Hardship to the Stars",
    unebCenterNumber: "U0080",
    moesRegNumber: "MoES/PSS/023/1995",
    establishedYear: "1995",
    curriculum: "UNEB Center of Academic & Sports Excellence",
    badgeUrl: "/logo.png",
    badgeInitials: "SM",
    location: "Entebbe Road, Kitende, Wakiso District, Uganda",
    district: "Wakiso District",
    phone: "+256 414 382 110",
    whatsapp: "+256 702 382 110",
    email: "admissions@stmaryskitende.ac.ug",
    website: "https://stmaryskitende.ac.ug",
    directorName: "Dr. Lawrence Mulindwa",
    directorTitle: "Executive Director & Proprietor",
    directorBio: "Championing unmatched academic supremacy, sports development, and disciplined national leadership.",
    deputyAcademics: "Mr. Ssentongo Godfrey",
    deputyAdmin: "Mr. Male Patrick",
    bursarName: "Mr. Mugisha Robert",
    primaryColor: "#800020",
    accentColor: "#d4af37",
    level: "Premier Co-Educational Boarding Secondary School",
    academicYear: "2026/2027",
    currentTerm: "Term 1",
    termDates: "01 Feb 2026 — 02 May 2026",
    gradingScale: "UNEB",
    classesOffered: ["S.1", "S.2", "S.3", "S.4", "S.5 Arts", "S.5 Sci", "S.6 Arts", "S.6 Sci"],
    subjectOfferings: ["Pure Mathematics", "English Language", "Physics", "Chemistry", "Biology", "History", "Geography", "Economics", "Sub-Maths", "ICT", "Divinity"],
    currency: "UGX",
    termFeesDay: "950,000",
    termFeesBoarding: "1,850,000",
    paymentBankName: "Dfcu Bank Uganda",
    paymentAccountNumber: "0182104928100",
    momoMerchantCode: "710294",
    airtelMerchantCode: "492011",
    posReceiptHeader: "ST. MARY'S SS KITENDE — ACCOUNTS & TREASURY",
    attendanceMode: "Biometric",
    dailyStartTime: "07:00 AM",
    dailyEndTime: "05:30 PM",
    periodDurationMinutes: 45,
    mealPlanEnabled: true,
    mealsOffered: ["Morning Milk Porridge & Rolls", "Hearty Posho & Beans / Meat", "Evening Tea", "Dinner"],
    boardingHouses: ["Mulindwa Complex", "St. Jude Hostel", "St. Mary's Wing", "Kizito Block"],
    admissionsOpen: true,
    applicationFee: "75,000",
    studentCapacity: "3,500",
    frontSiteStats: {
      students: "3,200+",
      passRate: "100%",
      teachers: "120",
      campuses: "2"
    }
  }
};
