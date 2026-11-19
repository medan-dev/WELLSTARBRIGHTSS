"use server";

import {
  getGlobalPlatformMetrics,
  getAllSchoolOrganizations,
  provisionNewSchoolOrganization,
  toggleSchoolStatus,
  updateSchoolCampusQuota,
  GlobalSaaSTelemetry,
  DetailedSchoolGroup,
} from "./super-admin-service";

export interface SuperAdminResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function getGlobalMetricsAction(): Promise<SuperAdminResult<GlobalSaaSTelemetry>> {
  try {
    const data = await getGlobalPlatformMetrics();
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to load platform metrics." };
  }
}

export async function getAllSchoolsAction(): Promise<SuperAdminResult<DetailedSchoolGroup[]>> {
  try {
    const data = await getAllSchoolOrganizations();
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to load school organizations." };
  }
}

export async function provisionSchoolAction(input: {
  name: string;
  code: string;
  motto?: string;
  contactEmail: string;
  contactPhone: string;
  website?: string;
  maxCampuses?: number;
  primaryCampus: {
    name: string;
    code: string;
    location?: string;
    headteacher?: string;
    contactPhone?: string;
    contactEmail?: string;
  };
  adminUser?: {
    name: string;
    email: string;
    password?: string;
  };
}): Promise<SuperAdminResult> {
  try {
    const result = await provisionNewSchoolOrganization(input);
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to provision school organization." };
  }
}

export async function toggleSchoolStatusAction(
  schoolId: string,
  status: "ACTIVE" | "SUSPENDED"
): Promise<SuperAdminResult> {
  try {
    const updated = await toggleSchoolStatus(schoolId, status);
    return { success: true, data: updated };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update school status." };
  }
}

export async function updateCampusQuotaAction(
  schoolId: string,
  newQuota: number
): Promise<SuperAdminResult> {
  try {
    const updated = await updateSchoolCampusQuota(schoolId, newQuota);
    return { success: true, data: updated };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update campus quota." };
  }
}
