export interface DocArticle {
  slug: string;
  title: string;
  shortTitle?: string;
  category: string;
  description: string;
  readingTime: string;
  lastUpdated: string;
  badge?: {
    text: string;
    variant: "default" | "success" | "warning" | "info";
  };
  toc: { id: string; title: string }[];
  content: {
    lead: string;
    sections: {
      id: string;
      title: string;
      body: string[];
      callout?: {
        type: "tip" | "info" | "warning" | "success";
        title: string;
        message: string;
      };
      codeExample?: {
        title: string;
        language: string;
        code: string;
      };
      steps?: {
        stepNumber: string;
        title: string;
        description: string;
      }[];
      table?: {
        headers: string[];
        rows: string[][];
      };
    }[];
  };
}

export interface DocCategory {
  title: string;
  items: {
    title: string;
    slug: string;
    badge?: string;
    badgeColor?: string;
  }[];
}

export const DOC_CATEGORIES: DocCategory[] = [
  {
    title: "Getting Started",
    items: [
      { title: "Introduction & Overview", slug: "introduction", badge: "Start Here", badgeColor: "bg-blue-100 text-blue-700" },
      { title: "Multi-Tenant Architecture", slug: "architecture" },
      { title: "School Onboarding (48h)", slug: "onboarding", badge: "Setup", badgeColor: "bg-emerald-100 text-emerald-700" },
      { title: "Free 4-Hour Sandbox Demo", slug: "sandbox-demo", badge: "Free", badgeColor: "bg-orange-100 text-[#f26522]" },
    ],
  },
  {
    title: "Core Engines & Workflows",
    items: [
      { title: "Academic & UNEB Engine", slug: "academics", badge: "CBC Ready", badgeColor: "bg-purple-100 text-purple-700" },
      { title: "Finance & POS Anti-Leakage", slug: "finance", badge: "Core", badgeColor: "bg-emerald-100 text-emerald-700" },
      { title: "Student SIS & Staff HR", slug: "students-staff" },
      { title: "Boarding, Clinic & Logistics", slug: "operations" },
    ],
  },
  {
    title: "Portals & URL Slashing",
    items: [
      { title: "Direct URL Portal Access", slug: "portals", badge: "Slash Access", badgeColor: "bg-amber-100 text-amber-800" },
    ],
  },
  {
    title: "Integrations & Platform",
    items: [
      { title: "SMS & WhatsApp Automation", slug: "integrations" },
      { title: "Security, RBAC & Cloud Backups", slug: "security", badge: "Enterprise", badgeColor: "bg-indigo-100 text-indigo-700" },
    ],
  },
];

export const DOC_ARTICLES: Record<string, DocArticle> = {
  introduction: {
    slug: "introduction",
    title: "Introduction to EDUREXA",
    shortTitle: "Introduction",
    category: "Getting Started",
    description: "Learn about EDUREXA, the next-generation multi-tenant school management ecosystem designed for modern educational institutions across Uganda and Africa.",
    readingTime: "4 min read",
    lastUpdated: "November 2026",
    badge: { text: "Start Here", variant: "info" },
    toc: [
      { id: "what-is-edurexa", title: "What is EDUREXA?" },
      { id: "core-pillars", title: "Core Architectural Pillars" },
      { id: "system-prerequisites", title: "Prerequisites & Compatibility" },
      { id: "free-sandbox", title: "Free 4-Hour Sandbox Testing" },
    ],
    content: {
      lead: "EDUREXA is a unified cloud-native school operating system built from the ground up to solve the operational realities of nursery, primary, and secondary school institutions. From UNEB competence-based grading to offline thermal cashier desks, EDUREXA centralizes every department into one reliable ecosystem.",
      sections: [
        {
          id: "what-is-edurexa",
          title: "What is EDUREXA?",
          body: [
            "EDUREXA eliminates the fragmentation of disconnected spreadsheets, paper ledgers, and ad-hoc desktop tools. It gives administrators real-time visibility into collections, attendance, UNEB competence marks, clinic admissions, and multi-campus metrics through a single browser interface.",
            "Each onboarded school operates in a dedicated, cryptographically isolated tenant with automated daily backups, custom school branding, and granular role-based permissions for directors, headteachers, bursars, teachers, and parents.",
          ],
          callout: {
            type: "info",
            title: "Zero Heavy Hardware Required",
            message: "EDUREXA runs entirely via modern web browsers on PCs, laptops, tablets, and smartphones. No expensive local server racks or complex IT installations are necessary.",
          },
        },
        {
          id: "core-pillars",
          title: "Core Architectural Pillars",
          body: [
            "Every component of EDUREXA has been engineered around four core institutional pillars:",
          ],
          table: {
            headers: ["Pillar", "Institutional Impact", "Key Feature"],
            rows: [
              ["Anti-Leakage Finance", "Stops fee slippage, fake bank slips, and unauthorized manual ledger alterations.", "Offline POS desk, thermal receipts, cryptographic receipt verification codes."],
              ["Academic Accuracy", "Zero-error marks entry, automated UNEB division calculations, and instant report cards.", "O-Level CBC 1.0-3.0 scale, A-Level combinations, broad-sheets with 1-click PDF export."],
              ["Direct Slashing Portals", "Clean, unencumbered user experience with role-based routing.", "Direct access via /admin, /teacher, /student, and /super-admin with zero marketing distraction."],
              ["Instant Communications", "Immediate stakeholder transparency on fees, attendance, and emergency alerts.", "Direct WhatsApp notification dispatch and automated SMS gateway triggers."],
            ],
          },
        },
        {
          id: "system-prerequisites",
          title: "Prerequisites & Compatibility",
          body: [
            "EDUREXA is optimized for low-bandwidth African school network environments, including 3G, 4G, and satellite internet (Starlink).",
            "Cashier POS desks support standard 58mm and 80mm ESC/POS USB and Bluetooth thermal printers. Barcode scanners and webcam biometric modules connect plug-and-play without requiring custom driver installations.",
          ],
          codeExample: {
            title: "Recommended Hardware & Network Profile",
            language: "bash",
            code: `# Minimum Recommended School Hardware Profile
Browser: Chrome 110+, Edge 110+, Safari 16+, Firefox 115+
Screen Resolution: 1280x720 or higher for admin; 360px+ for mobile
Internet: 512 Kbps down / 256 Kbps up per simultaneous workstation
POS Thermal Printer: Any standard ESC/POS 58mm or 80mm thermal receipt printer
Backup Power: 500VA UPS recommended for cashier desks during power outages`,
          },
        },
        {
          id: "free-sandbox",
          title: "Free 4-Hour Sandbox Testing",
          body: [
            "We believe that every school leadership team should experience the full speed, anti-leakage control, and academic reporting of EDUREXA before committing a single shilling.",
            "Schools can request a private 4-hour live sandbox environment pre-populated with realistic student rosters, grading scales, and cashier registers to simulate a complete school term.",
          ],
          callout: {
            type: "success",
            title: "Start Your Free Sandbox Today",
            message: "Contact the EDUREXA Implementation Desk via WhatsApp at +256 758 611 414 to receive instant 4-hour credentials with zero onboarding commitment.",
          },
        },
      ],
    },
  },

  architecture: {
    slug: "architecture",
    title: "Multi-Tenant Architecture & Data Isolation",
    shortTitle: "Architecture",
    category: "Getting Started",
    description: "An in-depth technical overview of EDUREXA's enterprise multi-tenant cloud architecture, tenant isolation, and security perimeter.",
    readingTime: "5 min read",
    lastUpdated: "November 2026",
    badge: { text: "Security", variant: "default" },
    toc: [
      { id: "tenant-isolation", title: "Strict Multi-Tenant Isolation" },
      { id: "data-hierarchy", title: "Institutional Data Hierarchy" },
      { id: "subdomain-routing", title: "Campus & Branch Routing" },
      { id: "offline-sync", title: "Offline Cashier Sync Protocol" },
    ],
    content: {
      lead: "EDUREXA employs a multi-tenant cloud architecture where every institution's academic, financial, and personal data is logically and cryptographically partitioned to ensure absolute privacy, high availability, and low latency.",
      sections: [
        {
          id: "tenant-isolation",
          title: "Strict Multi-Tenant Isolation",
          body: [
            "Every database query executed within EDUREXA is automatically scoped by the tenant identifier (`school_id`). It is technically impossible for an administrator, teacher, or bursar of one institution to read or alter records belonging to another school.",
            "All sensitive student data, fee ledgers, and staff payroll information are protected with TLS 1.3 encryption in transit and AES-256 encryption at rest.",
          ],
          callout: {
            type: "info",
            title: "Enterprise Regulatory Compliance",
            message: "Compliant with national Data Protection and Privacy standards. Data is regularly backed up across redundant cloud availability zones.",
          },
        },
        {
          id: "data-hierarchy",
          title: "Institutional Data Hierarchy",
          body: [
            "EDUREXA models complex multi-campus school chains with an intuitive multi-tier structure:",
          ],
          table: {
            headers: ["Hierarchy Level", "Access Scope", "Example Scenario"],
            rows: [
              ["Super-Admin Fleet", "Multi-Campus Governance", "School Group Board inspecting aggregate collection across Mukono, Jinja, and Entebbe branches."],
              ["Campus Administration", "Single Campus Scope", "Headteacher and Bursar managing local admissions, staff attendance, and term fees."],
              ["Departmental Desks", "Workstation Scope", "Cashier 1 on Desk A issuing thermal fee receipts; DOS entering UCE chemistry marks."],
              ["User Stations", "Individual Scope", "Teacher recording S.3 physics scores; parent checking terminal student balance."],
            ],
          },
        },
        {
          id: "subdomain-routing",
          title: "Campus & Branch Routing",
          body: [
            "Each school is provisioned with a secure tenant workspace. Institutions can also map custom subdomains (e.g. `portal.yourschool.ac.ug`) with SSL certificates provisioned and renewed automatically.",
            "Users navigate directly to role stations using intuitive URL slashes without navigating public landing page directories.",
          ],
        },
        {
          id: "offline-sync",
          title: "Offline Cashier Sync Protocol",
          body: [
            "Internet disruptions should never stop a school bursar from receipting fees on opening day. The EDUREXA cashier module operates offline using local indexed storage.",
            "Receipts are stamped with an offline cryptographic sequence number. When internet connectivity is restored, the workstation automatically reconciles the batch with the cloud ledger and dispatches parent WhatsApp alerts.",
          ],
        },
      ],
    },
  },

  onboarding: {
    slug: "onboarding",
    title: "School Onboarding in 48 Hours",
    shortTitle: "Onboarding (48h)",
    category: "Getting Started",
    description: "A practical step-by-step checklist to migrate your school from paper registers or legacy desktop systems onto EDUREXA within 48 hours.",
    readingTime: "6 min read",
    lastUpdated: "November 2026",
    badge: { text: "Fast Track", variant: "success" },
    toc: [
      { id: "onboarding-timeline", title: "48-Hour Implementation Timeline" },
      { id: "step-1-roster", title: "Step 1: Student Roster Bulk Import" },
      { id: "step-2-fees", title: "Step 2: Fee Structure Configuration" },
      { id: "step-3-staff", title: "Step 3: Staff Accounts & Workloads" },
      { id: "step-4-golive", title: "Step 4: Cashier Setup & Go-Live" },
    ],
    content: {
      lead: "Deploying a school management system shouldn't take months of expensive IT consulting. EDUREXA's streamlined onboarding pipeline enables secondary and primary schools to achieve full operational go-live in under 48 hours.",
      sections: [
        {
          id: "onboarding-timeline",
          title: "48-Hour Implementation Timeline",
          body: [
            "Our dedicated implementation engineering desk assists each school through five clear milestones:",
          ],
          steps: [
            {
              stepNumber: "01",
              title: "Tenant Provisioning (Hour 0 - 4)",
              description: "Creation of your private encrypted tenant, custom branding, school badge upload, and academic term calendar initialization.",
            },
            {
              stepNumber: "02",
              title: "Data Cleansing & Bulk Import (Hour 4 - 18)",
              description: "Upload of existing student rosters, parent phone numbers, class streams, and opening fee balances via Excel/CSV templates.",
            },
            {
              stepNumber: "03",
              title: "Fee Structures & Vote Heads (Hour 18 - 28)",
              description: "Configuration of tuition, boarding, development, UNEB exam fees, and automated family sibling discount rules.",
            },
            {
              stepNumber: "04",
              title: "Staff & Hardware Configuration (Hour 28 - 40)",
              description: "Connecting 58mm/80mm thermal receipt printers, setting up staff logins, and conducting a 90-minute live Zoom or in-person workshop.",
            },
            {
              stepNumber: "05",
              title: "Official Term Go-Live (Hour 40 - 48)",
              description: "Cashier desks open for fee payments, teacher portals unlocked for grading, and live WhatsApp notifications enabled.",
            },
          ],
        },
        {
          id: "step-1-roster",
          title: "Step 1: Student Roster Bulk Import",
          body: [
            "Administrators can download our standardized Excel import template. The importer automatically checks for duplicate registration numbers, formats phone numbers to international format (+256), and assigns students into their respective class streams.",
          ],
          codeExample: {
            title: "Standard Student Import CSV Schema",
            language: "csv",
            code: `reg_no,first_name,last_name,gender,class_name,stream,section,parent_name,parent_phone,previous_balance
WBS/2026/001,Ronald,Mutebi,Male,Senior 1,East,Boarding,Patrick Mutebi,+256772123456,0
WBS/2026/002,Grace,Nakato,Female,Senior 1,West,Day,Sarah Babirye,+256758611414,150000
WBS/2026/003,David,Okello,Male,Senior 2,North,Boarding,Emmanuel Okello,+256701987654,0`,
          },
        },
        {
          id: "step-2-fees",
          title: "Step 2: Fee Structure Configuration",
          body: [
            "Configure termly fee structures segmented by class level, boarding status (Day Scholar vs Boarder), and optional special subjects.",
            "EDUREXA supports modular vote heads (Tuition, Meals, Uniform, ICT, Laboratory, Medical) allowing bursars to track real cash allocation per vote head.",
          ],
        },
        {
          id: "step-3-staff",
          title: "Step 3: Staff Accounts & Workloads",
          body: [
            "Assign roles (Dean of Studies, Subject Teacher, Class Teacher, Bursar, Cashier, Matron, Nurse).",
            "Teachers only see the specific subject-class combinations assigned to them, preventing accidental mark tampering in other classes.",
          ],
        },
        {
          id: "step-4-golive",
          title: "Step 4: Cashier Setup & Go-Live",
          body: [
            "Plug your ESC/POS thermal printer into the bursar's PC via USB. Test-print a sample receipt with the school crest and verification code.",
            "Once verified, your school is 100% operational on EDUREXA with 24/7 priority support.",
          ],
        },
      ],
    },
  },

  "sandbox-demo": {
    slug: "sandbox-demo",
    title: "Free 4-Hour Live Interactive Demo",
    shortTitle: "Free Sandbox Demo",
    category: "Getting Started",
    description: "Experience the complete EDUREXA platform for 4 unrestricted hours in a realistic test environment with zero commitment.",
    readingTime: "3 min read",
    lastUpdated: "November 2026",
    badge: { text: "100% Free", variant: "warning" },
    toc: [
      { id: "how-it-works", title: "How the 4-Hour Demo Works" },
      { id: "what-you-can-test", title: "What You Can Test" },
      { id: "requesting-access", title: "Requesting Instant Access" },
    ],
    content: {
      lead: "To give school directors, headteachers, and bursars full confidence before onboarding, EDUREXA offers an instant, free 4-hour live interactive sandbox. You can simulate fee collections, test report card generation, and evaluate every single feature firsthand.",
      sections: [
        {
          id: "how-it-works",
          title: "How the 4-Hour Demo Works",
          body: [
            "Upon requesting a demo, our automated provisioning system spins up a private sandbox environment.",
            "You receive role-based credentials allowing you to log in as School Director, Bursar, Director of Studies (DOS), and Teacher simultaneously across different tabs or devices.",
            "The sandbox remains active for 4 continuous hours, during which you can enter transactions, generate reports, and test thermal receipt printing.",
          ],
          callout: {
            type: "tip",
            title: "Pre-Loaded with Realistic Ugandan School Data",
            message: "Your demo comes pre-loaded with sample S.1 to S.6 classes, realistic fee ledgers, and UNEB marks so you can immediately see the power of automated report cards without manual typing.",
          },
        },
        {
          id: "what-you-can-test",
          title: "What You Can Test During the 4 Hours",
          body: [
            "During your 4-hour evaluation, you have unrestricted access to all enterprise modules:",
          ],
          table: {
            headers: ["Test Scenario", "Module", "What to Expect"],
            rows: [
              ["Receipt a Student Fee", "Cashier POS Desk", "Record cash/bank payment, watch ledger update live, generate 80mm thermal slip with anti-fraud QR code."],
              ["Enter Competence Scores", "Teacher Gradebook", "Score students on 1.0 - 3.0 scale, write formative comments, view automatic calculation."],
              ["Generate UNEB Report Cards", "Academic Engine", "Produce batch PDF terminal report cards featuring division calculation, conduct remarks, and photo badge."],
              ["Reconcile Bank Statement", "Bursar Command", "Import simulated bank CSV and watch automated matching of payments against student registration numbers."],
            ],
          },
        },
        {
          id: "requesting-access",
          title: "Requesting Instant Access",
          body: [
            "Simply send a message to our WhatsApp Sales & Implementation line at **+256 758 611 414** with the message:",
            "Our automated bot and implementation engineers will return your custom sandbox URL and 4-hour credentials within 2 minutes.",
          ],
          callout: {
            type: "success",
            title: "WhatsApp Quick Launch",
            message: "Click to chat directly: WhatsApp +256 758 611 414 • Available Monday to Saturday, 7:00 AM – 9:00 PM EAT.",
          },
        },
      ],
    },
  },

  academics: {
    slug: "academics",
    title: "Academic & UNEB Grading Engine",
    shortTitle: "Academic Engine",
    category: "Core Engines & Workflows",
    description: "Comprehensive documentation of the UNEB competence-based curriculum (CBC) grading, traditional O/A Level marks, and report card generation.",
    readingTime: "7 min read",
    lastUpdated: "November 2026",
    badge: { text: "CBC & UNEB", variant: "info" },
    toc: [
      { id: "cbc-curriculum", title: "Uganda CBC Competence Scoring (1.0 - 3.0)" },
      { id: "uneb-aggregates", title: "Automated Division 1 - 4 Calculation" },
      { id: "report-cards", title: "Report Card & Transcript Generator" },
      { id: "broadsheets", title: "Master Examination Broad-Sheets" },
    ],
    content: {
      lead: "EDUREXA's Academic Engine is tailored specifically for the Ugandan National Examinations Board (UNEB) and the Ministry of Education & Sports (MoES) Lower Secondary Curriculum framework.",
      sections: [
        {
          id: "cbc-curriculum",
          title: "Uganda CBC Competence Scoring (1.0 - 3.0)",
          body: [
            "Under the new lower secondary curriculum, students are assessed on both continuous formative classroom activities of integration (Activities of Integration - AOIs) and end-of-cycle summative assessments.",
            "EDUREXA supports direct entry of competence descriptors across 3 levels:",
          ],
          table: {
            headers: ["Score Band", "Descriptor", "UNEB Standard Interpretation"],
            rows: [
              ["2.50 - 3.00", "Outstanding (Level 3)", "Student consistently demonstrates high competency, creative problem-solving, and deep understanding."],
              ["1.50 - 2.49", "Moderate (Level 2)", "Student demonstrates expected competencies with occasional guidance; satisfactory application."],
              ["1.00 - 1.49", "Basic (Level 1)", "Student requires remedial assistance to meet the core threshold competencies."],
            ],
          },
        },
        {
          id: "uneb-aggregates",
          title: "Automated Division 1 - 4 Calculation",
          body: [
            "For traditional secondary levels (UCE Senior 4 and UACE Senior 6), EDUREXA calculates best-8 aggregates and principal pass points instantly upon score entry.",
            "Grading rules automatically enforce UNEB criteria (e.g. compulsory English, Mathematics, Biology, Chemistry, Physics) to determine correct Division 1, 2, 3, 4, 7, 9, or U rankings without manual arithmetic errors.",
          ],
          codeExample: {
            title: "UNEB O-Level Aggregate Calculation Rules",
            language: "typescript",
            code: `// Sample Aggregate Engine Logic
interface SubjectScore {
  code: string;
  grade: "D1" | "D2" | "C3" | "C4" | "C5" | "C6" | "P7" | "P8" | "F9";
  aggregateValue: number;
  isCompulsory: boolean;
}

// Automatically selects best 8 subjects including English & Math
function calculateDivision(scores: SubjectScore[]): { totalAggregates: number; division: number } {
  // Evaluates core criteria, credit requirements, and aggregate ceilings
  return { totalAggregates: 18, division: 1 };
}`,
          },
        },
        {
          id: "report-cards",
          title: "Report Card & Transcript Generator",
          body: [
            "Generate hundreds of clean, standardized report cards in seconds. Each report card includes:",
            "1. School crest and verified header information.",
            "2. Student photograph, registration number, class, and stream.",
            "3. Subject breakdown: continuous formative assessment (20%) and summative exam marks (80%).",
            "4. Dynamic class teacher and headteacher remarks based on academic thresholds.",
            "5. QR code verification stamp to prevent unauthorized alterations.",
            "6. Next term opening dates, required requirements, and individual fees balance.",
          ],
        },
        {
          id: "broadsheets",
          title: "Master Examination Broad-Sheets",
          body: [
            "Produce consolidated master broad-sheets for staff marks review meetings. Sort instantly by total score, aggregates, or stream ranking with 1-click export to Excel and PDF.",
          ],
        },
      ],
    },
  },

  finance: {
    slug: "finance",
    title: "Fee Collection & Anti-Leakage POS Desk",
    shortTitle: "Finance & POS",
    category: "Core Engines & Workflows",
    description: "Eliminate fee leakages, reconcile bank transactions, manage sibling ledgers, and issue verifiable thermal receipts.",
    readingTime: "8 min read",
    lastUpdated: "November 2026",
    badge: { text: "Anti-Leakage", variant: "success" },
    toc: [
      { id: "anti-leakage", title: "The Anti-Leakage Framework" },
      { id: "cashier-pos", title: "Offline Cashier Desk & Thermal Receipts" },
      { id: "bank-reconciliation", title: "Bank Statement Auto-Matching" },
      { id: "sibling-ledgers", title: "Sibling & Family Ledger Consolidation" },
      { id: "defaulter-tracking", title: "Defaulter Auditing & Clearance Passes" },
    ],
    content: {
      lead: "School fee collection is vulnerable to fraud, unrecorded cash, delayed bank reconciliations, and forged payment receipts. EDUREXA's Financial Engine closes these gaps with cryptographic receipts, automated reconciliations, and role separation.",
      sections: [
        {
          id: "anti-leakage",
          title: "The Anti-Leakage Framework",
          body: [
            "In traditional school environments, cashiers may issue paper receipts from handwritten booklets that do not match the school's general ledger. EDUREXA enforces strict cryptographic sequential receipting:",
            "Every receipt issued carries a tamper-proof verification hash. Once a payment is submitted, it immediately reflects across the student's digital ledger, the cashier's daily cash drawer, and the director's overview console.",
          ],
          callout: {
            type: "warning",
            title: "Zero Manual Deletions",
            message: "Transactions cannot be silently deleted or altered. Any correction requires a documented bursar adjustment trail with audited justifications.",
          },
        },
        {
          id: "cashier-pos",
          title: "Offline Cashier Desk & Thermal Receipts",
          body: [
            "Designed for the high-volume opening weeks of school. Cashiers can lookup students by typing just 2 letters of their name or scanning their student ID barcode.",
            "Receipts print in under 1.5 seconds on 58mm or 80mm thermal printers with custom school crests, broken down by tuition, boarding, and uniform vote heads.",
          ],
          codeExample: {
            title: "Sample Thermal Receipt Format (80mm ESC/POS)",
            language: "text",
            code: `================================================
           EDUREXA SCHOOL MANAGEMENT
             OFFICIAL RECEIPT SLIP
================================================
Date: 20-Nov-2026 10:14 AM   Receipt #: REC-8924
Cashier: Sarah K. (Desk 1)   Terminal: POS-MUK-01
------------------------------------------------
Student: Ronald Mutebi       Reg No: WBS/2026/042
Class: Senior 4 East         Section: Boarding
Parent: Patrick Mutebi       Phone: +256 772 123456
------------------------------------------------
Vote Head Breakdown:
1. Tuition & Boarding Fees:         UGX 1,000,000
2. UNEB Registration Fee:           UGX   150,000
3. Computer & Science Lab:          UGX    50,000
------------------------------------------------
TOTAL PAID:                         UGX 1,200,000
Payment Method:                     Centenary Bank
Remaining Balance:                  UGX         0
------------------------------------------------
Verification Hash: 8F2A-99B1-C47D-E012
Verify online: https://edurexa.com/verify
================================================
      Thank you for your prompt payment!`,
          },
        },
        {
          id: "bank-reconciliation",
          title: "Bank Statement Auto-Matching",
          body: [
            "Easily import electronic statements from Centenary Bank, Stanbic Bank, Equity Bank, DFCU, PostBank, and Absa Bank.",
            "EDUREXA matches student registration codes embedded in bank narrative fields and credits student ledgers in bulk, saving bursars weeks of manual ticking.",
          ],
        },
        {
          id: "sibling-ledgers",
          title: "Sibling & Family Ledger Consolidation",
          body: [
            "When parents have multiple children across Senior 1, Senior 3, and Primary sections, EDUREXA links them under a consolidated Family Ledger.",
            "Parents can make a single lump-sum payment that bursars allocate proportionally across all siblings.",
          ],
        },
        {
          id: "defaulter-tracking",
          title: "Defaulter Auditing & Clearance Passes",
          body: [
            "Generate instant fee defaulter lists filtered by class, stream, or minimum balance threshold. Dispatch targeted automated WhatsApp reminders to parents with 1-click.",
            "Issue digital Examination Clearance Gate Passes with barcode verification for school gate entry during mid-term and final exam weeks.",
          ],
        },
      ],
    },
  },

  "students-staff": {
    slug: "students-staff",
    title: "Student Information System & Staff Administration",
    shortTitle: "Students & Staff",
    category: "Core Engines & Workflows",
    description: "Manage comprehensive student bio-data, digital ID cards, disciplinary logs, teacher workloads, and staff payroll slips.",
    readingTime: "6 min read",
    lastUpdated: "November 2026",
    badge: { text: "HR & SIS", variant: "default" },
    toc: [
      { id: "student-sis", title: "Complete Student Bio-Data & Medical Files" },
      { id: "digital-id", title: "Digital ID Card Generation" },
      { id: "staff-workloads", title: "Teacher Workload & Subject Allocations" },
      { id: "staff-payroll", title: "Payroll Slips & Statutory Deductions" },
    ],
    content: {
      lead: "A unified record of every student and staff member from admission to alumni status. Maintain emergency contacts, medical records, disciplinary tracking, and staff compensation.",
      sections: [
        {
          id: "student-sis",
          title: "Complete Student Bio-Data & Medical Files",
          body: [
            "Each student profile centralizes academic records, fees ledger, dormitory allocation, medical conditions (e.g. asthma, allergies), and parent emergency contacts.",
            "Capture student photos directly using any laptop webcam or upload high-resolution studio photographs in bulk.",
          ],
        },
        {
          id: "digital-id",
          title: "Digital ID Card Generation",
          body: [
            "Generate ready-to-print PVC student and staff identity cards formatted with your school colors, official badge, student photo, and unique barcode.",
            "The barcode works interchangeably with cashier desks, library book borrowing, and dining hall meal checkpoints.",
          ],
        },
        {
          id: "staff-workloads",
          title: "Teacher Workload & Subject Allocations",
          body: [
            "Assign subjects to teachers across streams and track weekly lesson periods. Prevent scheduling conflicts and ensure balanced teacher timetables.",
          ],
        },
        {
          id: "staff-payroll",
          title: "Payroll Slips & Statutory Deductions",
          body: [
            "Calculate monthly staff salaries, allowances, SACCO deductions, advances, and statutory remittances (NSSF and PAYE).",
            "Generate clean PDF payslips that can be emailed or dispatched directly via WhatsApp to staff members.",
          ],
        },
      ],
    },
  },

  operations: {
    slug: "operations",
    title: "Boarding, Clinic & Campus Logistics",
    shortTitle: "Operations & Boarding",
    category: "Core Engines & Workflows",
    description: "Dormitory allocations, biometric dining hall meal tokens, sickbay clinic records, and school bus fleet logistics.",
    readingTime: "5 min read",
    lastUpdated: "November 2026",
    badge: { text: "Logistics", variant: "default" },
    toc: [
      { id: "dormitory-management", title: "Boarding Dormitories & Bed Allocations" },
      { id: "dining-tokens", title: "Dining Hall Meal Checkpoint Tokens" },
      { id: "sickbay-clinic", title: "Sickbay Medical Records & Pharmacy" },
      { id: "bus-routes", title: "School Bus Transport Routes" },
    ],
    content: {
      lead: "Day-to-day school operations require smooth coordination across matrons, dining hall staff, nurses, and transport coordinators. EDUREXA brings these ancillary operations into real-time synchrony.",
      sections: [
        {
          id: "dormitory-management",
          title: "Boarding Dormitories & Bed Allocations",
          body: [
            "Manage separate boys and girls boarding houses. Track room capacity, bunk bed numbers, and matron/patron inspection logs.",
            "Prevent overcrowding and instantly locate any boarding student during roll calls.",
          ],
        },
        {
          id: "dining-tokens",
          title: "Dining Hall Meal Checkpoint Tokens",
          body: [
            "Stop dining hall double-feeding and unauthorized meal access. Kitchen staff scan the student's ID card or barcode on a low-cost tablet at the serving hatch.",
            "The system validates whether the student has valid meal entitlement for breakfast, lunch, or dinner and flags any duplicate attempts.",
          ],
        },
        {
          id: "sickbay-clinic",
          title: "Sickbay Medical Records & Pharmacy",
          body: [
            "The school nurse logs outpatient clinic visits, symptoms, malaria tests, and prescribed dispensary medications.",
            "Critical medical events immediately trigger an automated WhatsApp notification to the parent.",
          ],
        },
        {
          id: "bus-routes",
          title: "School Bus Transport Routes",
          body: [
            "Assign day scholars to specific bus routes, morning pickup stops, and evening drop-off zones. Ensure transport fees match distance zones.",
          ],
        },
      ],
    },
  },

  portals: {
    slug: "portals",
    title: "Direct URL Portal Access Guide",
    shortTitle: "Direct Portals",
    category: "Portals & URL Slashing",
    description: "Learn how authorized staff, students, and system administrators navigate directly to their dedicated workstations via URL slashing.",
    readingTime: "5 min read",
    lastUpdated: "November 2026",
    badge: { text: "Slash Routes", variant: "warning" },
    toc: [
      { id: "why-slashing", title: "The Direct URL Slashing Concept" },
      { id: "admin-portal", title: "School Admin Console (/admin)" },
      { id: "teacher-portal", title: "Teacher Gradebook (/teacher)" },
      { id: "student-portal", title: "Student Results Station (/student)" },
      { id: "super-admin", title: "Multi-Campus Super Admin (/super-admin)" },
    ],
    content: {
      lead: "To maintain an enterprise-grade user experience, EDUREXA isolates operational workstations from marketing pages. Portals are never cluttered with promotional links; users navigate directly to their dedicated role by appending the appropriate slash route to their browser URL.",
      sections: [
        {
          id: "why-slashing",
          title: "The Direct URL Slashing Concept",
          body: [
            "Marketing landing pages are designed for prospective school clients, directors, and boards evaluating the software.",
            "Daily operational users (such as a cashier opening the morning register or a teacher grading physics exams) navigate directly via clean, memorable URL slashes. No searching through header dropdowns or marketing banners is necessary.",
          ],
          callout: {
            type: "info",
            title: "Bookmark Your Direct Station",
            message: "School staff are encouraged to bookmark their specific direct portal route for 1-click morning access.",
          },
        },
        {
          id: "admin-portal",
          title: "School Admin Console (/admin)",
          body: [
            "**Access Route:** `your-domain.com/admin`",
            "**Who Uses It:** Headteachers, Principals, Directors of Studies (DOS), Bursars, and System Administrators.",
            "**Core Capabilities:**",
            "• High-level revenue collection analytics and real-time bank reconciliation oversight.",
            "• Student admission approvals, class stream promotions, and academic term calendar locks.",
            "• Staff account provisioning and granular permission toggles.",
            "• Master audit log inspection to monitor user actions across the system.",
          ],
        },
        {
          id: "teacher-portal",
          title: "Teacher Gradebook (/teacher)",
          body: [
            "**Access Route:** `your-domain.com/teacher`",
            "**Who Uses It:** Subject Teachers, Class Teachers, and Heads of Departments (HODs).",
            "**Core Capabilities:**",
            "• Fast, distraction-free marks entry with automatic saving as you type.",
            "• Lower secondary competence descriptors (1.0 to 3.0 scale) and formative activity comments.",
            "• Daily and period-by-period class attendance registers.",
            "• Class teacher terminal conduct remarks and discipline logs.",
          ],
        },
        {
          id: "student-portal",
          title: "Student & Parent Station (/student)",
          body: [
            "**Access Route:** `your-domain.com/student`",
            "**Who Uses It:** Enrolled Students, Parents, and Guardians.",
            "**Core Capabilities:**",
            "• Instant terminal report card download with verified QR stamp.",
            "• Real-time fees ledger transparency showing every payment, receipt number, and outstanding balance.",
            "• Mid-term examination timetables and holiday package assignments.",
            "• Dining hall and dormitory allocation information.",
          ],
        },
        {
          id: "super-admin",
          title: "Multi-Campus Super Admin (/super-admin)",
          body: [
            "**Access Route:** `your-domain.com/super-admin`",
            "**Who Uses It:** Educational Group Directors, Board of Governors, and Multi-Campus Executives.",
            "**Core Capabilities:**",
            "• Consolidated multi-branch financial intelligence across all school campuses.",
            "• Fleet health metrics, server status, database sizing, and tenant provisioning.",
            "• Global license management, audit monitoring, and multi-tenant security policy enforcement.",
          ],
        },
      ],
    },
  },

  integrations: {
    slug: "integrations",
    title: "SMS & WhatsApp Automation",
    shortTitle: "SMS & WhatsApp",
    category: "Integrations & Platform",
    description: "Automate parent payment confirmations, end-of-term marks broadcasts, and emergency notifications via SMS and WhatsApp.",
    readingTime: "5 min read",
    lastUpdated: "November 2026",
    badge: { text: "Automation", variant: "default" },
    toc: [
      { id: "whatsapp-receipts", title: "Automated WhatsApp Fee Receipts" },
      { id: "sms-broadcasts", title: "Bulk SMS Announcements" },
      { id: "mobile-money", title: "Mobile Money (MTN & Airtel) Hookup" },
    ],
    content: {
      lead: "Keep parents informed within seconds of any financial or academic event. EDUREXA connects directly to Uganda's leading SMS and WhatsApp messaging gateways for instantaneous stakeholder communication.",
      sections: [
        {
          id: "whatsapp-receipts",
          title: "Automated WhatsApp Fee Receipts",
          body: [
            "The moment a cashier prints a fee receipt at the school bursary, EDUREXA dispatches an automated WhatsApp receipt notification to the parent's registered mobile number.",
            "The message contains the student name, receipt number, amount paid, and updated remaining balance. This builds immediate trust and eliminates disputes over unreceipted cash.",
          ],
          codeExample: {
            title: "Sample WhatsApp Automated Receipt Template",
            language: "text",
            code: `Dear Mr. Patrick Mutebi,

✅ Payment Confirmation:
We have received UGX 1,200,000 for Ronald Mutebi (Senior 4 East).
Official Receipt Number: #REC-8924.
Remaining Term Balance: UGX 0.

View digital receipt: https://edurexa.com/receipt/8924
Thank you for supporting your child's education!

- EDUREXA School Administration`,
          },
        },
        {
          id: "sms-broadcasts",
          title: "Bulk SMS Announcements",
          body: [
            "Broadcast school reopening dates, visitation day schedules, and fee balance reminders to hundreds of parents in seconds.",
            "Filter recipients by class level, boarding status, or specific fee balance brackets to avoid spamming compliant parents.",
          ],
        },
        {
          id: "mobile-money",
          title: "Mobile Money (MTN & Airtel) Hookup",
          body: [
            "Parents can pay fees directly via MTN Mobile Money (*165#) or Airtel Money (*185#) using the school's unique school-code or student registration number.",
            "Transactions settle into the school's bank account with automatic webhook reconciliation into EDUREXA.",
          ],
        },
      ],
    },
  },

  security: {
    slug: "security",
    title: "Security, RBAC & Cloud Backups",
    shortTitle: "Security & RBAC",
    category: "Integrations & Platform",
    description: "Understand EDUREXA's enterprise security protocols, role-based access control, cryptographic verification, and disaster recovery.",
    readingTime: "5 min read",
    lastUpdated: "November 2026",
    badge: { text: "Enterprise", variant: "info" },
    toc: [
      { id: "rbac", title: "Role-Based Access Control (RBAC)" },
      { id: "encryption", title: "Encryption & Data Protection" },
      { id: "audit-logs", title: "Comprehensive Audit Trail" },
      { id: "backups", title: "Automated Cloud Backups & Recovery" },
    ],
    content: {
      lead: "Institutional data requires uncompromising security. EDUREXA implements bank-grade protection mechanisms to prevent unauthorized access, data alteration, and accidental loss.",
      sections: [
        {
          id: "rbac",
          title: "Role-Based Access Control (RBAC)",
          body: [
            "Access to every module, button, and report is governed by fine-grained permissions.",
            "A subject teacher cannot see student fee ledgers; a cashier cannot alter academic marks; a receptionist cannot view staff payroll records. Administrators maintain complete control over permission matrices.",
          ],
        },
        {
          id: "encryption",
          title: "Encryption & Data Protection",
          body: [
            "All traffic between client browsers and the EDUREXA cloud is secured with 256-bit SSL/TLS 1.3 encryption.",
            "Database volumes and backups are encrypted at rest using AES-256 standards with automated key rotation.",
          ],
        },
        {
          id: "audit-logs",
          title: "Comprehensive Audit Trail",
          body: [
            "Every critical action—from fee adjustments and marks revisions to staff account logins—is stamped with user identity, timestamp, IP address, and previous values in the system audit log.",
            "Headteachers can inspect audit logs at any time to investigate discrepancies or verify institutional accountability.",
          ],
        },
        {
          id: "backups",
          title: "Automated Cloud Backups & Recovery",
          body: [
            "Databases are automatically backed up every 60 minutes across geographically separated cloud data centers.",
            "Point-in-time recovery ensures that even in the unlikely event of hardware failure, data can be restored to the exact minute.",
          ],
        },
      ],
    },
  },
};
