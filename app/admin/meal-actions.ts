"use server";

import prisma from "@/lib/prisma";
import { unstable_cache, revalidateTag } from "next/cache";
import { requireAuth } from "@/lib/auth-service";
import { resolveActiveTenantContext } from "../actions";

export type MealPlanType = 
  | "BOARDING_FULL" 
  | "DAY_LUNCH" 
  | "SPECIAL_DIET" 
  | "BURSARY_SUBSIDIZED" 
  | "CUSTOM";

export type MealCardStatus = "ACTIVE" | "SUSPENDED" | "EXPIRED";

export type MealSession = "BREAKFAST" | "LUNCH" | "DINNER" | "SPECIAL_BREAK";

// Helper to guarantee clean runtime objects without legacy references
function sanitizeMealCard<T extends Record<string, any>>(card: T | null | undefined): T | null {
  if (!card) return null;
  const cleaned: Record<string, any> = { ...card };
  if (cleaned.planType === "MILK_NUTRITION_AWARD" || (cleaned.planType as string) === "MILK_NUTRITION_SCHEME") {
    cleaned.planType = "BURSARY_SUBSIDIZED";
  }
  if (cleaned.notes && typeof cleaned.notes === "string") {
    cleaned.notes = cleaned.notes.replace(/milk cans? daily\.?/gi, "meals daily.").replace(/milk/gi, "meal");
  }
  delete cleaned.milkQuota;
  delete cleaned.dailyMilkQuota;
  return cleaned as T;
}

// ============================================================================
// 1. READ ACTIONS (CACHED)
// ============================================================================

export async function getAllMealCards() {
  const { campusId, isDemo } = await resolveActiveTenantContext();
  if (isDemo) return [];

  const where = campusId ? { campusId } : {};
  const cards = await prisma.mealCard.findMany({
    where,
    include: {
      student: {
        select: {
          id: true,
          name: true,
          email: true,
          class: { select: { id: true, name: true, grade: true } },
        },
      },
      logs: {
        take: 3,
        orderBy: { servedAt: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const parsed = JSON.parse(JSON.stringify(cards));
  return Array.isArray(parsed) ? parsed.map(sanitizeMealCard) : [];
}

export async function getMealCardByStudent(studentId: string) {
  const fetchCached = unstable_cache(
    async () => {
      const card = await prisma.mealCard.findUnique({
        where: { studentId },
        include: {
          student: {
            select: {
              id: true,
              name: true,
              email: true,
              class: { select: { id: true, name: true, grade: true } },
            },
          },
          logs: {
            take: 10,
            orderBy: { servedAt: "desc" },
          },
        },
      });
      return card ? sanitizeMealCard(JSON.parse(JSON.stringify(card))) : null;
    },
    [`meal-card-student-${studentId}`],
    { tags: ["meal-cards", `meal-card-${studentId}`] }
  );

  return await fetchCached();
}

export async function getMealCardByNumber(cardNumber: string) {
  const card = await prisma.mealCard.findUnique({
    where: { cardNumber: cardNumber.trim().toUpperCase() },
    include: {
      student: {
        select: {
          id: true,
          name: true,
          email: true,
          class: { select: { id: true, name: true, grade: true } },
        },
      },
      logs: {
        take: 5,
        orderBy: { servedAt: "desc" },
      },
    },
  });

  return card ? sanitizeMealCard(JSON.parse(JSON.stringify(card))) : null;
}

export async function getRecentMealLogs(limit: number = 30) {
  const { campusId, isDemo } = await resolveActiveTenantContext();
  if (isDemo) return [];

  const logs = await prisma.mealLog.findMany({
    where: campusId ? { mealCard: { campusId } } : {},
    take: limit,
    orderBy: { servedAt: "desc" },
    include: {
      mealCard: {
        include: {
          student: {
            select: {
              id: true,
              name: true,
              class: { select: { name: true } },
            },
          },
        },
      },
    },
  });

  return JSON.parse(JSON.stringify(logs));
}

export async function getDailyMealStats(targetDate?: string) {
  const { campusId, isDemo } = await resolveActiveTenantContext();
  const dateStr = targetDate || new Date().toISOString().split("T")[0];

  if (isDemo) {
    return {
      date: dateStr,
      totalMealsServed: 0,
      uniqueStudentsServed: 0,
      totalCards: 0,
      activeCards: 0,
      breakfastCount: 0,
      lunchCount: 0,
      dinnerCount: 0,
      specialBreakCount: 0,
    };
  }

  const where = campusId ? { campusId } : {};
  const [todayLogs, totalCards, activeCards] = await Promise.all([
    prisma.mealLog.findMany({
      where: {
        date: dateStr,
        ...(campusId ? { mealCard: { campusId } } : {}),
      },
      select: {
        id: true,
        mealSession: true,
        portionQty: true,
        studentId: true,
      },
    }),
    prisma.mealCard.count({ where }),
    prisma.mealCard.count({ where: { ...where, status: "ACTIVE" } }),
  ]);

  const totalMealsServed = todayLogs.reduce((acc, l) => acc + l.portionQty, 0);
  const uniqueStudentsServed = new Set(todayLogs.map((l) => l.studentId)).size;

  const breakfastCount = todayLogs
    .filter((l) => l.mealSession === "BREAKFAST")
    .reduce((acc, l) => acc + l.portionQty, 0);

  const lunchCount = todayLogs
    .filter((l) => l.mealSession === "LUNCH")
    .reduce((acc, l) => acc + l.portionQty, 0);

  const dinnerCount = todayLogs
    .filter((l) => l.mealSession === "DINNER")
    .reduce((acc, l) => acc + l.portionQty, 0);

  const specialBreakCount = todayLogs
    .filter((l) => l.mealSession === "SPECIAL_BREAK")
    .reduce((acc, l) => acc + l.portionQty, 0);

  return {
    date: dateStr,
    totalMealsServed,
    uniqueStudentsServed,
    totalCards,
    activeCards,
    breakfastCount,
    lunchCount,
    dinnerCount,
    specialBreakCount,
  };
}

// ============================================================================
// 2. MUTATION ACTIONS (SERVE MEALS, ISSUE CARDS, ANTI-DOUBLE-SERVING)
// ============================================================================

/**
 * Validates card and logs meal session.
 * Protects against double-serving for the same meal session on the same date.
 */
export async function serveMealCheckIn(params: {
  cardNumber?: string;
  studentId?: string;
  mealSession: MealSession;
  portionQty?: number;
  servedBy?: string;
  notes?: string;
}) {
  const session = await requireAuth(["SUPER_ADMIN", "BURSAR", "CASHIER", "AUDITOR"]);
  const { cardNumber, studentId, mealSession, portionQty = 1, servedBy = session.name, notes } = params;
  const todayStr = new Date().toISOString().split("T")[0];

  let card = null;

  if (cardNumber) {
    card = await prisma.mealCard.findUnique({
      where: { cardNumber: cardNumber.trim().toUpperCase() },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            class: { select: { name: true, grade: true } },
          },
        },
      },
    });
  } else if (studentId) {
    card = await prisma.mealCard.findUnique({
      where: { studentId },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            class: { select: { name: true, grade: true } },
          },
        },
      },
    });
  }

  if (!card) {
    return {
      success: false,
      error: "CARD_NOT_FOUND",
      message: "No meal card found matching this identifier or barcode.",
    };
  }

  if (card.status !== "ACTIVE") {
    return {
      success: false,
      error: "CARD_SUSPENDED",
      cardStatus: card.status,
      student: card.student,
      message: `Meal card is ${card.status}. Dining access is temporarily restricted.`,
    };
  }

  // 1. Session Eligibility Check
  if (card.planType === "DAY_LUNCH" && mealSession === "DINNER") {
    return {
      success: false,
      error: "PLAN_INELIGIBLE",
      student: card.student,
      message: "Day Scholar plan only includes Lunch service. Dinner is not included.",
    };
  }

  if (card.planType === "SPECIAL_DIET" && mealSession === "DINNER" && card.dailyQuota < 3) {
    return {
      success: false,
      error: "PLAN_INELIGIBLE",
      student: card.student,
      message: "Special Diet plan has restricted dinner access. Please check dining plan clearance.",
    };
  }

  // 2. Anti-Double-Serving Verification
  const existingLog = await prisma.mealLog.findFirst({
    where: {
      studentId: card.studentId,
      date: todayStr,
      mealSession,
    },
    orderBy: { servedAt: "desc" },
  });

  const sessionName = ({
    BREAKFAST: "Breakfast Service",
    LUNCH: "Lunch Service",
    DINNER: "Dinner / Supper",
    SPECIAL_BREAK: "Special Nutrition Break",
  } as Record<string, string>)[mealSession as string] || "Meal Service";

  if (existingLog) {
    const servedTime = new Date(existingLog.servedAt).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return {
      success: false,
      error: "ALREADY_SERVED",
      alreadyServed: true,
      student: card.student,
      mealSession,
      previousTime: servedTime,
      message: `Already served! ${card.student.name} already received ${sessionName} today at ${servedTime}.`,
    };
  }

  // 3. Record Successful Meal Log
  const newLog = await prisma.mealLog.create({
    data: {
      cardId: card.id,
      studentId: card.studentId,
      mealSession,
      date: todayStr,
      portionQty,
      servedBy: servedBy || "Dining Hall Staff",
      notes: notes || null,
    },
  });

  // Optional: deduct points if card uses point balance
  if (card.points > 0) {
    await prisma.mealCard.update({
      where: { id: card.id },
      data: { points: Math.max(0, card.points - 1) },
    });
  }

  revalidateTag("meal-cards");
  revalidateTag("meal-stats");
  revalidateTag("meal-logs");

  return {
    success: true,
    alreadyServed: false,
    student: card.student,
    card: {
      cardNumber: card.cardNumber,
      planType: card.planType,
      allergies: card.allergies,
    },
    mealSession,
    sessionName,
    servedAt: newLog.servedAt,
    message: `Meal Approved! ${sessionName} successfully served to ${card.student.name} (${card.student.class?.name || "Class"}).`,
  };
}

export async function issueOrUpdateMealCard(data: {
  studentId: string;
  cardNumber?: string;
  planType: MealPlanType;
  status?: MealCardStatus;
  allergies?: string;
  dailyQuota?: number;
  points?: number;
  campusId?: string;
}) {
  await requireAuth(["SUPER_ADMIN", "BURSAR", "CASHIER", "AUDITOR"]);
  const { campusId: activeCampusId } = await resolveActiveTenantContext();
  const campusId = data.campusId || activeCampusId || null;

  const existingByStudent = await prisma.mealCard.findUnique({
    where: { studentId: data.studentId },
  });

  const generatedCardNum = data.cardNumber?.trim() || `MC-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  let card;
  if (existingByStudent) {
    card = await prisma.mealCard.update({
      where: { studentId: data.studentId },
      data: {
        planType: data.planType,
        status: data.status || existingByStudent.status,
        allergies: data.allergies !== undefined ? data.allergies : existingByStudent.allergies,
        dailyQuota: data.dailyQuota !== undefined ? data.dailyQuota : existingByStudent.dailyQuota,
        points: data.points !== undefined ? data.points : existingByStudent.points,
        campusId: existingByStudent.campusId || campusId,
      },
      include: { student: { select: { name: true } } },
    });
  } else {
    card = await prisma.mealCard.create({
      data: {
        cardNumber: generatedCardNum,
        studentId: data.studentId,
        campusId,
        planType: data.planType,
        status: data.status || "ACTIVE",
        allergies: data.allergies || null,
        dailyQuota: data.dailyQuota || 3,
        points: data.points !== undefined ? data.points : 100,
      },
      include: { student: { select: { name: true } } },
    });
  }

  revalidateTag("meal-cards");
  revalidateTag("meal-stats");

  return sanitizeMealCard(JSON.parse(JSON.stringify(card)));
}

export async function batchGenerateMealCards() {
  await requireAuth(["SUPER_ADMIN", "BURSAR"]);
  const { campusId } = await resolveActiveTenantContext();
  const where = campusId ? { campusId } : {};

  const studentsWithoutCard = await prisma.student.findMany({
    where: { ...where, mealCard: null },
    select: { id: true, name: true, campusId: true },
  });

  if (studentsWithoutCard.length === 0) {
    return { count: 0, message: "All students already have active meal cards." };
  }

  let createdCount = 0;
  for (let i = 0; i < studentsWithoutCard.length; i++) {
    const student = studentsWithoutCard[i];
    const cardNumber = `MC-2026-${(1001 + i).toString().padStart(4, "0")}`;

    await prisma.mealCard.create({
      data: {
        cardNumber,
        studentId: student.id,
        campusId: student.campusId || campusId || null,
        planType: "BOARDING_FULL",
        status: "ACTIVE",
        dailyQuota: 3,
        points: 120,
      },
    });
    createdCount++;
  }

  revalidateTag("meal-cards");
  revalidateTag("meal-stats");

  return { count: createdCount, message: `Successfully issued ${createdCount} new meal cards!` };
}

export async function toggleMealCardStatus(cardId: string, status: MealCardStatus) {
  await requireAuth(["SUPER_ADMIN", "BURSAR", "CASHIER"]);
  const card = await prisma.mealCard.update({
    where: { id: cardId },
    data: { status },
  });

  revalidateTag("meal-cards");
  return sanitizeMealCard(JSON.parse(JSON.stringify(card)));
}
