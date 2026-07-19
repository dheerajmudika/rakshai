import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

/**
 * This module is intentionally dependency-light (jose + next/headers only)
 * so it can be imported from middleware.ts, which runs on the Edge Runtime
 * and cannot load native Node modules like better-sqlite3 or bcryptjs.
 * Anything that touches the database or bcrypt lives in lib/auth.ts instead.
 */

export const SESSION_COOKIE = "rakshai_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

export interface SessionPayload {
  sub: string; // user id
  email: string;
  role: string;
  name: string;
}

function requireSecretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error(
      "JWT_SECRET is not set. Add JWT_SECRET to your .env file (see .env.example)."
    );
  }
  return new TextEncoder().encode(secret);
}

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(requireSecretKey());
}

/** Edge + Node compatible verification — safe to call from middleware.ts */
export async function verifySessionToken(
  token: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, requireSecretKey());
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

/** Set the session cookie on the response (Route Handlers use this). */
export async function setSessionCookie(payload: SessionPayload) {
  const token = await signSession(payload);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

/** Read + verify the session cookie from the current request (Server Components / Route Handlers). */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}
