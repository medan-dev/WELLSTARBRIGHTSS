"use server";

import {
  getClusterPerformanceVitals,
  getCampusesHealthMatrix,
  getPlatformErrorLogs,
  resolvePlatformErrorLog,
  emergencyLockdownBranch,
  emergencyRestoreBranch,
  triggerImmediateDatabaseSnapshot,
  getBackupHistory,
  executeRealCsvMigration,
  ClusterPerformanceVitals,
  CampusHealthTelemetry,
} from "./super-admin-observability";

export interface ObservabilityResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function getClusterPerformanceAction(): Promise<ObservabilityResult<ClusterPerformanceVitals>> {
  try {
    const data = await getClusterPerformanceVitals();
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to load cluster vitals." };
  }
}

export async function getCampusesHealthAction(): Promise<ObservabilityResult<CampusHealthTelemetry[]>> {
  try {
    const data = await getCampusesHealthMatrix();
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to load campus health matrix." };
  }
}

export async function getPlatformErrorsAction(): Promise<ObservabilityResult<any[]>> {
  try {
    const data = await getPlatformErrorLogs(30);
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to load error logs." };
  }
}

export async function resolveErrorAction(logId: string): Promise<ObservabilityResult> {
  try {
    const data = await resolvePlatformErrorLog(logId);
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to resolve error log." };
  }
}

export async function emergencyLockdownAction(
  campusId: string,
  reason: string
): Promise<ObservabilityResult> {
  try {
    const data = await emergencyLockdownBranch(campusId, reason);
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to execute emergency lockdown." };
  }
}

export async function emergencyRestoreAction(campusId: string): Promise<ObservabilityResult> {
  try {
    const data = await emergencyRestoreBranch(campusId);
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to restore campus branch." };
  }
}

export async function triggerSnapshotAction(): Promise<ObservabilityResult<{ backupRecord: any; payloadString: string }>> {
  try {
    const result = await triggerImmediateDatabaseSnapshot("Super Administrator Console");
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to generate snapshot." };
  }
}

export async function getBackupHistoryAction(): Promise<ObservabilityResult<any[]>> {
  try {
    const data = await getBackupHistory(15);
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to load backup history." };
  }
}

export async function runCsvMigrationAction(input: {
  campusId: string;
  csvText: string;
  academicYear?: string;
  term?: string;
}): Promise<ObservabilityResult<{ totalRows: number; importedCount: number; failedCount: number; errors: string[] }>> {
  try {
    const result = await executeRealCsvMigration(input);
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to execute CSV migration." };
  }
}
