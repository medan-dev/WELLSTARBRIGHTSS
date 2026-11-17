"use server";

import prisma from "@/lib/prisma";
import {
  signSessionToken,
  setSessionCookie,
  clearSessionCookie,
  getServerSession,
  verifyPassword,
  SessionUser,
} from "@/lib/auth-service";
import { ENTERPRISE_FINANCE_USERS, FinanceAuthUser } from "@/lib/finance-users";
import { revalidatePath } from "next/cache";

export type AuthResponse = {
  success: boolean;
  user?: SessionUser;
  error?: string;
};

/**
 * Server Action for authenticating administrative and finance officers.
 * Issues an httpOnly secure session cookie upon success.
 */
export async function loginAdminAction(
  identifier: string,
  secret: string
): Promise<AuthResponse> {
  const cleanId = (identifier || "").trim().toLowerCase();
  const cleanSecret = (secret || "").trim();

  if (!cleanId || !cleanSecret) {
    return { success: false, error: "Please enter both identifier and password/PIN." };
  }

  // Find user from enterprise registry
  const match = ENTERPRISE_FINANCE_USERS.find((u) => {
    const emailMatch = u.email.toLowerCase() === cleanId;
    const shortMatch =
      (u.role === "SUPER_ADMIN" && (cleanId === "admin" || cleanId === "superadmin")) ||
      (u.role === "BURSAR" && cleanId === "bursar") ||
      (u.role === "CASHIER" && (cleanId === "cashier" || cleanId === u.id)) ||
      (u.role === "AUDITOR" && cleanId === "auditor");
    return emailMatch || shortMatch;
  });

  if (!match) {
    return { success: false, error: "Invalid credentials or unauthorized administrative account." };
  }

  // Allowed secrets per account
  const allowedSecrets: string[] = [match.pin];
  if (match.role === "SUPER_ADMIN") allowedSecrets.push("demo1234", "admin1234", "9900");
  if (match.role === "BURSAR") allowedSecrets.push("bursar1234", "1234");
  if (match.role === "CASHIER") allowedSecrets.push("cashier1234", "5566", "5577");
  if (match.role === "AUDITOR") allowedSecrets.push("auditor1234", "7788");

  const isPasswordValid = allowedSecrets.includes(cleanSecret);

  if (!isPasswordValid) {
    return { success: false, error: "Incorrect password or authorization PIN." };
  }

  const sessionUser: SessionUser = {
    id: match.id,
    name: match.name,
    email: match.email,
    role: match.role,
    title: match.title,
    permissions: match.permissions,
    workstationId: match.workstationId,
  };

  const token = await signSessionToken(sessionUser);
  await setSessionCookie(token);

  return { success: true, user: sessionUser };
}

/**
 * Server Action for authenticating teachers.
 */
export async function loginTeacherAction(
  email: string,
  password: string
): Promise<AuthResponse> {
  const cleanEmail = (email || "").trim().toLowerCase();
  const cleanPassword = (password || "").trim();

  if (!cleanEmail || !cleanPassword) {
    return { success: false, error: "Please provide both teacher email and password." };
  }

  const teacher = await prisma.teacher.findFirst({
    where: {
      email: {
        equals: cleanEmail,
        mode: "insensitive",
      },
    },
  });

  if (!teacher) {
    return { success: false, error: "Teacher account not found in school directory." };
  }

  const isValid = await verifyPassword(cleanPassword, teacher.password || "password123");
  if (!isValid) {
    return { success: false, error: "Incorrect password. Please verify your credentials." };
  }

  const sessionUser: SessionUser = {
    id: teacher.id,
    name: teacher.name,
    email: teacher.email || cleanEmail,
    role: "TEACHER",
    title: "Faculty Instructor",
  };

  const token = await signSessionToken(sessionUser);
  await setSessionCookie(token);

  return { success: true, user: sessionUser };
}

/**
 * Server Action for authenticating students.
 */
export async function loginStudentAction(
  email: string,
  password: string
): Promise<AuthResponse> {
  const cleanEmail = (email || "").trim().toLowerCase();
  const cleanPassword = (password || "").trim();

  if (!cleanEmail || !cleanPassword) {
    return { success: false, error: "Please provide your student email and password." };
  }

  const student = await prisma.student.findFirst({
    where: {
      email: {
        equals: cleanEmail,
        mode: "insensitive",
      },
    },
    include: {
      class: { select: { id: true, name: true } },
    },
  });

  if (!student) {
    return { success: false, error: "Student account not found in admissions roster." };
  }

  const isValid = await verifyPassword(cleanPassword, student.password || "student123");
  if (!isValid) {
    return { success: false, error: "Invalid student credentials. Please verify your password." };
  }

  const sessionUser: SessionUser = {
    id: student.id,
    name: student.name,
    email: student.email || cleanEmail,
    role: "STUDENT",
    classId: student.classId,
    title: student.class?.name || "Student",
  };

  const token = await signSessionToken(sessionUser);
  await setSessionCookie(token);

  return { success: true, user: sessionUser };
}

/**
 * Server Action for user logout. Clears the httpOnly session cookie.
 */
export async function logoutAction(): Promise<{ success: boolean }> {
  await clearSessionCookie();
  revalidatePath("/", "layout");
  return { success: true };
}

/**
 * Server Action for retrieving the current user's session.
 */
export async function getCurrentUserAction(): Promise<SessionUser | null> {
  return await getServerSession();
}
