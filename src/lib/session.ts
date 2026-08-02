import { cookies } from "next/headers";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

const SESSION_MAX_AGE_SECONDS = 30 * 24 * 60 * 60; // 30 days, matches Auth.js's default

export async function createDatabaseSession(userId: string) {
  const sessionToken = crypto.randomUUID();
  const expires = new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000);

  await prisma.session.create({
    data: { sessionToken, userId, expires },
  });

  const isProd = process.env.NODE_ENV === "production";
  const cookieName = isProd
    ? "__Secure-authjs.session-token"
    : "authjs.session-token";

  const cookieStore = await cookies();
  cookieStore.set(cookieName, sessionToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProd,
    path: "/",
    expires,
  });
}
