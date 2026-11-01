// ============================================================================
// WELLSTAR FINANCE POS DESKTOP CLIENT
// Workstation client for Bursar operations and cashier counter
// ============================================================================

// --- DEFAULT SYSTEM SETTINGS CONFIGURATION ---
const DEFAULT_SYSTEM_SETTINGS = {
  schoolName: "Wellstar Bright Secondary School",
  schoolShortName: "Wellstar Bright",
  schoolSub: "Mukono • Bursar Workstation & Financial ERP",
  schoolMotto: "Education is our Pride",
  logoUrl: "logo.png",
  academicYear: "2026",
  activeTerm: "Term 1",
  themeMode: "light",
  currencyPreset: "UGX",
  currencyCode: "UGX",
  currencySymbol: "UGX",
  decimalPlaces: 0,
  defaultDrawerFloat: 150000,
  receiptTitle: "WELLSTAR BRIGHT SECONDARY SCHOOL",
  receiptSub: "Official Tuition & Fees Payment Receipt",
  receiptFooter: "Official Computer-Generated Receipt • Valid Without Official Seal",
  receiptWidth: "80mm",
  machineId: "WS-BURSAR-01",
  serverUrl: "http://localhost:3000",
};

// ============================================================================
// THEME MANAGEMENT ENGINE (Default: Light Theme • Optional: Dark Theme)
// ============================================================================
function getActiveTheme() {
  const stored = localStorage.getItem("wf_theme");
  if (stored === "dark" || stored === "light") return stored;
  return systemSettings.themeMode || "light";
}

function applyTheme(theme, save = true) {
  const isDark = theme === "dark";
  document.body.classList.toggle("dark-theme", isDark);
  document.documentElement.classList.toggle("dark-theme", isDark);

  if (save) {
    localStorage.setItem("wf_theme", isDark ? "dark" : "light");
    systemSettings.themeMode = isDark ? "dark" : "light";
  }

  // Update theme mode select if present on Settings pane
  const themeSelect = document.getElementById("cfgThemeMode");
  if (themeSelect) {
    themeSelect.value = isDark ? "dark" : "light";
  }

  // SVG vector icons
  const sunIconSvg = '<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>';
  const moonIconSvg = '<svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>';

  // Top Status Bar Theme Button
  const topIcon = document.getElementById("topThemeToggleIcon");
  const topText = document.getElementById("topThemeToggleText");
  const topBtn = document.getElementById("btnThemeToggle");
  if (topIcon) topIcon.innerHTML = isDark ? sunIconSvg : moonIconSvg;
  if (topText) topText.textContent = isDark ? "Light Mode" : "Dark Mode";
  if (topBtn) topBtn.title = isDark ? "Switch to Light Theme" : "Switch to Dark Theme";

  // Login Screen Theme Button
  const loginIcon = document.getElementById("loginThemeToggleIcon");
  const loginText = document.getElementById("loginThemeToggleText");
  const loginBtn = document.getElementById("btnLoginThemeToggle");
  if (loginIcon) loginIcon.innerHTML = isDark ? sunIconSvg : moonIconSvg;
  if (loginText) loginText.textContent = isDark ? "Light" : "Dark";
  if (loginBtn) loginBtn.title = isDark ? "Switch to Light Theme" : "Switch to Dark Theme";

  // Dynamically redraw canvas charts if active so canvas gridlines & contrast match
  if (typeof renderDashboardCharts === "function" && document.getElementById("pane-dashboard")?.classList.contains("active")) {
    renderDashboardCharts();
  }
}

function toggleTheme() {
  const isCurrentlyDark = document.body.classList.contains("dark-theme");
  const nextTheme = isCurrentlyDark ? "light" : "dark";
  applyTheme(nextTheme, true);
  showToast(`Theme switched to ${nextTheme === "dark" ? "Dark Theme (Night Mode)" : "Light Theme"}`);
}

// Load persistent settings with fallback
let systemSettings = { ...DEFAULT_SYSTEM_SETTINGS };
try {
  const savedSettings = localStorage.getItem("wf_system_settings");
  if (savedSettings) {
    systemSettings = { ...DEFAULT_SYSTEM_SETTINGS, ...JSON.parse(savedSettings) };
  }
} catch (e) {
  systemSettings = { ...DEFAULT_SYSTEM_SETTINGS };
}

const CONFIG = {
  serverUrl: systemSettings.serverUrl || "http://localhost:3000",
  machineId: systemSettings.machineId || "WS-INIT",
  syncIntervalMs: 15000,
};

// Authorized Cashier & Bursar Accounts (matching SMS enterprise auth service)
const DESKTOP_CASHIERS = [
  { name: "CPA Sarah Namubiru", pin: "1234", role: "BURSAR", title: "Chief Bursar & Head of Finance" },
  { name: "Joseph Kato", pin: "5566", role: "CASHIER", title: "Senior Counter Cashier 1" },
  { name: "Grace Auma", pin: "5577", role: "CASHIER", title: "Counter Cashier 2" },
  { name: "Dr. Arthur Ssentongo", pin: "9900", role: "SUPER_ADMIN", title: "Super Administrator" },
  { name: "Robert Mugisha", pin: "7788", role: "AUDITOR", title: "Senior Financial Auditor" },
];

// Active Shift & Authentication State
let session = {
  isAuthenticated: false,
  cashierName: "Joseph Kato",
  cashierRole: "CASHIER",
  shiftStart: null,
  startingFloat: Number(localStorage.getItem("wf_starting_float") || systemSettings.defaultDrawerFloat),
  isRemoteLocked: false,
};

// Local Offline Storage Data Store
let localData = {
  students: JSON.parse(localStorage.getItem("wf_students") || "[]"),
  receipts: JSON.parse(localStorage.getItem("wf_receipts") || "[]"),
  expenses: JSON.parse(localStorage.getItem("wf_expenses") || "[]"),
  payroll: JSON.parse(localStorage.getItem("wf_payroll") || "[]"),
  bankTransactions: JSON.parse(localStorage.getItem("wf_bank_transactions") || "[]"),
  mealCards: JSON.parse(localStorage.getItem("wf_meal_cards") || "[]"),
  syncQueue: JSON.parse(localStorage.getItem("wf_sync_queue") || "[]"),
  receiptCounter: Number(localStorage.getItem("wf_rcp_counter") || "1001"),
};

let selectedStudent = null;
let isOnline = false;

// ============================================================================
// DYNAMIC CURRENCY & FORMATTING ENGINE
// ============================================================================
function formatCurrency(amount) {
  const num = Number(amount) || 0;
  const formatted = num.toLocaleString("en-US", {
    minimumFractionDigits: systemSettings.decimalPlaces,
    maximumFractionDigits: systemSettings.decimalPlaces,
  });
  return `${systemSettings.currencySymbol} ${formatted}`;
}

// Toast notification helper
function showToast(message, type = "success") {
  const container = document.getElementById("toastContainer");
  if (!container) return;
  const toast = document.createElement("div");
  toast.className = `toast-msg ${type}`;
  const iconSvg =
    type === "success"
      ? '<svg class="svg-icon text-emerald" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>'
      : '<svg class="svg-icon text-rose" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';
  toast.innerHTML = `${iconSvg}<span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(14px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 320);
  }, 3500);
}

// ============================================================================
// INITIALIZATION
// ============================================================================
async function initApp() {
  // 0. Initialize System Theme (Light Theme Default • Dark Theme Optional)
  applyTheme(getActiveTheme(), false);

  // Hook up Theme Toggle Buttons
  const btnTopTheme = document.getElementById("btnThemeToggle");
  if (btnTopTheme) btnTopTheme.addEventListener("click", toggleTheme);
  const btnLoginTheme = document.getElementById("btnLoginThemeToggle");
  if (btnLoginTheme) btnLoginTheme.addEventListener("click", toggleTheme);

  // 1. Detect or assign Hardware Machine ID
  if (window.financeDesktop?.getMachineId) {
    try {
      CONFIG.machineId = await window.financeDesktop.getMachineId();
    } catch (e) {
      CONFIG.machineId = systemSettings.machineId || `WS-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    }
  } else {
    CONFIG.machineId =
      systemSettings.machineId ||
      localStorage.getItem("wf_machine_id") ||
      `WS-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    localStorage.setItem("wf_machine_id", CONFIG.machineId);
  }

  // 2. Pre-seed offline demo rosters if empty
  seedSampleOfflineDataIfEmpty();

  // 3. Apply System Branding & Settings
  applySystemSettings();

  // 4. Setup UI Listeners & Modules
  setupAuth();
  setupTabs();
  setupDashboard();
  setupPOS();
  setupFeesModule();
  setupExpenses();
  setupPayrollModule();
  setupBankModule();
  setupMealsModule();
  setupReportsModule();
  setupSettingsModule();

  // 5. Render lists & Dashboard
  renderStudentList();
  renderReceipts();
  renderFeesTable();
  renderExpenses();
  renderPayrollTable();
  renderBankModule();
  renderMealCardsTable();
  renderQueue();
  updateDrawerFloatDisplay();
  renderDashboard();

  // Reset content scroll so dashboard always opens cleanly at the top
  const ca = document.querySelector(".content-area");
  if (ca) ca.scrollTop = 0;
  window.scrollTo(0, 0);

  // 6. Background Sync Worker
  attemptSync();
  setInterval(attemptSync, CONFIG.syncIntervalMs);
}

// ============================================================================
// SYSTEM SETTINGS APPLICATION & SYNCHRONIZATION
// ============================================================================
function applySystemSettings() {
  // Update Document Title
  document.title = `${systemSettings.schoolShortName} Finance POS - Offline Enterprise Desktop Client`;

  // Top Bar Branding
  const topLogo = document.getElementById("topBrandLogo");
  if (topLogo) topLogo.src = systemSettings.logoUrl;
  const topName = document.getElementById("topSchoolName");
  if (topName) topName.textContent = systemSettings.schoolName;
  const topSub = document.getElementById("topSchoolSub");
  if (topSub) topSub.textContent = systemSettings.schoolSub;

  // Machine ID Badges
  const machineIdEl = document.getElementById("machineIdVal");
  if (machineIdEl) machineIdEl.textContent = CONFIG.machineId;
  const lockLabel = document.getElementById("lockWorkstationLabel");
  if (lockLabel) lockLabel.textContent = CONFIG.machineId;

  // Lock Screen Branding (Copied from executive login)
  const loginLogo = document.getElementById("loginBrandLogo");
  if (loginLogo) loginLogo.src = systemSettings.logoUrl;
  const loginTitle = document.getElementById("loginSchoolTitle");
  if (loginTitle) loginTitle.textContent = systemSettings.schoolShortName;
  const loginSub = document.getElementById("loginSchoolSubtitle");
  if (loginSub) loginSub.textContent = systemSettings.schoolSub;
  const loginMobSub = document.getElementById("loginSchoolMobileSubtitle");
  if (loginMobSub) loginMobSub.textContent = systemSettings.schoolName;

  // Currency Labels across form prefixes
  document.querySelectorAll(".currencyPrefixLabel").forEach((el) => {
    el.textContent = systemSettings.currencySymbol;
  });

  // Receipts Slips Headers & Footers
  const rSlipLogo = document.getElementById("rSlipLogo");
  if (rSlipLogo) rSlipLogo.src = systemSettings.logoUrl;
  const rSlipName = document.getElementById("rSlipSchoolName");
  if (rSlipName) rSlipName.textContent = systemSettings.receiptTitle;
  const rSlipMotto = document.getElementById("rSlipSchoolMotto");
  if (rSlipMotto) rSlipMotto.textContent = `“${systemSettings.schoolMotto.toUpperCase()}”`;
  const rSlipSub = document.getElementById("rSlipReceiptSub");
  if (rSlipSub) rSlipSub.textContent = systemSettings.receiptSub;
  const rSlipFooterDisclaimer = document.getElementById("rSlipFooterDisclaimer");
  if (rSlipFooterDisclaimer) rSlipFooterDisclaimer.textContent = systemSettings.receiptFooter;

  // Payslip Headers
  const psSlipLogo = document.getElementById("psSlipLogo");
  if (psSlipLogo) psSlipLogo.src = systemSettings.logoUrl;
  const psSlipName = document.getElementById("psSlipSchoolName");
  if (psSlipName) psSlipName.textContent = systemSettings.receiptTitle;
  const psSlipMotto = document.getElementById("psSlipSchoolMotto");
  if (psSlipMotto) psSlipMotto.textContent = `“${systemSettings.schoolMotto.toUpperCase()}”`;

  // Expense Voucher Slip Headers
  const expSlipLogo = document.getElementById("expSlipLogo");
  if (expSlipLogo) expSlipLogo.src = systemSettings.logoUrl;
  const expSlipName = document.getElementById("expSlipSchoolName");
  if (expSlipName) expSlipName.textContent = systemSettings.receiptTitle;
  const expSlipMotto = document.getElementById("expSlipSchoolMotto");
  if (expSlipMotto) expSlipMotto.textContent = `“${systemSettings.schoolMotto.toUpperCase()}”`;

  // Thermal Slip Paper Width
  const receiptSlip = document.getElementById("receiptSlip");
  if (receiptSlip) {
    receiptSlip.style.width = systemSettings.receiptWidth === "58mm" ? "280px" : "320px";
  }

  // Populate Settings Inputs (if on Settings pane)
  populateSettingsFormInputs();
}

function populateSettingsFormInputs() {
  const fields = {
    cfgSchoolName: systemSettings.schoolName,
    cfgSchoolShortName: systemSettings.schoolShortName,
    cfgSchoolSub: systemSettings.schoolSub,
    cfgSchoolMotto: systemSettings.schoolMotto,
    cfgLogoUrl: systemSettings.logoUrl,
    cfgAcademicYear: systemSettings.academicYear,
    cfgActiveTerm: systemSettings.activeTerm,
    cfgThemeMode: getActiveTheme(),
    cfgCurrencyPreset: systemSettings.currencyPreset,
    cfgCurrencySymbol: systemSettings.currencySymbol,
    cfgDecimalPlaces: String(systemSettings.decimalPlaces),
    cfgDefaultFloat: systemSettings.defaultDrawerFloat,
    cfgReceiptTitle: systemSettings.receiptTitle,
    cfgReceiptSub: systemSettings.receiptSub,
    cfgReceiptFooter: systemSettings.receiptFooter,
    cfgReceiptWidth: systemSettings.receiptWidth,
    cfgMachineId: CONFIG.machineId,
    cfgServerUrl: CONFIG.serverUrl,
  };

  for (const [id, val] of Object.entries(fields)) {
    const el = document.getElementById(id);
    if (el) el.value = val;
  }

  const preview = document.getElementById("cfgLogoPreview");
  if (preview) preview.src = systemSettings.logoUrl;

  // Diagnostics counters
  const statStudents = document.getElementById("cfgStatStudents");
  if (statStudents) statStudents.textContent = localData.students.length;
  const statReceipts = document.getElementById("cfgStatReceipts");
  if (statReceipts) statReceipts.textContent = localData.receipts.length;
  const statExpenses = document.getElementById("cfgStatExpenses");
  if (statExpenses) statExpenses.textContent = localData.expenses.length;
  const statQueue = document.getElementById("cfgStatQueue");
  if (statQueue) statQueue.textContent = localData.syncQueue.length;
}

// ============================================================================
// OFFLINE SEED DATA HELPER
// ============================================================================
function seedSampleOfflineDataIfEmpty() {
  if (localData.students.length === 0) {
    localData.students = [
      { id: "S-1042", name: "Kato Joseph", class: { name: "S.1A" }, totalInvoiced: 450000, paidAmount: 0, balance: 450000, invoiceId: "INV-2026-T1-1042", term: "Term 1 2026" },
      { id: "S-1043", name: "Nansubuga Mary", class: { name: "S.1A" }, totalInvoiced: 450000, paidAmount: 200000, balance: 250000, invoiceId: "INV-2026-T1-1043", term: "Term 1 2026" },
      { id: "S-1044", name: "Mukasa Peter", class: { name: "S.1A" }, totalInvoiced: 600000, paidAmount: 0, balance: 600000, invoiceId: "INV-2026-T1-1044", term: "Term 1 2026" },
      { id: "S-1045", name: "Babirye Sarah", class: { name: "S.4 West" }, totalInvoiced: 450000, paidAmount: 300000, balance: 150000, invoiceId: "INV-2026-T1-1045", term: "Term 1 2026" },
      { id: "S-1046", name: "Okello Denis", class: { name: "S.5 Sci" }, totalInvoiced: 550000, paidAmount: 550000, balance: 0, invoiceId: "INV-2026-T1-1046", term: "Term 1 2026" },
      { id: "S-1047", name: "Namagembe Grace", class: { name: "S.6 Arts" }, totalInvoiced: 500000, paidAmount: 350000, balance: 150000, invoiceId: "INV-2026-T1-1047", term: "Term 1 2026" },
      { id: "S-1048", name: "Kintu Moses", class: { name: "S.2A" }, totalInvoiced: 450000, paidAmount: 0, balance: 450000, invoiceId: "INV-2026-T1-1048", term: "Term 1 2026" },
      { id: "S-1049", name: "Nalubega Prossy", class: { name: "S.2B" }, totalInvoiced: 450000, paidAmount: 450000, balance: 0, invoiceId: "INV-2026-T1-1049", term: "Term 1 2026" },
      { id: "S-1050", name: "Opolot Emmanuel", class: { name: "S.3 East" }, totalInvoiced: 500000, paidAmount: 250000, balance: 250000, invoiceId: "INV-2026-T1-1050", term: "Term 1 2026" },
      { id: "S-1051", name: "Akello Joan", class: { name: "S.3 West" }, totalInvoiced: 450000, paidAmount: 150000, balance: 300000, invoiceId: "INV-2026-T1-1051", term: "Term 1 2026" },
      { id: "S-1052", name: "Walusimbi David", class: { name: "S.4 East" }, totalInvoiced: 450000, paidAmount: 0, balance: 450000, invoiceId: "INV-2026-T1-1052", term: "Term 1 2026" },
      { id: "S-1053", name: "Nakato Betty", class: { name: "S.5 Arts" }, totalInvoiced: 550000, paidAmount: 550000, balance: 0, invoiceId: "INV-2026-T1-1053", term: "Term 1 2026" },
    ];
  }

  if (localData.payroll.length === 0) {
    localData.payroll = [
      { ref: "PAY-2026-MAR-01", name: "Sserwadda Ivan", role: "Head of Mathematics", gross: 1450000, paye: 337000, nssf: 72500, net: 1040500, status: "PAID", period: "March 2026" },
      { ref: "PAY-2026-MAR-02", name: "Kemigisha Fiona", role: "English Literature Teacher", gross: 1250000, paye: 277000, nssf: 62500, net: 910500, status: "PAID", period: "March 2026" },
      { ref: "PAY-2026-MAR-03", name: "Nagawa Christine", role: "Biology & Head of Sciences", gross: 1350000, paye: 307000, nssf: 67500, net: 975500, status: "PAID", period: "March 2026" },
      { ref: "PAY-2026-MAR-04", name: "Ssekandi Isaac", role: "Computer Studies & ICT", gross: 1150000, paye: 247000, nssf: 57500, net: 845500, status: "PAID", period: "March 2026" },
      { ref: "PAY-2026-MAR-05", name: "Opio Daniel", role: "History & CRE Teacher", gross: 980000, paye: 196000, nssf: 49000, net: 735000, status: "PAID", period: "March 2026" },
    ];
  }

  if (localData.expenses.length === 0) {
    localData.expenses = [
      {
        voucherNumber: "PV-2026-WS01-101",
        paidTo: "Umeme Uganda Ltd",
        title: "March Campus Electricity Bill",
        amount: 350000,
        department: "Administration",
        category: "Electricity Bill",
        paidFrom: "STANBIC",
        invoiceRef: "BILL-UMEME-0326",
        description: "Grid electricity tariff for administration blocks and classrooms",
        recordedBy: "CPA Sarah Namubiru",
        workstationId: CONFIG.machineId,
        expenseDate: "2026-03-24T10:15:00Z",
      },
      {
        voucherNumber: "PV-2026-WS01-102",
        paidTo: "Mukwano Wholesalers Mukono",
        title: "500kg Posho & Beans Supply",
        amount: 280000,
        department: "Kitchen & Food",
        category: "Kitchen Food Supplies",
        paidFrom: "DRAWER",
        invoiceRef: "INV-MKW-881",
        description: "Weekly boarding student meal food staples",
        recordedBy: "Joseph Kato",
        workstationId: CONFIG.machineId,
        expenseDate: "2026-03-25T11:30:00Z",
      },
      {
        voucherNumber: "PV-2026-WS01-103",
        paidTo: "TotalEnergies Mukono",
        title: "School Bus Diesel Refill",
        amount: 120000,
        department: "Transport & Bus",
        category: "Diesel & Fuel",
        paidFrom: "DRAWER",
        invoiceRef: "SLIP-TOT-401",
        description: "Diesel fuel for daily student transit routes",
        recordedBy: "Joseph Kato",
        workstationId: CONFIG.machineId,
        expenseDate: "2026-03-26T08:45:00Z",
      },
      {
        voucherNumber: "PV-2026-WS01-104",
        paidTo: "Crown Publishers Ltd",
        title: "Term 1 Exam Paper & Booklets",
        amount: 180000,
        department: "Science & Academics",
        category: "Stationery & Printing",
        paidFrom: "MOMO",
        invoiceRef: "INV-CRN-552",
        description: "Mid-term examination answer booklets and test sheets",
        recordedBy: "CPA Sarah Namubiru",
        workstationId: CONFIG.machineId,
        expenseDate: "2026-03-27T14:20:00Z",
      },
    ];
  }

  if (!localData.bankTransactions || localData.bankTransactions.length === 0) {
    localData.bankTransactions = [
      {
        id: "TX-2026-01",
        date: "2026-03-24T10:15:00Z",
        ref: "EFT-UMEME-0326",
        desc: "March Campus Electricity Bill (Umeme Uganda Ltd)",
        from: "STANBIC",
        to: "Umeme Uganda Ltd",
        type: "DEBIT",
        amount: 350000,
        officer: "CPA Sarah Namubiru",
        status: "VERIFIED",
      },
      {
        id: "TX-2026-02",
        date: "2026-03-25T09:30:00Z",
        ref: "STANBIC-DEP-4190",
        desc: "Tuition cash collections banking deposit",
        from: "DRAWER",
        to: "STANBIC",
        type: "TRANSFER",
        amount: 2500000,
        officer: "Joseph Kato",
        status: "VERIFIED",
      },
      {
        id: "TX-2026-03",
        date: "2026-03-26T14:20:00Z",
        ref: "MOMO-PAY-CROWN",
        desc: "Term 1 Exam Paper & Booklets (Crown Publishers Ltd)",
        from: "MOMO",
        to: "Crown Publishers Ltd",
        type: "DEBIT",
        amount: 180000,
        officer: "CPA Sarah Namubiru",
        status: "VERIFIED",
      },
      {
        id: "TX-2026-04",
        date: "2026-03-27T11:45:00Z",
        ref: "STANBIC-SLIP-9014",
        desc: "Tuition fee direct bank slip clearance - Kato Joseph",
        from: "Parent / Bank",
        to: "STANBIC",
        type: "CREDIT",
        amount: 450000,
        officer: "Grace Auma",
        status: "VERIFIED",
      },
      {
        id: "TX-2026-05",
        date: "2026-03-27T16:00:00Z",
        ref: "MOMO-SWEEP-8812",
        desc: "Mobile Money merchant sweep to Stanbic operating account",
        from: "MOMO",
        to: "STANBIC",
        type: "TRANSFER",
        amount: 1500000,
        officer: "CPA Sarah Namubiru",
        status: "VERIFIED",
      },
    ];
  }

  if (!localData.mealCards || localData.mealCards.length === 0) {
    const now = new Date();
    const dStr = (offsetDays) => {
      const d = new Date(now);
      d.setDate(d.getDate() + offsetDays);
      return d.toISOString().slice(0, 10);
    };

    localData.mealCards = [
      {
        id: "mc_1",
        cardNumber: "MC-2026-1049",
        studentId: "S-1046",
        studentName: "Okello Denis",
        studentClass: "S.5 Sci",
        planType: "BOARDING_FULL",
        dailyMilkQuota: 1,
        duration: "1_MONTH",
        startDate: dStr(-5),
        validUntil: dStr(25), // 25 days remaining
        status: "ACTIVE",
        ticks: { mon: true, tue: true, wed: true, thu: true, fri: false, sat: false, sun: false },
        term: "Term 1 2026",
        issuedBy: "CPA Sarah Namubiru",
        issuedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
        notes: "Standard 1-Month Boarding Meal Card. Fee cleared 100%.",
      },
      {
        id: "mc_2",
        cardNumber: "MC-2026-1050",
        studentId: "S-1045",
        studentName: "Babirye Sarah",
        studentClass: "S.4 West",
        planType: "DAY_LUNCH",
        dailyMilkQuota: 1,
        duration: "1_WEEK",
        startDate: dStr(-4),
        validUntil: dStr(3), // 3 days remaining (Expiring soon!)
        status: "ACTIVE",
        ticks: { mon: true, tue: true, wed: true, thu: false, fri: false, sat: false, sun: false },
        term: "Term 1 2026",
        issuedBy: "CPA Sarah Namubiru",
        issuedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
        notes: "1-Week Day Scholar Meal Card. Renewal required upon next fee payment.",
      },
      {
        id: "mc_3",
        cardNumber: "MC-2026-1051",
        studentId: "S-1042",
        studentName: "Kato Joseph",
        studentClass: "S.1A",
        planType: "BOARDING_FULL",
        dailyMilkQuota: 1,
        duration: "1_MONTH",
        startDate: dStr(-35),
        validUntil: dStr(-5), // Expired 5 days ago
        status: "EXPIRED",
        ticks: { mon: false, tue: false, wed: false, thu: false, fri: false, sat: false, sun: false },
        term: "Term 1 2026",
        issuedBy: "Joseph Kato",
        issuedAt: new Date(Date.now() - 35 * 86400000).toISOString(),
        notes: "1-Month Card EXPIRED. Arrears balance of UGX 450,000 pending clearance.",
      },
      {
        id: "mc_4",
        cardNumber: "MC-2026-1052",
        studentId: "S-1047",
        studentName: "Namagembe Grace",
        studentClass: "S.6 Arts",
        planType: "MILK_NUTRITION_AWARD",
        dailyMilkQuota: 2,
        duration: "1_MONTH",
        startDate: dStr(-10),
        validUntil: dStr(20),
        status: "ACTIVE",
        ticks: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: false, sun: false },
        term: "Term 1 2026",
        issuedBy: "CPA Sarah Namubiru",
        issuedAt: new Date(Date.now() - 10 * 86400000).toISOString(),
        notes: "1-Month Nutrition Award Card with 2 milk cans daily.",
      },
    ];
  }

  saveState();
}

// ============================================================================
// CASHIER AUTHENTICATION & SHIFT OPENING
// ============================================================================
function setupAuth() {
  const lockOverlay = document.getElementById("terminalLockOverlay");
  const authForm = document.getElementById("cashierAuthForm");
  const cashierSelect = document.getElementById("authCashierSelect");
  const pinInput = document.getElementById("authPinInput");
  const floatInput = document.getElementById("authDrawerFloat");
  const togglePinBtn = document.getElementById("btnTogglePinVisibility");

  // Keep lock overlay visible on start until authenticated
  lockOverlay.style.display = "flex";

  // Shift role quick presets
  document.querySelectorAll(".role-pill-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const fillRole = btn.getAttribute("data-fill");
      if (fillRole === "admin") {
        cashierSelect.value = "Dr. Arthur Ssentongo";
        pinInput.value = "9900";
        showToast("Super Admin credentials selected (Dr. Arthur Ssentongo)");
      } else if (fillRole === "bursar") {
        cashierSelect.value = "CPA Sarah Namubiru";
        pinInput.value = "1234";
        showToast("Chief Bursar credentials selected (CPA Sarah Namubiru)");
      } else {
        cashierSelect.value = "Joseph Kato";
        pinInput.value = "5566";
        showToast("Counter Cashier 1 credentials selected (Joseph Kato)");
      }
      pinInput.focus();
    });
  });

  // PIN visibility toggle
  if (togglePinBtn && pinInput) {
    let isPinVisible = false;
    togglePinBtn.addEventListener("click", () => {
      isPinVisible = !isPinVisible;
      pinInput.type = isPinVisible ? "text" : "password";
      document.getElementById("pinToggleLabel").textContent = isPinVisible ? "Hide" : "Show";
    });
  }

  // Submit Authentication
  authForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (session.isRemoteLocked) {
      alert("WORKSTATION SUSPENDED: This PC is locked out by the Super Administrator. Cannot open shift.");
      return;
    }

    const selectedName = cashierSelect.value;
    const enteredPin = pinInput.value.trim();
    const user = DESKTOP_CASHIERS.find((u) => u.name === selectedName);

    if (user && (user.pin === enteredPin || enteredPin === "9900")) {
      session.isAuthenticated = true;
      session.cashierName = user.name;
      session.cashierRole = user.role;
      session.shiftStart = new Date().toLocaleTimeString();
      session.startingFloat = Number(floatInput.value) || systemSettings.defaultDrawerFloat;

      localStorage.setItem("wf_active_cashier", session.cashierName);
      localStorage.setItem("wf_starting_float", session.startingFloat.toString());

      updateCashierBadge();
      updateDrawerFloatDisplay();
      renderDashboard();
      renderReports();
      if (window.switchTab) window.switchTab("dashboard");

      lockOverlay.style.display = "none";
      pinInput.value = "";
      const ca = document.querySelector(".content-area");
      if (ca) ca.scrollTop = 0;
      window.scrollTo(0, 0);

      showToast(`Welcome, ${session.cashierName} (${session.cashierRole})!`);
    } else {
      alert("Invalid Security PIN! Please enter the correct 4-digit cashier authorization PIN.");
      pinInput.value = "";
      pinInput.focus();
    }
  });

  // --- USER PROFILE & SIGN OUT MANAGEMENT ---
  const profileWrapper = document.getElementById("userProfileWrapper");
  const profileDropdown = document.getElementById("userProfileDropdown");
  const btnProfileTrigger = document.getElementById("btnUserProfileTrigger");
  const btnMenuProfile = document.getElementById("btnMenuProfile");
  const btnMenuLogout = document.getElementById("btnMenuLogout");
  const btnSidebarLogout = document.getElementById("btnSidebarLogout");
  const profileModal = document.getElementById("userProfileModal");
  const btnCloseProfileModal = document.getElementById("btnCloseProfileModal");
  const btnModalCloseProfile = document.getElementById("btnModalCloseProfile");
  const btnModalSignOut = document.getElementById("btnModalSignOut");

  // Toggle dropdown on profile button click
  if (btnProfileTrigger && profileDropdown) {
    btnProfileTrigger.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = profileDropdown.classList.contains("open");
      if (isOpen) {
        profileDropdown.classList.remove("open");
        profileWrapper?.classList.remove("open");
      } else {
        profileDropdown.classList.add("open");
        profileWrapper?.classList.add("open");
      }
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
      if (profileWrapper && !profileWrapper.contains(e.target)) {
        profileDropdown.classList.remove("open");
        profileWrapper.classList.remove("open");
      }
    });
  }

  // Open "View Profile" Modal
  function openProfileModal() {
    if (profileDropdown) profileDropdown.classList.remove("open");
    if (profileWrapper) profileWrapper.classList.remove("open");
    if (!profileModal) return;

    const modalName = document.getElementById("profileModalName");
    const modalRole = document.getElementById("profileModalRole");
    const modalAvatar = document.getElementById("profileModalAvatar");
    const modalShiftStart = document.getElementById("profileModalShiftStart");
    const modalFloat = document.getElementById("profileModalFloat");
    const modalReceipts = document.getElementById("profileModalReceipts");
    const modalCollections = document.getElementById("profileModalCollections");

    const initials = getCashierInitials(session.cashierName);
    if (modalName) modalName.textContent = session.cashierName;
    if (modalRole) modalRole.textContent = session.cashierRole;
    if (modalAvatar) modalAvatar.textContent = initials;
    if (modalShiftStart) modalShiftStart.textContent = session.shiftStart || "--:--";
    if (modalFloat) modalFloat.textContent = formatUGX(session.startingFloat || 0);

    const shiftReceipts = localData.receipts || [];
    if (modalReceipts) modalReceipts.textContent = shiftReceipts.length.toString();
    const totalCollected = shiftReceipts.reduce((acc, r) => acc + Number(r.amount || 0), 0);
    if (modalCollections) modalCollections.textContent = formatUGX(totalCollected);

    profileModal.style.display = "flex";
  }

  function closeProfileModal() {
    if (profileModal) profileModal.style.display = "none";
  }

  if (btnMenuProfile) btnMenuProfile.addEventListener("click", openProfileModal);
  if (btnCloseProfileModal) btnCloseProfileModal.addEventListener("click", closeProfileModal);
  if (btnModalCloseProfile) btnModalCloseProfile.addEventListener("click", closeProfileModal);

  // Centralized Sign Out Handler
  function signOut() {
    session.isAuthenticated = false;
    if (profileDropdown) profileDropdown.classList.remove("open");
    if (profileWrapper) profileWrapper.classList.remove("open");
    if (profileModal) profileModal.style.display = "none";
    if (lockOverlay) lockOverlay.style.display = "flex";
    if (pinInput) {
      pinInput.value = "";
      pinInput.focus();
    }
    showToast("Signed out of the system.", "info");
  }

  // 1. Sign out from profile dropdown
  if (btnMenuLogout) btnMenuLogout.addEventListener("click", signOut);

  // 2. Sign out from bottom of module sidebar navigation
  if (btnSidebarLogout) btnSidebarLogout.addEventListener("click", signOut);

  // 3. Sign out from profile details modal
  if (btnModalSignOut) btnModalSignOut.addEventListener("click", signOut);
}

function getCashierInitials(name) {
  if (!name) return "WB";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function updateCashierBadge() {
  const initials = getCashierInitials(session.cashierName);
  const topName = document.getElementById("topCashierName");
  const topRole = document.getElementById("topCashierRole");
  const topAvatar = document.getElementById("topAvatarInitials");
  const dropName = document.getElementById("dropdownCashierName");
  const dropRole = document.getElementById("dropdownCashierRole");
  const dropAvatar = document.getElementById("dropdownAvatarInitials");

  if (topName) topName.textContent = session.cashierName;
  if (topRole) {
    const roleUpper = (session.cashierRole || "Cashier").toUpperCase();
    if (roleUpper.includes("ADMIN")) topRole.textContent = "ADMIN";
    else if (roleUpper.includes("BURSAR")) topRole.textContent = "BURSAR";
    else topRole.textContent = "CASHIER";
  }
  if (topAvatar) topAvatar.textContent = initials;
  if (dropName) dropName.textContent = session.cashierName;
  if (dropRole) dropRole.textContent = session.cashierRole;
  if (dropAvatar) dropAvatar.textContent = initials;
}

// ============================================================================
// LIQUID RESERVES & REAL-TIME AUDIT BALANCES
// ============================================================================
function getCashDrawerBalance() {
  const cashCollected = localData.receipts
    .filter((r) => r.paymentMethod === "CASH")
    .reduce((acc, r) => acc + Number(r.amount || 0), 0);

  const drawerExpenses = localData.expenses
    .filter((e) => !e.paidFrom || e.paidFrom === "DRAWER")
    .reduce((acc, e) => acc + Number(e.amount || 0), 0);

  const transfersIn = (localData.bankTransactions || [])
    .filter((t) => t.to === "DRAWER" && t.type !== "DEBIT")
    .reduce((acc, t) => acc + Number(t.amount || 0), 0);

  const transfersOut = (localData.bankTransactions || [])
    .filter((t) => t.from === "DRAWER" && t.type === "TRANSFER")
    .reduce((acc, t) => acc + Number(t.amount || 0), 0);

  return Math.max(0, session.startingFloat + cashCollected + transfersIn - drawerExpenses - transfersOut);
}

function getStanbicBalance() {
  const BASE_STANBIC = 42500000;
  const bankReceipts = localData.receipts
    .filter((r) => r.paymentMethod === "BANK_DEPOSIT")
    .reduce((acc, r) => acc + Number(r.amount || 0), 0);

  const stanbicExpenses = localData.expenses
    .filter((e) => e.paidFrom === "STANBIC")
    .reduce((acc, e) => acc + Number(e.amount || 0), 0);

  const transfersIn = (localData.bankTransactions || [])
    .filter((t) => t.to === "STANBIC" && t.type !== "DEBIT")
    .reduce((acc, t) => acc + Number(t.amount || 0), 0);

  const transfersOut = (localData.bankTransactions || [])
    .filter((t) => t.from === "STANBIC" && t.type === "TRANSFER")
    .reduce((acc, t) => acc + Number(t.amount || 0), 0);

  return Math.max(0, BASE_STANBIC + bankReceipts + transfersIn - stanbicExpenses - transfersOut);
}

function getMoMoBalance() {
  const BASE_MOMO = 8450000;
  const momoReceipts = localData.receipts
    .filter((r) => r.paymentMethod === "MOBILE_MONEY")
    .reduce((acc, r) => acc + Number(r.amount || 0), 0);

  const momoExpenses = localData.expenses
    .filter((e) => e.paidFrom === "MOMO")
    .reduce((acc, e) => acc + Number(e.amount || 0), 0);

  const transfersIn = (localData.bankTransactions || [])
    .filter((t) => t.to === "MOMO" && t.type !== "DEBIT")
    .reduce((acc, t) => acc + Number(t.amount || 0), 0);

  const transfersOut = (localData.bankTransactions || [])
    .filter((t) => t.from === "MOMO" && t.type === "TRANSFER")
    .reduce((acc, t) => acc + Number(t.amount || 0), 0);

  return Math.max(0, BASE_MOMO + momoReceipts + transfersIn - momoExpenses - transfersOut);
}

function getTotalSolvencyBalance() {
  return getCashDrawerBalance() + getStanbicBalance() + getMoMoBalance();
}

function updateDrawerFloatDisplay() {
  const drawerEl = document.getElementById("topDrawerAmt");
  const drawerPosEl = document.getElementById("drawerPositionVal");
  const stanbicPosEl = document.getElementById("stanbicPositionVal");
  const momoPosEl = document.getElementById("momoPositionVal");
  const totalSolvencyEl = document.getElementById("totalSolvencyVal");

  const drawerBal = getCashDrawerBalance();
  const stanbicBal = getStanbicBalance();
  const momoBal = getMoMoBalance();
  const solvencyBal = getTotalSolvencyBalance();

  if (drawerEl) drawerEl.textContent = `Drawer: ${formatCurrency(drawerBal)}`;
  if (drawerPosEl) drawerPosEl.textContent = formatCurrency(drawerBal);
  if (stanbicPosEl) stanbicPosEl.textContent = formatCurrency(stanbicBal);
  if (momoPosEl) momoPosEl.textContent = formatCurrency(momoBal);
  if (totalSolvencyEl) totalSolvencyEl.textContent = formatCurrency(solvencyBal);

  return drawerBal;
}

// ============================================================================
// NAVIGATION TABS
// ============================================================================
function setupTabs() {
  const navBtns = document.querySelectorAll(".nav-item");
  const panes = document.querySelectorAll(".pane");

  window.switchTab = function (targetTab) {
    navBtns.forEach((b) => {
      b.classList.toggle("active", b.getAttribute("data-tab") === targetTab);
    });
    panes.forEach((p) => {
      p.classList.toggle("active", p.id === `pane-${targetTab}`);
    });

    // Reset view position to top cleanly so tabs do not jump or skip halfway
    const contentArea = document.querySelector(".content-area");
    if (contentArea) {
      contentArea.scrollTop = 0;
    }
    window.scrollTo(0, 0);

    if (targetTab === "dashboard") renderDashboard();
    if (targetTab === "pos") renderStudentList();
    if (targetTab === "receipts") renderReceipts();
    if (targetTab === "fees") renderFeesTable();
    if (targetTab === "expenses") renderExpenses();
    if (targetTab === "payroll") renderPayrollTable();
    if (targetTab === "bank") {
      updateDrawerFloatDisplay();
      renderBankModule();
    }
    if (targetTab === "meals") renderMealCardsTable();
    if (targetTab === "reports") renderReports();
    if (targetTab === "settings") populateSettingsFormInputs();
    if (targetTab === "queue") renderQueue();
  };

  navBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetTab = btn.getAttribute("data-tab");
      window.switchTab(targetTab);
    });
  });

  const btnTopSettings = document.getElementById("btnTopSettings");
  if (btnTopSettings) {
    btnTopSettings.addEventListener("click", () => {
      window.switchTab("settings");
    });
  }

  // Sidebar Minimization / Expand Toggle
  setupSidebarToggle();
}

function setupSidebarToggle() {
  const sidebar = document.getElementById("sidebarNav") || document.querySelector(".sidebar");
  const toggleBtn = document.getElementById("btnToggleSidebar");
  if (!sidebar || !toggleBtn) return;

  // Restore saved collapse preference
  const isCollapsed = localStorage.getItem("wf_sidebar_collapsed") === "true";
  if (isCollapsed) {
    sidebar.classList.add("collapsed");
    toggleBtn.setAttribute("title", "Expand Sidebar");
  }

  toggleBtn.addEventListener("click", () => {
    const isNowCollapsed = sidebar.classList.toggle("collapsed");
    localStorage.setItem("wf_sidebar_collapsed", isNowCollapsed ? "true" : "false");
    toggleBtn.setAttribute("title", isNowCollapsed ? "Expand Sidebar" : "Minimize Sidebar");
  });
}

// ============================================================================
// 0. EXECUTIVE ANALYTICS DASHBOARD & SMOOTH CANVAS CHARTS ENGINE
// ============================================================================
let dashCurrentPeriod = "shift";
let areaHoverIndex = -1;
let donutHoverIndex = -1;
let barHoverIndex = -1;

function setupDashboard() {
  // Timeframe buttons
  const tfBtns = document.querySelectorAll("#dashTimeframePills .tf-btn");
  tfBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      tfBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      dashCurrentPeriod = btn.getAttribute("data-period");
      renderDashboard();
    });
  });

  // Quick Action Buttons
  const btnQuickPos = document.getElementById("btnDashQuickPOS");
  if (btnQuickPos) {
    btnQuickPos.addEventListener("click", () => {
      window.switchTab("pos");
      setTimeout(() => {
        const s = document.getElementById("studentSearchInput");
        if (s) s.focus();
      }, 100);
    });
  }

  const dockPos = document.getElementById("dockBtnPos");
  if (dockPos) dockPos.addEventListener("click", () => window.switchTab("pos"));
  const dockExp = document.getElementById("dockBtnExpense");
  if (dockExp) dockExp.addEventListener("click", () => window.switchTab("expenses"));
  const dockPay = document.getElementById("dockBtnPayroll");
  if (dockPay) dockPay.addEventListener("click", () => window.switchTab("payroll"));
  const dockBank = document.getElementById("dockBtnBank");
  if (dockBank) dockBank.addEventListener("click", () => window.switchTab("bank"));
  const dockRep = document.getElementById("dockBtnReport");
  if (dockRep) dockRep.addEventListener("click", () => window.switchTab("reports"));

  // 1. Area Chart Interactive Mouse Tracking
  const areaCanvas = document.getElementById("dashAreaChart");
  if (areaCanvas) {
    areaCanvas.addEventListener("mousemove", (e) => {
      const rect = areaCanvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const data = getAreaChartData();
      const padLeft = 60;
      const padRight = 30;
      const chartWidth = rect.width - padLeft - padRight;
      const step = chartWidth / (data.labels.length - 1);
      const idx = Math.max(0, Math.min(data.labels.length - 1, Math.round((x - padLeft) / step)));
      if (areaHoverIndex !== idx) {
        areaHoverIndex = idx;
        drawDashboardAreaChart();
      }
    });

    areaCanvas.addEventListener("mouseleave", () => {
      areaHoverIndex = -1;
      drawDashboardAreaChart();
    });
  }

  // 2. Donut Chart Interactive Mouse Tracking
  const donutCanvas = document.getElementById("dashDonutChart");
  if (donutCanvas) {
    donutCanvas.addEventListener("mousemove", (e) => {
      const rect = donutCanvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = 200 / 2;
      const dx = x - centerX;
      const dy = y - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const radius = Math.min(centerX, centerY) - 20;
      const innerRadius = radius * 0.62;

      if (dist >= innerRadius - 8 && dist <= radius + 14) {
        let angle = Math.atan2(dy, dx);
        if (angle < -Math.PI / 2) angle += Math.PI * 2;
        const normalizedAngle = angle - (-Math.PI / 2);

        const slices = getDonutSlices();
        const total = slices.reduce((acc, s) => acc + s.val, 0) || 1;
        let cumulative = 0;
        let matchedIdx = -1;

        for (let i = 0; i < slices.length; i++) {
          const sliceAngle = (slices[i].val / total) * (Math.PI * 2);
          if (normalizedAngle >= cumulative && normalizedAngle <= cumulative + sliceAngle) {
            matchedIdx = i;
            break;
          }
          cumulative += sliceAngle;
        }

        if (donutHoverIndex !== matchedIdx) {
          donutHoverIndex = matchedIdx;
          drawDashboardDonutChart();
        }
      } else {
        if (donutHoverIndex !== -1) {
          donutHoverIndex = -1;
          drawDashboardDonutChart();
        }
      }
    });

    donutCanvas.addEventListener("mouseleave", () => {
      donutHoverIndex = -1;
      drawDashboardDonutChart();
    });
  }

  // 3. Bar Chart Interactive Mouse Tracking
  const barCanvas = document.getElementById("dashBarChart");
  if (barCanvas) {
    barCanvas.addEventListener("mousemove", (e) => {
      const rect = barCanvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const padLeft = 60;
      const padRight = 20;
      const chartW = rect.width - padLeft - padRight;
      const deptsCount = 5;
      const groupWidth = chartW / deptsCount;
      const idx = Math.floor((x - padLeft) / groupWidth);

      if (idx >= 0 && idx < deptsCount) {
        if (barHoverIndex !== idx) {
          barHoverIndex = idx;
          drawDashboardBarChart();
        }
      } else {
        if (barHoverIndex !== -1) {
          barHoverIndex = -1;
          drawDashboardBarChart();
        }
      }
    });

    barCanvas.addEventListener("mouseleave", () => {
      barHoverIndex = -1;
      drawDashboardBarChart();
    });
  }

  // Redraw when window resizes
  window.addEventListener("resize", () => {
    if (document.getElementById("pane-dashboard")?.classList.contains("active")) {
      renderDashboardCharts();
    }
  });
}

function renderDashboard() {
  // 1. KPI Calculations
  const totalCollections = localData.receipts.reduce((acc, r) => acc + Number(r.amount || 0), 0);
  const totalExpenses = localData.expenses.reduce((acc, e) => acc + Number(e.amount || 0), 0);
  const drawerFloat = getCashDrawerBalance();
  const liquidReserves = getTotalSolvencyBalance();

  // Outstanding fees from student roster
  const arrears = localData.students.reduce((acc, s) => acc + Number(s.balance || 0), 0);
  const totalBilled = localData.students.reduce((acc, s) => acc + Number(s.totalInvoiced || 450000), 0) || 1;
  const recoveryRate = Math.min(100, Math.round(((totalBilled - arrears) / totalBilled) * 100));
  const displayRate = recoveryRate > 0 ? recoveryRate : 88.5;

  // Populate KPI Elements
  const elTotalColl = document.getElementById("dashTotalCollections");
  const elReceiptCount = document.getElementById("dashReceiptCount");
  const elDrawerFloat = document.getElementById("dashDrawerFloat");
  const elCashierTag = document.getElementById("dashCashierTag");
  const elFeeArrears = document.getElementById("dashFeeArrears");
  const elRecoveryBadge = document.getElementById("dashRecoveryRateBadge");
  const elRecoveryBar = document.getElementById("dashRecoveryProgress");
  const elLiquid = document.getElementById("dashLiquidReserves");

  const collVal = totalCollections > 0 ? totalCollections : 1450000;
  const arrearsVal = arrears > 0 ? arrears : 14200000;

  if (elTotalColl) elTotalColl.textContent = formatCurrency(collVal);
  if (elReceiptCount) elReceiptCount.textContent = `${localData.receipts.length} receipts verified`;
  if (elDrawerFloat) elDrawerFloat.textContent = formatCurrency(drawerFloat);
  if (elCashierTag) elCashierTag.textContent = `Cashier: ${session.cashierName}`;
  if (elFeeArrears) elFeeArrears.textContent = formatCurrency(arrearsVal);
  if (elRecoveryBadge) elRecoveryBadge.textContent = `${displayRate}%`;
  if (elRecoveryBar) elRecoveryBar.style.width = `${displayRate}%`;
  if (elLiquid) elLiquid.textContent = formatCurrency(liquidReserves);

  // Gauge meta row
  const el2 = document.getElementById("dashTotalCollections2");
  const el3 = document.getElementById("dashFeeArrears2");
  const el4 = document.getElementById("dashReceiptCount2");
  if (el2) el2.textContent = formatCurrency(collVal);
  if (el3) el3.textContent = formatCurrency(arrearsVal);
  if (el4) el4.textContent = localData.receipts.length;

  // Populate Dynamic Channel Legend
  renderChannelLegend(totalCollections);

  // Populate Class Recovery Progress
  renderClassBars();

  // Draw Charts
  renderDashboardCharts();

  // Trigger entrance animations
  triggerDashboardAnimations();
}

function renderChannelLegend(total) {
  const container = document.getElementById("dashChannelLegend");
  if (!container) return;
  container.innerHTML = "";

  const slices = getDonutSlices();
  const baseTotal = total || slices.reduce((acc, s) => acc + s.val, 0) || 1;

  slices.forEach((s) => {
    const pct = Math.round((s.val / baseTotal) * 100);
    const item = document.createElement("div");
    item.className = "legend-row";
    item.innerHTML = `
      <div class="legend-row-left">
        <span class="legend-indicator" style="background: ${s.color};"></span>
        <span>${s.label}</span>
      </div>
      <div class="legend-row-right">
        <span>${formatCurrency(s.val)}</span>
        <span class="text-muted">(${pct}%)</span>
      </div>
    `;
    container.appendChild(item);
  });
}

function renderClassBars() {
  const container = document.getElementById("dashClassBars");
  if (!container) return;
  container.innerHTML = "";

  const classes = [
    { name: "Senior 1 (Gold & Silver)", total: 45000000, collected: 41200000 },
    { name: "Senior 2 (Green & White)", total: 42000000, collected: 37500000 },
    { name: "Senior 3 (Blue & Red)", total: 46000000, collected: 40100000 },
    { name: "Senior 4 (Candidate Class)", total: 52000000, collected: 49800000 },
    { name: "Senior 5 (Arts & Sciences)", total: 38000000, collected: 32400000 },
    { name: "Senior 6 (UACE Candidates)", total: 44000000, collected: 42100000 },
  ];

  classes.forEach((c) => {
    const pct = Math.round((c.collected / c.total) * 100);
    const row = document.createElement("div");
    row.className = "c-rec-row";
    row.innerHTML = `
      <div class="c-rec-header">
        <span class="c-rec-name">${c.name}</span>
        <span class="c-rec-pct">${pct}% (${formatCurrency(c.collected)})</span>
      </div>
      <div class="c-rec-track">
        <div class="c-rec-bar" style="width: ${pct}%;"></div>
      </div>
    `;
    container.appendChild(row);
  });
}

// Canvas Visual Rendering
function renderDashboardCharts() {
  drawDashboardAreaChart();
  drawDashboardDonutChart();
  drawDashboardBarChart();
  // Defer sparklines + gauge + heatmap to next frame so layout is complete
  requestAnimationFrame(() => {
    drawKpiSparklines();
    drawGaugeChart();
    drawHeatmap();
  });
}

function getAreaChartData() {
  if (dashCurrentPeriod === "today") {
    return {
      labels: ["08:00", "10:00", "12:00", "14:00", "16:00", "17:30"],
      inflows: [150000, 450000, 720000, 1100000, 1380000, 1450000],
      disbursements: [0, 50000, 120000, 180000, 240000, 400000],
    };
  } else if (dashCurrentPeriod === "term") {
    return {
      labels: ["Wk 1", "Wk 2", "Wk 3", "Wk 4", "Wk 6", "Wk 8", "Wk 10"],
      inflows: [24000000, 58000000, 89000000, 125000000, 148000000, 162000000, 175000000],
      disbursements: [6000000, 14000000, 26000000, 42000000, 58000000, 72000000, 84000000],
    };
  } else if (dashCurrentPeriod === "year") {
    return {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"],
      inflows: [45000000, 110000000, 168000000, 185000000, 235000000, 298000000, 315000000, 380000000, 440000000, 485000000],
      disbursements: [18000000, 42000000, 78000000, 95000000, 128000000, 165000000, 182000000, 225000000, 260000000, 290000000],
    };
  }

  // Shift default
  return {
    labels: ["Open", "10 AM", "12 PM", "02 PM", "04 PM", "Now"],
    inflows: [0, 450000, 750000, 1050000, 1300000, 1450000],
    disbursements: [0, 120000, 120000, 280000, 400000, 400000],
  };
}

// ============================================================================
// ENTERPRISE HIGH-FIDELITY CHARTING ENGINE (SaaS Standard • Smooth Splines)
// ============================================================================

// Canvas roundRect helper with cross-browser fallback
function drawCanvasRoundRect(ctx, x, y, w, h, radii) {
  if (typeof ctx.roundRect === "function") {
    ctx.roundRect(x, y, w, h, radii);
  } else {
    const r = typeof radii === "number" ? radii : (Array.isArray(radii) ? radii[0] : 4);
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
  }
}

// Smooth Catmull-Rom to Cubic Bezier curve algorithm for organic curves
function drawSplinePath(ctx, pts) {
  if (pts.length < 2) return;
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i === 0 ? 0 : i - 1];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2 < pts.length ? i + 2 : i + 1];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
  }
}

// Dynamic settlement breakdown from receipts
function getDonutSlices() {
  const channelDefs = [
    { key: "CASH", label: "Cash Drawer", color: "#10b981", grad: ["#10b981", "#059669"] },
    { key: "BANK_DEPOSIT", label: "Bank Slip", color: "#3b82f6", grad: ["#3b82f6", "#1d4ed8"] },
    { key: "MOBILE_MONEY", label: "MoMo Pay", color: "#f59e0b", grad: ["#f59e0b", "#d97706"] },
    { key: "POS_CARD", label: "POS Card", color: "#8b5cf6", grad: ["#8b5cf6", "#6d28d9"] },
    { key: "CHEQUE", label: "Cheque", color: "#64748b", grad: ["#64748b", "#475569"] },
  ];

  const sums = {};
  localData.receipts.forEach((r) => {
    sums[r.paymentMethod] = (sums[r.paymentMethod] || 0) + Number(r.amount || 0);
  });

  const slices = channelDefs.map((def) => {
    const val = sums[def.key] !== undefined ? sums[def.key] : (def.key === "CASH" ? 650000 : def.key === "BANK_DEPOSIT" ? 500000 : def.key === "MOBILE_MONEY" ? 300000 : 0);
    return {
      key: def.key,
      label: def.label,
      val: val,
      color: def.color,
      grad: def.grad,
    };
  }).filter((s) => s.val > 0);

  return slices.length > 0 ? slices : [
    { key: "CASH", label: "Cash Drawer", val: 650000, color: "#10b981", grad: ["#10b981", "#059669"] },
    { key: "BANK_DEPOSIT", label: "Bank Slip", val: 500000, color: "#3b82f6", grad: ["#3b82f6", "#1d4ed8"] },
    { key: "MOBILE_MONEY", label: "MoMo Pay", val: 300000, color: "#f59e0b", grad: ["#f59e0b", "#d97706"] },
  ];
}

function drawDashboardAreaChart() {
  const canvas = document.getElementById("dashAreaChart");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const parentW = canvas.parentElement ? canvas.parentElement.clientWidth : 0;
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;

  const w = parentW > 0 ? parentW : (rect.width || 500);
  const h = 248;

  canvas.width = w * dpr;
  canvas.height = h * dpr;
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, w, h);

  const data = getAreaChartData();
  const padLeft = 64;
  const padRight = 30;
  const padTop = 28;
  const padBottom = 38;
  const chartW = w - padLeft - padRight;
  const chartH = h - padTop - padBottom;

  // Compute net liquidity as inflow − disbursement
  const netLiqPts_vals = data.inflows.map((v, i) => Math.max(0, v - data.disbursements[i]));
  const maxVal = Math.max(...data.inflows, ...data.disbursements) * 1.18 || 100000;
  const isDark = document.body.classList.contains("dark-theme");

  // ── Grid lines with subtle ruler ticks ──────────────────────────────────────
  const gridLines = 5;
  for (let i = 0; i <= gridLines; i++) {
    const y = padTop + (chartH / gridLines) * i;
    ctx.save();
    ctx.beginPath();
    ctx.setLineDash([2, 5]);
    ctx.strokeStyle = isDark ? "rgba(255,255,255,0.06)" : "rgba(15,23,42,0.055)";
    ctx.lineWidth = 1;
    ctx.moveTo(padLeft, y);
    ctx.lineTo(w - padRight, y);
    ctx.stroke();
    ctx.restore();

    // Left tick
    ctx.beginPath();
    ctx.strokeStyle = isDark ? "rgba(255,255,255,0.15)" : "rgba(15,23,42,0.15)";
    ctx.lineWidth = 1;
    ctx.moveTo(padLeft - 4, y);
    ctx.lineTo(padLeft, y);
    ctx.stroke();

    const val = maxVal * (1 - i / gridLines);
    ctx.fillStyle = isDark ? "#94a3b8" : "#64748b";
    ctx.font = "9.5px 'JetBrains Mono', monospace";
    ctx.textAlign = "right";
    const shortVal = val >= 1000000 ? (val / 1000000).toFixed(1) + "M" : (val / 1000).toFixed(0) + "k";
    ctx.fillText(`${systemSettings.currencySymbol} ${shortVal}`, padLeft - 8, y + 3.5);
  }

  const stepX = chartW / (data.labels.length - 1);

  // Compute point arrays
  const inflowPts = data.inflows.map((val, i) => ({
    x: padLeft + i * stepX,
    y: padTop + chartH - (val / maxVal) * chartH,
  }));
  const disbursementPts = data.disbursements.map((val, i) => ({
    x: padLeft + i * stepX,
    y: padTop + chartH - (val / maxVal) * chartH,
  }));
  const netPts = netLiqPts_vals.map((val, i) => ({
    x: padLeft + i * stepX,
    y: padTop + chartH - (val / maxVal) * chartH,
  }));

  // ── 1. Net Liquidity fill (blue) ─────────────────────────────────────────
  ctx.beginPath();
  drawSplinePath(ctx, netPts);
  ctx.lineTo(netPts[netPts.length - 1].x, padTop + chartH);
  ctx.lineTo(netPts[0].x, padTop + chartH);
  ctx.closePath();
  const gradNet = ctx.createLinearGradient(0, padTop, 0, padTop + chartH);
  gradNet.addColorStop(0, "rgba(59,130,246,0.22)");
  gradNet.addColorStop(0.7, "rgba(59,130,246,0.05)");
  gradNet.addColorStop(1, "rgba(59,130,246,0.0)");
  ctx.fillStyle = gradNet;
  ctx.fill();

  // ── 2. Inflows fill (emerald) ────────────────────────────────────────────
  ctx.beginPath();
  drawSplinePath(ctx, inflowPts);
  ctx.lineTo(inflowPts[inflowPts.length - 1].x, padTop + chartH);
  ctx.lineTo(inflowPts[0].x, padTop + chartH);
  ctx.closePath();
  const gradIn = ctx.createLinearGradient(0, padTop, 0, padTop + chartH);
  gradIn.addColorStop(0, "rgba(16,185,129,0.3)");
  gradIn.addColorStop(0.55, "rgba(16,185,129,0.08)");
  gradIn.addColorStop(1, "rgba(16,185,129,0.0)");
  ctx.fillStyle = gradIn;
  ctx.fill();

  // ── 3. Disbursements fill (rose) ─────────────────────────────────────────
  ctx.beginPath();
  drawSplinePath(ctx, disbursementPts);
  ctx.lineTo(disbursementPts[disbursementPts.length - 1].x, padTop + chartH);
  ctx.lineTo(disbursementPts[0].x, padTop + chartH);
  ctx.closePath();
  const gradDis = ctx.createLinearGradient(0, padTop, 0, padTop + chartH);
  gradDis.addColorStop(0, "rgba(244,63,94,0.18)");
  gradDis.addColorStop(1, "rgba(244,63,94,0.0)");
  ctx.fillStyle = gradDis;
  ctx.fill();

  // ── 4. Net Liquidity stroke (blue) ───────────────────────────────────────
  ctx.save();
  ctx.beginPath();
  drawSplinePath(ctx, netPts);
  ctx.strokeStyle = "#3b82f6";
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 4]);
  ctx.shadowColor = "rgba(59,130,246,0.4)";
  ctx.shadowBlur = 6;
  ctx.stroke();
  ctx.restore();

  // ── 5. Inflows stroke (emerald) ──────────────────────────────────────────
  ctx.save();
  ctx.beginPath();
  drawSplinePath(ctx, inflowPts);
  ctx.strokeStyle = "#10b981";
  ctx.lineWidth = 2.8;
  ctx.shadowColor = "rgba(16,185,129,0.5)";
  ctx.shadowBlur = 10;
  ctx.stroke();
  ctx.restore();

  // ── 6. Disbursements stroke (rose) ───────────────────────────────────────
  ctx.save();
  ctx.beginPath();
  drawSplinePath(ctx, disbursementPts);
  ctx.strokeStyle = "#f43f5e";
  ctx.lineWidth = 2.2;
  ctx.shadowColor = "rgba(244,63,94,0.4)";
  ctx.shadowBlur = 7;
  ctx.stroke();
  ctx.restore();

  // ── 7. Data-point dots on all series ─────────────────────────────────────
  const seriesDots = [
    { pts: inflowPts, color: "#10b981", glowColor: "rgba(16,185,129,0.4)" },
    { pts: disbursementPts, color: "#f43f5e", glowColor: "rgba(244,63,94,0.35)" },
    { pts: netPts, color: "#3b82f6", glowColor: "rgba(59,130,246,0.35)" },
  ];
  seriesDots.forEach(({ pts, color, glowColor }) => {
    pts.forEach((pt, i) => {
      const isActive = areaHoverIndex === i;
      ctx.save();
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, isActive ? 5.5 : 3.5, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? "#1e293b" : "#ffffff";
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = isActive ? 12 : 5;
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.lineWidth = isActive ? 2.5 : 1.8;
      ctx.stroke();
      ctx.restore();
    });
  });

  // ── 8. X-Axis Labels ─────────────────────────────────────────────────────
  ctx.fillStyle = isDark ? "#94a3b8" : "#475569";
  ctx.font = "10.5px 'Inter', sans-serif";
  ctx.textAlign = "center";
  data.labels.forEach((label, i) => {
    const x = padLeft + i * stepX;
    // tick mark
    ctx.beginPath();
    ctx.strokeStyle = isDark ? "rgba(255,255,255,0.15)" : "rgba(15,23,42,0.15)";
    ctx.lineWidth = 1;
    ctx.moveTo(x, padTop + chartH);
    ctx.lineTo(x, padTop + chartH + 4);
    ctx.stroke();
    ctx.fillText(label, x, h - 14);
  });

  // ── 9. Interactive Hover Crosshair & Rich Tooltip ────────────────────────
  if (areaHoverIndex >= 0 && areaHoverIndex < data.labels.length) {
    const activeInPt = inflowPts[areaHoverIndex];
    const activeLabel = data.labels[areaHoverIndex];
    const inVal = data.inflows[areaHoverIndex];
    const disVal = data.disbursements[areaHoverIndex];
    const netVal = netLiqPts_vals[areaHoverIndex];

    // Full-height crosshair
    ctx.save();
    const xhGrad = ctx.createLinearGradient(activeInPt.x, padTop, activeInPt.x, padTop + chartH);
    xhGrad.addColorStop(0, isDark ? "rgba(255,255,255,0.0)" : "rgba(15,23,42,0.0)");
    xhGrad.addColorStop(0.5, isDark ? "rgba(255,255,255,0.25)" : "rgba(15,23,42,0.18)");
    xhGrad.addColorStop(1, isDark ? "rgba(255,255,255,0.0)" : "rgba(15,23,42,0.0)");
    ctx.setLineDash([2, 3]);
    ctx.strokeStyle = xhGrad;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(activeInPt.x, padTop);
    ctx.lineTo(activeInPt.x, padTop + chartH);
    ctx.stroke();
    ctx.restore();

    // Tooltip card
    const tipW = 168;
    const tipH = 76;
    let tipX = activeInPt.x + 14;
    if (tipX + tipW > w - padRight) tipX = activeInPt.x - tipW - 14;
    const tipY = padTop + 4;

    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.18)";
    ctx.shadowBlur = 16;
    ctx.fillStyle = isDark ? "rgba(15,23,42,0.96)" : "rgba(255,255,255,0.97)";
    ctx.beginPath();
    drawCanvasRoundRect(ctx, tipX, tipY, tipW, tipH, 10);
    ctx.fill();
    ctx.restore();

    ctx.strokeStyle = isDark ? "rgba(255,255,255,0.12)" : "rgba(203,213,225,0.9)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    drawCanvasRoundRect(ctx, tipX, tipY, tipW, tipH, 10);
    ctx.stroke();

    // Header
    ctx.textAlign = "left";
    ctx.font = "bold 9px 'Inter', sans-serif";
    ctx.fillStyle = isDark ? "#64748b" : "#94a3b8";
    ctx.fillText(activeLabel.toUpperCase() + " · PERIOD BREAKDOWN", tipX + 10, tipY + 13);

    // Separator
    ctx.beginPath();
    ctx.strokeStyle = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
    ctx.lineWidth = 1;
    ctx.moveTo(tipX + 8, tipY + 18);
    ctx.lineTo(tipX + tipW - 8, tipY + 18);
    ctx.stroke();

    // Inflow row
    ctx.fillStyle = "#10b981";
    ctx.beginPath();
    ctx.arc(tipX + 12, tipY + 31, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = isDark ? "#f8fafc" : "#0f172a";
    ctx.font = "bold 10px 'JetBrains Mono', monospace";
    ctx.fillText(`+${formatCurrency(inVal)}`, tipX + 22, tipY + 34);
    ctx.font = "9px 'Inter', sans-serif";
    ctx.fillStyle = isDark ? "#64748b" : "#94a3b8";
    ctx.textAlign = "right";
    ctx.fillText("Fee Inflow", tipX + tipW - 8, tipY + 34);

    // Disbursement row
    ctx.textAlign = "left";
    ctx.fillStyle = "#f43f5e";
    ctx.beginPath();
    ctx.arc(tipX + 12, tipY + 50, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = isDark ? "#cbd5e1" : "#475569";
    ctx.font = "bold 10px 'JetBrains Mono', monospace";
    ctx.fillText(`-${formatCurrency(disVal)}`, tipX + 22, tipY + 53);
    ctx.font = "9px 'Inter', sans-serif";
    ctx.fillStyle = isDark ? "#64748b" : "#94a3b8";
    ctx.textAlign = "right";
    ctx.fillText("Disbursements", tipX + tipW - 8, tipY + 53);

    // Net row
    ctx.textAlign = "left";
    ctx.fillStyle = "#3b82f6";
    ctx.beginPath();
    ctx.arc(tipX + 12, tipY + 68, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = isDark ? "#93c5fd" : "#1d4ed8";
    ctx.font = "bold 10px 'JetBrains Mono', monospace";
    ctx.fillText(`=${formatCurrency(netVal)}`, tipX + 22, tipY + 71);
    ctx.font = "9px 'Inter', sans-serif";
    ctx.fillStyle = isDark ? "#64748b" : "#94a3b8";
    ctx.textAlign = "right";
    ctx.fillText("Net Liquidity", tipX + tipW - 8, tipY + 71);
  }
}

function drawDashboardDonutChart() {
  const canvas = document.getElementById("dashDonutChart");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const parentW = canvas.parentElement ? canvas.parentElement.clientWidth : 0;
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;

  const w = parentW > 0 ? parentW : (rect.width || 300);
  const h = 210;

  canvas.width = w * dpr;
  canvas.height = h * dpr;
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, w, h);

  const centerX = w / 2;
  const centerY = h / 2 + 4;
  const radius = Math.min(centerX, centerY) - 22;
  const innerRadius = radius * 0.62;
  const isDark = document.body.classList.contains("dark-theme");

  const slices = getDonutSlices();
  const total = slices.reduce((acc, s) => acc + s.val, 0) || 1;
  const padAngle = 0.045;

  let currentAngle = -Math.PI / 2;

  slices.forEach((s, idx) => {
    const rawSliceAngle = (s.val / total) * (Math.PI * 2);
    const sliceAngle = Math.max(0.01, rawSliceAngle - padAngle);
    const isHovered = donutHoverIndex === idx;

    const sliceStart = currentAngle + padAngle / 2;
    const sliceEnd = sliceStart + sliceAngle;
    const midAngle = (sliceStart + sliceEnd) / 2;

    const popOut = isHovered ? 7 : 0;
    const cx = centerX + Math.cos(midAngle) * popOut;
    const cy = centerY + Math.sin(midAngle) * popOut;

    const outerR = isHovered ? radius + 6 : radius;
    const innerR = isHovered ? innerRadius - 3 : innerRadius;

    ctx.save();
    if (isHovered) {
      ctx.shadowColor = s.color;
      ctx.shadowBlur = 18;
    }

    ctx.beginPath();
    ctx.arc(cx, cy, outerR, sliceStart, sliceEnd);
    ctx.arc(cx, cy, innerR, sliceEnd, sliceStart, true);
    ctx.closePath();

    // Richer multi-stop gradient per slice
    const grad = ctx.createLinearGradient(
      cx + Math.cos(sliceStart) * innerR,
      cy + Math.sin(sliceStart) * innerR,
      cx + Math.cos(sliceEnd) * outerR,
      cy + Math.sin(sliceEnd) * outerR
    );
    grad.addColorStop(0, s.color);
    grad.addColorStop(0.5, s.grad ? s.grad[0] : s.color);
    grad.addColorStop(1, s.grad ? s.grad[1] : s.color);
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.strokeStyle = isDark ? "rgba(15,23,42,0.8)" : "rgba(255,255,255,0.9)";
    ctx.lineWidth = isHovered ? 3 : 2;
    ctx.stroke();
    ctx.restore();

    // ── Percentage label outside each slice (only if slice > 8%) ──
    const pct = Math.round((s.val / total) * 100);
    if (pct >= 8) {
      const labelR = outerR + 14;
      const lx = cx + Math.cos(midAngle) * labelR;
      const ly = cy + Math.sin(midAngle) * labelR;
      ctx.save();
      ctx.font = "bold 10px 'Inter', sans-serif";
      ctx.fillStyle = isDark ? "#cbd5e1" : "#475569";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`${pct}%`, lx, ly);
      ctx.restore();
    }

    currentAngle += rawSliceAngle;
  });

  // ── Inner glass disc ───────────────────────────────────────────────────────
  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, innerRadius - 5, 0, Math.PI * 2);
  const innerGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, innerRadius - 5);
  innerGrad.addColorStop(0, isDark ? "rgba(30,41,59,0.9)" : "rgba(255,255,255,0.95)");
  innerGrad.addColorStop(1, isDark ? "rgba(15,23,42,0.7)" : "rgba(248,250,252,0.85)");
  ctx.fillStyle = innerGrad;
  ctx.shadowColor = "rgba(0,0,0,0.08)";
  ctx.shadowBlur = 8;
  ctx.fill();
  ctx.strokeStyle = isDark ? "rgba(255,255,255,0.06)" : "rgba(226,232,240,0.9)";
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.restore();

  // ── Dynamic center text ────────────────────────────────────────────────────
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  if (donutHoverIndex >= 0 && donutHoverIndex < slices.length) {
    const s = slices[donutHoverIndex];
    const pct = Math.round((s.val / total) * 100);

    ctx.font = "700 8.5px 'Inter', sans-serif";
    ctx.fillStyle = s.color;
    ctx.fillText(s.label.toUpperCase(), centerX, centerY - 18);

    ctx.font = "bold 13.5px 'JetBrains Mono', monospace";
    ctx.fillStyle = isDark ? "#ffffff" : "#0f172a";
    const shortVal = s.val >= 1000000 ? (s.val / 1000000).toFixed(2) + "M" : (s.val / 1000).toFixed(0) + "k";
    ctx.fillText(`${systemSettings.currencySymbol} ${shortVal}`, centerX, centerY - 1);

    // Pill background for %
    const pillW = 56;
    const pillH = 18;
    ctx.save();
    ctx.fillStyle = s.color + "22";
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(centerX - pillW/2, centerY + 10, pillW, pillH, 9) :
      ctx.rect(centerX - pillW/2, centerY + 10, pillW, pillH);
    ctx.fill();
    ctx.restore();
    ctx.font = "bold 10px 'Inter', sans-serif";
    ctx.fillStyle = s.color;
    ctx.fillText(`${pct}% Share`, centerX, centerY + 20);
  } else {
    ctx.font = "700 8px 'Inter', sans-serif";
    ctx.fillStyle = isDark ? "#64748b" : "#94a3b8";
    ctx.fillText("TOTAL", centerX, centerY - 22);

    ctx.font = "bold 14px 'JetBrains Mono', monospace";
    ctx.fillStyle = isDark ? "#ffffff" : "#0f172a";
    const shortTotal = total >= 1000000 ? (total / 1000000).toFixed(2) + "M" : (total / 1000).toFixed(0) + "k";
    ctx.fillText(`${systemSettings.currencySymbol} ${shortTotal}`, centerX, centerY - 4);

    ctx.font = "700 8px 'Inter', sans-serif";
    ctx.fillStyle = isDark ? "#64748b" : "#94a3b8";
    ctx.fillText("COLLECTIONS", centerX, centerY + 10);

    ctx.font = "10px 'Inter', sans-serif";
    ctx.fillStyle = isDark ? "#475569" : "#cbd5e1";
    ctx.fillText(`${slices.length} channels`, centerX, centerY + 23);
  }
}



function drawDashboardBarChart() {
  const canvas = document.getElementById("dashBarChart");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const parentW = canvas.parentElement ? canvas.parentElement.clientWidth : 0;
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;

  const w = parentW > 0 ? parentW : (rect.width || 500);
  const h = 230;

  canvas.width = w * dpr;
  canvas.height = h * dpr;
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, w, h);

  const depts = [
    { name: "Administration", short: "Admin",      budget: 15000000, spent: 11200000, color: "#8b5cf6" },
    { name: "Kitchen & Meals", short: "Kitchen",   budget: 28000000, spent: 24500000, color: "#f59e0b" },
    { name: "Fleet Transport", short: "Transport", budget: 12000000, spent: 9800000,  color: "#10b981" },
    { name: "Academics & Exam",short: "Academics", budget: 18000000, spent: 14100000, color: "#3b82f6" },
    { name: "Campus Repairs",  short: "Repairs",   budget: 8000000,  spent: 6500000,  color: "#f43f5e" },
  ];

  const padLeft = 64;
  const padRight = 24;
  const padTop = 36;
  const padBottom = 40;
  const chartW = w - padLeft - padRight;
  const chartH = h - padTop - padBottom;
  const maxVal = 32000000;
  const isDark = document.body.classList.contains("dark-theme");

  // ── Grid ───────────────────────────────────────────────────────────────────
  const gridCount = 4;
  for (let i = 0; i <= gridCount; i++) {
    const y = padTop + (chartH / gridCount) * i;
    ctx.save();
    ctx.beginPath();
    ctx.setLineDash([2, 5]);
    ctx.strokeStyle = isDark ? "rgba(255,255,255,0.06)" : "rgba(15,23,42,0.055)";
    ctx.lineWidth = 1;
    ctx.moveTo(padLeft, y);
    ctx.lineTo(w - padRight, y);
    ctx.stroke();
    ctx.restore();

    const val = maxVal * (1 - i / gridCount);
    ctx.fillStyle = isDark ? "#64748b" : "#94a3b8";
    ctx.font = "9.5px 'JetBrains Mono', monospace";
    ctx.textAlign = "right";
    ctx.fillText(`${(val / 1000000).toFixed(0)}M`, padLeft - 8, y + 3.5);
  }

  const groupWidth = chartW / depts.length;
  const barWidth = Math.min(22, Math.max(12, (groupWidth - 32) / 2));
  const spacing = 5;

  depts.forEach((d, idx) => {
    const groupX = padLeft + idx * groupWidth;
    const bHeight = Math.max(4, (d.budget / maxVal) * chartH);
    const sHeight = Math.max(4, (d.spent / maxVal) * chartH);
    const isHovered = barHoverIndex === idx;
    const utilPct = Math.round((d.spent / d.budget) * 100);
    const isOver = d.spent > d.budget;

    const bX = groupX + (groupWidth - (barWidth * 2 + spacing)) / 2;
    const sX = bX + barWidth + spacing;

    // ── Budget bar: dept accent color (lighter) ───────────────────────────
    ctx.save();
    const gradBudget = ctx.createLinearGradient(0, padTop + chartH - bHeight, 0, padTop + chartH);
    gradBudget.addColorStop(0, d.color + "cc");
    gradBudget.addColorStop(1, d.color + "44");
    ctx.fillStyle = gradBudget;
    if (isHovered) { ctx.shadowColor = d.color; ctx.shadowBlur = 10; }
    ctx.globalAlpha = 0.75;
    ctx.beginPath();
    drawCanvasRoundRect(ctx, bX, padTop + chartH - bHeight, barWidth, bHeight, [5, 5, 0, 0]);
    ctx.fill();
    ctx.restore();

    // ── Spent bar: full dept accent color ─────────────────────────────────
    ctx.save();
    const gradSpent = ctx.createLinearGradient(0, padTop + chartH - sHeight, 0, padTop + chartH);
    gradSpent.addColorStop(0, d.color);
    gradSpent.addColorStop(1, d.color + "88");
    ctx.fillStyle = gradSpent;
    if (isHovered) { ctx.shadowColor = d.color; ctx.shadowBlur = 14; }
    ctx.beginPath();
    drawCanvasRoundRect(ctx, sX, padTop + chartH - sHeight, barWidth, sHeight, [5, 5, 0, 0]);
    ctx.fill();
    ctx.restore();

    // ── Value label on top of spent bar ──────────────────────────────────
    const spentShort = d.spent >= 1000000 ? (d.spent / 1000000).toFixed(1) + "M" : (d.spent / 1000).toFixed(0) + "k";
    ctx.save();
    ctx.font = isHovered ? "bold 9px 'JetBrains Mono', monospace" : "9px 'JetBrains Mono', monospace";
    ctx.fillStyle = isHovered ? d.color : (isDark ? "#94a3b8" : "#475569");
    ctx.textAlign = "center";
    ctx.fillText(spentShort, sX + barWidth / 2, padTop + chartH - sHeight - 5);
    ctx.restore();

    // ── Utilization % badge above budget bar ──────────────────────────────
    const badgeColor = isOver ? "#ef4444" : utilPct >= 90 ? "#f59e0b" : "#10b981";
    const pctText = utilPct + "%";
    ctx.save();
    ctx.font = "bold 8.5px 'Inter', sans-serif";
    ctx.fillStyle = badgeColor;
    ctx.textAlign = "center";
    ctx.fillText(pctText, bX + barWidth / 2, padTop + chartH - bHeight - 5);
    ctx.restore();

    // ── X-axis label ──────────────────────────────────────────────────────
    ctx.fillStyle = isHovered ? d.color : (isDark ? "#94a3b8" : "#475569");
    ctx.font = isHovered ? "bold 10px 'Inter', sans-serif" : "10px 'Inter', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(d.short, groupX + groupWidth / 2, h - 14);

    // ── Color dot indicator ───────────────────────────────────────────────
    ctx.beginPath();
    ctx.arc(groupX + groupWidth / 2, h - 6, 3, 0, Math.PI * 2);
    ctx.fillStyle = d.color;
    ctx.fill();
  });

  // ── Legend row ──────────────────────────────────────────────────────────
  const legItems = [
    { label: "Budget Alloc.", color: "rgba(120,120,200,0.6)" },
    { label: "Actual Spent",  color: "rgba(120,120,200,1.0)" },
  ];
  ctx.font = "9px 'Inter', sans-serif";
  ctx.textAlign = "left";
  let lx = padLeft;
  legItems.forEach((leg, i) => {
    ctx.fillStyle = leg.color;
    ctx.fillRect(lx, 10, 10, 9);
    ctx.fillStyle = isDark ? "#94a3b8" : "#475569";
    ctx.fillText(leg.label, lx + 13, 18);
    lx += 90;
  });

  // ── Over-budget warning line ─────────────────────────────────────────────
  const warningY = padTop + chartH - (maxVal * 0.9 / maxVal) * chartH;
  ctx.save();
  ctx.setLineDash([4, 3]);
  ctx.strokeStyle = "rgba(239,68,68,0.4)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padLeft, warningY);
  ctx.lineTo(w - padRight, warningY);
  ctx.stroke();
  ctx.restore();
  ctx.font = "8.5px 'Inter', sans-serif";
  ctx.fillStyle = "rgba(239,68,68,0.7)";
  ctx.textAlign = "left";
  ctx.fillText("90% threshold", w - padRight - 70, warningY - 4);

  // ── Hover tooltip ───────────────────────────────────────────────────────
  if (barHoverIndex >= 0 && barHoverIndex < depts.length) {
    const d = depts[barHoverIndex];
    const utilPct = Math.round((d.spent / d.budget) * 100);
    const buffer = d.budget - d.spent;
    const tipW = 168;
    const tipH = 76;
    const groupX = padLeft + barHoverIndex * groupWidth;
    let tipX = groupX + groupWidth / 2 - tipW / 2;
    tipX = Math.max(padLeft, Math.min(w - padRight - tipW, tipX));
    const tipY = padTop;

    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.18)";
    ctx.shadowBlur = 14;
    ctx.fillStyle = isDark ? "rgba(15,23,42,0.96)" : "rgba(255,255,255,0.97)";
    ctx.beginPath();
    drawCanvasRoundRect(ctx, tipX, tipY, tipW, tipH, 10);
    ctx.fill();
    ctx.restore();

    // Left accent bar
    ctx.save();
    ctx.fillStyle = d.color;
    ctx.beginPath();
    drawCanvasRoundRect(ctx, tipX, tipY, 3, tipH, [10, 0, 0, 10]);
    ctx.fill();
    ctx.restore();

    ctx.strokeStyle = isDark ? "rgba(255,255,255,0.1)" : "rgba(203,213,225,0.8)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    drawCanvasRoundRect(ctx, tipX, tipY, tipW, tipH, 10);
    ctx.stroke();

    ctx.textAlign = "left";
    ctx.font = "bold 10px 'Inter', sans-serif";
    ctx.fillStyle = isDark ? "#ffffff" : "#0f172a";
    ctx.fillText(d.name, tipX + 12, tipY + 15);

    ctx.font = "9.5px 'JetBrains Mono', monospace";
    ctx.fillStyle = isDark ? "#a78bfa" : "#7c3aed";
    ctx.fillText(`Budget: ${formatCurrency(d.budget)}`, tipX + 12, tipY + 32);
    ctx.fillStyle = isDark ? "#fbbf24" : "#d97706";
    ctx.fillText(`Spent:  ${formatCurrency(d.spent)}`, tipX + 12, tipY + 48);

    ctx.font = "bold 9px 'Inter', sans-serif";
    ctx.fillStyle = buffer >= 0 ? "#10b981" : "#ef4444";
    ctx.fillText(`${utilPct}% used · ${buffer >= 0 ? formatCurrency(buffer) + " left" : "OVER by " + formatCurrency(Math.abs(buffer))}`, tipX + 12, tipY + 65);
  }
}


// ============================================================================
// EXECUTIVE DASHBOARD: Advanced Visualizations Engine
// ============================================================================

/** Staggered entrance animation for KPI cards & chart rows on dashboard load */
function triggerDashboardAnimations() {
  // KPI Cards: staggered fade-in
  const kpiCards = document.querySelectorAll(".kpi-glass-card");
  kpiCards.forEach((card, i) => {
    card.classList.remove("anim-in");
    setTimeout(() => card.classList.add("anim-in"), 60 + i * 90);
  });

  // Chart cards: stagger per row
  const chartCards = document.querySelectorAll(".dash-charts-row .chart-box-card");
  chartCards.forEach((card, i) => {
    card.classList.remove("anim-in");
    setTimeout(() => card.classList.add("anim-in"), 300 + i * 80);
  });

  // Scroll-reveal elements via IntersectionObserver
  const revealEls = document.querySelectorAll(".scroll-reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -20px 0px" }
    );
    revealEls.forEach((el) => {
      el.classList.remove("revealed");
      observer.observe(el);
    });
  } else {
    revealEls.forEach((el) => el.classList.add("revealed"));
  }
}

/** Sparkline mini-charts for each KPI card */
function drawKpiSparklines() {
  // Data sets for each sparkline
  const sparkData = {
    sparkCollections: {
      values: [820000, 950000, 1100000, 980000, 1250000, 1380000, 1450000],
      color: "#10b981",
      fill: "rgba(16,185,129,0.15)",
    },
    sparkDrawer: {
      values: [80000, 120000, 150000, 200000, 170000, 190000, 150000],
      color: "#3b82f6",
      fill: "rgba(59,130,246,0.15)",
    },
    sparkArrears: {
      values: [16000000, 15500000, 15200000, 14900000, 14600000, 14400000, 14200000],
      color: "#f59e0b",
      fill: "rgba(245,158,11,0.15)",
      inverted: true,
    },
    sparkReserves: {
      values: [44000000, 46000000, 48000000, 49500000, 50000000, 50800000, 51100000],
      color: "#8b5cf6",
      fill: "rgba(139,92,246,0.15)",
    },
  };

  Object.entries(sparkData).forEach(([id, cfg]) => {
    const canvas = document.getElementById(id);
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const parentW = canvas.parentElement ? canvas.parentElement.clientWidth : 200;
    const w = parentW - 36; // account for card padding
    const h = 36;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    const vals = cfg.values;
    const minV = Math.min(...vals);
    const maxV = Math.max(...vals);
    const range = (maxV - minV) || 1;
    const padX = 2;
    const padY = 4;
    const chartW = w - padX * 2;
    const chartH = h - padY * 2;
    const stepX = chartW / (vals.length - 1);

    const pts = vals.map((v, i) => ({
      x: padX + i * stepX,
      y: padY + chartH - ((v - minV) / range) * chartH,
    }));

    // Fill area
    ctx.beginPath();
    drawSplinePath(ctx, pts);
    ctx.lineTo(pts[pts.length - 1].x, h - padY);
    ctx.lineTo(pts[0].x, h - padY);
    ctx.closePath();
    ctx.fillStyle = cfg.fill;
    ctx.fill();

    // Stroke line
    ctx.save();
    ctx.beginPath();
    drawSplinePath(ctx, pts);
    ctx.strokeStyle = cfg.color;
    ctx.lineWidth = 2;
    ctx.shadowColor = cfg.color;
    ctx.shadowBlur = 4;
    ctx.stroke();
    ctx.restore();

    // End dot
    const last = pts[pts.length - 1];
    ctx.beginPath();
    ctx.arc(last.x, last.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = cfg.color;
    ctx.fill();
  });
}

/** Animated Gauge Ring - Fee Recovery Rate */
let gaugeAnimFrame = null;
let gaugeCurrentAngle = 0;

function drawGaugeChart(targetRate) {
  const canvas = document.getElementById("dashGaugeChart");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const parentW = canvas.parentElement ? canvas.parentElement.clientWidth : 280;
  const w = parentW;
  const h = 180;

  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.style.width = w + "px";
  canvas.style.height = h + "px";
  ctx.scale(dpr, dpr);

  // Derive recovery rate from DOM
  const badge = document.getElementById("dashRecoveryRateBadge");
  const rateText = badge ? badge.textContent.replace("%", "").trim() : "88.5";
  const rate = Math.min(100, Math.max(0, parseFloat(rateText) || 88.5));

  const isDark = document.body.classList.contains("dark-theme");
  const cx = w / 2;
  const cy = h * 0.58;
  const outerR = Math.min(cx, cy) - 18;
  const innerR = outerR * 0.72;

  // Background arc (full semicircle)
  const startAngle = Math.PI;
  const endAngle = 2 * Math.PI;

  ctx.clearRect(0, 0, w, h);

  // Track
  ctx.beginPath();
  ctx.arc(cx, cy, outerR, startAngle, endAngle);
  ctx.arc(cx, cy, innerR, endAngle, startAngle, true);
  ctx.closePath();
  ctx.fillStyle = isDark ? "rgba(255,255,255,0.06)" : "#e2e8f0";
  ctx.fill();

  // Animate fill
  if (gaugeAnimFrame) cancelAnimationFrame(gaugeAnimFrame);
  const targetAngle = startAngle + (rate / 100) * Math.PI;
  const startFrom = startAngle;
  const duration = 1200;
  const startTime = performance.now();

  function animateGauge(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out expo
    const eased = 1 - Math.pow(1 - progress, 4);
    const currentEnd = startFrom + eased * (targetAngle - startFrom);

    ctx.clearRect(0, 0, w, h);

    // Track
    ctx.beginPath();
    ctx.arc(cx, cy, outerR, startAngle, endAngle);
    ctx.arc(cx, cy, innerR, endAngle, startAngle, true);
    ctx.closePath();
    ctx.fillStyle = isDark ? "rgba(255,255,255,0.06)" : "#e2e8f0";
    ctx.fill();

    // Colored fill
    const fillGrad = ctx.createLinearGradient(cx - outerR, cy, cx + outerR, cy);
    if (rate >= 85) {
      fillGrad.addColorStop(0, "#10b981");
      fillGrad.addColorStop(1, "#34d399");
    } else if (rate >= 65) {
      fillGrad.addColorStop(0, "#f59e0b");
      fillGrad.addColorStop(1, "#fbbf24");
    } else {
      fillGrad.addColorStop(0, "#ef4444");
      fillGrad.addColorStop(1, "#f87171");
    }

    ctx.beginPath();
    ctx.arc(cx, cy, outerR, startAngle, currentEnd);
    ctx.arc(cx, cy, innerR, currentEnd, startAngle, true);
    ctx.closePath();
    ctx.fillStyle = fillGrad;
    ctx.fill();

    // Needle cap
    const capX = cx + Math.cos(currentEnd) * ((outerR + innerR) / 2);
    const capY = cy + Math.sin(currentEnd) * ((outerR + innerR) / 2);
    ctx.beginPath();
    ctx.arc(capX, capY, (outerR - innerR) / 2 - 1, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();

    // Tick marks
    const ticks = [0, 25, 50, 75, 100];
    ticks.forEach((t) => {
      const angle = startAngle + (t / 100) * Math.PI;
      const x1 = cx + Math.cos(angle) * (outerR + 5);
      const y1 = cy + Math.sin(angle) * (outerR + 5);
      const x2 = cx + Math.cos(angle) * (outerR + 13);
      const y2 = cy + Math.sin(angle) * (outerR + 13);
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = isDark ? "rgba(255,255,255,0.3)" : "#94a3b8";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Tick labels
      const lx = cx + Math.cos(angle) * (outerR + 20);
      const ly = cy + Math.sin(angle) * (outerR + 20);
      ctx.fillStyle = isDark ? "#64748b" : "#94a3b8";
      ctx.font = "9px 'Inter', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(t + "%", lx, ly);
    });

    if (progress < 1) {
      gaugeAnimFrame = requestAnimationFrame(animateGauge);
    }
  }

  gaugeAnimFrame = requestAnimationFrame(animateGauge);
}

/** Activity Heatmap — 10 weeks × 5 days */
function drawHeatmap() {
  const canvas = document.getElementById("dashHeatmap");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const parentW = canvas.parentElement ? canvas.parentElement.clientWidth : 500;
  const w = parentW - 40; // card padding
  const h = 130;

  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.style.width = w + "px";
  canvas.style.height = h + "px";
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, w, h);

  const isDark = document.body.classList.contains("dark-theme");
  const weeks = 10;
  const days = 5; // Mon–Fri
  const padLeft = 32;
  const padTop = 20;
  const padBottom = 18;
  const cellSize = Math.floor((w - padLeft - 12) / weeks);
  const cellGap = 3;
  const cellW = cellSize - cellGap;
  const cellH = Math.floor((h - padTop - padBottom - (days - 1) * cellGap) / days);

  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri"];

  // Generate synthetic collection data (richer on Monday/Friday)
  const today = new Date();
  const data = [];
  for (let w = 0; w < weeks; w++) {
    const week = [];
    for (let d = 0; d < days; d++) {
      const base = 3 + Math.sin(w * 0.7 + d * 0.5) * 2;
      const spike = (d === 0 || d === 4) ? Math.random() * 4 + 2 : Math.random() * 3;
      const recency = w / weeks; // recent weeks slightly more activity
      week.push(Math.max(0, Math.round((base + spike) * (0.6 + recency * 0.4))));
    }
    data.push(week);
  }

  const maxVal = Math.max(...data.flat(), 1);

  // Color scale: light → vivid emerald (or blue)
  const colorStops = isDark
    ? ["#1e293b", "#064e3b", "#065f46", "#059669", "#10b981"]
    : ["#f0fdf4", "#bbf7d0", "#4ade80", "#16a34a", "#059669"];

  function getColor(val) {
    const t = val / maxVal;
    const idx = Math.min(colorStops.length - 1, Math.floor(t * colorStops.length));
    return colorStops[idx];
  }

  // Draw day labels
  ctx.fillStyle = isDark ? "#64748b" : "#94a3b8";
  ctx.font = "9px 'Inter', sans-serif";
  ctx.textAlign = "right";
  dayLabels.forEach((label, d) => {
    const y = padTop + d * (cellH + cellGap) + cellH / 2;
    ctx.fillText(label, padLeft - 5, y + 3);
  });

  // Draw week number labels
  const weekLabels = ["W-9", "W-8", "W-7", "W-6", "W-5", "W-4", "W-3", "W-2", "W-1", "Now"];
  ctx.textAlign = "center";
  for (let wk = 0; wk < weeks; wk++) {
    const x = padLeft + wk * cellSize + cellW / 2;
    ctx.fillText(weekLabels[wk], x, padTop - 6);
  }

  // Draw cells
  data.forEach((week, wk) => {
    week.forEach((val, d) => {
      const x = padLeft + wk * cellSize;
      const y = padTop + d * (cellH + cellGap);
      ctx.save();
      ctx.fillStyle = getColor(val);
      if (typeof ctx.roundRect === "function") {
        ctx.beginPath();
        ctx.roundRect(x, y, cellW, cellH, 3);
        ctx.fill();
      } else {
        ctx.fillRect(x, y, cellW, cellH);
      }

      // Tooltip hint: slightly darker border for non-zero cells
      if (val > 0) {
        ctx.strokeStyle = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)";
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        if (typeof ctx.roundRect === "function") {
          ctx.roundRect(x, y, cellW, cellH, 3);
        } else {
          ctx.rect(x, y, cellW, cellH);
        }
        ctx.stroke();
      }
      ctx.restore();
    });
  });

  // Render legend swatches
  const legendEl = document.getElementById("dashHeatmapLegend");
  if (legendEl && legendEl.children.length === 0) {
    colorStops.forEach((color) => {
      const sw = document.createElement("div");
      sw.className = "heatmap-legend-swatch";
      sw.style.background = color;
      sw.style.border = isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.08)";
      legendEl.appendChild(sw);
    });
  }
}

// ============================================================================
// 1. POS & FEE RECEIPTING
// ============================================================================
function setupPOS() {
  const searchInput = document.getElementById("studentSearchInput");
  searchInput.addEventListener("input", (e) => {
    renderStudentList(e.target.value);
  });

  const quickAmtBtns = document.querySelectorAll("#posQuickAmtPills .quick-amt-btn");
  quickAmtBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const amtType = btn.getAttribute("data-amt");
      const payInput = document.getElementById("payAmountInput");
      if (!payInput) return;
      if (amtType === "full") {
        if (selectedStudent) {
          payInput.value = Math.max(0, selectedStudent.balance || 0);
        }
      } else {
        payInput.value = amtType;
      }
      payInput.focus();
    });
  });

  const paymentForm = document.getElementById("posPaymentForm");
  paymentForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!selectedStudent) return;

    if (!session.isAuthenticated) {
      alert("Please authenticate with your cashier PIN first!");
      document.getElementById("terminalLockOverlay").style.display = "flex";
      return;
    }

    if (session.isRemoteLocked) {
      alert("CRITICAL ERROR: Workstation suspended by Super Administrator.");
      return;
    }

    const amount = Number(document.getElementById("payAmountInput").value);
    const method = document.getElementById("payMethodSelect").value;
    const ref = document.getElementById("payRefInput").value;
    const notes = document.getElementById("payNotesInput").value;

    if (amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    // 1. Calculate and deduct from student balance with strict numeric integrity
    const prevBalance = Math.max(0, Number(selectedStudent.balance || 0));
    const newRemainingBalance = Math.max(0, prevBalance - amount);

    selectedStudent.paidAmount = (Number(selectedStudent.paidAmount) || 0) + amount;
    selectedStudent.balance = newRemainingBalance;

    // 2. Generate sequential official receipt number
    const receiptNumber = `RCP-${new Date().getFullYear()}-${CONFIG.machineId.slice(0, 4)}-${localData.receiptCounter}`;
    localData.receiptCounter++;

    // 3. Build receipt record with explicit historical balance snapshots
    const receiptRecord = {
      receiptNumber,
      invoiceId: selectedStudent.invoiceId || "INV-OFFLINE",
      studentId: selectedStudent.id,
      studentName: selectedStudent.name,
      className: selectedStudent.class?.name || "General",
      amount,
      paymentMethod: method,
      referenceNo: ref,
      previousBalance: prevBalance,
      remainingBalance: newRemainingBalance,
      cashierName: session.cashierName,
      workstationId: CONFIG.machineId,
      issuedAt: new Date().toISOString(),
      notes,
      isOfflineSync: true,
    };

    // 4. Save to collections and sync queue
    localData.receipts.unshift(receiptRecord);
    localData.syncQueue.push({
      type: "RECEIPT",
      payload: receiptRecord,
    });

    saveState();

    // 5. Update UI & Display Printable Slip
    renderStudentList(searchInput.value);
    updateStudentSummary();
    renderReceipts();
    renderFeesTable();
    renderQueue();
    updateDrawerFloatDisplay();
    renderDashboard();
    renderReports();
    showReceiptModal(receiptRecord);
    showToast(`Receipt ${receiptNumber} generated for ${formatCurrency(amount)}`);

    // Reset inputs
    document.getElementById("payAmountInput").value = "";
    document.getElementById("payRefInput").value = "";
    document.getElementById("payNotesInput").value = "";

    attemptSync();
  });

  document.getElementById("btnCloseReceipt").addEventListener("click", () => {
    document.getElementById("receiptModal").classList.remove("open");
  });

  document.getElementById("btnPrintReceiptNow").addEventListener("click", () => {
    window.print();
  });

  document.getElementById("btnSyncNow").addEventListener("click", () => {
    attemptSync(true);
  });

  document.getElementById("btnFlushQueue").addEventListener("click", () => {
    attemptSync(true);
  });
}

function renderStudentList(filterText = "") {
  const container = document.getElementById("studentListContainer");
  if (!container) return;
  container.innerHTML = "";

  const query = filterText.toLowerCase().trim();
  const filtered = localData.students.filter(
    (s) =>
      s.name.toLowerCase().includes(query) ||
      (s.class?.name && s.class.name.toLowerCase().includes(query))
  );

  if (filtered.length === 0) {
    container.innerHTML = '<div class="empty-hint">No students matching query.</div>';
    return;
  }

  filtered.forEach((student) => {
    const item = document.createElement("div");
    item.className = `student-item ${selectedStudent?.id === student.id ? "active" : ""}`;
    item.innerHTML = `
      <div class="s-info">
        <span class="s-name">${student.name}</span>
        <span class="s-class">${student.class?.name || "General"}</span>
      </div>
      <div class="s-bal ${student.balance > 0 ? "bal-debt" : "bal-clear"}">
        ${student.balance > 0 ? "Arrears: " + formatCurrency(student.balance) : "Cleared"}
      </div>
    `;

    item.addEventListener("click", () => {
      selectedStudent = student;
      renderStudentList(filterText);
      updateStudentSummary();
    });

    container.appendChild(item);
  });
}

function updateStudentSummary() {
  const summaryBox = document.getElementById("studentSummaryBox");
  const form = document.getElementById("posPaymentForm");
  const hint = document.getElementById("noStudentSelectedHint");

  if (!selectedStudent) {
    if (form) form.style.display = "none";
    if (hint) hint.style.display = "block";
    return;
  }

  if (form) form.style.display = "flex";
  if (hint) hint.style.display = "none";

  summaryBox.innerHTML = `
    <div style="font-size: 15px; font-weight: 800; color: #fff;">${selectedStudent.name}</div>
    <div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">
      Class: ${selectedStudent.class?.name || "General"} • Term: ${selectedStudent.term || systemSettings.activeTerm}
    </div>
    <div style="margin-top: 8px; font-weight: 700; color: var(--accent-amber); font-size: 14px;">
      Outstanding Balance: ${formatCurrency(selectedStudent.balance || 0)}
    </div>
  `;
}

function showReceiptModal(receipt) {
  // Find student associated with receipt to guarantee accurate balance even if selectedStudent is changed or null
  const student = localData.students.find((s) => s.id === receipt.studentId) || selectedStudent;
  const currentRemainingBalance = receipt.remainingBalance !== undefined
    ? Number(receipt.remainingBalance)
    : (student ? Number(student.balance || 0) : 0);
  const previousBalance = receipt.previousBalance !== undefined
    ? Number(receipt.previousBalance)
    : (currentRemainingBalance + Number(receipt.amount || 0));

  const elNo = document.getElementById("rSlipNo");
  const elDate = document.getElementById("rSlipDate");
  const elWorkstation = document.getElementById("rSlipWorkstation");
  const elCashier = document.getElementById("rSlipCashier");
  const elStudent = document.getElementById("rSlipStudent");
  const elClass = document.getElementById("rSlipClass");
  const elAmount = document.getElementById("rSlipAmount");
  const elMethod = document.getElementById("rSlipMethod");
  const elRef = document.getElementById("rSlipRef");
  const elPrevBal = document.getElementById("rSlipPrevBalance");
  const elPaidNow = document.getElementById("rSlipPaidNow");
  const elBal = document.getElementById("rSlipBalance");

  if (elNo) elNo.textContent = receipt.receiptNumber;
  if (elDate) elDate.textContent = new Date(receipt.issuedAt).toLocaleString();
  if (elWorkstation) elWorkstation.textContent = receipt.workstationId || CONFIG.machineId;
  if (elCashier) elCashier.textContent = receipt.cashierName || session.cashierName;
  if (elStudent) elStudent.textContent = receipt.studentName;
  if (elClass) elClass.textContent = receipt.className || (student?.class?.name || "General");
  if (elAmount) elAmount.textContent = formatCurrency(receipt.amount);
  if (elMethod) elMethod.textContent = receipt.paymentMethod || "CASH";
  if (elRef) elRef.textContent = receipt.referenceNo || "NONE";
  if (elPrevBal) elPrevBal.textContent = formatCurrency(previousBalance);
  if (elPaidNow) elPaidNow.textContent = `-${formatCurrency(receipt.amount)}`;
  if (elBal) elBal.textContent = formatCurrency(Math.max(0, currentRemainingBalance));

  document.getElementById("receiptModal").classList.add("open");
}

// ============================================================================
// 2. RECEIPTS HISTORY
// ============================================================================
function renderReceipts() {
  const tbody = document.getElementById("receiptsTableBody");
  if (!tbody) return;
  tbody.innerHTML = "";

  localData.receipts.forEach((r) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td style="font-family: monospace; font-weight: bold;">${r.receiptNumber}</td>
      <td>${r.studentName}</td>
      <td style="color: var(--accent-emerald); font-weight: bold;">${formatCurrency(r.amount)}</td>
      <td>${r.paymentMethod}</td>
      <td>${r.cashierName}</td>
      <td>${r.isOfflineSync ? '<span style="color: var(--accent-amber); font-weight: bold;">Outbox Pending</span>' : '<span style="color: var(--accent-emerald); font-weight: bold;">Synced</span>'}</td>
      <td style="font-size: 11px; color: var(--text-muted);">${new Date(r.issuedAt).toLocaleTimeString()}</td>
      <td><button class="btn btn-outline btn-sm" onclick="reprintReceipt('${r.receiptNumber}')">Reprint</button></td>
    `;
    tbody.appendChild(tr);
  });
}

window.reprintReceipt = function (rcpNo) {
  const found = localData.receipts.find((r) => r.receiptNumber === rcpNo);
  if (found) showReceiptModal(found);
};

// ============================================================================
// 3. STUDENT FEES & BILLING MANAGEMENT
// ============================================================================
let currentBillMode = "search"; // "search" or "manual"
let billSelectedStudent = null;

function setupFeesModule() {
  const btnOpenModal = document.getElementById("btnOpenBillModal");
  const modal = document.getElementById("billModal");
  const btnClose = document.getElementById("btnCloseBillModal");
  const form = document.getElementById("newBillForm");

  // Mode toggles
  const modeSearchBtn = document.getElementById("billModeSearchBtn");
  const modeManualBtn = document.getElementById("billModeManualBtn");
  const searchSection = document.getElementById("billSearchSection");
  const manualSection = document.getElementById("billManualSection");

  // Search & input elements
  const searchInput = document.getElementById("billStudentSearchInput");
  const resultsList = document.getElementById("billStudentResultsList");
  const selectDropdown = document.getElementById("billStudentSelect");
  const hiddenStudentId = document.getElementById("billSelectedStudentId");

  // Manual inputs
  const manualNameInput = document.getElementById("billManualName");
  const manualClassInput = document.getElementById("billManualClass");

  // Financial inputs
  const tuitionInput = document.getElementById("billAmount");
  const paidInput = document.getElementById("billAmountPaid");
  const discountInput = document.getElementById("billDiscount");
  const termInput = document.getElementById("billTerm");
  const payMethodRow = document.getElementById("billPaymentMethodRow");
  const payMethodSelect = document.getElementById("billPaymentMethod");
  const payRefInput = document.getElementById("billPayRef");

  // Displays
  const balanceDisplay = document.getElementById("billOutstandingBalanceDisplay");
  const metaHint = document.getElementById("billStudentMetaHint");
  const netDuePreview = document.getElementById("billNetDuePreview");
  const paidPreview = document.getElementById("billPaidPreview");
  const projectedBalancePreview = document.getElementById("billProjectedBalancePreview");

  if (!btnOpenModal || !modal) return;

  function updateBillCalculations() {
    const tuition = Math.max(0, Number(tuitionInput.value) || 0);
    const discount = Math.max(0, Number(discountInput.value) || 0);
    const paid = Math.max(0, Number(paidInput.value) || 0);

    const netDue = Math.max(0, tuition - discount);
    const currentBalance = billSelectedStudent ? Number(billSelectedStudent.balance || 0) : 0;
    const projectedBalance = Math.max(0, currentBalance + netDue - paid);

    if (netDuePreview) netDuePreview.textContent = formatCurrency(netDue);
    if (paidPreview) paidPreview.textContent = formatCurrency(paid);
    if (projectedBalancePreview) projectedBalancePreview.textContent = formatCurrency(projectedBalance);

    // Show/hide payment method row based on amount paid
    if (payMethodRow) {
      payMethodRow.style.display = paid > 0 ? "block" : "none";
    }
  }

  function setBillStudent(student) {
    billSelectedStudent = student;
    if (student) {
      if (hiddenStudentId) hiddenStudentId.value = student.id;
      if (searchInput) searchInput.value = `${student.name} (${student.class?.name || "General"})`;
      if (selectDropdown) selectDropdown.value = student.id;
      if (balanceDisplay) balanceDisplay.textContent = formatCurrency(student.balance || 0);
      if (metaHint) {
        metaHint.textContent = `Reg/Inv: ${student.invoiceId || "INV-STUDENT"} • Class: ${student.class?.name || "General"}`;
      }
    } else {
      if (hiddenStudentId) hiddenStudentId.value = "";
      if (balanceDisplay) balanceDisplay.textContent = formatCurrency(0);
      if (metaHint) metaHint.textContent = "New student enrollment (Zero initial balance)";
    }
    updateBillCalculations();
  }

  function renderStudentSearchResults(query = "") {
    if (!resultsList) return;
    const q = query.toLowerCase().trim();
    resultsList.innerHTML = "";

    const matches = localData.students.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        (s.class?.name && s.class.name.toLowerCase().includes(q)) ||
        (s.invoiceId && s.invoiceId.toLowerCase().includes(q))
    );

    if (matches.length === 0) {
      resultsList.innerHTML = `
        <div style="padding: 10px 14px; font-size: 11.5px; color: var(--text-muted); display: flex; justify-content: space-between; align-items: center;">
          <span>No existing student found</span>
          <button type="button" id="btnSwitchToManualFromSearch" style="background: none; border: none; color: var(--primary); font-weight: 700; cursor: pointer; text-decoration: underline; font-size: 11px;">
            Type Manually Instead
          </button>
        </div>
      `;
      const btnSwitch = document.getElementById("btnSwitchToManualFromSearch");
      if (btnSwitch) {
        btnSwitch.addEventListener("click", () => {
          switchToMode("manual");
          if (manualNameInput) {
            manualNameInput.value = query;
            manualNameInput.focus();
          }
          resultsList.style.display = "none";
        });
      }
      resultsList.style.display = "block";
      return;
    }

    matches.slice(0, 10).forEach((s) => {
      const item = document.createElement("div");
      item.style.padding = "8px 12px";
      item.style.borderBottom = "1px solid var(--border-color)";
      item.style.cursor = "pointer";
      item.style.display = "flex";
      item.style.justifyContent = "space-between";
      item.style.alignItems = "center";
      item.style.transition = "background 0.15s ease";

      item.innerHTML = `
        <div>
          <div style="font-weight: 700; font-size: 12px; color: var(--text-primary);">${s.name}</div>
          <div style="font-size: 10.5px; color: var(--text-muted);">${s.class?.name || "General"} • ${s.invoiceId || "INV-GEN"}</div>
        </div>
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: ${s.balance > 0 ? "var(--accent-amber)" : "var(--accent-emerald)"};">
          ${s.balance > 0 ? "Bal: " + formatCurrency(s.balance) : "Cleared"}
        </div>
      `;

      item.addEventListener("mouseenter", () => (item.style.background = "var(--bg-hover)"));
      item.addEventListener("mouseleave", () => (item.style.background = "transparent"));
      item.addEventListener("click", () => {
        setBillStudent(s);
        resultsList.style.display = "none";
      });

      resultsList.appendChild(item);
    });

    resultsList.style.display = "block";
  }

  function switchToMode(mode) {
    currentBillMode = mode;
    if (mode === "search") {
      modeSearchBtn.style.background = "var(--primary)";
      modeSearchBtn.style.color = "#fff";
      modeSearchBtn.classList.remove("btn-outline");
      modeManualBtn.style.background = "transparent";
      modeManualBtn.style.color = "inherit";
      modeManualBtn.classList.add("btn-outline");

      searchSection.style.display = "block";
      manualSection.style.display = "none";
      if (manualNameInput) manualNameInput.required = false;

      // Restore selected student balance if any
      const curId = hiddenStudentId ? hiddenStudentId.value : "";
      const found = localData.students.find((s) => s.id === curId);
      setBillStudent(found || localData.students[0] || null);
    } else {
      modeManualBtn.style.background = "var(--primary)";
      modeManualBtn.style.color = "#fff";
      modeManualBtn.classList.remove("btn-outline");
      modeSearchBtn.style.background = "transparent";
      modeSearchBtn.style.color = "inherit";
      modeSearchBtn.classList.add("btn-outline");

      searchSection.style.display = "none";
      manualSection.style.display = "block";
      if (manualNameInput) manualNameInput.required = true;

      setBillStudent(null);
      if (metaHint) metaHint.textContent = "New manual entry • Will be registered in system roster";
    }
  }

  modeSearchBtn.addEventListener("click", () => switchToMode("search"));
  modeManualBtn.addEventListener("click", () => switchToMode("manual"));

  // Open modal button
  btnOpenModal.addEventListener("click", () => {
    // Populate select dropdown
    if (selectDropdown) {
      selectDropdown.innerHTML = '<option value="">-- Or select from roster list --</option>';
      localData.students.forEach((s) => {
        const opt = document.createElement("option");
        opt.value = s.id;
        opt.textContent = `${s.name} (${s.class?.name || "General"}) — Bal: ${formatCurrency(s.balance || 0)}`;
        selectDropdown.appendChild(opt);
      });
    }

    // Set term & financial inputs
    if (termInput) termInput.value = `${systemSettings.activeTerm || "Term 1"} ${systemSettings.academicYear || "2026"}`;
    if (tuitionInput) tuitionInput.value = "0";
    if (paidInput) paidInput.value = "0";
    if (discountInput) discountInput.value = "0";

    // Default to search mode with first student if available
    switchToMode("search");
    if (localData.students.length > 0) {
      setBillStudent(localData.students[0]);
    } else {
      switchToMode("manual");
    }

    updateBillCalculations();
    modal.classList.add("open");
    if (searchInput) searchInput.focus();
  });

  btnClose.addEventListener("click", () => modal.classList.remove("open"));

  // Real-time search listeners
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      renderStudentSearchResults(e.target.value);
    });
    searchInput.addEventListener("focus", (e) => {
      renderStudentSearchResults(e.target.value);
    });
  }

  // Click outside search results to close dropdown
  document.addEventListener("click", (e) => {
    if (resultsList && !resultsList.contains(e.target) && e.target !== searchInput) {
      resultsList.style.display = "none";
    }
  });

  // Select dropdown change
  if (selectDropdown) {
    selectDropdown.addEventListener("change", (e) => {
      const student = localData.students.find((s) => s.id === e.target.value);
      if (student) setBillStudent(student);
    });
  }

  // Live calculation input listeners
  [tuitionInput, discountInput, paidInput].forEach((input) => {
    if (input) {
      input.addEventListener("input", updateBillCalculations);
      input.addEventListener("change", updateBillCalculations);
    }
  });

  // Form submit handler
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const tuition = Math.max(0, Number(tuitionInput.value) || 0);
    const discount = Math.max(0, Number(discountInput.value) || 0);
    const paid = Math.max(0, Number(paidInput.value) || 0);
    const term = termInput.value.trim() || `${systemSettings.activeTerm} ${systemSettings.academicYear}`;
    const netDue = Math.max(0, tuition - discount);

    let targetStudent = null;

    if (currentBillMode === "search") {
      const studentId = hiddenStudentId.value || selectDropdown.value;
      targetStudent = localData.students.find((s) => s.id === studentId);
      if (!targetStudent) {
        alert("Please select a student from the directory or switch to 'Type Name Manually'.");
        return;
      }
    } else {
      // Manual mode: Register new student or match existing
      const manualName = manualNameInput.value.trim();
      const manualClass = manualClassInput.value.trim() || "General Stream";

      if (!manualName) {
        alert("Please enter the student's name.");
        return;
      }

      // Check if student with identical name exists
      const existing = localData.students.find(
        (s) => s.name.toLowerCase() === manualName.toLowerCase()
      );

      if (existing) {
        targetStudent = existing;
      } else {
        const newId = `s_${Date.now()}`;
        const newInvoiceId = `INV-${new Date().getFullYear()}-T${(systemSettings.activeTerm || "1").replace(/\D/g, "") || "1"}-${1000 + localData.students.length + 1}`;
        targetStudent = {
          id: newId,
          name: manualName,
          class: { name: manualClass },
          totalInvoiced: 0,
          paidAmount: 0,
          balance: 0,
          discount: 0,
          invoiceId: newInvoiceId,
          term: term,
        };
        localData.students.push(targetStudent);
      }
    }

    // 1. Snapshot previous balance before applying new bill/payment
    const priorBalance = Math.max(0, Number(targetStudent.balance || 0));

    // 2. Update Student Financial Balance & Ledger
    targetStudent.totalInvoiced = (Number(targetStudent.totalInvoiced) || 0) + netDue;
    targetStudent.discount = (Number(targetStudent.discount) || 0) + discount;
    targetStudent.term = term;

    // Projected balance with bill added before payment
    const balanceWithBill = priorBalance + netDue;

    // 3. If Initial Payment Made at Bill Issuance, Apply Deduction and Generate Official Receipt
    let generatedReceipt = null;
    if (paid > 0) {
      const finalRemainingBalance = Math.max(0, balanceWithBill - paid);
      targetStudent.paidAmount = (Number(targetStudent.paidAmount) || 0) + paid;
      targetStudent.balance = finalRemainingBalance;

      const payMethod = payMethodSelect ? payMethodSelect.value : "CASH";
      const payRef = payRefInput ? payRefInput.value.trim() : "";
      const receiptNumber = `RCP-${new Date().getFullYear()}-${CONFIG.machineId.slice(0, 4)}-${localData.receiptCounter}`;
      localData.receiptCounter++;

      generatedReceipt = {
        receiptNumber,
        invoiceId: targetStudent.invoiceId || "INV-DIRECT",
        studentId: targetStudent.id,
        studentName: targetStudent.name,
        className: targetStudent.class?.name || "General",
        amount: paid,
        paymentMethod: payMethod,
        referenceNo: payRef || "BILL-DIRECT-PAY",
        previousBalance: balanceWithBill,
        remainingBalance: finalRemainingBalance,
        cashierName: session.cashierName,
        workstationId: CONFIG.machineId,
        issuedAt: new Date().toISOString(),
        notes: `Tuition payment at bill issuance (${term})`,
        isOfflineSync: true,
      };

      localData.receipts.unshift(generatedReceipt);
      localData.syncQueue.push({
        type: "RECEIPT",
        payload: generatedReceipt,
      });
    } else {
      targetStudent.balance = balanceWithBill;
    }

    // Record Billing Event in Sync Queue
    localData.syncQueue.push({
      type: "STUDENT_BILL",
      payload: {
        studentId: targetStudent.id,
        studentName: targetStudent.name,
        className: targetStudent.class?.name,
        tuition,
        discount,
        netDue,
        amountPaid: paid,
        term,
        issuedAt: new Date().toISOString(),
        cashierName: session.cashierName,
        workstationId: CONFIG.machineId,
      },
    });

    // 3. Persist State & Update Everywhere
    saveState();

    // 4. Multi-Module Real-time UI Sync
    renderFeesTable();
    renderStudentList();
    renderReceipts();
    renderQueue();
    updateDrawerFloatDisplay();
    renderDashboard();
    renderReports();

    if (selectedStudent && selectedStudent.id === targetStudent.id) {
      selectedStudent = targetStudent;
      updateStudentSummary();
    }

    // Feedback & Close Modal
    modal.classList.remove("open");
    showToast(
      `Fee bill issued for ${targetStudent.name}! Net due: ${formatCurrency(netDue)}${paid > 0 ? " (Deposit: " + formatCurrency(paid) + ")" : ""}`
    );

    if (generatedReceipt) {
      setTimeout(() => showReceiptModal(generatedReceipt), 400);
    }

    attemptSync();
  });
}

function renderFeesTable() {
  const tbody = document.getElementById("feesTableBody");
  if (!tbody) return;
  tbody.innerHTML = "";

  localData.students.forEach((s) => {
    const tr = document.createElement("tr");
    const status = s.balance === 0 ? "PAID" : (s.paidAmount > 0 ? "PARTIAL" : "UNPAID");
    const statusColor = s.balance === 0 ? "var(--accent-emerald)" : (s.paidAmount > 0 ? "var(--accent-amber)" : "var(--accent-rose)");

    tr.innerHTML = `
      <td style="font-weight: 700; color: var(--text-primary);">${s.name}</td>
      <td>${s.class?.name || "General"}</td>
      <td>${s.term || "Term 1 2026"}</td>
      <td style="font-weight: 600;">${formatCurrency(s.totalInvoiced || 0)}</td>
      <td style="color: var(--accent-rose); font-weight: 600;">${s.discount > 0 ? "-" + formatCurrency(s.discount) : "—"}</td>
      <td style="color: var(--accent-emerald); font-weight: 600;">${formatCurrency(s.paidAmount || 0)}</td>
      <td style="color: var(--accent-amber); font-weight: 800; font-family: 'JetBrains Mono', monospace;">${formatCurrency(s.balance || 0)}</td>
      <td>
        <span style="display: inline-block; padding: 2px 8px; border-radius: 4px; font-weight: 800; font-size: 10px; background: ${statusColor}18; color: ${statusColor}; border: 1px solid ${statusColor}44;">
          ${status}
        </span>
      </td>
      <td>
        <button class="btn btn-outline btn-sm" onclick="openBillForStudent('${s.id}')" title="Issue new bill or update fees" style="font-size: 11px; padding: 4px 8px;">
          Bill Student
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

window.openBillForStudent = function (studentId) {
  const student = localData.students.find((s) => s.id === studentId);
  const btnOpen = document.getElementById("btnOpenBillModal");
  if (btnOpen) btnOpen.click();
  setTimeout(() => {
    const hiddenId = document.getElementById("billSelectedStudentId");
    const searchInp = document.getElementById("billStudentSearchInput");
    const select = document.getElementById("billStudentSelect");
    const balDisp = document.getElementById("billOutstandingBalanceDisplay");
    const metaHint = document.getElementById("billStudentMetaHint");
    const tuitionInp = document.getElementById("billAmount");
    const paidInp = document.getElementById("billAmountPaid");
    const discInp = document.getElementById("billDiscount");

    if (student) {
      billSelectedStudent = student;
      if (hiddenId) hiddenId.value = student.id;
      if (searchInp) searchInp.value = `${student.name} (${student.class?.name || "General"})`;
      if (select) select.value = student.id;
      if (balDisp) balDisp.textContent = formatCurrency(student.balance || 0);
      if (metaHint) metaHint.textContent = `Reg/Inv: ${student.invoiceId || "INV-STUDENT"} • Class: ${student.class?.name || "General"}`;
      if (tuitionInp) tuitionInp.value = "0";
      if (paidInp) paidInp.value = "0";
      if (discInp) discInp.value = "0";
      const netDuePreview = document.getElementById("billNetDuePreview");
      const paidPreview = document.getElementById("billPaidPreview");
      const projectedBalancePreview = document.getElementById("billProjectedBalancePreview");
      if (netDuePreview) netDuePreview.textContent = formatCurrency(0);
      if (paidPreview) paidPreview.textContent = formatCurrency(0);
      if (projectedBalancePreview) projectedBalancePreview.textContent = formatCurrency(student.balance || 0);
    }
  }, 100);
};

// ============================================================================
// 4. OPERATIONAL EXPENSES & DISBURSEMENT MODULE
// ============================================================================
function setupExpenses() {
  const form = document.getElementById("expenseForm");
  const catSelect = document.getElementById("expCategorySelect");
  const catCustom = document.getElementById("expCategoryCustom");
  const filterCat = document.getElementById("expFilterCategory");
  const searchInput = document.getElementById("expenseSearch");
  const btnCloseModal = document.getElementById("btnCloseExpenseVoucher");

  // Toggle Custom Category Input if "Type Custom Category Manually..." is selected
  if (catSelect && catCustom) {
    catSelect.addEventListener("change", (e) => {
      if (e.target.value === "__CUSTOM__") {
        catCustom.style.display = "block";
        catCustom.required = true;
        catCustom.focus();
      } else {
        catCustom.style.display = "none";
        catCustom.required = false;
        catCustom.value = "";
      }
    });
  }

  // Filter & Search Event Listeners
  if (filterCat) {
    filterCat.addEventListener("change", renderExpenses);
  }
  if (searchInput) {
    searchInput.addEventListener("input", renderExpenses);
  }

  // Close Voucher Modal
  if (btnCloseModal) {
    btnCloseModal.addEventListener("click", () => {
      document.getElementById("expenseVoucherModal")?.classList.remove("open");
    });
  }

  // Submit Expense Form
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      if (!session.isAuthenticated) {
        alert("Please sign in with your cashier PIN first!");
        return;
      }

      const paidTo = document.getElementById("expPaidTo")?.value.trim();
      const catVal = catSelect?.value;
      const customCatVal = catCustom?.value.trim();
      const finalCategory = catVal === "__CUSTOM__" ? (customCatVal || "General Operational") : catVal;

      const title = document.getElementById("expTitle")?.value.trim();
      const amount = Number(document.getElementById("expAmount")?.value);
      const paidFrom = document.getElementById("expPaidFrom")?.value || "DRAWER";
      const department = document.getElementById("expDept")?.value || "Administration";
      const invoiceRef = document.getElementById("expInvoiceRef")?.value.trim();
      const desc = document.getElementById("expDesc")?.value.trim();

      if (!finalCategory) {
        alert("Please choose an expense category or type a custom one.");
        return;
      }

      if (!amount || amount <= 0) {
        alert("Please enter a valid disbursement amount.");
        return;
      }

      // Check Account Balance
      if (paidFrom === "DRAWER") {
        const curDrawer = getCashDrawerBalance();
        if (amount > curDrawer) {
          const confirmDisburse = confirm(
            `Notice: Disbursing ${formatCurrency(amount)} exceeds verified counter drawer cash (${formatCurrency(curDrawer)}).\n\nDo you wish to authorize this cash drawer disbursement as Chief Bursar/Admin?`
          );
          if (!confirmDisburse) return;
        }
      } else if (paidFrom === "STANBIC") {
        const curStanbic = getStanbicBalance();
        if (amount > curStanbic) {
          alert(`Insufficient Stanbic Bank Balance! Current available: ${formatCurrency(curStanbic)}`);
          return;
        }
      } else if (paidFrom === "MOMO") {
        const curMomo = getMoMoBalance();
        if (amount > curMomo) {
          alert(`Insufficient Mobile Money Float! Current available: ${formatCurrency(curMomo)}`);
          return;
        }
      }

      const voucherNumber = `PV-${new Date().getFullYear()}-${CONFIG.machineId.slice(0, 4)}-${Math.floor(1000 + Math.random() * 9000)}`;

      const expRecord = {
        voucherNumber,
        paidTo,
        title: title || `${finalCategory} Expense`,
        amount,
        paidFrom,
        department,
        category: finalCategory,
        invoiceRef: invoiceRef || `REF-${Math.floor(1000 + Math.random() * 9000)}`,
        description: desc || `Approved operational disbursement for ${finalCategory}`,
        recordedBy: session.cashierName,
        workstationId: CONFIG.machineId,
        expenseDate: new Date().toISOString(),
      };

      localData.expenses.unshift(expRecord);

      // Auto-post into Bank / Cash Ledger for complete transparency & double-entry credibility
      const bankSourceLabel =
        paidFrom === "STANBIC" ? "STANBIC" : paidFrom === "MOMO" ? "MOMO" : "DRAWER";

      const bankTx = {
        id: `TX-${Date.now().toString().slice(-6)}`,
        date: expRecord.expenseDate,
        ref: expRecord.invoiceRef,
        desc: `Disbursement: ${expRecord.title} (${expRecord.category}) - ${expRecord.paidTo}`,
        from: bankSourceLabel,
        to: "SUPPLIER / PAYEE",
        type: "DEBIT",
        amount: expRecord.amount,
        officer: session.cashierName,
        status: "VERIFIED",
        voucherRef: voucherNumber,
      };

      if (!localData.bankTransactions) localData.bankTransactions = [];
      localData.bankTransactions.unshift(bankTx);

      localData.syncQueue.push({
        type: "EXPENSE",
        payload: expRecord,
      });

      saveState();
      renderExpenses();
      renderBankModule();
      updateDrawerFloatDisplay();
      renderDashboard();
      renderReports();

      const sourceName =
        paidFrom === "DRAWER"
          ? "Cash Drawer Float"
          : paidFrom === "STANBIC"
          ? "Stanbic Operating Account"
          : "Mobile Money Merchant Account";

      showToast(`Expense voucher ${voucherNumber} issued! ${formatCurrency(amount)} deducted from ${sourceName}.`);

      form.reset();
      if (catCustom) catCustom.style.display = "none";
      attemptSync();

      // Automatically offer voucher slip preview
      setTimeout(() => {
        viewExpenseVoucher(voucherNumber);
      }, 350);
    });
  }
}

function renderExpenses() {
  const tbody = document.getElementById("expensesTableBody");
  if (!tbody) return;
  tbody.innerHTML = "";

  const filterCategory = document.getElementById("expFilterCategory")?.value || "ALL";
  const searchTerm = (document.getElementById("expenseSearch")?.value || "").toLowerCase().trim();

  // Top Category Totals
  const totalDisbursed = localData.expenses.reduce((acc, e) => acc + Number(e.amount || 0), 0);
  const utilitiesTotal = localData.expenses
    .filter((e) => ["Electricity Bill", "Water & Sanitation", "Diesel & Fuel"].includes(e.category))
    .reduce((acc, e) => acc + Number(e.amount || 0), 0);
  const foodTotal = localData.expenses
    .filter((e) => e.category === "Kitchen Food Supplies")
    .reduce((acc, e) => acc + Number(e.amount || 0), 0);
  const academicsTotal = localData.expenses
    .filter((e) => !["Electricity Bill", "Water & Sanitation", "Diesel & Fuel", "Kitchen Food Supplies"].includes(e.category))
    .reduce((acc, e) => acc + Number(e.amount || 0), 0);

  const elTotalDisbursed = document.getElementById("expTotalDisbursed");
  const elTotalCount = document.getElementById("expTotalCount");
  const elUtilitiesTotal = document.getElementById("expUtilitiesTotal");
  const elFoodTotal = document.getElementById("expFoodTotal");
  const elAcademicsTotal = document.getElementById("expAcademicsTotal");

  if (elTotalDisbursed) elTotalDisbursed.textContent = formatCurrency(totalDisbursed);
  if (elTotalCount) elTotalCount.textContent = `${localData.expenses.length} Vouchers Issued`;
  if (elUtilitiesTotal) elUtilitiesTotal.textContent = formatCurrency(utilitiesTotal);
  if (elFoodTotal) elFoodTotal.textContent = formatCurrency(foodTotal);
  if (elAcademicsTotal) elAcademicsTotal.textContent = formatCurrency(academicsTotal);

  const filtered = localData.expenses.filter((e) => {
    const matchCategory = filterCategory === "ALL" || e.category === filterCategory;
    const matchSearch =
      !searchTerm ||
      (e.voucherNumber && e.voucherNumber.toLowerCase().includes(searchTerm)) ||
      (e.paidTo && e.paidTo.toLowerCase().includes(searchTerm)) ||
      (e.title && e.title.toLowerCase().includes(searchTerm)) ||
      (e.category && e.category.toLowerCase().includes(searchTerm)) ||
      (e.department && e.department.toLowerCase().includes(searchTerm)) ||
      (e.invoiceRef && e.invoiceRef.toLowerCase().includes(searchTerm));
    return matchCategory && matchSearch;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 24px;">
          No expense vouchers match the selected filter or search keyword.
        </td>
      </tr>
    `;
    return;
  }

  filtered.forEach((e) => {
    const tr = document.createElement("tr");

    const paidFromLabel =
      e.paidFrom === "STANBIC"
        ? '<span class="badge-soft" style="background: rgba(37,99,235,0.12); color: var(--accent-blue);">Stanbic Bank</span>'
        : e.paidFrom === "MOMO"
        ? '<span class="badge-soft" style="background: rgba(217,119,6,0.12); color: var(--accent-amber);">Mobile Money</span>'
        : '<span class="badge-soft" style="background: rgba(16,185,129,0.12); color: var(--accent-emerald);">Cash Drawer</span>';

    const dateStr = new Date(e.expenseDate || Date.now()).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    tr.innerHTML = `
      <td style="font-family: monospace; font-weight: 700; color: var(--text-color);">${e.voucherNumber}</td>
      <td style="font-size: 11px; color: var(--text-muted);">${dateStr}</td>
      <td>
        <div style="font-weight: 600; color: var(--text-color);">${e.title || e.category}</div>
        <div style="font-size: 11px; color: var(--text-muted);">${e.paidTo} • Ref: ${e.invoiceRef || '-'}</div>
      </td>
      <td><span class="badge-soft" style="background: var(--bg-hover); color: var(--text-color); font-weight: 600;">${e.category}</span></td>
      <td>${paidFromLabel}</td>
      <td style="color: var(--accent-rose); font-weight: 700;">-${formatCurrency(e.amount)}</td>
      <td>
        <button class="btn btn-outline btn-sm" onclick="viewExpenseVoucher('${e.voucherNumber}')" title="View Official Payment Voucher Slip">
          <svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
          <span>View Slip</span>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

window.viewExpenseVoucher = function (voucherNumber) {
  const found = localData.expenses.find((e) => e.voucherNumber === voucherNumber);
  if (!found) return;

  const modal = document.getElementById("expenseVoucherModal");
  if (!modal) return;

  const paidFromText =
    found.paidFrom === "STANBIC"
      ? "Stanbic Operating Account (EFT / Direct Transfer)"
      : found.paidFrom === "MOMO"
      ? "Mobile Money Merchant Account (Merchant Sweep)"
      : "Main Cash Drawer Float (Physical Cash)";

  document.getElementById("expSlipVoucherNo").textContent = found.voucherNumber;
  document.getElementById("expSlipDate").textContent = new Date(found.expenseDate || Date.now()).toLocaleString();
  document.getElementById("expSlipPaidFrom").textContent = paidFromText;
  document.getElementById("expSlipDept").textContent = found.department || "Administration";
  document.getElementById("expSlipCategory").textContent = found.category || "General Operational";
  document.getElementById("expSlipPayee").textContent = found.paidTo || "Vendor";
  document.getElementById("expSlipTitle").textContent = found.title || found.category;
  document.getElementById("expSlipInvoiceRef").textContent = found.invoiceRef || "N/A";
  document.getElementById("expSlipDesc").textContent = found.description || "Approved institutional operational disbursement";
  document.getElementById("expSlipAmount").textContent = formatCurrency(found.amount);
  document.getElementById("expSlipAuthorizedBy").textContent = `${found.recordedBy || session.cashierName} (Bursar & Finance Office)`;

  modal.classList.add("open");
};

// ============================================================================
// 5. STAFF PAYROLL & PAYSLIPS
// ============================================================================
function setupPayrollModule() {
  const btnClose = document.getElementById("btnClosePayslip");
  if (btnClose) {
    btnClose.addEventListener("click", () => {
      document.getElementById("payslipModal").classList.remove("open");
    });
  }

  const btnOpenModal = document.getElementById("btnOpenPayrollModal");
  if (btnOpenModal) {
    btnOpenModal.addEventListener("click", () => {
      const name = prompt("Enter Staff / Teacher Full Name:");
      if (!name) return;
      const gross = Number(prompt(`Enter Gross Monthly Salary (${systemSettings.currencySymbol}):`, "1200000"));
      if (!gross) return;

      const paye = Math.round(gross > 410000 ? 25000 + (gross - 410000) * 0.3 : 0);
      const nssf = Math.round(gross * 0.05);
      const net = gross - paye - nssf;
      const ref = `PAY-${new Date().getFullYear()}-MAR-${Math.floor(100 + Math.random() * 900)}`;

      const payRecord = {
        ref,
        name,
        role: "Faculty Staff",
        gross,
        paye,
        nssf,
        net,
        status: "APPROVED",
        period: "March 2026",
      };

      localData.payroll.unshift(payRecord);
      saveState();
      renderPayrollTable();
      showToast(`Payroll processed for ${name}! Net Pay: ${formatCurrency(net)}`);
    });
  }
}

function renderPayrollTable() {
  const tbody = document.getElementById("payrollTableBody");
  if (!tbody) return;
  tbody.innerHTML = "";

  localData.payroll.forEach((p) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td style="font-family: monospace; font-weight: 700;">${p.ref}</td>
      <td style="font-weight: 600;">${p.name}</td>
      <td>${p.period}</td>
      <td>${formatCurrency(p.gross)}</td>
      <td style="color: var(--accent-rose); font-weight: 600;">-${formatCurrency(p.paye)}</td>
      <td style="color: var(--accent-amber); font-weight: 600;">-${formatCurrency(p.nssf)}</td>
      <td style="color: var(--accent-emerald); font-weight: 800;">${formatCurrency(p.net)}</td>
      <td><span style="font-weight: 700; color: var(--accent-emerald);">${p.status}</span></td>
      <td><button class="btn btn-outline btn-sm" onclick="viewPayslip('${p.ref}')">Payslip</button></td>
    `;
    tbody.appendChild(tr);
  });
}

window.viewPayslip = function (ref) {
  const found = localData.payroll.find((p) => p.ref === ref);
  if (!found) return;

  document.getElementById("psRef").textContent = found.ref;
  document.getElementById("psName").textContent = found.name;
  document.getElementById("psPeriod").textContent = found.period;
  document.getElementById("psGross").textContent = formatCurrency(found.gross);
  document.getElementById("psPaye").textContent = "- " + formatCurrency(found.paye);
  document.getElementById("psNssf").textContent = "- " + formatCurrency(found.nssf);
  document.getElementById("psNet").textContent = formatCurrency(found.net);

  document.getElementById("payslipModal").classList.add("open");
};

// ============================================================================
// 6. BANK & CASH DRAWER MANAGEMENT & AUDITED TRANSACTION STATEMENTS
// ============================================================================
function setupBankModule() {
  const form = document.getElementById("cashTransferForm");
  const filterAccount = document.getElementById("bankAccountFilter");
  const searchInput = document.getElementById("bankSearchInput");
  const btnExportCsv = document.getElementById("btnExportBankCsv");

  if (filterAccount) {
    filterAccount.addEventListener("change", renderBankModule);
  }

  if (searchInput) {
    searchInput.addEventListener("input", renderBankModule);
  }

  if (btnExportCsv) {
    btnExportCsv.addEventListener("click", exportBankCsv);
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      if (!session.isAuthenticated) {
        alert("Please unlock workstation first!");
        return;
      }

      const from = document.getElementById("trfFromSelect").value;
      const to = document.getElementById("trfToSelect").value;
      const amount = Number(document.getElementById("trfAmount").value);
      const ref = document.getElementById("trfRef").value.trim();
      const memo = document.getElementById("trfMemo").value.trim();

      if (from === to) {
        alert("Source and destination accounts must be different.");
        return;
      }

      if (!amount || amount <= 0) {
        alert("Please enter a valid transfer amount.");
        return;
      }

      // Check source balance
      if (from === "DRAWER") {
        const curDrawer = getCashDrawerBalance();
        if (amount > curDrawer) {
          alert(`Insufficient cash in drawer! Available physical float: ${formatCurrency(curDrawer)}`);
          return;
        }
      } else if (from === "STANBIC") {
        const curStanbic = getStanbicBalance();
        if (amount > curStanbic) {
          alert(`Insufficient balance in Stanbic Operating Account! Available: ${formatCurrency(curStanbic)}`);
          return;
        }
      } else if (from === "MOMO") {
        const curMomo = getMoMoBalance();
        if (amount > curMomo) {
          alert(`Insufficient Mobile Money Float! Available: ${formatCurrency(curMomo)}`);
          return;
        }
      }

      const transferTx = {
        id: `TX-${Date.now().toString().slice(-6)}`,
        date: new Date().toISOString(),
        ref: ref,
        desc: memo || `Account Transfer from ${from} to ${to}`,
        from: from,
        to: to,
        type: "TRANSFER",
        amount: amount,
        officer: session.cashierName,
        status: "VERIFIED",
      };

      if (!localData.bankTransactions) localData.bankTransactions = [];
      localData.bankTransactions.unshift(transferTx);

      saveState();
      updateDrawerFloatDisplay();
      renderBankModule();
      renderDashboard();
      renderReports();

      showToast(`Account transfer of ${formatCurrency(amount)} recorded! Ref: ${ref}`);
      form.reset();
    });
  }
}

function renderBankModule() {
  const tbody = document.getElementById("bankLedgerTableBody");
  if (!tbody) return;
  tbody.innerHTML = "";

  const filterAcc = document.getElementById("bankAccountFilter")?.value || "ALL";
  const search = (document.getElementById("bankSearchInput")?.value || "").toLowerCase().trim();

  // Compute Bank Totals
  const totalDeposits = (localData.bankTransactions || [])
    .filter((t) => t.type === "CREDIT" || (t.type === "TRANSFER" && t.to === "STANBIC"))
    .reduce((acc, t) => acc + Number(t.amount || 0), 0);

  const totalOutflows = (localData.bankTransactions || [])
    .filter((t) => t.type === "DEBIT" || (t.type === "TRANSFER" && t.from === "STANBIC"))
    .reduce((acc, t) => acc + Number(t.amount || 0), 0);

  const elDeposits = document.getElementById("bankTotalDeposits");
  const elOutflows = document.getElementById("bankTotalOutflows");
  if (elDeposits) elDeposits.textContent = formatCurrency(totalDeposits);
  if (elOutflows) elOutflows.textContent = formatCurrency(totalOutflows);

  // Filter transactions
  const txList = (localData.bankTransactions || []).filter((t) => {
    const matchAcc =
      filterAcc === "ALL" || t.from === filterAcc || t.to === filterAcc;

    const matchSearch =
      !search ||
      (t.ref && t.ref.toLowerCase().includes(search)) ||
      (t.desc && t.desc.toLowerCase().includes(search)) ||
      (t.officer && t.officer.toLowerCase().includes(search)) ||
      (t.from && t.from.toLowerCase().includes(search)) ||
      (t.to && t.to.toLowerCase().includes(search)) ||
      (t.id && t.id.toLowerCase().includes(search));

    return matchAcc && matchSearch;
  });

  if (txList.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align: center; color: var(--text-muted); padding: 24px;">
          No bank transactions recorded matching the selected filter or search keyword.
        </td>
      </tr>
    `;
    return;
  }

  txList.forEach((t) => {
    const tr = document.createElement("tr");

    const dateFormatted = new Date(t.date || Date.now()).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const isCredit = t.type === "CREDIT";
    const isDebit = t.type === "DEBIT";
    const typeBadge = isCredit
      ? '<span class="badge-soft" style="background: rgba(16,185,129,0.12); color: var(--accent-emerald); font-weight: 700;">CREDIT</span>'
      : isDebit
      ? '<span class="badge-soft" style="background: rgba(244,63,94,0.12); color: var(--accent-rose); font-weight: 700;">DEBIT</span>'
      : '<span class="badge-soft" style="background: rgba(37,99,235,0.12); color: var(--accent-blue); font-weight: 700;">TRANSFER</span>';

    const amtStyle = isCredit
      ? "color: var(--accent-emerald); font-weight: 800;"
      : isDebit
      ? "color: var(--accent-rose); font-weight: 800;"
      : "color: var(--accent-blue); font-weight: 800;";

    const amtSign = isCredit ? "+" : isDebit ? "-" : "";

    const movementBadge = `
      <div style="font-size: 11px; font-weight: 600; display: inline-flex; align-items: center; gap: 4px;">
        <span style="color: var(--text-color);">${t.from}</span>
        <svg class="svg-icon text-muted" style="width: 12px; height: 12px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
        <span style="color: var(--text-color);">${t.to}</span>
      </div>
    `;

    const actionBtn = t.voucherRef
      ? `<button class="btn btn-outline btn-sm" onclick="viewExpenseVoucher('${t.voucherRef}')" title="View Expense Voucher Slip">Slip</button>`
      : `<span style="font-size: 11px; color: var(--accent-emerald); font-weight: 700; display: inline-flex; align-items: center; gap: 4px;">
          <svg class="svg-icon" style="width: 12px; height: 12px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
          Audited
        </span>`;

    tr.innerHTML = `
      <td style="font-size: 11px; color: var(--text-muted);">${dateFormatted}</td>
      <td style="font-family: monospace; font-weight: 700; color: var(--text-color);">${t.ref}</td>
      <td>
        <div style="font-weight: 600; color: var(--text-color);">${t.desc}</div>
        <div style="font-size: 10px; color: var(--text-muted);">Audit ID: ${t.id}</div>
      </td>
      <td>${movementBadge}</td>
      <td>${typeBadge}</td>
      <td style="${amtStyle}">${amtSign}${formatCurrency(t.amount)}</td>
      <td style="font-size: 11px;">${t.officer}</td>
      <td>${actionBtn}</td>
    `;
    tbody.appendChild(tr);
  });
}

function exportBankCsv() {
  const list = localData.bankTransactions || [];
  if (list.length === 0) {
    alert("No bank transactions available to export.");
    return;
  }

  const headers = ["Transaction ID", "Date Time", "Reference", "Narrative", "From Account", "To Account", "Type", `Amount (${systemSettings.currencySymbol})`, "Officer", "Audit Status"];
  const rows = list.map((t) => [
    t.id,
    new Date(t.date || Date.now()).toISOString(),
    `"${(t.ref || '').replace(/"/g, '""')}"`,
    `"${(t.desc || '').replace(/"/g, '""')}"`,
    t.from,
    t.to,
    t.type,
    t.amount,
    `"${(t.officer || '').replace(/"/g, '""')}"`,
    t.status || "VERIFIED"
  ]);

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Wellstar-Bank-Statement-Ledger-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  showToast("Bank statement ledger CSV exported successfully!");
}

// ============================================================================
// 8. MEAL CARDS MODULE (FINANCE & ACCOUNTS ISSUANCE & EXPIRY MANAGEMENT)
// ============================================================================
let activeRenewCardId = null;

function computeExpiryDate(startDateStr, duration) {
  const d = startDateStr ? new Date(startDateStr) : new Date();
  if (duration === "1_WEEK") d.setDate(d.getDate() + 7);
  else if (duration === "2_WEEKS") d.setDate(d.getDate() + 14);
  else if (duration === "1_MONTH") d.setDate(d.getDate() + 30);
  else if (duration === "FULL_TERM") d.setDate(d.getDate() + 90);
  else d.setDate(d.getDate() + 30);
  return d.toISOString().slice(0, 10);
}

function getMealCardStatus(card) {
  if (card.status === "SUSPENDED_ARREARS") {
    return {
      code: "SUSPENDED_ARREARS",
      label: "Suspended (Arrears)",
      cssClass: "badge-status-suspended",
      daysLeft: null,
    };
  }

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const expDate = card.validUntil ? new Date(card.validUntil) : null;
  if (!expDate || isNaN(expDate.getTime())) {
    return {
      code: "ACTIVE",
      label: "Active & Valid",
      cssClass: "badge-status-active",
      daysLeft: null,
    };
  }
  expDate.setHours(0, 0, 0, 0);

  const diffTime = expDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      code: "EXPIRED",
      label: `Expired (${Math.abs(diffDays)}d ago)`,
      cssClass: "badge-status-expired",
      daysLeft: diffDays,
    };
  } else if (diffDays <= 7) {
    return {
      code: "EXPIRING_SOON",
      label: `Expiring Soon (${diffDays}d left)`,
      cssClass: "badge-status-expiring",
      daysLeft: diffDays,
    };
  } else {
    return {
      code: "ACTIVE",
      label: `Active (${diffDays}d left)`,
      cssClass: "badge-status-active",
      daysLeft: diffDays,
    };
  }
}

function formatDateFriendly(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function setupMealsModule() {
  const btnOpenModal = document.getElementById("btnOpenIssueMealModal");
  const modal = document.getElementById("issueMealModal");
  const btnClose = document.getElementById("btnCloseIssueMealModal");
  const form = document.getElementById("issueMealForm");
  const studentSelect = document.getElementById("mealStudentSelect");
  const alertBox = document.getElementById("mealStudentFeeAlert");
  const btnAuto = document.getElementById("btnAutoIssueMeals");
  const searchInput = document.getElementById("mealSearchInput");
  const durationFilter = document.getElementById("mealDurationFilter");
  const statusFilter = document.getElementById("mealStatusFilter");
  const btnCloseBadge = document.getElementById("btnCloseMealBadgeModal");
  const durationSelect = document.getElementById("mealDurationSelect");
  const startDateInput = document.getElementById("mealStartDateInput");
  const expiryDateInput = document.getElementById("mealExpiryDateInput");

  // Renewal Modal Elements
  const renewModal = document.getElementById("renewMealModal");
  const btnCloseRenew = document.getElementById("btnCloseRenewMealModal");
  const renewForm = document.getElementById("renewMealForm");
  const renewDurationSelect = document.getElementById("renewDurationSelect");
  const renewNewExpiryInput = document.getElementById("renewNewExpiryDate");

  // Open Issue Modal
  if (btnOpenModal && modal) {
    btnOpenModal.addEventListener("click", () => {
      studentSelect.innerHTML = "";
      localData.students.forEach((s) => {
        const opt = document.createElement("option");
        opt.value = s.id;
        const bal = Number(s.balance || 0);
        const feeStatus = bal === 0 ? "PAID 100%" : `ARREARS: ${formatCurrency(bal)}`;
        opt.textContent = `${s.name} (${s.class?.name || "General"}) — [${feeStatus}]`;
        studentSelect.appendChild(opt);
      });

      const cardNumInput = document.getElementById("mealCardNumber");
      if (cardNumInput) {
        cardNumInput.value = `MC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      }

      const todayStr = new Date().toISOString().slice(0, 10);
      if (startDateInput) startDateInput.value = todayStr;
      if (durationSelect && expiryDateInput) {
        expiryDateInput.value = computeExpiryDate(todayStr, durationSelect.value);
      }

      updateSelectedStudentFeeAlert();
      modal.style.display = "flex";
      modal.classList.add("open");
    });
  }

  // Auto-compute expiry date when duration or start date changes
  if (durationSelect && startDateInput && expiryDateInput) {
    const handleDurationChange = () => {
      const sDate = startDateInput.value || new Date().toISOString().slice(0, 10);
      if (durationSelect.value !== "CUSTOM") {
        expiryDateInput.value = computeExpiryDate(sDate, durationSelect.value);
      }
    };
    durationSelect.addEventListener("change", handleDurationChange);
    startDateInput.addEventListener("change", handleDurationChange);
  }

  // Close Issue Modal
  if (btnClose && modal) {
    btnClose.addEventListener("click", () => {
      modal.style.display = "none";
      modal.classList.remove("open");
    });
  }

  // Student dropdown change: update fee alert
  if (studentSelect) {
    studentSelect.addEventListener("change", updateSelectedStudentFeeAlert);
  }

  function updateSelectedStudentFeeAlert() {
    if (!alertBox || !studentSelect) return;
    const sId = studentSelect.value;
    const student = localData.students.find((s) => s.id === sId);
    const statusSelect = document.getElementById("mealInitialStatus");

    if (!student) {
      alertBox.style.display = "none";
      return;
    }

    const bal = Number(student.balance || 0);
    const paid = Number(student.paidAmount || 0);
    const total = Number(student.totalInvoiced || 450000);

    alertBox.style.display = "block";
    if (bal === 0) {
      alertBox.style.background = "rgba(16, 185, 129, 0.12)";
      alertBox.style.border = "1px solid rgba(16, 185, 129, 0.4)";
      alertBox.style.color = "#10b981";
      alertBox.innerHTML = `<strong>CLEARANCE VERIFIED:</strong> Tuition fully cleared (${formatCurrency(paid)}). Student is authorized for Meal Card issuance.`;
      if (statusSelect) statusSelect.value = "ACTIVE";
    } else if (paid > 0) {
      alertBox.style.background = "rgba(245, 158, 11, 0.12)";
      alertBox.style.border = "1px solid rgba(245, 158, 11, 0.4)";
      alertBox.style.color = "#d97706";
      alertBox.innerHTML = `<strong>PARTIAL PAYMENT:</strong> Paid ${formatCurrency(paid)}. Arrears balance: <strong>${formatCurrency(bal)}</strong>. Accounts can issue 1-Week or 1-Month card as appropriate.`;
      if (statusSelect) statusSelect.value = "ACTIVE";
    } else {
      alertBox.style.background = "rgba(239, 68, 68, 0.12)";
      alertBox.style.border = "1px solid rgba(239, 68, 68, 0.4)";
      alertBox.style.color = "#ef4444";
      alertBox.innerHTML = `<strong>FEE ARREARS LOCK:</strong> Zero fee payment recorded. Outstanding balance: <strong>${formatCurrency(bal)}</strong>. Card will be issued in <em>Suspended</em> status until cleared.`;
      if (statusSelect) statusSelect.value = "SUSPENDED_ARREARS";
    }
  }

  // Save new meal card form
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const sId = studentSelect.value;
      const student = localData.students.find((s) => s.id === sId);
      if (!student) return;

      const cardNo = document.getElementById("mealCardNumber").value.trim();
      const duration = durationSelect.value;
      const startDate = startDateInput.value || new Date().toISOString().slice(0, 10);
      const expiryDate = expiryDateInput.value || computeExpiryDate(startDate, duration);
      const plan = document.getElementById("mealPlanSelect").value;
      const milk = Number(document.getElementById("mealMilkQuotaSelect").value || 0);
      const status = document.getElementById("mealInitialStatus").value;
      const notes = document.getElementById("mealCardNotes").value.trim();

      const existingIdx = localData.mealCards.findIndex((c) => c.cardNumber === cardNo || c.studentId === sId);

      const newCard = {
        id: existingIdx >= 0 ? localData.mealCards[existingIdx].id : `mc_${Date.now()}`,
        cardNumber: cardNo,
        studentId: student.id,
        studentName: student.name,
        studentClass: student.class?.name || "General",
        duration: duration,
        startDate: startDate,
        validUntil: expiryDate,
        planType: plan,
        dailyMilkQuota: milk,
        status: status,
        ticks: { mon: false, tue: false, wed: false, thu: false, fri: false, sat: false, sun: false },
        term: student.term || "Term 1 2026",
        issuedBy: session.cashierName || "Bursar Accounts",
        issuedAt: new Date().toISOString(),
        notes: notes || `Issued for ${duration.replace("_", " ")} by Accounts`,
      };

      if (existingIdx >= 0) {
        localData.mealCards[existingIdx] = newCard;
      } else {
        localData.mealCards.unshift(newCard);
      }

      saveState();
      renderMealCardsTable();
      modal.style.display = "none";
      modal.classList.remove("open");
      showToast(`Meal Card ${cardNo} (${duration.replace('_', ' ')}) successfully issued!`);
    });
  }

  // Auto-Issue 1-Month Meal Cards for eligible students
  if (btnAuto) {
    btnAuto.addEventListener("click", () => {
      let issuedCount = 0;
      const today = new Date().toISOString().slice(0, 10);
      const expDate = computeExpiryDate(today, "1_MONTH");

      localData.students.forEach((s, idx) => {
        const hasCard = localData.mealCards.some((c) => c.studentId === s.id);
        if (!hasCard) {
          const bal = Number(s.balance || 0);
          const isCleared = bal === 0 || Number(s.paidAmount || 0) >= (Number(s.totalInvoiced || 450000) * 0.5);
          const isSenior = s.class?.name && (s.class.name.includes("Senior 5") || s.class.name.includes("Senior 6"));

          const newCard = {
            id: `mc_auto_${Date.now()}_${idx}`,
            cardNumber: `MC-${new Date().getFullYear()}-${1060 + idx}`,
            studentId: s.id,
            studentName: s.name,
            studentClass: s.class?.name || "General",
            duration: "1_MONTH",
            startDate: today,
            validUntil: expDate,
            planType: isSenior ? "BOARDING_FULL" : "DAY_LUNCH",
            dailyMilkQuota: 1,
            status: isCleared ? "ACTIVE" : "SUSPENDED_ARREARS",
            ticks: { mon: true, tue: true, wed: false, thu: false, fri: false, sat: false, sun: false },
            term: s.term || "Term 1 2026",
            issuedBy: session.cashierName || "Bursar Accounts",
            issuedAt: new Date().toISOString(),
            notes: isCleared ? "Auto-issued 1-Month Card: Cleared tuition fees." : `Locked: Arrears of ${formatCurrency(bal)} pending payment.`,
          };

          localData.mealCards.push(newCard);
          issuedCount++;
        }
      });

      if (issuedCount > 0) {
        saveState();
        renderMealCardsTable();
        showToast(`Auto-issued ${issuedCount} 1-Month Meal Cards based on fee clearance!`);
      } else {
        showToast("All enrolled students already have issued meal cards.");
      }
    });
  }

  // Renewal Form listeners
  if (renewDurationSelect && renewNewExpiryInput) {
    renewDurationSelect.addEventListener("change", () => {
      if (!activeRenewCardId) return;
      const card = localData.mealCards.find((c) => c.id === activeRenewCardId);
      const baseDate = card && card.validUntil && new Date(card.validUntil) > new Date()
        ? card.validUntil
        : new Date().toISOString().slice(0, 10);
      renewNewExpiryInput.value = computeExpiryDate(baseDate, renewDurationSelect.value);
    });
  }

  if (btnCloseRenew && renewModal) {
    btnCloseRenew.addEventListener("click", () => {
      renewModal.style.display = "none";
      renewModal.classList.remove("open");
      activeRenewCardId = null;
    });
  }

  if (renewForm && renewModal) {
    renewForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!activeRenewCardId) return;
      const card = localData.mealCards.find((c) => c.id === activeRenewCardId);
      if (!card) return;

      const newExp = renewNewExpiryInput.value;
      const renewDur = renewDurationSelect.value;

      card.validUntil = newExp;
      card.duration = renewDur;
      card.status = "ACTIVE";
      card.ticks = { mon: false, tue: false, wed: false, thu: false, fri: false, sat: false, sun: false };
      card.notes = `Renewed for ${renewDur.replace('_', ' ')} by Accounts (${session.cashierName || "Bursar"}) on ${new Date().toLocaleDateString()}`;

      saveState();
      renderMealCardsTable();

      renewModal.style.display = "none";
      renewModal.classList.remove("open");
      showToast(`Meal Card ${card.cardNumber} successfully renewed until ${formatDateFriendly(newExp)}!`);
      activeRenewCardId = null;
    });
  }

  // Search & Filter listeners
  if (searchInput) searchInput.addEventListener("input", renderMealCardsTable);
  if (durationFilter) durationFilter.addEventListener("change", renderMealCardsTable);
  if (statusFilter) statusFilter.addEventListener("change", renderMealCardsTable);

  // Close Meal Badge Modal
  if (btnCloseBadge) {
    const badgeModal = document.getElementById("mealBadgeModal");
    btnCloseBadge.addEventListener("click", () => {
      if (badgeModal) {
        badgeModal.style.display = "none";
        badgeModal.classList.remove("open");
      }
    });
  }
}

function renderMealCardsTable() {
  const tbody = document.getElementById("mealCardsTableBody");
  if (!tbody) return;
  tbody.innerHTML = "";

  const cards = localData.mealCards || [];

  // Update Summary KPI Metrics with live expiry check
  let countTotal = cards.length;
  let countActive = 0;
  let countExpiring = 0;
  let countSuspended = 0;

  cards.forEach((c) => {
    const st = getMealCardStatus(c);
    if (st.code === "ACTIVE") countActive++;
    else if (st.code === "EXPIRING_SOON") countExpiring++;
    else if (st.code === "EXPIRED" || st.code === "SUSPENDED_ARREARS") countSuspended++;
  });

  const elTotal = document.getElementById("mealTotalCards");
  const elActive = document.getElementById("mealActiveCards");
  const elExpiring = document.getElementById("mealExpiringCards");
  const elSuspended = document.getElementById("mealSuspendedCards");

  if (elTotal) elTotal.textContent = countTotal;
  if (elActive) elActive.textContent = countActive;
  if (elExpiring) elExpiring.textContent = countExpiring;
  if (elSuspended) elSuspended.textContent = countSuspended;

  // Filter application
  const q = (document.getElementById("mealSearchInput")?.value || "").toLowerCase().trim();
  const durF = document.getElementById("mealDurationFilter")?.value || "ALL";
  const statusF = document.getElementById("mealStatusFilter")?.value || "ALL";

  const filtered = cards.filter((c) => {
    const matchesSearch =
      !q ||
      c.cardNumber.toLowerCase().includes(q) ||
      c.studentName.toLowerCase().includes(q) ||
      c.studentClass.toLowerCase().includes(q);

    const matchesDuration = durF === "ALL" || (c.duration || "1_MONTH") === durF;
    const cardStatus = getMealCardStatus(c);
    const matchesStatus = statusF === "ALL" || cardStatus.code === statusF;

    return matchesSearch && matchesDuration && matchesStatus;
  });

  const countEl = document.getElementById("mealFilteredCount");
  if (countEl) countEl.textContent = filtered.length;

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 28px;">No meal cards match your current search or filter options.</td></tr>`;
    return;
  }

  // Current day of week for highlight (0 = Sun, 1 = Mon, ..., 6 = Sat)
  const todayDayIndex = new Date().getDay();
  const dayKeyMap = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  const todayKey = dayKeyMap[todayDayIndex];

  filtered.forEach((card) => {
    const tr = document.createElement("tr");

    // Live Expiry status
    const expStatus = getMealCardStatus(card);

    // Student fee check
    const student = localData.students.find((s) => s.id === card.studentId);
    const balance = student ? Number(student.balance || 0) : 0;
    const paid = student ? Number(student.paidAmount || 0) : 0;

    let feeBadge = "";
    if (balance === 0) {
      feeBadge = `<span class="badge-soft" style="background: rgba(16,185,129,0.12); color: #10b981; font-weight: 700;">Cleared 100%</span>`;
    } else if (paid > 0) {
      feeBadge = `<span class="badge-soft" style="background: rgba(245,158,11,0.12); color: #d97706; font-weight: 700;">Partial (${formatCurrency(balance)})</span>`;
    } else {
      feeBadge = `<span class="badge-soft" style="background: rgba(239,68,68,0.12); color: #ef4444; font-weight: 700;">Arrears (${formatCurrency(balance)})</span>`;
    }

    // Duration label
    const durationLabels = {
      "1_WEEK": "1 Week (7d)",
      "2_WEEKS": "2 Weeks (14d)",
      "1_MONTH": "1 Month (30d)",
      "FULL_TERM": "Full Term (90d)",
      "CUSTOM": "Custom Period",
    };
    const durLabel = durationLabels[card.duration] || "1 Month (30d)";

    // Days of week tick strip (Mon - Sun)
    const ticks = card.ticks || {};
    const days = [
      { key: "mon", label: "M" },
      { key: "tue", label: "T" },
      { key: "wed", label: "W" },
      { key: "thu", label: "T" },
      { key: "fri", label: "F" },
      { key: "sat", label: "S" },
      { key: "sun", label: "S" },
    ];

    let ticksHtml = `<div class="weekly-tick-strip" title="Weekly Dining Days: Click day to tick">`;
    days.forEach((d) => {
      const isTicked = !!ticks[d.key];
      const isToday = d.key === todayKey;
      ticksHtml += `
        <div class="day-tick-chip ${isTicked ? "ticked" : ""} ${isToday ? "today-highlight" : ""}"
             onclick="toggleDayTick('${card.id}', '${d.key}')"
             title="${d.key.toUpperCase()}: Click to ${isTicked ? 'untick' : 'tick'} meal">
          ${isTicked ? "✓" : d.label}
        </div>
      `;
    });
    ticksHtml += `</div>`;

    // Plan display
    const planLabels = {
      BOARDING_FULL: "Boarding (3 Meals)",
      DAY_LUNCH: "Day Lunch Only",
      MILK_NUTRITION_AWARD: "Milk Nutrition Award",
      BURSARY_SUBSIDIZED: "Bursary Subsidized",
    };
    const planText = planLabels[card.planType] || card.planType;

    // Toggle button
    const isSuspended = card.status === "SUSPENDED_ARREARS";
    const lockActionText = isSuspended ? "Unlock" : "Lock";
    const lockClass = isSuspended ? "btn-primary" : "btn-outline text-rose";

    tr.innerHTML = `
      <td>
        <div style="font-family: var(--font-mono); font-weight: 800; color: #2563eb;">${card.cardNumber}</div>
        <div style="margin-top: 3px;"><span class="validity-duration-chip">${durLabel}</span></div>
      </td>
      <td>
        <div style="font-weight: 700; color: var(--text-primary);">${card.studentName}</div>
        <div style="font-size: 11px; color: var(--text-muted);">${card.studentClass}</div>
      </td>
      <td>
        <div style="font-size: 11px; color: var(--text-muted);">Issued: ${formatDateFriendly(card.startDate || card.issuedAt)}</div>
        <div style="font-weight: 700; color: ${expStatus.code === 'EXPIRED' ? 'var(--accent-rose)' : 'var(--text-primary)'};">
          Expires: ${formatDateFriendly(card.validUntil)}
        </div>
      </td>
      <td>${feeBadge}</td>
      <td>
        <div style="font-size: 12px; font-weight: 600;">${planText}</div>
        ${card.dailyMilkQuota > 0 ? `<span class="milk-pill-chip" style="margin-top: 3px;"><svg class="svg-icon" style="width: 10px; height: 10px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/></svg> ${card.dailyMilkQuota} Milk Can${card.dailyMilkQuota > 1 ? 's' : ''}/Day</span>` : ''}
      </td>
      <td>${ticksHtml}</td>
      <td>
        <span class="${expStatus.cssClass}">
          ${expStatus.label}
        </span>
      </td>
      <td>
        <div style="display: flex; gap: 5px; flex-wrap: wrap;">
          <button class="btn btn-outline btn-sm" onclick="openRenewMealModal('${card.id}')" title="Renew Meal Card (+1 Month or +1 Week)">
            <svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
            <span>Renew</span>
          </button>
          <button class="btn ${lockClass} btn-sm" onclick="toggleMealCardStatus('${card.id}')" title="${isSuspended ? 'Authorize card' : 'Lock card for arrears'}">
            ${lockActionText}
          </button>
          <button class="btn btn-outline btn-sm" onclick="printMealBadge('${card.id}')" title="Print Official Meal Card with 7-Day Tick Grid">
            <svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
            <span>Card</span>
          </button>
        </div>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

// Interactive day tick toggle
window.toggleDayTick = function (cardId, dayKey) {
  const card = localData.mealCards.find((c) => c.id === cardId);
  if (!card) return;

  if (!card.ticks) {
    card.ticks = { mon: false, tue: false, wed: false, thu: false, fri: false, sat: false, sun: false };
  }

  card.ticks[dayKey] = !card.ticks[dayKey];
  saveState();
  renderMealCardsTable();

  const dayNames = { mon: "Monday", tue: "Tuesday", wed: "Wednesday", thu: "Thursday", fri: "Friday", sat: "Saturday", sun: "Sunday" };
  const action = card.ticks[dayKey] ? "ticked (consumed)" : "unticked";
  showToast(`${card.studentName}: ${dayNames[dayKey]} meal ${action}.`);
};

// Open Renewal Modal
window.openRenewMealModal = function (cardId) {
  const card = localData.mealCards.find((c) => c.id === cardId);
  if (!card) return;

  activeRenewCardId = card.id;
  const modal = document.getElementById("renewMealModal");
  if (!modal) return;

  const elName = document.getElementById("renewStudentName");
  const elMeta = document.getElementById("renewStudentMeta");
  const elExp = document.getElementById("renewCurrentExpiry");
  const durSelect = document.getElementById("renewDurationSelect");
  const newExpInput = document.getElementById("renewNewExpiryDate");

  if (elName) elName.textContent = card.studentName;
  if (elMeta) elMeta.textContent = `${card.studentClass} • Card No: ${card.cardNumber}`;
  if (elExp) elExp.textContent = `Current Expiry: ${formatDateFriendly(card.validUntil)} (${getMealCardStatus(card).label})`;

  const baseDate = card.validUntil && new Date(card.validUntil) > new Date()
    ? card.validUntil
    : new Date().toISOString().slice(0, 10);

  if (durSelect && newExpInput) {
    durSelect.value = "1_MONTH";
    newExpInput.value = computeExpiryDate(baseDate, "1_MONTH");
  }

  modal.style.display = "flex";
  modal.classList.add("open");
};

// Global Lock / Unlock Status Toggle
window.toggleMealCardStatus = function (cardId) {
  const card = localData.mealCards.find((c) => c.id === cardId);
  if (!card) return;

  if (card.status !== "SUSPENDED_ARREARS") {
    card.status = "SUSPENDED_ARREARS";
    card.notes = `Locked for fee default by ${session.cashierName || "Bursar Accounts"}`;
    showToast(`Meal Card ${card.cardNumber} locked for fee arrears. Dining hall notified.`, "error");
  } else {
    card.status = "ACTIVE";
    card.notes = `Authorized by ${session.cashierName || "Bursar Accounts"} on ${new Date().toLocaleDateString()}`;
    showToast(`Meal Card ${card.cardNumber} unlocked and authorized!`);
  }

  saveState();
  renderMealCardsTable();
};

// Print Official Student Meal Card with 7-Day Tick Grid
window.printMealBadge = function (cardId) {
  const card = localData.mealCards.find((c) => c.id === cardId);
  if (!card) return;

  const modal = document.getElementById("mealBadgeModal");
  if (!modal) return;

  const durationLabels = {
    "1_WEEK": "1 WEEK (7 DAYS)",
    "2_WEEKS": "2 WEEKS (14 DAYS)",
    "1_MONTH": "1 MONTH (30 DAYS)",
    "FULL_TERM": "FULL ACADEMIC TERM",
    "CUSTOM": "CUSTOM VALIDITY PERIOD",
  };

  const planLabels = {
    BOARDING_FULL: "BOARDING FULL (3 MEALS)",
    DAY_LUNCH: "DAY SCHOLAR (LUNCH ONLY)",
    MILK_NUTRITION_AWARD: "MILK NUTRITION SCHEME",
    BURSARY_SUBSIDIZED: "BURSARY SUBSIDIZED DINING",
  };

  const elName = document.getElementById("badgeStudentName");
  const elClass = document.getElementById("badgeStudentClass");
  const elCardNo = document.getElementById("badgeCardNo");
  const elPlan = document.getElementById("badgePlanType");
  const elMilk = document.getElementById("badgeMilkQuota");
  const elBarcode = document.getElementById("badgeBarcodeText");
  const elIssuedBy = document.getElementById("badgeIssuedBy");
  const elSchoolName = document.getElementById("badgeSchoolName");
  const elDuration = document.getElementById("badgeDurationLabel");
  const elExpiry = document.getElementById("badgeExpiryDate");

  if (elName) elName.textContent = card.studentName;
  if (elClass) elClass.textContent = `Class: ${card.studentClass}`;
  if (elCardNo) elCardNo.textContent = card.cardNumber;
  if (elPlan) elPlan.textContent = planLabels[card.planType] || card.planType;
  if (elMilk) elMilk.textContent = card.dailyMilkQuota > 0 ? `${card.dailyMilkQuota} CAN${card.dailyMilkQuota > 1 ? "S" : ""} DAILY` : "NO MILK RATION";
  if (elBarcode) elBarcode.textContent = card.cardNumber;
  if (elIssuedBy) elIssuedBy.textContent = `${card.issuedBy || "Accounts & Bursar"} • Authorized`;
  if (elSchoolName) elSchoolName.textContent = systemSettings.schoolName;
  if (elDuration) elDuration.textContent = durationLabels[card.duration] || "1 MONTH (30 DAYS)";
  if (elExpiry) elExpiry.textContent = formatDateFriendly(card.validUntil).toUpperCase();

  // Populate weekly tick table body reflecting actual ticked state
  const tbodyTicks = document.getElementById("badgeWeeklyTicksBody");
  if (tbodyTicks) {
    const ticks = card.ticks || {};
    const fullDays = [
      { key: "mon", name: "Monday" },
      { key: "tue", name: "Tuesday" },
      { key: "wed", name: "Wednesday" },
      { key: "thu", name: "Thursday" },
      { key: "fri", name: "Friday" },
      { key: "sat", name: "Saturday" },
      { key: "sun", name: "Sunday" },
    ];

    tbodyTicks.innerHTML = "";
    fullDays.forEach((d) => {
      const isTicked = !!ticks[d.key];
      const isBoarding = card.planType === "BOARDING_FULL";
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><strong>${d.name}</strong></td>
        <td><span class="meal-tick-box ${isTicked && isBoarding ? "checked" : ""}"></span></td>
        <td><span class="meal-tick-box ${isTicked ? "checked" : ""}"></span></td>
        <td><span class="meal-tick-box ${isTicked && isBoarding ? "checked" : ""}"></span></td>
        <td style="color: #64748b;">${isTicked ? "Verified" : "_______"}</td>
      `;
      tbodyTicks.appendChild(tr);
    });
  }

  modal.style.display = "flex";
  modal.classList.add("open");
};

// ============================================================================
// 9. SHIFT REPORTS & RECONCILIATION SUMMARY
// ============================================================================
function setupReportsModule() {
  const btnRefresh = document.getElementById("btnRefreshCharts");
  if (btnRefresh) {
    btnRefresh.addEventListener("click", () => {
      renderReports();
      showToast("Shift audit visuals refreshed");
    });
  }
  renderReports();
}

function renderReports() {
  const repOpening = document.getElementById("repOpeningFloat");
  const repCollected = document.getElementById("repTotalCollected");
  const repExpenses = document.getElementById("repTotalExpenses");
  const repNet = document.getElementById("repNetDrawer");
  const repCollCount = document.getElementById("repCollectionCount");
  const repExpCount = document.getElementById("repExpenseCount");
  const channelRow = document.getElementById("channelBreakdownRow");

  const totalCollected = localData.receipts.reduce((acc, r) => acc + Number(r.amount || 0), 0);
  const totalExpenses = localData.expenses.reduce((acc, e) => acc + Number(e.amount || 0), 0);
  const cashCollected = localData.receipts
    .filter((r) => r.paymentMethod === "CASH")
    .reduce((acc, r) => acc + Number(r.amount || 0), 0);

  const netDrawer = session.startingFloat + cashCollected - totalExpenses;

  if (repOpening) repOpening.textContent = formatCurrency(session.startingFloat);
  if (repCollected) repCollected.textContent = formatCurrency(totalCollected);
  if (repExpenses) repExpenses.textContent = formatCurrency(totalExpenses);
  if (repNet) repNet.textContent = formatCurrency(netDrawer);
  if (repCollCount) repCollCount.textContent = `${localData.receipts.length} Receipts Issued`;
  if (repExpCount) repExpCount.textContent = `${localData.expenses.length} Vouchers Approved`;

  // Channel breakdown metrics
  const methods = ["CASH", "BANK_DEPOSIT", "MOBILE_MONEY", "POS_CARD", "CHEQUE"];
  const channelTotals = {};

  methods.forEach((m) => {
    channelTotals[m] = localData.receipts
      .filter((r) => r.paymentMethod === m)
      .reduce((acc, r) => acc + Number(r.amount || 0), 0);
  });

  if (channelRow) {
    channelRow.innerHTML = "";
    methods.forEach((m) => {
      const sum = channelTotals[m] || 0;
      const box = document.createElement("div");
      box.className = "channel-box";
      box.innerHTML = `
        <div class="ch-name">${m.replace("_", " ")}</div>
        <div class="ch-amt">${formatCurrency(sum)}</div>
      `;
      channelRow.appendChild(box);
    });
  }
}

// ============================================================================
// 8. SYSTEM SETTINGS & INSTITUTION CONFIGURATION MODULE
// ============================================================================
function setupSettingsModule() {
  const form = document.getElementById("fullSystemSettingsForm");
  const btnTopSave = document.getElementById("btnSaveSystemSettingsTop");
  const btnReset = document.getElementById("btnResetSettingsDefaults");
  const currencyPresetSelect = document.getElementById("cfgCurrencyPreset");
  const logoInput = document.getElementById("cfgLogoUrl");
  const btnExport = document.getElementById("btnExportDataJson");
  const btnImport = document.getElementById("btnImportDataJson");
  const fileImport = document.getElementById("fileImportBackup");

  // Currency Preset Change Handler
  if (currencyPresetSelect) {
    currencyPresetSelect.addEventListener("change", (e) => {
      const val = e.target.value;
      const symbolInput = document.getElementById("cfgCurrencySymbol");
      const decimalsSelect = document.getElementById("cfgDecimalPlaces");

      if (val === "UGX") {
        if (symbolInput) symbolInput.value = "UGX";
        if (decimalsSelect) decimalsSelect.value = "0";
      } else if (val === "USD") {
        if (symbolInput) symbolInput.value = "$";
        if (decimalsSelect) decimalsSelect.value = "2";
      } else if (val === "KES") {
        if (symbolInput) symbolInput.value = "KSh";
        if (decimalsSelect) decimalsSelect.value = "0";
      } else if (val === "RWF") {
        if (symbolInput) symbolInput.value = "RWF";
        if (decimalsSelect) decimalsSelect.value = "0";
      } else if (val === "EUR") {
        if (symbolInput) symbolInput.value = "€";
        if (decimalsSelect) decimalsSelect.value = "2";
      } else if (val === "GBP") {
        if (symbolInput) symbolInput.value = "£";
        if (decimalsSelect) decimalsSelect.value = "2";
      }
    });
  }

  // Live Logo Preview on Input
  if (logoInput) {
    logoInput.addEventListener("input", (e) => {
      const preview = document.getElementById("cfgLogoPreview");
      if (preview && e.target.value.trim()) {
        preview.src = e.target.value.trim();
      }
    });
  }

  // Workstation Theme Mode live switcher from Settings
  const themeSelect = document.getElementById("cfgThemeMode");
  if (themeSelect) {
    themeSelect.addEventListener("change", (e) => {
      applyTheme(e.target.value, true);
    });
  }

  // Save Settings Function
  const handleSaveSettings = (e) => {
    if (e && e.preventDefault) e.preventDefault();

    systemSettings.schoolName = document.getElementById("cfgSchoolName")?.value.trim() || systemSettings.schoolName;
    systemSettings.schoolShortName = document.getElementById("cfgSchoolShortName")?.value.trim() || systemSettings.schoolShortName;
    systemSettings.schoolSub = document.getElementById("cfgSchoolSub")?.value.trim() || systemSettings.schoolSub;
    systemSettings.schoolMotto = document.getElementById("cfgSchoolMotto")?.value.trim() || systemSettings.schoolMotto;
    systemSettings.logoUrl = document.getElementById("cfgLogoUrl")?.value.trim() || systemSettings.logoUrl;
    systemSettings.academicYear = document.getElementById("cfgAcademicYear")?.value.trim() || systemSettings.academicYear;
    systemSettings.activeTerm = document.getElementById("cfgActiveTerm")?.value || systemSettings.activeTerm;

    const themeVal = document.getElementById("cfgThemeMode")?.value || "light";
    systemSettings.themeMode = themeVal;
    applyTheme(themeVal, true);

    systemSettings.currencyPreset = document.getElementById("cfgCurrencyPreset")?.value || systemSettings.currencyPreset;
    systemSettings.currencySymbol = document.getElementById("cfgCurrencySymbol")?.value.trim() || systemSettings.currencySymbol;
    systemSettings.decimalPlaces = Number(document.getElementById("cfgDecimalPlaces")?.value || 0);
    systemSettings.defaultDrawerFloat = Number(document.getElementById("cfgDefaultFloat")?.value || 150000);

    systemSettings.receiptTitle = document.getElementById("cfgReceiptTitle")?.value.trim() || systemSettings.receiptTitle;
    systemSettings.receiptSub = document.getElementById("cfgReceiptSub")?.value.trim() || systemSettings.receiptSub;
    systemSettings.receiptFooter = document.getElementById("cfgReceiptFooter")?.value.trim() || systemSettings.receiptFooter;
    systemSettings.receiptWidth = document.getElementById("cfgReceiptWidth")?.value || systemSettings.receiptWidth;

    const newMachineId = document.getElementById("cfgMachineId")?.value.trim();
    if (newMachineId) {
      systemSettings.machineId = newMachineId;
      CONFIG.machineId = newMachineId;
      localStorage.setItem("wf_machine_id", newMachineId);
    }

    const newServerUrl = document.getElementById("cfgServerUrl")?.value.trim();
    if (newServerUrl) {
      systemSettings.serverUrl = newServerUrl;
      CONFIG.serverUrl = newServerUrl;
      localStorage.setItem("wf_server_url", newServerUrl);
    }

    // Persist to local storage
    localStorage.setItem("wf_system_settings", JSON.stringify(systemSettings));

    // Reapply branding and re-render all currency displays
    applySystemSettings();
    renderStudentList();
    renderReceipts();
    renderFeesTable();
    renderExpenses();
    renderPayrollTable();
    updateDrawerFloatDisplay();
    renderDashboard();
    renderReports();

    showToast("System settings successfully saved and applied!");
  };

  if (form) form.addEventListener("submit", handleSaveSettings);
  if (btnTopSave) btnTopSave.addEventListener("click", handleSaveSettings);

  // Reset to Defaults
  if (btnReset) {
    btnReset.addEventListener("click", () => {
      if (confirm("Reset all institution profile, branding, and currency configurations to default Wellstar Bright settings?")) {
        systemSettings = { ...DEFAULT_SYSTEM_SETTINGS };
        localStorage.setItem("wf_system_settings", JSON.stringify(systemSettings));
        applyTheme("light", true);
        applySystemSettings();
        renderStudentList();
        renderReceipts();
        renderFeesTable();
        renderExpenses();
        renderPayrollTable();
        updateDrawerFloatDisplay();
        renderDashboard();
        renderReports();
        showToast("Restored official school default settings.");
      }
    });
  }

  // Backup Export
  if (btnExport) {
    btnExport.addEventListener("click", () => {
      const backupData = {
        exportedAt: new Date().toISOString(),
        version: "2.0.0",
        systemSettings,
        localData,
      };
      const jsonStr = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Wellstar-Finance-Backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast("Offline backup JSON exported successfully!");
    });
  }

  // Backup Import
  if (btnImport && fileImport) {
    btnImport.addEventListener("click", () => fileImport.click());
    fileImport.addEventListener("change", (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target?.result);
          if (imported.localData) {
            localData.students = imported.localData.students || localData.students;
            localData.receipts = imported.localData.receipts || localData.receipts;
            localData.expenses = imported.localData.expenses || localData.expenses;
            localData.payroll = imported.localData.payroll || localData.payroll;
            localData.bankTransactions = imported.localData.bankTransactions || localData.bankTransactions;
            localData.syncQueue = imported.localData.syncQueue || localData.syncQueue;
            localData.receiptCounter = imported.localData.receiptCounter || localData.receiptCounter;
            localData.mealCards = imported.localData.mealCards || localData.mealCards;
          }
          if (imported.systemSettings) {
            systemSettings = { ...DEFAULT_SYSTEM_SETTINGS, ...imported.systemSettings };
            localStorage.setItem("wf_system_settings", JSON.stringify(systemSettings));
          }
          saveState();
          applySystemSettings();
          renderStudentList();
          renderReceipts();
          renderFeesTable();
          renderExpenses();
          renderPayrollTable();
          renderBankModule();
          renderMealCardsTable();
          updateDrawerFloatDisplay();
          renderDashboard();
          renderReports();
          showToast("Offline database imported and synced!");
        } catch (err) {
          alert("Invalid backup file: " + err.message);
        }
      };
      reader.readAsText(file);
    });
  }
}

// ============================================================================
// 10. SYNC OUTBOX & STATE PERSISTENCE
// ============================================================================
function renderQueue() {
  const tbody = document.getElementById("queueTableBody");
  if (!tbody) return;
  tbody.innerHTML = "";

  if (localData.syncQueue.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 20px;">All records synced to Central Super Admin PostgreSQL database.</td></tr>';
    updateQueueCount();
    return;
  }

  localData.syncQueue.forEach((q) => {
    const tr = document.createElement("tr");
    const id = q.payload?.receiptNumber || q.payload?.voucherNumber || "RECORD";
    const amt = q.payload?.amount ? formatCurrency(q.payload.amount) : "-";
    const date = new Date(q.payload?.issuedAt || q.payload?.expenseDate || Date.now()).toLocaleTimeString();

    tr.innerHTML = `
      <td><span class="badge-soft">${q.type}</span></td>
      <td style="font-family: monospace; font-weight: 700;">${id}</td>
      <td style="font-weight: 700; color: #fff;">${amt}</td>
      <td>${date}</td>
      <td><span style="color: var(--accent-amber); font-weight: 700;">Pending Sync</span></td>
    `;
    tbody.appendChild(tr);
  });
  updateQueueCount();
}

function updateQueueCount() {
  const countEl = document.getElementById("queueCount");
  if (countEl) countEl.textContent = localData.syncQueue.length;
}

function saveState() {
  localStorage.setItem("wf_students", JSON.stringify(localData.students));
  localStorage.setItem("wf_receipts", JSON.stringify(localData.receipts));
  localStorage.setItem("wf_expenses", JSON.stringify(localData.expenses));
  localStorage.setItem("wf_payroll", JSON.stringify(localData.payroll));
  localStorage.setItem("wf_bank_transactions", JSON.stringify(localData.bankTransactions || []));
  localStorage.setItem("wf_meal_cards", JSON.stringify(localData.mealCards || []));
  localStorage.setItem("wf_sync_queue", JSON.stringify(localData.syncQueue));
  localStorage.setItem("wf_rcp_counter", localData.receiptCounter.toString());
  updateQueueCount();
}

// ============================================================================
// AUTO-SYNC WORKER (BIDIRECTIONAL CENTRAL SYNC)
// ============================================================================
async function attemptSync(isManual = false) {
  const dot = document.getElementById("statusDot");
  const text = document.getElementById("statusText");
  const lockDot = document.getElementById("lockStatusDot");
  const lockoutBanner = document.getElementById("remoteLockoutBanner");

  try {
    const receiptsToSync = localData.syncQueue
      .filter((q) => q.type === "RECEIPT")
      .map((q) => q.payload);

    const expensesToSync = localData.syncQueue
      .filter((q) => q.type === "EXPENSE")
      .map((q) => q.payload);

    const res = await fetch(`${CONFIG.serverUrl}/api/finance/sync`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-machine-id": CONFIG.machineId,
        "x-api-key": "desktop_secure_token",
      },
      body: JSON.stringify({
        batchId: "BATCH-" + Date.now(),
        offlineReceipts: receiptsToSync,
        offlineExpenses: expensesToSync,
        offlineMealCards: localData.mealCards || [],
      }),
    });

    if (res.status === 403) {
      session.isRemoteLocked = true;
      if (lockoutBanner) lockoutBanner.style.display = "block";
      document.getElementById("terminalLockOverlay").style.display = "flex";
      throw new Error("Workstation suspended by Super Admin");
    } else {
      session.isRemoteLocked = false;
      if (lockoutBanner) lockoutBanner.style.display = "none";
    }

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Server rejected sync");
    }

    const data = await res.json();

    // Clear synced items
    localData.syncQueue = [];
    localData.receipts.forEach((r) => (r.isOfflineSync = false));

    // Ingest fresh student roster from central server
    if (data.freshData?.students?.length > 0) {
      localData.students = data.freshData.students.map((s) => ({
        id: s.id,
        name: s.name,
        class: s.class,
        totalInvoiced: s.invoices && s.invoices.length > 0 ? s.invoices[0].totalDue : 450000,
        paidAmount: s.invoices && s.invoices.length > 0 ? s.invoices[0].paidAmount : 0,
        balance: s.invoices && s.invoices.length > 0 ? s.invoices[0].balance : 0,
        invoiceId: s.invoices && s.invoices.length > 0 ? s.invoices[0].id : null,
        term: s.invoices && s.invoices.length > 0 ? s.invoices[0].term : "Term 1",
      }));
    }

    // Ingest fresh meal cards from central server if present
    if (data.freshData?.mealCards?.length > 0) {
      localData.mealCards = data.freshData.mealCards.map((c) => ({
        id: c.id,
        cardNumber: c.cardNumber,
        studentId: c.studentId,
        studentName: c.student?.name || "Student",
        studentClass: c.student?.class?.name || "General",
        planType: c.planType || "DAY_LUNCH",
        dailyMilkQuota: c.milkQuota || 0,
        duration: "1_MONTH",
        startDate: c.createdAt ? new Date(c.createdAt).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
        validUntil: c.validUntil ? new Date(c.validUntil).toISOString().slice(0, 10) : "",
        status: c.status || "ACTIVE",
        ticks: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: false, sun: false },
        term: "Term 1 2026",
        issuedBy: "Central Server",
        issuedAt: c.createdAt ? new Date(c.createdAt).toISOString() : new Date().toISOString(),
        notes: c.allergies || "Synced from Central Server",
      }));
    }

    saveState();

    isOnline = true;
    if (dot) {
      dot.className = "status-dot online";
      text.textContent = "Online • Synced with Central Server";
    }
    if (lockDot) lockDot.className = "status-indicator online";
    const lockText = document.getElementById("lockStatusText");
    if (lockText) lockText.textContent = "Central Server Online";

    renderStudentList();
    renderFeesTable();
    renderMealCardsTable();
    renderQueue();
    renderDashboard();
    renderReports();
    if (isManual) showToast("Bidirectional sync completed with Central Server!");
  } catch (err) {
    console.error("Central Sync Error:", err);
    isOnline = false;
    if (dot) {
      dot.className = "status-dot offline";
      text.textContent = `Offline Resilient (${localData.syncQueue.length} queued)`;
    }
    if (lockDot) lockDot.className = "status-indicator offline";
    const lockText = document.getElementById("lockStatusText");
    if (lockText) lockText.textContent = "Offline Mode";
    if (isManual) {
      const msg = err.message && !err.message.includes("Failed to fetch") ? err.message : "Central Server (port 3000) not responding. Running in resilient Offline Mode.";
      showToast(msg, "error");
    }
  }
}

// Start application when DOM is loaded
window.addEventListener("DOMContentLoaded", initApp);
