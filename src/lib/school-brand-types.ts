export interface SchoolBrandConfig {
  name: string;
  shortCode: string;
  motto: string;
  unebCenterNumber: string;
  curriculum: string;
  badgeUrl: string;
  badgeInitials: string;
  location: string;
  phone: string;
  whatsapp: string;
  email: string;
  website: string;
  directorName: string;
  directorTitle: string;
  directorBio: string;
  primaryColor: string;
  accentColor: string;
  level: string;
}

export const DEFAULT_SCHOOL_BRAND: SchoolBrandConfig = {
  name: "Wellstar Bright Secondary School",
  shortCode: "WBSS-2026",
  motto: "A holistic school built for character & intellect.",
  unebCenterNumber: "U0482",
  curriculum: "Competence-Based Curriculum (CBC) & UNEB Standard",
  badgeUrl: "/assets/logo.png",
  badgeInitials: "WB",
  location: "off Kayunga Road, Kabembe, Mukono District, Uganda",
  phone: "+256 701 116 781",
  whatsapp: "+256 701 116 781",
  email: "info@wellstarbright.sc.ug",
  website: "https://wellstarbright.sc.ug",
  directorName: "Nshuti Medan",
  directorTitle: "Head of School / Director",
  directorBio: "Leading our educational institutions with a holistic whole-child approach to academic and moral excellence.",
  primaryColor: "#0b2256",
  accentColor: "#f26522",
  level: "Mixed Day & Boarding Secondary School (S.1 — S.6)",
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
    curriculum: "Uganda National Examination Board (UCE & UACE)",
    badgeUrl: "/gallery/stem-lab.png",
    badgeInitials: "SP",
    location: "Main Hill Road, Wakiso District",
    phone: "+256 701 445 522",
    whatsapp: "+256 701 445 522",
    email: "admissions@stpaulscollege.ac.ug",
    website: "https://stpaulscollege.ac.ug",
    directorName: "Canon David Ssebunya",
    directorTitle: "Headmaster & College Provost",
    directorBio: "Fostering academic rigor, traditional discipline, and holistic Christian leadership.",
    primaryColor: "#065f46",
    accentColor: "#d97706",
    level: "Boarding Secondary School (S.1 — S.6)",
  },
  greenhill: {
    name: "Greenhill Secondary",
    shortCode: "GHS-2026",
    motto: "Extend Your Horizons",
    unebCenterNumber: "U0840",
    curriculum: "Competence-Based Curriculum (CBC) & UNEB Standard",
    badgeUrl: "/gallery/arts-studio.png",
    badgeInitials: "GH",
    location: "Mbogo Road, Kibuli, Kampala",
    phone: "+256 772 300 400",
    whatsapp: "+256 772 300 400",
    email: "info@greenhillsecondary.ac.ug",
    website: "https://greenhillsecondary.ac.ug",
    directorName: "Mrs. Joy Veronica Maraka",
    directorTitle: "Rector / Managing Director",
    directorBio: "Empowering every learner with innovative digital tools, practical sciences, and creative arts.",
    primaryColor: "#1d4ed8",
    accentColor: "#ea580c",
    level: "Mixed Day & Boarding Secondary School",
  },
};
