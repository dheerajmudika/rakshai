import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import type { User } from "@/lib/db/schema";

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function jsonOk<T extends object>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

/** Resolve the current authenticated user or return a 401 response. */
export async function requireUser(): Promise<
  { user: User } | { error: NextResponse }
> {
  const user = await getCurrentUser();
  if (!user) {
    return { error: jsonError("Not authenticated.", 401) };
  }
  return { user };
}

export function isError<T>(
  result: T | { error: NextResponse }
): result is { error: NextResponse } {
  return (result as { error: NextResponse }).error !== undefined;
}
