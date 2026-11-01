import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createBalancedJournalEntry, logFinanceAudit } from "@/lib/finance-service";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, x-machine-id, x-api-key",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function GET(req: NextRequest) {
  return NextResponse.json(
    {
      status: "HEALTHY",
      service: "Finance Gateway Sync API",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
    },
    { headers: corsHeaders }
  );
}

export async function POST(req: NextRequest) {
  try {
    const machineId = req.headers.get("x-machine-id");
    const apiKey = req.headers.get("x-api-key");

    if (!machineId) {
      return NextResponse.json({ error: "Unauthorized: Missing machine identification" }, { status: 401 });
    }

    // 1. Check or auto-register workstation
    let workstation = await prisma.workstation.findUnique({
      where: { machineId },
    });

    if (!workstation) {
      // Auto-register pending workstation
      workstation = await prisma.workstation.create({
        data: {
          machineId,
          machineName: `Workstation-${machineId.slice(0, 8)}`,
          assignedCashier: "Default Cashier",
          apiKeyHash: apiKey || "auto_registered",
          lastSyncAt: new Date(),
          pendingRecords: 0,
        },
      });
    }

    // 2. Check if Super Admin blocked this workstation
    if (workstation.isBlocked) {
      return NextResponse.json(
        { error: "Access Denied: This financial workstation has been suspended by the Super Admin." },
        { status: 403 }
      );
    }

    let body = {};
    try {
      const text = await req.text();
      body = text ? JSON.parse(text) : {};
    } catch (parseErr) {
      body = {};
    }
    const { offlineReceipts = [], offlineExpenses = [], offlineMealCards = [] } = body;

    let processedReceipts = 0;
    let processedExpenses = 0;
    let processedMealCards = 0;

    // 2.1 Ingest offline meal cards issued by Finance
    for (const card of offlineMealCards) {
      if (card.cardNumber && card.studentId) {
        try {
          const student = await prisma.student.findUnique({ where: { id: card.studentId } });
          if (student) {
            await prisma.mealCard.upsert({
              where: { cardNumber: card.cardNumber },
              update: {
                planType: card.planType || "DAY_LUNCH",
                milkQuota: Number(card.milkQuota || card.dailyMilkQuota || 0),
                dailyQuota: Number(card.dailyQuota || 3),
                status: card.status || "ACTIVE",
                validUntil: card.validUntil ? new Date(card.validUntil) : null,
                allergies: card.notes || null,
              },
              create: {
                cardNumber: card.cardNumber,
                studentId: card.studentId,
                planType: card.planType || "DAY_LUNCH",
                milkQuota: Number(card.milkQuota || card.dailyMilkQuota || 0),
                dailyQuota: Number(card.dailyQuota || 3),
                status: card.status || "ACTIVE",
                validUntil: card.validUntil ? new Date(card.validUntil) : null,
                allergies: card.notes || null,
              },
            });
            processedMealCards++;
          }
        } catch (e) {
          // ignore duplicate or non-existent offline student IDs
        }
      }
    }

    // 3. Ingest offline receipts atomically
    for (const item of offlineReceipts) {
      // Check if already synced by unique receiptNumber
      const exists = await prisma.paymentReceipt.findUnique({
        where: { receiptNumber: item.receiptNumber },
      });

      if (!exists) {
        // Validate student and invoice existence to prevent foreign key errors
        let student = item.studentId
          ? await prisma.student.findUnique({ where: { id: item.studentId } })
          : null;

        if (!student && item.studentName) {
          student = await prisma.student.findFirst({
            where: { name: { contains: item.studentName, mode: "insensitive" } },
          });
        }

        if (!student) {
          // Fallback to first available student so offline counter receipt never fails
          student = await prisma.student.findFirst();
        }

        if (!student) continue;

        let invoice = item.invoiceId
          ? await prisma.studentFeeInvoice.findUnique({ where: { id: item.invoiceId } })
          : null;

        if (!invoice) {
          invoice = await prisma.studentFeeInvoice.findFirst({
            where: { studentId: student.id },
          });
        }

        if (!invoice) {
          invoice = await prisma.studentFeeInvoice.create({
            data: {
              invoiceNumber: `INV-AUTO-${Date.now().toString().slice(-6)}`,
              studentId: student.id,
              academicYear: "2026",
              term: "Term 1",
              subtotal: Number(item.amount),
              totalDue: Number(item.amount),
              paidAmount: 0,
              balance: Number(item.amount),
              status: "UNPAID",
              dueDate: new Date(Date.now() + 30 * 86400000),
            },
          });
        }

        await prisma.paymentReceipt.create({
          data: {
            receiptNumber: item.receiptNumber,
            invoiceId: invoice.id,
            studentId: student.id,
            amount: Number(item.amount),
            paymentMethod: item.paymentMethod || "CASH",
            referenceNo: item.referenceNo || null,
            cashierName: item.cashierName || workstation.assignedCashier,
            workstationId: machineId,
            isOfflineSync: true,
            issuedAt: new Date(item.issuedAt || Date.now()),
            syncedAt: new Date(),
            notes: item.notes || "Synced from offline desktop executable",
          },
        });

        // Deduct from invoice balance if valid invoice exists
        if (invoice?.id) {
          await prisma.studentFeeInvoice.update({
            where: { id: invoice.id },
            data: {
              paidAmount: { increment: Number(item.amount) },
              balance: { decrement: Number(item.amount) },
            },
          });
        }

        // Post balanced journal: Debit Cash (1010), Credit Accounts Receivable (1200)
        try {
          await createBalancedJournalEntry({
            date: new Date(item.issuedAt || Date.now()),
            reference: item.receiptNumber,
            description: `Offline Fee Payment: Receipt ${item.receiptNumber}`,
            lines: [
              { accountCode: "1010", debit: Number(item.amount) },
              { accountCode: "1200", credit: Number(item.amount) },
            ],
          });
        } catch (e) {
          console.error("Offline receipt journal post error:", e);
        }

        processedReceipts++;
      }
    }

    // 4. Ingest offline expenses
    for (const exp of offlineExpenses) {
      const exists = await prisma.expenseRecord.findUnique({
        where: { voucherNumber: exp.voucherNumber },
      });

      if (!exists) {
        await prisma.expenseRecord.create({
          data: {
            voucherNumber: exp.voucherNumber,
            department: exp.department || "General Operations",
            category: exp.category || "Petty Cash",
            amount: Number(exp.amount),
            paymentMethod: exp.paymentMethod || "CASH",
            paidTo: exp.paidTo || "Payee",
            description: exp.description || "Offline expense",
            recordedBy: exp.recordedBy || workstation.assignedCashier,
            approvalStatus: "APPROVED",
            workstationId: machineId,
            expenseDate: new Date(exp.expenseDate || Date.now()),
          },
        });
        processedExpenses++;
      }
    }

    // 5. Update workstation heartbeat
    await prisma.workstation.update({
      where: { machineId },
      data: {
        lastSyncAt: new Date(),
        pendingRecords: 0,
        lastIpAddress: req.headers.get("x-forwarded-for") || "local-ip",
      },
    });

    if (processedReceipts > 0 || processedExpenses > 0) {
      await logFinanceAudit({
        action: "OFFLINE_BATCH_SYNCED",
        actorName: workstation.assignedCashier,
        actorRole: "DESKTOP_EXECUTABLE",
        workstationId: machineId,
        details: { processedReceipts, processedExpenses },
      });
    }

    // 6. Return fresh master data for the desktop client to cache
    const freshStudents = await prisma.student.findMany({
      select: {
        id: true,
        name: true,
        class: { select: { id: true, name: true, grade: true } },
        invoices: {
          select: {
            id: true,
            invoiceNumber: true,
            term: true,
            academicYear: true,
            totalDue: true,
            paidAmount: true,
            balance: true,
            status: true,
          },
        },
      },
    });

    const freshFeeStructures = await prisma.feeStructure.findMany();
    const freshMealCards = await prisma.mealCard.findMany({
      include: {
        student: { select: { id: true, name: true, class: { select: { name: true } } } },
      },
    });

    return NextResponse.json(
      {
        success: true,
        syncedAt: new Date().toISOString(),
        processedReceipts,
        processedExpenses,
        processedMealCards,
        freshData: {
          students: freshStudents,
          feeStructures: freshFeeStructures,
          mealCards: freshMealCards,
        },
      },
      { headers: corsHeaders }
    );
  } catch (error: any) {
    console.error("Sync API error:", error);
    return NextResponse.json({ error: error.message || "Sync failed" }, { status: 500, headers: corsHeaders });
  }
}
