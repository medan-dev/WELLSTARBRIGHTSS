import prisma from "@/lib/prisma";
import { AccountClass, MealPlanType, MealCardStatus } from "../../generated/prisma/client";

// ============================================================================
// 0. ENSURE WELLSTAR BRIGHT FINANCIAL DATASET IS SEEDED IN POSTGRESQL
// ============================================================================
export async function ensureWellstarFinanceSeeded() {
  try {
    // 1. Initialize Chart of Accounts if empty
    await initializeStandardChartOfAccounts();

    // Ensure realistic cash & bank balances
    await prisma.account.updateMany({
      where: { code: "1010" },
      data: { balance: 2650000 }, // Cash drawer float + cash collections
    });
    await prisma.account.updateMany({
      where: { code: "1020" },
      data: { balance: 2000000 }, // Petty cash float
    });
    await prisma.account.updateMany({
      where: { code: "1030" },
      data: { balance: 42500000 }, // Stanbic Bank Operating A/C
    });
    await prisma.account.updateMany({
      where: { code: "1040" },
      data: { balance: 8400000 }, // Mobile Money merchant float
    });

    // 2. Seed Workstations if empty
    const workstationCount = await prisma.workstation.count();
    if (workstationCount === 0) {
      await prisma.workstation.createMany({
        data: [
          {
            machineId: "WS-BURSAR-01",
            machineName: "Counter Workstation 01 (Front Desk)",
            assignedCashier: "Joseph Kato",
            apiKeyHash: "ws_pos_sync_key_secure_2026",
            isBlocked: false,
            lastSyncAt: new Date(),
            pendingRecords: 0,
            clientVersion: "1.0.0",
          },
          {
            machineId: "WS-BURSAR-HEAD",
            machineName: "Chief Bursar Executive Terminal",
            assignedCashier: "CPA Sarah Namubiru",
            apiKeyHash: "ws_pos_sync_key_secure_2026",
            isBlocked: false,
            lastSyncAt: new Date(),
            pendingRecords: 0,
            clientVersion: "1.0.0",
          },
        ],
      });
    }

    // 3. Seed Students & Invoices if empty
    const invoiceCount = await prisma.studentFeeInvoice.count();
    if (invoiceCount === 0) {
      const studentRoster = [
        { id: "S-1042", name: "Kato Joseph", className: "S.1A", grade: "S.1", invoiceNum: "INV-2026-T1-1042", fee: 450000, paid: 0, status: "UNPAID" },
        { id: "S-1043", name: "Nansubuga Mary", className: "S.1A", grade: "S.1", invoiceNum: "INV-2026-T1-1043", fee: 450000, paid: 200000, status: "PARTIAL" },
        { id: "S-1044", name: "Mukasa Peter", className: "S.1A", grade: "S.1", invoiceNum: "INV-2026-T1-1044", fee: 600000, paid: 0, status: "UNPAID" },
        { id: "S-1045", name: "Babirye Sarah", className: "S.4 West", grade: "S.4", invoiceNum: "INV-2026-T1-1045", fee: 450000, paid: 300000, status: "PARTIAL" },
        { id: "S-1046", name: "Okello Denis", className: "S.5 Sci", grade: "S.5", invoiceNum: "INV-2026-T1-1046", fee: 550000, paid: 550000, status: "PAID" },
        { id: "S-1047", name: "Namagembe Grace", className: "S.6 Arts", grade: "S.6", invoiceNum: "INV-2026-T1-1047", fee: 500000, paid: 350000, status: "PARTIAL" },
        { id: "S-1048", name: "Kintu Moses", className: "S.2A", grade: "S.2", invoiceNum: "INV-2026-T1-1048", fee: 450000, paid: 0, status: "UNPAID" },
        { id: "S-1049", name: "Nalubega Prossy", className: "S.2B", grade: "S.2", invoiceNum: "INV-2026-T1-1049", fee: 450000, paid: 450000, status: "PAID" },
        { id: "S-1050", name: "Opolot Emmanuel", className: "S.3 East", grade: "S.3", invoiceNum: "INV-2026-T1-1050", fee: 500000, paid: 250000, status: "PARTIAL" },
        { id: "S-1051", name: "Akello Joan", className: "S.3 West", grade: "S.3", invoiceNum: "INV-2026-T1-1051", fee: 450000, paid: 150000, status: "PARTIAL" },
        { id: "S-1052", name: "Walusimbi David", className: "S.4 East", grade: "S.4", invoiceNum: "INV-2026-T1-1052", fee: 450000, paid: 0, status: "UNPAID" },
        { id: "S-1053", name: "Nakato Betty", className: "S.5 Arts", grade: "S.5", invoiceNum: "INV-2026-T1-1053", fee: 550000, paid: 550000, status: "PAID" },
      ];

      for (let i = 0; i < studentRoster.length; i++) {
        const item = studentRoster[i];

        // Ensure class exists
        let cls = await prisma.class.findFirst({ where: { name: item.className } });
        if (!cls) {
          cls = await prisma.class.create({
            data: { name: item.className, grade: item.grade },
          });
        }

        // Ensure student exists
        let student = await prisma.student.findFirst({ where: { name: item.name } });
        if (!student) {
          const email = `${item.name.toLowerCase().replace(/[^a-z0-9]/g, ".")}@student.wellstarbright.sc.ug`;
          student = await prisma.student.create({
            data: {
              name: item.name,
              email,
              password: "student123",
              classId: cls.id,
            },
          });
        }

        // Create invoice
        const inv = await prisma.studentFeeInvoice.create({
          data: {
            invoiceNumber: item.invoiceNum,
            studentId: student.id,
            academicYear: "2026",
            term: "Term 1",
            subtotal: item.fee,
            discountAmount: 0,
            totalDue: item.fee,
            paidAmount: item.paid,
            balance: item.fee - item.paid,
            status: item.status,
            dueDate: new Date("2026-04-15"),
          },
        });

        // Create payment receipt if paidAmount > 0
        if (item.paid > 0) {
          const methods = ["CASH", "MOBILE_MONEY", "BANK_DEPOSIT", "CASH", "CASH", "CASH", "CASH", "POS_CARD"];
          const method = methods[i % methods.length];
          const cashier = method === "BANK_DEPOSIT" || method === "POS_CARD" ? "CPA Sarah Namubiru" : "Joseph Kato";

          await prisma.paymentReceipt.create({
            data: {
              receiptNumber: `RCP-2026-0010${i + 1}`,
              invoiceId: inv.id,
              studentId: student.id,
              amount: item.paid,
              paymentMethod: method,
              referenceNo: method === "CASH" ? undefined : `REF-WBSS-90${i + 1}`,
              cashierName: cashier,
              workstationId: "WS-BURSAR-01",
              isOfflineSync: false,
              issuedAt: new Date(Date.now() - (12 - i) * 86400000),
              notes: `Official Term 1 Tuition Collection — ${item.name}`,
            },
          });
        }
      }
    }

    // 4. Seed Expenses if empty
    const expenseCount = await prisma.expenseRecord.count();
    if (expenseCount === 0) {
      const expensesList = [
        {
          voucherNumber: "PV-2026-WS01-101",
          paidTo: "Umeme Uganda Ltd",
          department: "Administration",
          category: "Electricity Bill",
          amount: 350000,
          paymentMethod: "BANK_TRANSFER",
          description: "March campus electricity grid power bill for main academic & laboratory blocks",
          recordedBy: "CPA Sarah Namubiru",
          workstationId: "WS-BURSAR-HEAD",
          expenseDate: new Date("2026-03-24T10:15:00Z"),
        },
        {
          voucherNumber: "PV-2026-WS01-102",
          paidTo: "Mukwano Wholesalers Mukono",
          department: "Kitchen & Food",
          category: "Kitchen Food Supplies",
          amount: 280000,
          paymentMethod: "CASH",
          description: "500kg Posho & Beans supply for boarding student dining hall meals",
          recordedBy: "Joseph Kato",
          workstationId: "WS-BURSAR-01",
          expenseDate: new Date("2026-03-25T11:30:00Z"),
        },
        {
          voucherNumber: "PV-2026-WS01-103",
          paidTo: "TotalEnergies Mukono",
          department: "Transport & Bus",
          category: "Diesel & Fuel",
          amount: 120000,
          paymentMethod: "CASH",
          description: "School Bus diesel refill for student daily transit route",
          recordedBy: "Joseph Kato",
          workstationId: "WS-BURSAR-01",
          expenseDate: new Date("2026-03-26T08:45:00Z"),
        },
        {
          voucherNumber: "PV-2026-WS01-104",
          paidTo: "Crown Publishers Ltd",
          department: "Science & Academics",
          category: "Stationery & Printing",
          amount: 180000,
          paymentMethod: "MOBILE_MONEY",
          description: "Term 1 Mid-Term Examination answer booklets and assessment sheets",
          recordedBy: "CPA Sarah Namubiru",
          workstationId: "WS-BURSAR-HEAD",
          expenseDate: new Date("2026-03-27T14:20:00Z"),
        },
      ];

      for (const exp of expensesList) {
        await prisma.expenseRecord.create({
          data: {
            ...exp,
            approvalStatus: "APPROVED",
          },
        });
      }
    }

    // 5. Seed Staff Payroll if empty
    const payrollCount = await prisma.staffPayrollRecord.count();
    if (payrollCount === 0) {
      const payrollStaff = [
        { name: "Sserwadda Ivan", role: "Head of Mathematics", email: "sserwadda.ivan@wellstarbright.sc.ug", gross: 1450000, base: 1200000, housing: 150000, transport: 100000, paye: 337000, nssf: 72500, net: 1040500, ref: "PAY-2026-MAR-01" },
        { name: "Kemigisha Fiona", role: "English Literature Teacher", email: "kemigisha.fiona@wellstarbright.sc.ug", gross: 1250000, base: 1050000, housing: 100000, transport: 100000, paye: 277000, nssf: 62500, net: 910500, ref: "PAY-2026-MAR-02" },
        { name: "Nagawa Christine", role: "Biology & Head of Sciences", email: "nagawa.christine@wellstarbright.sc.ug", gross: 1350000, base: 1150000, housing: 100000, transport: 100000, paye: 307000, nssf: 67500, net: 975500, ref: "PAY-2026-MAR-03" },
        { name: "Ssekandi Isaac", role: "Computer Studies & ICT", email: "ssekandi.isaac@wellstarbright.sc.ug", gross: 1150000, base: 1000000, housing: 80000, transport: 70000, paye: 247000, nssf: 57500, net: 845500, ref: "PAY-2026-MAR-04" },
        { name: "Opio Daniel", role: "History & CRE Teacher", email: "opio.daniel@wellstarbright.sc.ug", gross: 980000, base: 850000, housing: 70000, transport: 60000, paye: 196000, nssf: 49000, net: 735000, ref: "PAY-2026-MAR-05" },
      ];

      for (const st of payrollStaff) {
        let teacher = await prisma.teacher.findFirst({ where: { name: st.name } });
        if (!teacher) {
          teacher = await prisma.teacher.create({
            data: {
              name: st.name,
              email: st.email,
              password: "password123",
              role: st.role,
            },
          });
        }

        await prisma.staffPayrollRecord.create({
          data: {
            teacherId: teacher.id,
            month: "March",
            year: "2026",
            baseSalary: st.base,
            housingAllowance: st.housing,
            transportAllowance: st.transport,
            otherAllowances: 0,
            grossSalary: st.gross,
            payeTax: st.paye,
            nssfEmployee: st.nssf,
            nssfEmployer: st.nssf * 2,
            totalDeductions: st.paye + st.nssf,
            netSalary: st.net,
            status: "PAID",
            paymentDate: new Date("2026-03-25"),
            payslipRef: st.ref,
          },
        });
      }
    }

    // 6. Seed Meal Cards if empty
    const mealCardCount = await prisma.mealCard.count();
    if (mealCardCount === 0) {
      const mealCardsToSeed = [
        { studentName: "Okello Denis", cardNum: "MC-2026-1049", plan: MealPlanType.BOARDING_FULL, quota: 3, status: MealCardStatus.ACTIVE, notes: "Standard 1-Month Boarding Meal Card. Fee cleared 100%." },
        { studentName: "Babirye Sarah", cardNum: "MC-2026-1050", plan: MealPlanType.DAY_LUNCH, quota: 1, status: MealCardStatus.ACTIVE, notes: "1-Week Day Scholar Meal Card. Renewal required upon next fee payment." },
        { studentName: "Kato Joseph", cardNum: "MC-2026-1051", plan: MealPlanType.BOARDING_FULL, quota: 3, status: MealCardStatus.EXPIRED, notes: "1-Month Card EXPIRED. Arrears balance of UGX 450,000 pending clearance." },
        { studentName: "Namagembe Grace", cardNum: "MC-2026-1052", plan: MealPlanType.SPECIAL_DIET, quota: 3, status: MealCardStatus.ACTIVE, notes: "1-Month Special Dietary Meal Pass." },
      ];

      for (const mc of mealCardsToSeed) {
        const student = await prisma.student.findFirst({ where: { name: mc.studentName } });
        if (student) {
          const validUntil = new Date();
          validUntil.setDate(validUntil.getDate() + (mc.status === MealCardStatus.EXPIRED ? -5 : 25));

          await prisma.mealCard.create({
            data: {
              cardNumber: mc.cardNum,
              studentId: student.id,
              planType: mc.plan,
              dailyQuota: mc.quota,
              status: mc.status,
              allergies: mc.notes,
              validUntil,
            },
          });
        }
      }
    }
  } catch (err) {
    console.error("ensureWellstarFinanceSeeded error:", err);
  }
}

// ============================================================================
// 1. INITIALIZE STANDARD CHART OF ACCOUNTS (DOUBLE-ENTRY)
// ============================================================================
export async function initializeStandardChartOfAccounts() {
  const existing = await prisma.account.count();
  if (existing > 0) return { message: "Accounts already initialized", count: existing };

  const standardAccounts = [
    // 1000s: ASSETS
    { code: "1010", name: "Main Cash Drawer (Bursar Counter)", accountClass: AccountClass.ASSET, isBankOrCash: true, balance: 0 },
    { code: "1020", name: "Petty Cash Float", accountClass: AccountClass.ASSET, isBankOrCash: true, balance: 0 },
    { code: "1030", name: "School Stanbic Operating Bank A/C", accountClass: AccountClass.ASSET, isBankOrCash: true, balance: 0 },
    { code: "1040", name: "School Mobile Money Merchant Account", accountClass: AccountClass.ASSET, isBankOrCash: true, balance: 0 },
    { code: "1200", name: "Accounts Receivable (Student Fee Arrears)", accountClass: AccountClass.ASSET, isBankOrCash: false, balance: 0 },
    { code: "1510", name: "Fixed Assets - Buildings & Infrastructure", accountClass: AccountClass.ASSET, isBankOrCash: false, balance: 0 },
    { code: "1520", name: "Fixed Assets - Motor Vehicles & Buses", accountClass: AccountClass.ASSET, isBankOrCash: false, balance: 0 },
    { code: "1530", name: "Fixed Assets - IT & Science Equipment", accountClass: AccountClass.ASSET, isBankOrCash: false, balance: 0 },
    { code: "1590", name: "Accumulated Depreciation", accountClass: AccountClass.ASSET, isBankOrCash: false, balance: 0 },

    // 2000s: LIABILITIES
    { code: "2010", name: "Accounts Payable (Suppliers & Vendors)", accountClass: AccountClass.LIABILITY, isBankOrCash: false, balance: 0 },
    { code: "2020", name: "Accrued Staff Payroll Liabilities", accountClass: AccountClass.LIABILITY, isBankOrCash: false, balance: 0 },
    { code: "2030", name: "Statutory Tax Payable (PAYE)", accountClass: AccountClass.LIABILITY, isBankOrCash: false, balance: 0 },
    { code: "2040", name: "Statutory Social Security Payable (NSSF)", accountClass: AccountClass.LIABILITY, isBankOrCash: false, balance: 0 },
    { code: "2050", name: "Prepaid Tuition / Unearned Fee Revenue", accountClass: AccountClass.LIABILITY, isBankOrCash: false, balance: 0 },

    // 3000s: EQUITY
    { code: "3010", name: "School Capital / Accumulated General Fund", accountClass: AccountClass.EQUITY, isBankOrCash: false, balance: 0 },
    { code: "3020", name: "Retained Surplus / Current Year Earnings", accountClass: AccountClass.EQUITY, isBankOrCash: false, balance: 0 },

    // 4000s: REVENUE
    { code: "4010", name: "Tuition & Academic Fees", accountClass: AccountClass.REVENUE, isBankOrCash: false, balance: 0 },
    { code: "4020", name: "Boarding & Catering Fees", accountClass: AccountClass.REVENUE, isBankOrCash: false, balance: 0 },
    { code: "4030", name: "Examination & Assessment Levies", accountClass: AccountClass.REVENUE, isBankOrCash: false, balance: 0 },
    { code: "4040", name: "Uniforms, Books & Stationery Sales", accountClass: AccountClass.REVENUE, isBankOrCash: false, balance: 0 },
    { code: "4050", name: "School Transport Fees", accountClass: AccountClass.REVENUE, isBankOrCash: false, balance: 0 },
    { code: "4900", name: "Other Donations, Grants & Sundry Income", accountClass: AccountClass.REVENUE, isBankOrCash: false, balance: 0 },

    // 5000s: EXPENSES
    { code: "5010", name: "Academic Staff Salaries & Allowances", accountClass: AccountClass.EXPENSE, isBankOrCash: false, balance: 0 },
    { code: "5020", name: "Support Staff Salaries & Wages", accountClass: AccountClass.EXPENSE, isBankOrCash: false, balance: 0 },
    { code: "5030", name: "Employer NSSF Contributions (10%)", accountClass: AccountClass.EXPENSE, isBankOrCash: false, balance: 0 },
    { code: "5110", name: "Kitchen & Student Food Provisions", accountClass: AccountClass.EXPENSE, isBankOrCash: false, balance: 0 },
    { code: "5120", name: "Water, Electricity & Generator Fuel", accountClass: AccountClass.EXPENSE, isBankOrCash: false, balance: 0 },
    { code: "5130", name: "Classroom, Books & Laboratory Consumables", accountClass: AccountClass.EXPENSE, isBankOrCash: false, balance: 0 },
    { code: "5140", name: "Vehicle Fuel, Repairs & Bus Servicing", accountClass: AccountClass.EXPENSE, isBankOrCash: false, balance: 0 },
    { code: "5150", name: "Repairs, Maintenance & Campus Upkeep", accountClass: AccountClass.EXPENSE, isBankOrCash: false, balance: 0 },
    { code: "5160", name: "Internet, Telecoms & IT Software Subscriptions", accountClass: AccountClass.EXPENSE, isBankOrCash: false, balance: 0 },
    { code: "5170", name: "Depreciation Expense", accountClass: AccountClass.EXPENSE, isBankOrCash: false, balance: 0 },
  ];

  for (const acct of standardAccounts) {
    await prisma.account.create({ data: acct });
  }

  return { message: "Standard chart of accounts created", count: standardAccounts.length };
}

// ============================================================================
// 2. BALANCED JOURNAL HELPER (DOUBLE-ENTRY TRANSACTION)
// ============================================================================
export async function createBalancedJournalEntry({
  date,
  reference,
  description,
  lines,
}: {
  date: Date;
  reference?: string;
  description: string;
  lines: Array<{
    accountCode: string;
    debit?: number;
    credit?: number;
    description?: string;
  }>;
}) {
  const totalDebit = lines.reduce((acc, l) => acc + (l.debit || 0), 0);
  const totalCredit = lines.reduce((acc, l) => acc + (l.credit || 0), 0);

  // Floating point precision check: difference must be < 0.01
  if (Math.abs(totalDebit - totalCredit) > 0.01) {
    throw new Error(`Double-entry mismatch! Total Debits (${totalDebit}) must equal Total Credits (${totalCredit})`);
  }

  const entryNumber = `JRN-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

  // Find accounts
  const created = await prisma.journalEntry.create({
    data: {
      entryNumber,
      date,
      reference,
      description,
      isPosted: true,
      lines: {
        create: await Promise.all(
          lines.map(async (line) => {
            const acct = await prisma.account.findUnique({ where: { code: line.accountCode } });
            if (!acct) throw new Error(`Account code ${line.accountCode} not found in Chart of Accounts`);
            
            // Adjust balance: Assets/Expenses increase with Debit; Liab/Equity/Rev increase with Credit
            let delta = 0;
            if (acct.accountClass === AccountClass.ASSET || acct.accountClass === AccountClass.EXPENSE) {
              delta = (line.debit || 0) - (line.credit || 0);
            } else {
              delta = (line.credit || 0) - (line.debit || 0);
            }

            await prisma.account.update({
              where: { id: acct.id },
              data: { balance: { increment: delta } },
            });

            return {
              accountId: acct.id,
              debit: line.debit || 0,
              credit: line.credit || 0,
              description: line.description || description,
            };
          })
        ),
      },
    },
    include: { lines: true },
  });

  return created;
}

// ============================================================================
// 3. AUDIT LOGGING HELPER
// ============================================================================
export async function logFinanceAudit({
  action,
  actorName,
  actorRole = "SUPER_ADMIN",
  workstationId = "SERVER-CENTRAL",
  details,
  ipAddress,
}: {
  action: string;
  actorName: string;
  actorRole?: string;
  workstationId?: string;
  details: Record<string, any>;
  ipAddress?: string;
}) {
  try {
    return await prisma.financeAuditLog.create({
      data: {
        action,
        actorName,
        actorRole,
        workstationId,
        ipAddress: ipAddress || null,
        details: JSON.stringify(details),
      },
    });
  } catch (err) {
    console.error("Failed to write audit log:", err);
  }
}

// ============================================================================
// 4. ENTERPRISE AUTHENTICATION & ROLE-BASED ACCESS CONTROL (RBAC)
// ============================================================================
// 4. ROLE-BASED ACCESS CONTROL (RBAC) & MULTI-USER WORKSTATIONS
// ============================================================================
export * from "./finance-users";
import { ENTERPRISE_FINANCE_USERS, FinanceAuthUser } from "./finance-users";

export async function verifyFinanceUser({
  email,
  pin,
  role,
}: {
  email?: string;
  pin?: string;
  role?: string;
}) {
  let user: FinanceAuthUser | undefined;

  if (pin) {
    user = ENTERPRISE_FINANCE_USERS.find((u) => u.pin === pin);
  } else if (email) {
    user = ENTERPRISE_FINANCE_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
  } else if (role) {
    user = ENTERPRISE_FINANCE_USERS.find((u) => u.role === role);
  }

  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    title: user.title,
    permissions: user.permissions,
    workstationId: user.workstationId,
  };
}

// ============================================================================
// 5. TAX & STATUTORY COMPLIANCE COMPUTATION ENGINE (UGANDA URA / NSSF)
// ============================================================================

/**
 * Calculates Uganda PAYE based on standard monthly graduated tax brackets.
 */
export function calculateUgandaPAYE(grossMonthlyPay: number): number {
  if (grossMonthlyPay <= 235000) {
    return 0;
  } else if (grossMonthlyPay <= 335000) {
    return (grossMonthlyPay - 235000) * 0.1;
  } else if (grossMonthlyPay <= 410000) {
    return 10000 + (grossMonthlyPay - 335000) * 0.2;
  } else {
    let paye = 25000 + (grossMonthlyPay - 410000) * 0.3;
    if (grossMonthlyPay > 10000000) {
      paye += (grossMonthlyPay - 10000000) * 0.1;
    }
    return Math.round(paye);
  }
}

/**
 * Calculates NSSF: 5% employee, 10% employer
 */
export function calculateUgandaNSSF(grossMonthlyPay: number) {
  const employee = Math.round(grossMonthlyPay * 0.05);
  const employer = Math.round(grossMonthlyPay * 0.10);
  return { employee, employer, total: employee + employer };
}

/**
 * Calculates Withholding Tax (6% on local supplier invoices)
 */
export function calculateUgandaWHT(invoiceAmount: number): number {
  if (invoiceAmount < 1000000) return 0; // Below standard 1M threshold
  return Math.round(invoiceAmount * 0.06);
}

// ============================================================================
// 6. FINANCIAL STATEMENTS ENGINE (BALANCE SHEET, P&L, CASH FLOW, AGED DEBTORS)
// ============================================================================
export async function generateFullFinancialStatements() {
  await initializeStandardChartOfAccounts();

  // 1. Fetch all accounts
  const accounts = await prisma.account.findMany({
    orderBy: { code: "asc" },
  });

  // Group accounts by class
  const assets = accounts.filter((a) => a.accountClass === AccountClass.ASSET);
  const liabilities = accounts.filter((a) => a.accountClass === AccountClass.LIABILITY);
  const equity = accounts.filter((a) => a.accountClass === AccountClass.EQUITY);
  const revenues = accounts.filter((a) => a.accountClass === AccountClass.REVENUE);
  const expenses = accounts.filter((a) => a.accountClass === AccountClass.EXPENSE);

  const totalAssets = assets.reduce((acc, a) => acc + a.balance, 0);
  const totalLiabilities = liabilities.reduce((acc, a) => acc + a.balance, 0);
  const totalEquity = equity.reduce((acc, a) => acc + a.balance, 0);
  const totalRevenue = revenues.reduce((acc, a) => acc + a.balance, 0);
  const totalExpenses = expenses.reduce((acc, a) => acc + a.balance, 0);

  const netSurplus = totalRevenue - totalExpenses;

  // 2. Calculate Trial Balance
  const trialBalanceLines = accounts.map((acct) => {
    let debit = 0;
    let credit = 0;
    if (acct.accountClass === AccountClass.ASSET || acct.accountClass === AccountClass.EXPENSE) {
      if (acct.balance >= 0) debit = acct.balance;
      else credit = Math.abs(acct.balance);
    } else {
      if (acct.balance >= 0) credit = acct.balance;
      else debit = Math.abs(acct.balance);
    }
    return {
      code: acct.code,
      name: acct.name,
      accountClass: acct.accountClass,
      debit,
      credit,
    };
  });

  const totalTBDebit = trialBalanceLines.reduce((acc, l) => acc + l.debit, 0);
  const totalTBCredit = trialBalanceLines.reduce((acc, l) => acc + l.credit, 0);

  // 3. Aged Debtors Breakdown
  const invoices = await prisma.studentFeeInvoice.findMany({
    where: { balance: { gt: 0 } },
    include: {
      student: { select: { id: true, name: true, class: { select: { name: true } } } },
    },
  });

  const now = new Date().getTime();
  const agingSummary = {
    current: 0, // 0 - 30 days
    days30to60: 0,
    days61to90: 0,
    over90: 0,
    totalOverdue: 0,
    items: [] as any[],
  };

  invoices.forEach((inv) => {
    const ageDays = Math.floor((now - new Date(inv.dueDate).getTime()) / (1000 * 60 * 60 * 24));
    let bracket = "Current (0-30 Days)";
    if (ageDays > 90) {
      bracket = "Over 90 Days (Critical Arrears)";
      agingSummary.over90 += inv.balance;
    } else if (ageDays > 60) {
      bracket = "61-90 Days";
      agingSummary.days61to90 += inv.balance;
    } else if (ageDays > 30) {
      bracket = "31-60 Days";
      agingSummary.days30to60 += inv.balance;
    } else {
      agingSummary.current += inv.balance;
    }
    agingSummary.totalOverdue += inv.balance;

    agingSummary.items.push({
      invoiceNumber: inv.invoiceNumber,
      studentName: inv.student.name,
      className: inv.student.class?.name || "General",
      totalDue: inv.totalDue,
      paidAmount: inv.paidAmount,
      balance: inv.balance,
      dueDate: inv.dueDate,
      ageDays: Math.max(0, ageDays),
      bracket,
    });
  });

  // 4. Cash Flow Statement
  const receipts = await prisma.paymentReceipt.findMany({ select: { amount: true } });
  const allExpenses = await prisma.expenseRecord.findMany({ select: { amount: true, category: true } });

  const operatingInflow = receipts.reduce((acc, r) => acc + r.amount, 0);
  const operatingOutflow = allExpenses.reduce((acc, e) => acc + e.amount, 0);
  const netOperatingCashflow = operatingInflow - operatingOutflow;

  return {
    balanceSheet: {
      assets,
      totalAssets,
      liabilities,
      totalLiabilities,
      equity,
      totalEquity,
      netSurplus,
      isBalanced: Math.abs(totalAssets - (totalLiabilities + totalEquity + netSurplus)) < 1.0,
    },
    incomeStatement: {
      revenues,
      totalRevenue,
      expenses,
      totalExpenses,
      netSurplus,
      marginPercent: totalRevenue > 0 ? ((netSurplus / totalRevenue) * 100).toFixed(1) : "0",
    },
    cashFlowStatement: {
      operatingInflow,
      operatingOutflow,
      netOperatingCashflow,
      closingCashBalance: assets.find((a) => a.code === "1010")?.balance || 0,
      bankBalance: assets.find((a) => a.code === "1030")?.balance || 0,
      totalLiquid: (assets.find((a) => a.code === "1010")?.balance || 0) + (assets.find((a) => a.code === "1030")?.balance || 0),
    },
    trialBalance: {
      lines: trialBalanceLines,
      totalDebit: totalTBDebit,
      totalCredit: totalTBCredit,
      isBalanced: Math.abs(totalTBDebit - totalTBCredit) < 0.01,
    },
    agedDebtors: agingSummary,
  };
}
