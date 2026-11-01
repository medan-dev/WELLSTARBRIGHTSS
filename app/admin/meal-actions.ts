"use server";

import prisma from "@/lib/prisma";
import { unstable_cache, revalidateTag } from "next/cache";

export type MealPlanType = 
  | "BOARDING_FULL" 
  | "DAY_LUNCH" 
  | "MILK_NUTRITION_AWARD" 
  | "BURSARY_SUBSIDIZED" 
  | "CUSTOM";

export type MealCardStatus = "ACTIVE" | "SUSPENDED" | "EXPIRED";

export type MealSession = "BREAKFAST_MILK" | "LUNCH" | "DINNER" | "SPECIAL_BREAK";

// ============================================================================
// 1. READ ACTIONS (CACHED)
// ============================================================================

export async function getAllMealCards() {
  const fetchCached = unstable_cache(
    async () => {
      let cards = await prisma.mealCard.findMany({
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

      if (cards.length === 0) {
        const allStudents = await prisma.student.findMany({
          take: 60,
        });

        for (let i = 0; i < allStudents.length; i++) {
          const s = allStudents[i];
          const cardNum = `MC-2026-${(1001 + i).toString().padStart(4, "0")}`;
          const plan: MealPlanType =
            i % 3 === 0
              ? "BOARDING_FULL"
              : i % 3 === 1
              ? "DAY_LUNCH"
              : "MILK_NUTRITION_AWARD";

          await prisma.mealCard.create({
            data: {
              cardNumber: cardNum,
              studentId: s.id,
              planType: plan,
              status: "ACTIVE",
              milkQuota: plan === "MILK_NUTRITION_AWARD" ? 2 : 1,
              dailyQuota: plan === "BOARDING_FULL" ? 3 : 1,
              points: 120,
            },
          });
        }

        cards = await prisma.mealCard.findMany({
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
      }

      return JSON.parse(JSON.stringify(cards));
    },
    ["all-meal-cards"],
    { tags: ["meal-cards"] }
  );

  return await fetchCached();
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
      return card ? JSON.parse(JSON.stringify(card)) : null;
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

  return card ? JSON.parse(JSON.stringify(card)) : null;
}

export async function getRecentMealLogs(limit: number = 30) {
  const logs = await prisma.mealLog.findMany({
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
  const dateStr = targetDate || new Date().toISOString().split("T")[0];

  const fetchCached = unstable_cache(
    async () => {
      const [todayLogs, totalCards, activeCards] = await Promise.all([
        prisma.mealLog.findMany({
          where: { date: dateStr },
          select: {
            id: true,
            mealSession: true,
            portionQty: true,
            studentId: true,
          },
        }),
        prisma.mealCard.count(),
        prisma.mealCard.count({ where: { status: "ACTIVE" } }),
      ]);

      const totalMealsServed = todayLogs.reduce((acc, l) => acc + l.portionQty, 0);
      const uniqueStudentsServed = new Set(todayLogs.map((l) => l.studentId)).size;

      const breakfastAndMilkCount = todayLogs
        .filter((l) => l.mealSession === "BREAKFAST_MILK")
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
        breakfastAndMilkCount,
        lunchCount,
        dinnerCount,
        specialBreakCount,
      };
    },
    [`meal-stats-${dateStr}`],
    { tags: ["meal-stats", "meal-logs"] }
  );

  return await fetchCached();
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
  const { cardNumber, studentId, mealSession, portionQty = 1, servedBy, notes } = params;
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

  if (card.planType === "MILK_NUTRITION_AWARD" && mealSession !== "BREAKFAST_MILK" && mealSession !== "SPECIAL_BREAK") {
    return {
      success: false,
      error: "PLAN_INELIGIBLE",
      student: card.student,
      message: "This card is a designated Milk & Nutrition Award pass (valid for Morning Milk & Break).",
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

  const sessionName = {
    BREAKFAST_MILK: "Breakfast & Milk Rations",
    LUNCH: "Lunch Service",
    DINNER: "Dinner / Supper",
    SPECIAL_BREAK: "Special Nutrition Break",
  }[mealSession];

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
  milkQuota?: number;
  dailyQuota?: number;
  points?: number;
}) {
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
        milkQuota: data.milkQuota !== undefined ? data.milkQuota : existingByStudent.milkQuota,
        dailyQuota: data.dailyQuota !== undefined ? data.dailyQuota : existingByStudent.dailyQuota,
        points: data.points !== undefined ? data.points : existingByStudent.points,
      },
      include: { student: { select: { name: true } } },
    });
  } else {
    card = await prisma.mealCard.create({
      data: {
        cardNumber: generatedCardNum,
        studentId: data.studentId,
        planType: data.planType,
        status: data.status || "ACTIVE",
        allergies: data.allergies || null,
        milkQuota: data.milkQuota || 1,
        dailyQuota: data.dailyQuota || 3,
        points: data.points !== undefined ? data.points : 100,
      },
      include: { student: { select: { name: true } } },
    });
  }

  revalidateTag("meal-cards");
  revalidateTag("meal-stats");

  return JSON.parse(JSON.stringify(card));
}

export async function batchGenerateMealCards() {
  const studentsWithoutCard = await prisma.student.findMany({
    where: { mealCard: null },
    select: { id: true, name: true },
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
        planType: "BOARDING_FULL",
        status: "ACTIVE",
        milkQuota: 1,
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
  const card = await prisma.mealCard.update({
    where: { id: cardId },
    data: { status },
  });

  revalidateTag("meal-cards");
  return JSON.parse(JSON.stringify(card));
}
