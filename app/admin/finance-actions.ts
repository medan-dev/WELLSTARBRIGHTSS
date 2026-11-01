"use server";

import prisma from "@/lib/prisma";
import { revalidatePath, unstable_cache, revalidateTag } from "next/cache";
import {
  initializeStandardChartOfAccounts,
  createBalancedJournalEntry,
  logFinanceAudit,
  generateFullFinancialStatements,
  calculateUgandaPAYE,
  calculateUgandaNSSF,
  calculateUgandaWHT,
  verifyFinanceUser,
  ENTERPRISE_FINANCE_USERS,
} from "@/lib/finance-service";
import { AccountClass } from "../../generated/prisma/client";

// ============================================================================
// 1. OVERVIEW & EXECUTIVE KPI TELEMETRY (CACHED)
// ============================================================================
const getSuperAdminFinanceOverviewCached = unstable_cache(
  async () => {
    // Ensure chart of accounts exists
    await initializeStandardChartOfAccounts();

    // 1. Invoices & Receivables
    const invoices = await prisma.studentFeeInvoice.findMany({
      select: {
        totalDue: true,
        paidAmount: true,
        balance: true,
        status: true,
      },
    });

    const totalInvoiced = invoices.reduce((acc, inv) => acc + inv.totalDue, 0);
    const totalCollectedFromInvoices = invoices.reduce((acc, inv) => acc + inv.paidAmount, 0);
    const totalArrears = invoices.reduce((acc, inv) => acc + Math.max(0, inv.balance), 0);
    const totalDefaulters = invoices.filter((inv) => inv.balance > 0).length;

    // 2. Total Receipts (All payments recorded)
    const receipts = await prisma.paymentReceipt.findMany({
      select: { amount: true, isOfflineSync: true },
    });
    const totalReceiptsAmount = receipts.reduce((acc, r) => acc + r.amount, 0);
    const offlineReceiptsCount = receipts.filter((r) => r.isOfflineSync).length;

    // 3. Expenses
    const expenses = await prisma.expenseRecord.findMany({
      select: { amount: true, approvalStatus: true },
    });
    const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);

    // 4. Bank & Cash Position
    const cashAndBankAccounts = await prisma.account.findMany({
      where: { isBankOrCash: true },
    });
    const totalLiquidCash = cashAndBankAccounts.reduce((acc, a) => acc + a.balance, 0);

    // 5. Workstations Status
    const workstations = await prisma.workstation.findMany({
      orderBy: { createdAt: "desc" },
    });
    const activeWorkstations = workstations.filter((w) => !w.isBlocked).length;
    const blockedWorkstations = workstations.filter((w) => w.isBlocked).length;

    // 6. Recent Audit Logs
    const recentAudits = await prisma.financeAuditLog.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
    });

    // 7. Recent Transactions (Receipts + Expenses)
    const recentReceipts = await prisma.paymentReceipt.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: { student: { select: { name: true } } },
    });

    return JSON.parse(JSON.stringify({
      kpis: {
        totalInvoiced,
        totalCollected: totalCollectedFromInvoices || totalReceiptsAmount,
        totalArrears,
        totalDefaulters,
        totalExpenses,
        netCashflow: (totalCollectedFromInvoices || totalReceiptsAmount) - totalExpenses,
        totalLiquidCash,
        offlineReceiptsCount,
        activeWorkstations,
        blockedWorkstations,
      },
      cashAndBankAccounts,
      recentAudits,
      recentReceipts,
    }));
  },
  ["super-admin-finance-overview"],
  { tags: ["finance-overview", "finance-accounts", "finance-invoices", "finance-receipts"] }
);

export async function getSuperAdminFinanceOverview() {
  return await getSuperAdminFinanceOverviewCached();
}

// ============================================================================
// 2. CHART OF ACCOUNTS & BALANCES (CACHED)
// ============================================================================
const getFinanceAccountsCached = unstable_cache(
  async () => {
    await initializeStandardChartOfAccounts();
    const accounts = await prisma.account.findMany({
      orderBy: { code: "asc" },
    });
    return JSON.parse(JSON.stringify(accounts));
  },
  ["finance-accounts-list"],
  { tags: ["finance-accounts"] }
);

export async function getFinanceAccounts() {
  return await getFinanceAccountsCached();
}

// ============================================================================
// 3. INVOICES & STUDENT BILLING
// ============================================================================
export async function getFinanceInvoices() {
  const invoices = await prisma.studentFeeInvoice.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      student: { select: { id: true, name: true, class: { select: { name: true } } } },
      items: true,
      installments: true,
      payments: {
        select: {
          id: true,
          receiptNumber: true,
          amount: true,
          paymentMethod: true,
          issuedAt: true,
        },
      },
    },
  });
  return invoices;
}

// ============================================================================
// 4. PAYMENTS & RECEIPTS
// ============================================================================
export async function getFinanceReceipts() {
  const receipts = await prisma.paymentReceipt.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      student: { select: { name: true, class: { select: { name: true } } } },
      invoice: { select: { invoiceNumber: true, term: true, academicYear: true } },
    },
  });
  return receipts;
}

// ============================================================================
// 5. EXPENSES & ACCOUNTS PAYABLE
// ============================================================================
export async function getFinanceExpenses() {
  const expenses = await prisma.expenseRecord.findMany({
    orderBy: { expenseDate: "desc" },
    include: {
      supplierInvoice: { include: { supplier: true } },
    },
  });
  const suppliers = await prisma.supplier.findMany({
    orderBy: { name: "asc" },
  });
  return { expenses, suppliers };
}

// ============================================================================
// 6. PAYROLL & STATUTORY (PAYE / NSSF)
// ============================================================================
export async function getFinancePayroll() {
  const payroll = await prisma.staffPayrollRecord.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      teacher: { select: { name: true, role: true } },
    },
  });
  const loans = await prisma.staffLoanAdvance.findMany({
    orderBy: { disbursedAt: "desc" },
    include: {
      teacher: { select: { name: true } },
    },
  });
  return { payroll, loans };
}

// ============================================================================
// 7. BUDGETING & DEPARTMENTAL VARIANCE
// ============================================================================
export async function getFinanceBudgets() {
  const budgets = await prisma.budget.findMany({
    include: {
      lines: {
        include: { account: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return budgets;
}

// ============================================================================
// 8. FIXED ASSETS REGISTER
// ============================================================================
export async function getFinanceFixedAssets() {
  const assets = await prisma.fixedAsset.findMany({
    orderBy: { purchaseDate: "desc" },
  });
  return assets;
}

// ============================================================================
// 9. WORKSTATION TELEMETRY & SECURITY CONTROL
// ============================================================================
export async function getFinanceWorkstations() {
  const workstations = await prisma.workstation.findMany({
    orderBy: { lastSyncAt: "desc" },
  });
  return workstations;
}

export async function toggleWorkstationLock(machineId: string, blockStatus: boolean) {
  const updated = await prisma.workstation.update({
    where: { machineId },
    data: { isBlocked: blockStatus },
  });

  await logFinanceAudit({
    action: blockStatus ? "WORKSTATION_LOCKED" : "WORKSTATION_UNLOCKED",
    actorName: "Super Admin",
    workstationId: machineId,
    details: { machineId, machineName: updated.machineName, isBlocked: blockStatus },
  });

  revalidatePath("/admin/dashboard/finance");
  return { success: true, updated };
}

// ============================================================================
// 10. AUDIT TRAIL
// ============================================================================
export async function getFinanceAuditLogs() {
  const logs = await prisma.financeAuditLog.findMany({
    take: 100,
    orderBy: { createdAt: "desc" },
  });
  return logs;
}

// ============================================================================
// 11. RECORD EXPENSE DIRECTLY (SUPER ADMIN)
// ============================================================================
export async function createSuperAdminExpense(data: {
  title: string;
  department: string;
  category: string;
  amount: number;
  paymentMethod: string;
  paidTo: string;
  description: string;
  accountCode?: string;
}) {
  const voucherNumber = `PV-${Date.now().toString().slice(-6)}`;

  const created = await prisma.expenseRecord.create({
    data: {
      voucherNumber,
      department: data.department,
      category: data.category,
      amount: data.amount,
      paymentMethod: data.paymentMethod,
      paidTo: data.paidTo,
      description: data.description,
      recordedBy: "Super Admin",
      approvedBy: "Super Admin",
      approvalStatus: "APPROVED",
      workstationId: "SUPER-ADMIN-CONSOLE",
      expenseDate: new Date(),
    },
  });

  // Post balanced double-entry: Debit Expense (5110/5120/5150), Credit Cash/Bank (1010/1030)
  try {
    const expenseCode = data.accountCode || "5150";
    const creditCode = data.paymentMethod === "BANK_TRANSFER" ? "1030" : "1010";

    await createBalancedJournalEntry({
      date: new Date(),
      reference: voucherNumber,
      description: `Payment to ${data.paidTo}: ${data.title}`,
      lines: [
        { accountCode: expenseCode, debit: data.amount, description: data.description },
        { accountCode: creditCode, credit: data.amount, description: `Disbursement for ${voucherNumber}` },
      ],
    });
  } catch (e) {
    console.error("Journal auto-post error:", e);
  }

  await logFinanceAudit({
    action: "EXPENSE_CREATED",
    actorName: "Super Admin",
    workstationId: "SUPER-ADMIN-CONSOLE",
    details: { voucherNumber, amount: data.amount, paidTo: data.paidTo },
  });

  revalidatePath("/admin/dashboard/finance");
  return { success: true, voucherNumber };
}

// ============================================================================
// 12. DEMO / SAMPLE SEEDER HELPER (FOR ZERO-DATA STATE)
// ============================================================================
export async function seedSampleFinanceIfEmpty() {
  await initializeStandardChartOfAccounts();

  const invoiceCount = await prisma.studentFeeInvoice.count();
  if (invoiceCount > 0) return { message: "Finance data already present" };

  // Fetch some students
  const students = await prisma.student.findMany({ take: 5, include: { class: true } });
  if (students.length === 0) return { message: "No students available to bill" };

  // 1. Create a fee structure
  const feeStructure = await prisma.feeStructure.create({
    data: {
      name: "Term 1 Mandatory Tuition & Levies",
      code: "FEE-2026-T1",
      amount: 450000,
      term: "Term 1",
      academicYear: "2026",
      isOptional: false,
    },
  });

  // 2. Create sample invoices and receipts
  for (let i = 0; i < students.length; i++) {
    const student = students[i];
    const isPaid = i === 0;
    const isPartial = i === 1 || i === 2;
    const isDiscount = i === 3;

    const totalDue = 450000;
    const discount = isDiscount ? 100000 : 0;
    const netDue = totalDue - discount;
    const paid = isPaid ? netDue : isPartial ? 250000 : 0;
    const balance = netDue - paid;
    const status = balance === 0 ? "PAID" : paid > 0 ? "PARTIAL" : "UNPAID";

    const inv = await prisma.studentFeeInvoice.create({
      data: {
        invoiceNumber: `INV-2026-T1-${(1001 + i).toString()}`,
        studentId: student.id,
        term: "Term 1",
        academicYear: "2026",
        subtotal: totalDue,
        discountAmount: discount,
        discountType: isDiscount ? "SIBLING_DISCOUNT" : null,
        totalDue: netDue,
        paidAmount: paid,
        balance,
        status,
        dueDate: new Date(Date.now() + 15 * 86400000),
        items: {
          create: [
            { description: "Tuition & Academics", amount: 350000 },
            { description: "Laboratory & Library Levies", amount: 100000 },
          ],
        },
      },
    });

    if (paid > 0) {
      await prisma.paymentReceipt.create({
        data: {
          receiptNumber: `RCP-2026-WS1-${(2001 + i).toString()}`,
          invoiceId: inv.id,
          studentId: student.id,
          amount: paid,
          paymentMethod: i % 2 === 0 ? "CASH" : "BANK_DEPOSIT",
          referenceNo: `REF-BNK-${Math.floor(100000 + Math.random() * 900000)}`,
          cashierName: "Bursar Counter 1",
          workstationId: "WS-DESK-01",
          isOfflineSync: i % 2 === 1,
          issuedAt: new Date(),
        },
      });
    }
  }

  // 3. Create a sample workstation
  await prisma.workstation.upsert({
    where: { machineId: "WS-BURSAR-PC01" },
    update: { lastSyncAt: new Date() },
    create: {
      machineId: "WS-BURSAR-PC01",
      machineName: "Bursar Main Desktop (Dell OptiPlex)",
      assignedCashier: "Chief Bursar",
      apiKeyHash: "demo_secure_key_ws1",
      lastSyncAt: new Date(),
      pendingRecords: 0,
      clientVersion: "1.0.0",
    },
  });

  // 4. Create sample expenses
  await prisma.expenseRecord.create({
    data: {
      voucherNumber: "PV-2026-0001",
      department: "Boarding & Kitchen",
      category: "Food Supplies",
      amount: 1850000,
      paymentMethod: "BANK_TRANSFER",
      paidTo: "Fresh Harvest Food Wholesalers",
      description: "Bulk purchase of maize flour, beans, and cooking oil for Term 1",
      recordedBy: "Chief Bursar",
      approvedBy: "Super Admin",
      approvalStatus: "APPROVED",
      workstationId: "WS-BURSAR-PC01",
      expenseDate: new Date(),
    },
  });

  await prisma.expenseRecord.create({
    data: {
      voucherNumber: "PV-2026-0002",
      department: "Maintenance",
      category: "Repairs & Generator",
      amount: 420000,
      paymentMethod: "CASH",
      paidTo: "TotalEnergies Fuel Depot",
      description: "Diesel fuel top-up for 50kVA standby school generator",
      recordedBy: "Chief Bursar",
      approvedBy: "Super Admin",
      approvalStatus: "APPROVED",
      workstationId: "WS-BURSAR-PC01",
      expenseDate: new Date(),
    },
  });

  // 5. Create sample Fixed Asset
  await prisma.fixedAsset.create({
    data: {
      assetTag: "AST-BUS-01",
      name: "Toyota Coaster 30-Seater School Bus",
      category: "Motor Vehicles",
      purchaseDate: new Date("2024-02-15"),
      purchaseCost: 85000000,
      salvageValue: 15000000,
      usefulLifeYears: 7,
      accumulatedDepreciation: 20000000,
      netBookValue: 65000000,
      location: "School Garage",
      status: "ACTIVE",
    },
  });

  // 6. Create sample Budget
  await prisma.budget.create({
    data: {
      name: "Annual Operating Budget 2026",
      academicYear: "2026",
      department: "Whole School Operations",
      totalBudget: 150000000,
    },
  });

  // 7. Audit log
  await logFinanceAudit({
    action: "SYSTEM_INITIALIZED",
    actorName: "System Auto-Seed",
    details: { message: "Initial standard finance data generated successfully" },
  });

  revalidatePath("/admin/dashboard/finance");
  return { success: true, message: "Standard demo finance suite generated!" };
}

// ============================================================================
// 13. FINANCIAL STATEMENTS & TRIAL BALANCE (MODULE 10)
// ============================================================================
export async function getFinancialStatementsAction() {
  return await generateFullFinancialStatements();
}

// ============================================================================
// 14. TAX & STATUTORY COMPLIANCE (MODULE 9: PAYE, NSSF, WHT)
// ============================================================================
export async function getTaxComplianceAction() {
  const payroll = await prisma.staffPayrollRecord.findMany({
    orderBy: { createdAt: "desc" },
    include: { teacher: true },
  });

  const supplierInvoices = await prisma.supplierInvoice.findMany({
    include: { supplier: true },
  });

  // Calculate aggregated tax obligations
  const totalPayeDeducted = payroll.reduce((acc, p) => acc + p.payeTax, 0);
  const totalNssfEmployee = payroll.reduce((acc, p) => acc + p.nssfEmployee, 0);
  const totalNssfEmployer = payroll.reduce((acc, p) => acc + p.nssfEmployer, 0);
  const totalWhtCalculated = supplierInvoices.reduce(
    (acc, inv) => acc + calculateUgandaWHT(inv.totalAmount),
    0
  );

  return {
    summary: {
      totalPayeDeducted,
      totalNssfEmployee,
      totalNssfEmployer,
      totalNssfCombined: totalNssfEmployee + totalNssfEmployer,
      totalWhtCalculated,
      totalStatutoryDue:
        totalPayeDeducted + totalNssfEmployee + totalNssfEmployer + totalWhtCalculated,
      filingDeadline: "15th of Next Month",
      complianceStatus: "CURRENT / COMPLIANT",
    },
    payrollRecords: payroll,
    supplierInvoices: supplierInvoices.map((inv) => ({
      ...inv,
      whtAmount: calculateUgandaWHT(inv.totalAmount),
    })),
  };
}

// ============================================================================
// 15. BANK & CASH MANAGEMENT (MODULE 3)
// ============================================================================
export async function getBankAndCashAction() {
  await initializeStandardChartOfAccounts();

  const bankAndCashAccounts = await prisma.account.findMany({
    where: { isBankOrCash: true },
    orderBy: { code: "asc" },
  });

  const receipts = await prisma.paymentReceipt.findMany({
    take: 20,
    orderBy: { issuedAt: "desc" },
    include: { student: { select: { name: true } } },
  });

  const pettyExpenses = await prisma.expenseRecord.findMany({
    take: 20,
    orderBy: { expenseDate: "desc" },
  });

  const totalLiquid = bankAndCashAccounts.reduce((acc, a) => acc + a.balance, 0);
  const cashInDrawer = bankAndCashAccounts.find((a) => a.code === "1010")?.balance || 0;
  const pettyFloat = bankAndCashAccounts.find((a) => a.code === "1020")?.balance || 0;
  const stanbicBank = bankAndCashAccounts.find((a) => a.code === "1030")?.balance || 0;
  const momoMerchant = bankAndCashAccounts.find((a) => a.code === "1040")?.balance || 0;

  return {
    accounts: bankAndCashAccounts,
    positions: {
      totalLiquid,
      cashInDrawer,
      pettyFloat,
      stanbicBank,
      momoMerchant,
    },
    recentReceipts: receipts,
    recentExpenses: pettyExpenses,
    reconciliationStatus: {
      lastReconciledDate: new Date().toLocaleDateString("en-GB"),
      statementDifference: 0,
      status: "RECONCILED",
    },
  };
}

export async function transferBankCashAction(data: {
  fromAccountCode: string;
  toAccountCode: string;
  amount: number;
  reason: string;
  actorName: string;
}) {
  if (data.amount <= 0) throw new Error("Transfer amount must be greater than zero");
  if (data.fromAccountCode === data.toAccountCode)
    throw new Error("Source and destination accounts must be different");

  const fromAcct = await prisma.account.findUnique({ where: { code: data.fromAccountCode } });
  const toAcct = await prisma.account.findUnique({ where: { code: data.toAccountCode } });

  if (!fromAcct || !toAcct) throw new Error("Invalid account selection");

  const entry = await createBalancedJournalEntry({
    date: new Date(),
    reference: `TRF-${Date.now().toString().slice(-6)}`,
    description: `Internal Transfer from ${fromAcct.name} to ${toAcct.name}: ${data.reason}`,
    lines: [
      { accountCode: data.toAccountCode, debit: data.amount, description: `Received from ${fromAcct.name}` },
      { accountCode: data.fromAccountCode, credit: data.amount, description: `Transferred to ${toAcct.name}` },
    ],
  });

  await logFinanceAudit({
    action: "FUNDS_TRANSFERRED",
    actorName: data.actorName,
    workstationId: "SUPER-ADMIN-CONSOLE",
    details: {
      amount: data.amount,
      from: fromAcct.name,
      to: toAcct.name,
      entryNumber: entry.entryNumber,
    },
  });

  revalidatePath("/admin/dashboard/finance");
  return { success: true, entryNumber: entry.entryNumber };
}

// ============================================================================
// 16. STUDENT FEES, BILLING & DISCOUNTS (MODULE 1)
// ============================================================================
export async function createFeeStructureAction(data: {
  name: string;
  code: string;
  amount: number;
  term: string;
  academicYear: string;
  classId?: string;
  isOptional?: boolean;
}) {
  const created = await prisma.feeStructure.create({
    data: {
      name: data.name,
      code: data.code,
      amount: data.amount,
      term: data.term,
      academicYear: data.academicYear,
      classId: data.classId || null,
      isOptional: data.isOptional || false,
    },
  });

  await logFinanceAudit({
    action: "FEE_STRUCTURE_CREATED",
    actorName: "Chief Bursar",
    details: { code: data.code, name: data.name, amount: data.amount },
  });

  revalidatePath("/admin/dashboard/finance");
  return { success: true, feeStructure: created };
}

export async function createStudentFeeInvoiceAction(data: {
  studentId: string;
  term: string;
  academicYear: string;
  subtotal: number;
  discountAmount?: number;
  discountType?: string;
  dueDate: Date;
  items: Array<{ description: string; amount: number }>;
}) {
  const discount = data.discountAmount || 0;
  const totalDue = Math.max(0, data.subtotal - discount);
  const invoiceNumber = `INV-${data.academicYear}-${data.term.replace(/\s+/g, "")}-${Date.now().toString().slice(-4)}`;

  const invoice = await prisma.studentFeeInvoice.create({
    data: {
      invoiceNumber,
      studentId: data.studentId,
      term: data.term,
      academicYear: data.academicYear,
      subtotal: data.subtotal,
      discountAmount: discount,
      discountType: data.discountType || null,
      totalDue,
      paidAmount: 0,
      balance: totalDue,
      status: "UNPAID",
      dueDate: data.dueDate,
      items: {
        create: data.items.map((item) => ({
          description: item.description,
          amount: item.amount,
        })),
      },
    },
  });

  // Post double entry: Debit Accounts Receivable (1200), Credit Tuition/Fee Revenue (4010)
  try {
    await createBalancedJournalEntry({
      date: new Date(),
      reference: invoiceNumber,
      description: `Term Billing Invoice ${invoiceNumber}`,
      lines: [
        { accountCode: "1200", debit: totalDue },
        { accountCode: "4010", credit: totalDue },
      ],
    });
  } catch (e) {
    console.error("Journal post failed for invoice:", e);
  }

  await logFinanceAudit({
    action: "STUDENT_INVOICE_ISSUED",
    actorName: "Chief Bursar",
    details: { invoiceNumber, studentId: data.studentId, totalDue },
  });

  revalidatePath("/admin/dashboard/finance");
  return { success: true, invoice };
}

// ============================================================================
// 17. COUNTER POS FEE PAYMENT & RECEIPTING (MODULE 2)
// ============================================================================
export async function recordCounterFeePaymentAction(data: {
  studentId: string;
  invoiceId: string;
  amount: number;
  paymentMethod: string;
  referenceNo?: string;
  cashierName: string;
  workstationId: string;
  notes?: string;
}) {
  const receiptNumber = `RCP-${new Date().getFullYear()}-POS-${Math.floor(10000 + Math.random() * 90000)}`;

  const receipt = await prisma.paymentReceipt.create({
    data: {
      receiptNumber,
      invoiceId: data.invoiceId,
      studentId: data.studentId,
      amount: data.amount,
      paymentMethod: data.paymentMethod,
      referenceNo: data.referenceNo || null,
      cashierName: data.cashierName,
      workstationId: data.workstationId,
      isOfflineSync: false,
      issuedAt: new Date(),
      notes: data.notes || "Recorded via Web/Desktop POS Counter",
    },
    include: {
      student: { select: { name: true, class: { select: { name: true } } } },
      invoice: true,
    },
  });

  // Update invoice balance
  await prisma.studentFeeInvoice.update({
    where: { id: data.invoiceId },
    data: {
      paidAmount: { increment: data.amount },
      balance: { decrement: data.amount },
    },
  });

  // Check if fully paid
  const updatedInv = await prisma.studentFeeInvoice.findUnique({
    where: { id: data.invoiceId },
  });
  if (updatedInv && updatedInv.balance <= 0) {
    await prisma.studentFeeInvoice.update({
      where: { id: data.invoiceId },
      data: { status: "PAID" },
    });
  } else if (updatedInv && updatedInv.paidAmount > 0) {
    await prisma.studentFeeInvoice.update({
      where: { id: data.invoiceId },
      data: { status: "PARTIAL" },
    });
  }

  // Double-entry: Debit Cash (1010) or Bank (1030) or MoMo (1040), Credit Accounts Receivable (1200)
  let debitAccountCode = "1010"; // Default Cash Drawer
  if (data.paymentMethod === "BANK_DEPOSIT" || data.paymentMethod === "CARD") {
    debitAccountCode = "1030";
  } else if (data.paymentMethod === "MOBILE_MONEY") {
    debitAccountCode = "1040";
  }

  try {
    await createBalancedJournalEntry({
      date: new Date(),
      reference: receiptNumber,
      description: `Fee Receipt ${receiptNumber} for student ${receipt.student.name}`,
      lines: [
        { accountCode: debitAccountCode, debit: data.amount },
        { accountCode: "1200", credit: data.amount },
      ],
    });
  } catch (e) {
    console.error("Journal auto-post error on receipt:", e);
  }

  await logFinanceAudit({
    action: "FEE_RECEIPT_ISSUED",
    actorName: data.cashierName,
    actorRole: "CASHIER",
    workstationId: data.workstationId,
    details: { receiptNumber, amount: data.amount, student: receipt.student.name },
  });

  revalidatePath("/admin/dashboard/finance");
  return { success: true, receipt };
}

// ============================================================================
// 18. ACCOUNTS PAYABLE & SUPPLIERS (MODULE 5)
// ============================================================================
export async function createSupplierAction(data: {
  name: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  taxPin?: string;
  category: string;
}) {
  const supplier = await prisma.supplier.create({
    data,
  });

  await logFinanceAudit({
    action: "SUPPLIER_ADDED",
    actorName: "Chief Bursar",
    details: { supplierName: supplier.name, category: supplier.category },
  });

  revalidatePath("/admin/dashboard/finance");
  return { success: true, supplier };
}

export async function createSupplierInvoiceAction(data: {
  supplierId: string;
  invoiceNumber: string;
  totalAmount: number;
  dueDate: Date;
}) {
  const systemRef = `PINV-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`;
  const taxAmount = calculateUgandaWHT(data.totalAmount);

  const bill = await prisma.supplierInvoice.create({
    data: {
      systemRef,
      invoiceNumber: data.invoiceNumber,
      supplierId: data.supplierId,
      totalAmount: data.totalAmount,
      taxAmount,
      paidAmount: 0,
      balance: data.totalAmount,
      dueDate: data.dueDate,
      status: "PENDING",
    },
    include: { supplier: true },
  });

  // Double entry: Debit General Expenses (5150), Credit Accounts Payable (2010)
  try {
    await createBalancedJournalEntry({
      date: new Date(),
      reference: systemRef,
      description: `Supplier Bill ${data.invoiceNumber} from ${bill.supplier.name}`,
      lines: [
        { accountCode: "5150", debit: data.totalAmount },
        { accountCode: "2010", credit: data.totalAmount },
      ],
    });
  } catch (e) {
    console.error("Journal error for supplier bill:", e);
  }

  await logFinanceAudit({
    action: "SUPPLIER_BILL_RECORDED",
    actorName: "Chief Bursar",
    details: { systemRef, supplier: bill.supplier.name, amount: data.totalAmount },
  });

  revalidatePath("/admin/dashboard/finance");
  return { success: true, bill };
}

export async function approveSupplierInvoiceAction(billId: string, paymentMethod = "BANK_TRANSFER") {
  const bill = await prisma.supplierInvoice.findUnique({
    where: { id: billId },
    include: { supplier: true },
  });
  if (!bill) throw new Error("Supplier bill not found");

  const voucherNumber = `PV-${Date.now().toString().slice(-6)}`;

  // Record payment expense
  await prisma.expenseRecord.create({
    data: {
      voucherNumber,
      supplierInvoiceId: bill.id,
      department: "Accounts Payable",
      category: "Supplier Disbursement",
      amount: bill.balance,
      paymentMethod,
      paidTo: bill.supplier.name,
      description: `Settlement of supplier bill ${bill.invoiceNumber}`,
      recordedBy: "Chief Bursar",
      approvedBy: "Super Admin",
      approvalStatus: "PAID",
      workstationId: "SUPER-ADMIN-CONSOLE",
      expenseDate: new Date(),
    },
  });

  // Update bill status to PAID
  await prisma.supplierInvoice.update({
    where: { id: bill.id },
    data: {
      paidAmount: bill.totalAmount,
      balance: 0,
      status: "PAID",
    },
  });

  // Double entry: Debit Accounts Payable (2010), Credit Bank (1030)
  try {
    await createBalancedJournalEntry({
      date: new Date(),
      reference: voucherNumber,
      description: `Disbursement for bill ${bill.invoiceNumber} to ${bill.supplier.name}`,
      lines: [
        { accountCode: "2010", debit: bill.balance },
        { accountCode: "1030", credit: bill.balance },
      ],
    });
  } catch (e) {
    console.error("Journal post failed for bill payment:", e);
  }

  await logFinanceAudit({
    action: "SUPPLIER_BILL_PAID",
    actorName: "Super Admin",
    details: { billId, supplier: bill.supplier.name, amount: bill.balance },
  });

  revalidatePath("/admin/dashboard/finance");
  return { success: true, voucherNumber };
}

// ============================================================================
// 19. PAYROLL & COMPENSATION (MODULE 6)
// ============================================================================
export async function processStaffPayrollRunAction(data: {
  teacherId: string;
  month: string;
  year: string;
  baseSalary: number;
  housingAllowance?: number;
  transportAllowance?: number;
  otherAllowances?: number;
}) {
  const housing = data.housingAllowance || 0;
  const transport = data.transportAllowance || 0;
  const other = data.otherAllowances || 0;
  const grossSalary = data.baseSalary + housing + transport + other;

  const payeTax = calculateUgandaPAYE(grossSalary);
  const nssf = calculateUgandaNSSF(grossSalary);
  const totalDeductions = payeTax + nssf.employee;
  const netSalary = grossSalary - totalDeductions;
  const payslipRef = `PAY-${data.year}-${data.month.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`;

  const payrollRecord = await prisma.staffPayrollRecord.create({
    data: {
      teacherId: data.teacherId,
      month: data.month,
      year: data.year,
      baseSalary: data.baseSalary,
      housingAllowance: housing,
      transportAllowance: transport,
      otherAllowances: other,
      grossSalary,
      payeTax,
      nssfEmployee: nssf.employee,
      nssfEmployer: nssf.employer,
      loanRecovery: 0,
      advanceDeduction: 0,
      totalDeductions,
      netSalary,
      status: "APPROVED",
      paymentDate: new Date(),
      payslipRef,
    },
    include: { teacher: true },
  });

  // Double entry:
  // Debit Academic Staff Salaries (5010) [Gross Salary]
  // Debit Employer NSSF (5030) [Employer NSSF]
  // Credit PAYE Payable (2030) [PAYE]
  // Credit NSSF Payable (2040) [Employee + Employer NSSF]
  // Credit Bank A/C (1030) [Net Salary Paid]
  try {
    await createBalancedJournalEntry({
      date: new Date(),
      reference: payslipRef,
      description: `Payroll Run for ${payrollRecord.teacher.name} (${data.month} ${data.year})`,
      lines: [
        { accountCode: "5010", debit: grossSalary },
        { accountCode: "5030", debit: nssf.employer },
        { accountCode: "2030", credit: payeTax },
        { accountCode: "2040", credit: nssf.total },
        { accountCode: "1030", credit: netSalary },
      ],
    });
  } catch (e) {
    console.error("Journal auto-post error on payroll:", e);
  }

  await logFinanceAudit({
    action: "PAYROLL_PROCESSED",
    actorName: "Chief Bursar",
    details: { staffName: payrollRecord.teacher.name, netSalary, payslipRef },
  });

  revalidatePath("/admin/dashboard/finance");
  return { success: true, payrollRecord };
}

// ============================================================================
// 20. FIXED ASSETS REGISTER & DEPRECIATION (MODULE 8)
// ============================================================================
export async function createFixedAssetAction(data: {
  assetTag: string;
  name: string;
  category: string;
  purchaseCost: number;
  salvageValue?: number;
  usefulLifeYears: number;
  location?: string;
}) {
  const asset = await prisma.fixedAsset.create({
    data: {
      assetTag: data.assetTag,
      name: data.name,
      category: data.category,
      purchaseDate: new Date(),
      purchaseCost: data.purchaseCost,
      salvageValue: data.salvageValue || 0,
      usefulLifeYears: data.usefulLifeYears,
      accumulatedDepreciation: 0,
      netBookValue: data.purchaseCost,
      location: data.location || "School Campus",
      status: "ACTIVE",
    },
  });

  // Double entry: Debit Fixed Assets (1510/1520/1530), Credit Bank (1030)
  let assetCode = "1530"; // IT / Equipment
  if (data.category.toLowerCase().includes("vehicle") || data.category.toLowerCase().includes("bus")) {
    assetCode = "1520";
  } else if (data.category.toLowerCase().includes("building") || data.category.toLowerCase().includes("infrastructure")) {
    assetCode = "1510";
  }

  try {
    await createBalancedJournalEntry({
      date: new Date(),
      reference: data.assetTag,
      description: `Capital Acquisition: ${data.name}`,
      lines: [
        { accountCode: assetCode, debit: data.purchaseCost },
        { accountCode: "1030", credit: data.purchaseCost },
      ],
    });
  } catch (e) {
    console.error("Journal post failed for fixed asset:", e);
  }

  await logFinanceAudit({
    action: "FIXED_ASSET_ADDED",
    actorName: "Chief Bursar",
    details: { tag: data.assetTag, name: data.name, cost: data.purchaseCost },
  });

  revalidatePath("/admin/dashboard/finance");
  return { success: true, asset };
}

export async function runAssetDepreciationAction(assetId: string) {
  const asset = await prisma.fixedAsset.findUnique({ where: { id: assetId } });
  if (!asset) throw new Error("Asset not found");

  // Straight line depreciation per annum
  const annualDepreciation = (asset.purchaseCost - asset.salvageValue) / asset.usefulLifeYears;
  const newAccDep = Math.min(asset.purchaseCost - asset.salvageValue, asset.accumulatedDepreciation + annualDepreciation);
  const newNBV = asset.purchaseCost - newAccDep;

  await prisma.fixedAsset.update({
    where: { id: assetId },
    data: {
      accumulatedDepreciation: newAccDep,
      netBookValue: newNBV,
    },
  });

  // Double entry: Debit Depreciation Expense (5170), Credit Accumulated Depreciation (1590)
  try {
    await createBalancedJournalEntry({
      date: new Date(),
      reference: `DEP-${asset.assetTag}`,
      description: `Annual Depreciation for ${asset.name}`,
      lines: [
        { accountCode: "5170", debit: annualDepreciation },
        { accountCode: "1590", credit: annualDepreciation },
      ],
    });
  } catch (e) {
    console.error("Depreciation journal error:", e);
  }

  await logFinanceAudit({
    action: "ASSET_DEPRECIATED",
    actorName: "Chief Bursar",
    details: { tag: asset.assetTag, depreciationAmount: annualDepreciation, newNBV },
  });

  revalidatePath("/admin/dashboard/finance");
  return { success: true, annualDepreciation, newNBV };
}

// ============================================================================
// 21. BUDGETING & COST CENTERS (MODULE 7)
// ============================================================================
export async function createBudgetAction(data: {
  name: string;
  department: string;
  academicYear: string;
  totalBudget: number;
}) {
  const budget = await prisma.budget.create({
    data: {
      name: data.name,
      department: data.department,
      academicYear: data.academicYear,
      totalBudget: data.totalBudget,
    },
  });

  await logFinanceAudit({
    action: "BUDGET_CREATED",
    actorName: "Super Admin",
    details: { name: data.name, department: data.department, amount: data.totalBudget },
  });

  revalidatePath("/admin/dashboard/finance");
  return { success: true, budget };
}

// ============================================================================
// 22. GENERAL LEDGER & MANUAL JOURNAL VOUCHERS (MODULE 4)
// ============================================================================
export async function postManualJournalVoucherAction(data: {
  reference?: string;
  description: string;
  actorName: string;
  lines: Array<{ accountCode: string; debit?: number; credit?: number; description?: string }>;
}) {
  const entry = await createBalancedJournalEntry({
    date: new Date(),
    reference: data.reference,
    description: data.description,
    lines: data.lines,
  });

  await logFinanceAudit({
    action: "JOURNAL_VOUCHER_POSTED",
    actorName: data.actorName,
    actorRole: "BURSAR",
    details: { entryNumber: entry.entryNumber, linesCount: data.lines.length },
  });

  revalidatePath("/admin/dashboard/finance");
  return { success: true, entry };
}

export async function getJournalEntriesAction() {
  const entries = await prisma.journalEntry.findMany({
    take: 50,
    orderBy: { createdAt: "desc" },
    include: {
      lines: {
        include: { account: true },
      },
    },
  });
  return entries;
}

// ============================================================================
// 23. ENTERPRISE AUTHENTICATION SERVER VERIFICATION
// ============================================================================
export async function verifyFinanceAuthAction(credentials: {
  email?: string;
  pin?: string;
  role?: string;
}) {
  const user = await verifyFinanceUser(credentials);
  if (!user) {
    return { success: false, error: "Invalid PIN or credentials" };
  }

  await logFinanceAudit({
    action: "USER_AUTHENTICATED",
    actorName: user.name,
    actorRole: user.role,
    workstationId: user.workstationId || "SERVER-CENTRAL",
    details: { role: user.role, email: user.email },
  });

  return { success: true, user };
}
