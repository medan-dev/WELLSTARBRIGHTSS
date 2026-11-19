"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import {
  getCampusesWithTelemetry,
  createCampusWithGuardrails,
  initializeDefaultSchoolAndCampus,
  MAX_CAMPUSES_PER_SCHOOL,
  CampusTelemetry,
} from "./campus-service";

export interface CampusActionResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Fetches all registered campuses under the active school organization with live telemetry.
 */
export async function getCampusesAction(): Promise<CampusActionResult<{ campuses: CampusTelemetry[]; maxLimit: number }>> {
  try {
    const campuses = await getCampusesWithTelemetry();
    return {
      success: true,
      data: {
        campuses,
        maxLimit: MAX_CAMPUSES_PER_SCHOOL,
      },
    };
  } catch (error: any) {
    console.error("Failed to load campuses:", error);
    return {
      success: false,
      error: error.message || "Failed to load campuses.",
    };
  }
}

/**
 * Gets the current active campus ID from cookies (or 'ALL' for consolidated group view).
 */
export async function getActiveCampusIdAction(): Promise<string> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get("ws_active_campus_id")?.value || "ALL";
  } catch {
    return "ALL";
  }
}

/**
 * Sets the active campus ID in cookies.
 * Pass 'ALL' to view consolidated group data across all campuses.
 */
export async function setActiveCampusAction(campusId: string): Promise<CampusActionResult<{ activeCampusId: string }>> {
  try {
    const cookieStore = await cookies();
    cookieStore.set("ws_active_campus_id", campusId, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      httpOnly: false, // Accessible to client components for reactive telemetry
    });

    revalidatePath("/admin/dashboard");
    return {
      success: true,
      data: { activeCampusId: campusId },
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to set active campus.",
    };
  }
}

/**
 * Server action to register a new campus with enterprise guardrails (Max 20 campuses per school).
 */
export async function createCampusAction(input: {
  name: string;
  code: string;
  location?: string;
  headteacher?: string;
  contactEmail?: string;
  contactPhone?: string;
}): Promise<CampusActionResult> {
  try {
    // Ensure school organization exists
    const init = await initializeDefaultSchoolAndCampus();
    const schoolId = init.org.id;

    const newCampus = await createCampusWithGuardrails({
      schoolId,
      name: input.name,
      code: input.code,
      location: input.location,
      headteacher: input.headteacher,
      contactEmail: input.contactEmail,
      contactPhone: input.contactPhone,
    });

    revalidatePath("/admin/dashboard");
    return {
      success: true,
      data: newCampus,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to create campus.",
    };
  }
}
