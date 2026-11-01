import prisma from "@/lib/prisma";
import { AccountClass } from "../../generated/prisma/client";

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
    { code: "5110", name: "Kitchen & Student Food Rations", accountClass: AccountClass.EXPENSE, isBankOrCash: false, balance: 0 },
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
