import prisma from "@/lib/prisma";
import { revalidateTag } from "next/cache";

export const MAX_CAMPUSES_PER_SCHOOL = 20;
export const MAX_TOTAL_SCHOOLS_LIMIT = 200;

export interface CampusTelemetry {
  id: string;
  name: string;
  code: string;
  location?: string | null;
  headteacher?: string | null;
  status: string;
  studentCount: number;
  teacherCount: number;
  activeMealCards: number;
  unpaidArrears: number;
}

/**
 * Ensures default School Organization and Primary Campus exist,
 * and safely links any unassociated historical records to Campus #1.
 */
export async function initializeDefaultSchoolAndCampus() {
  // 1. Ensure Default School Organization exists
  let org = await prisma.schoolOrganization.findFirst({
    where: { OR: [{ code: "DEMO-2026" }, { code: "WEG-2026" }] },
  });

  if (org && (org.name.includes("Wellstar") || org.code === "WEG-2026")) {
    org = await prisma.schoolOrganization.update({
      where: { id: org.id },
      data: {
        name: "Demo Educational Group",
        code: "DEMO-2026",
      },
    });
  }

  if (!org) {
    org = await prisma.schoolOrganization.create({
      data: {
        id: "sch_demo_hq",
        name: "Demo Educational Group",
        code: "DEMO-2026",
        motto: "Excellence, Discipline & Academic Distinction",
        contactEmail: "admin@yourschool.com",
        contactPhone: "+256 758 611 414",
        website: "https://edurexa.com",
        status: "ACTIVE",
        maxCampuses: MAX_CAMPUSES_PER_SCHOOL, // 20 Campus Hard Limit
      },
    });
  }

  // 2. Ensure Primary Campus exists
  let campus = await prisma.campus.findFirst({
    where: { OR: [{ code: "CAMP-01" }, { code: "MUK-01" }] },
  });

  if (campus && (campus.code === "MUK-01" || campus.name.includes("Mukono") || campus.contactEmail?.includes("wellstar") || campus.contactEmail?.includes("mukono"))) {
    campus = await prisma.campus.update({
      where: { id: campus.id },
      data: {
        name: "Main Campus",
        code: "CAMP-01",
        location: "Central Educational Zone",
        headteacher: "Campus Principal",
        contactEmail: "campus@yourschool.com",
        contactPhone: "+256 758 611 414",
      },
    });
  }

  if (!campus) {
    campus = await prisma.campus.create({
      data: {
        id: "camp_main_01",
        schoolId: org.id,
        name: "Main Campus",
        code: "CAMP-01",
        location: "Central Educational Zone",
        headteacher: "Campus Principal",
        contactEmail: "campus@yourschool.com",
        contactPhone: "+256 758 611 414",
        status: "ACTIVE",
      },
    });
  }

  // 3. Zero-Loss Historical Data Linker:
  // Associate any existing students, teachers, classes, invoices, and meal cards to Campus #1
  await Promise.all([
    prisma.student.updateMany({
      where: { campusId: null },
      data: { campusId: campus.id },
    }),
    prisma.teacher.updateMany({
      where: { campusId: null },
      data: { campusId: campus.id },
    }),
    prisma.class.updateMany({
      where: { campusId: null },
      data: { campusId: campus.id },
    }),
    prisma.studentFeeInvoice.updateMany({
      where: { campusId: null },
      data: { campusId: campus.id },
    }),
    prisma.paymentReceipt.updateMany({
      where: { campusId: null },
      data: { campusId: campus.id },
    }),
    prisma.mealCard.updateMany({
      where: { campusId: null },
      data: { campusId: campus.id },
    }),
    prisma.workstation.updateMany({
      where: { campusId: null },
      data: { campusId: campus.id },
    }),
  ]);

  return { org, campus };
}

/**
 * Retrieves all registered campuses for a school organization with live telemetry.
 */
export async function getCampusesWithTelemetry(schoolId?: string): Promise<CampusTelemetry[]> {
  await initializeDefaultSchoolAndCampus();

  const campuses = await prisma.campus.findMany({
    where: schoolId ? { schoolId } : undefined,
    include: {
      _count: {
        select: {
          students: true,
          teachers: true,
          mealCards: true,
        },
      },
      invoices: {
        where: { balance: { gt: 0 } },
        select: { balance: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return campuses.map((c) => ({
    id: c.id,
    name: c.name,
    code: c.code,
    location: c.location,
    headteacher: c.headteacher,
    status: c.status,
    studentCount: c._count.students,
    teacherCount: c._count.teachers,
    activeMealCards: c._count.mealCards,
    unpaidArrears: c.invoices.reduce((acc, inv) => acc + inv.balance, 0),
  }));
}

/**
 * Creates a new campus with strict enterprise guardrail check (Max 20 campuses per school).
 */
export async function createCampusWithGuardrails(data: {
  schoolId: string;
  name: string;
  code: string;
  location?: string;
  headteacher?: string;
  contactEmail?: string;
  contactPhone?: string;
}) {
  const org = await prisma.schoolOrganization.findUnique({
    where: { id: data.schoolId },
    include: { _count: { select: { campuses: true } } },
  });

  if (!org) {
    throw new Error("School Organization not found.");
  }

  // Enterprise Hard Limit Check
  if (org._count.campuses >= org.maxCampuses) {
    throw new Error(
      `Enterprise Guardrail Triggered: This school group has reached its maximum contract limit of ${org.maxCampuses} campuses.`
    );
  }

  const existingCode = await prisma.campus.findUnique({
    where: { code: data.code.trim().toUpperCase() },
  });

  if (existingCode) {
    throw new Error(`Campus code '${data.code}' is already registered in the system.`);
  }

  const newCampus = await prisma.campus.create({
    data: {
      schoolId: data.schoolId,
      name: data.name.trim(),
      code: data.code.trim().toUpperCase(),
      location: data.location?.trim() || null,
      headteacher: data.headteacher?.trim() || null,
      contactEmail: data.contactEmail?.trim() || null,
      contactPhone: data.contactPhone?.trim() || null,
      status: "ACTIVE",
    },
  });

  revalidateTag("campuses");
  return newCampus;
}
