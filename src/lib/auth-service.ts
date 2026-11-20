import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { ENTERPRISE_FINANCE_USERS, FinanceAuthUser } from "./finance-users";

export type UserRole = "SUPER_ADMIN" | "BURSAR" | "CASHIER" | "AUDITOR" | "TEACHER" | "STUDENT";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  title?: string;
  classId?: string;
  permissions?: string[];
  workstationId?: string;
}

export const SESSION_COOKIE_NAME = "ws_session_token";

const AUTH_SECRET_STRING =
  process.env.AUTH_SECRET ||
  process.env.NEXTAUTH_SECRET ||
  "edurexa-enterprise-multi-tenant-jwt-secret-key-2026";

const secretKey = new TextEncoder().encode(AUTH_SECRET_STRING);

/**
 * Signs a cryptographically secure JWT token containing the authenticated user's session.
 */
export async function signSessionToken(user: SessionUser): Promise<string> {
  return await new SignJWT({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    title: user.title,
    classId: user.classId,
    permissions: user.permissions,
    workstationId: user.workstationId,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey);
}

/**
 * Verifies a JWT session token and returns the decoded user payload.
 */
export async function verifySessionToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return {
      id: payload.id as string,
      name: payload.name as string,
      email: payload.email as string,
      role: payload.role as UserRole,
      title: payload.title as string | undefined,
      classId: payload.classId as string | undefined,
      permissions: payload.permissions as string[] | undefined,
      workstationId: payload.workstationId as string | undefined,
    };
  } catch (err) {
    return null;
  }
}

/**
 * Sets an httpOnly, Secure, SameSite=Lax cookie with the session JWT.
 */
export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

/**
 * Clears the session cookie upon logout.
 */
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Retrieves the currently authenticated session user from server request cookies.
 */
export async function getServerSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;
    return await verifySessionToken(token);
  } catch (err) {
    return null;
  }
}

/**
 * Server-side authorization guard.
 * Throws an error if the user is not authenticated or lacks one of the required roles.
 */
export async function requireAuth(allowedRoles?: UserRole[]): Promise<SessionUser> {
  const session = await getServerSession();
  if (!session) {
    throw new Error("UNAUTHORIZED: Active authenticated session required.");
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(session.role)) {
    throw new Error(`FORBIDDEN: Access restricted. Role '${session.role}' is not authorized.`);
  }

  return session;
}

/**
 * Secure password verifier that supports both hashed passwords and legacy demo seeds.
 */
export async function verifyPassword(plainInput: string, storedHashOrPlain: string): Promise<boolean> {
  if (!plainInput || !storedHashOrPlain) return false;

  const trimmedInput = plainInput.trim();
  const trimmedStored = storedHashOrPlain.trim();

  // 1. If stored as a bcrypt hash (starts with $2a$, $2b$, or $2y$)
  if (/^\$2[aby]\$\d+\$/.test(trimmedStored)) {
    try {
      return await bcrypt.compare(trimmedInput, trimmedStored);
    } catch {
      return false;
    }
  }

  // 2. Direct string equality (for existing demo seeds during migration)
  if (trimmedInput === trimmedStored) return true;

  // 3. Flexible demo password fallback
  if (
    (trimmedStored === "password123!" && trimmedInput === "password123") ||
    (trimmedStored === "password123" && trimmedInput === "password123!")
  ) {
    return true;
  }

  return false;
}

/**
 * Hashes a plaintext password using bcrypt with standard cost factor 10.
 */
export async function hashPassword(plain: string): Promise<string> {
  return await bcrypt.hash(plain.trim(), 10);
}
