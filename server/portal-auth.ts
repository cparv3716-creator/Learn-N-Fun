import "server-only";

import crypto from "node:crypto";
import { PortalRole as PrismaPortalRole } from "@prisma/client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  readPortalEmail,
  readPortalPassword,
  verifyPortalPassword,
} from "@/server/portal-accounts";

export type PortalRole = "parent" | "student";

type EncodedPortalSession = {
  accountId: string;
  expiresAt: number;
};

type PortalSessionAccount = {
  email: string;
  id: string;
  role: PrismaPortalRole;
};

type PortalSession = {
  accountId: string;
  email: string;
  expiresAt: number;
  role: PortalRole;
};

const PORTAL_SESSION_COOKIE = "learn_n_fun_portal_session";
const PORTAL_SESSION_MAX_AGE = 60 * 60 * 12;

function getEnvRaw(name: string) {
  return process.env[name] ?? "";
}

function timingSafeEqualText(left: string, right: string) {
  const leftBuffer = crypto.createHash("sha256").update(left).digest();
  const rightBuffer = crypto.createHash("sha256").update(right).digest();

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function getPortalSecret() {
  return getEnvRaw("PORTAL_SESSION_SECRET");
}

function toPortalRole(role: PrismaPortalRole): PortalRole {
  return role === PrismaPortalRole.STUDENT ? "student" : "parent";
}

function signSessionPayload(payload: string) {
  return crypto
    .createHmac("sha256", getPortalSecret())
    .update(payload)
    .digest("base64url");
}

function encodeSessionValue(session: EncodedPortalSession) {
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  const signature = signSessionPayload(payload);

  return `${payload}.${signature}`;
}

function decodeSessionValue(value: string): EncodedPortalSession | null {
  const [payload, signature] = value.split(".");

  if (!payload || !signature) {
    return null;
  }

  const expectedSignature = signSessionPayload(payload);

  if (!timingSafeEqualText(signature, expectedSignature)) {
    return null;
  }

  try {
    const decoded = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as EncodedPortalSession;

    if (
      typeof decoded.accountId !== "string" ||
      !decoded.accountId ||
      typeof decoded.expiresAt !== "number" ||
      !Number.isFinite(decoded.expiresAt)
    ) {
      return null;
    }

    return decoded;
  } catch {
    return null;
  }
}

async function getPortalAccountById(accountId: string) {
  return prisma.portalAccount.findUnique({
    select: {
      email: true,
      id: true,
      role: true,
    },
    where: { id: accountId },
  });
}

export function isPortalAuthConfigured() {
  return Boolean(getPortalSecret());
}

export async function verifyPortalCredentials(email: string, password: string) {
  if (!isPortalAuthConfigured()) {
    return null;
  }

  const normalizedEmail = readPortalEmail(email);
  const submittedPassword = readPortalPassword(password);

  if (!normalizedEmail || !submittedPassword) {
    return null;
  }

  const account = await prisma.portalAccount.findUnique({
    select: {
      email: true,
      id: true,
      passwordHash: true,
      role: true,
    },
    where: { email: normalizedEmail },
  });

  if (!account) {
    return null;
  }

  if (!verifyPortalPassword(submittedPassword, account.passwordHash)) {
    return null;
  }

  return {
    accountId: account.id,
    email: account.email,
    role: toPortalRole(account.role),
  };
}

export async function createPortalSession(accountId: string) {
  const cookieStore = await cookies();
  const expiresAt = Date.now() + PORTAL_SESSION_MAX_AGE * 1000;

  cookieStore.set(
    PORTAL_SESSION_COOKIE,
    encodeSessionValue({ accountId, expiresAt }),
    {
      httpOnly: true,
      maxAge: PORTAL_SESSION_MAX_AGE,
      path: "/",
      priority: "high",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    },
  );
}

export async function clearPortalSession() {
  const cookieStore = await cookies();

  cookieStore.set(PORTAL_SESSION_COOKIE, "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
    priority: "high",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function getPortalSession(): Promise<PortalSession | null> {
  if (!isPortalAuthConfigured()) {
    return null;
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(PORTAL_SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  const decodedSession = decodeSessionValue(token);

  if (!decodedSession || decodedSession.expiresAt <= Date.now()) {
    return null;
  }

  let account: PortalSessionAccount | null = null;

  try {
    account = await getPortalAccountById(decodedSession.accountId);
  } catch (error) {
    console.error("Failed to load portal session account", error);
    return null;
  }

  if (!account) {
    return null;
  }

  return {
    accountId: account.id,
    email: account.email,
    expiresAt: decodedSession.expiresAt,
    role: toPortalRole(account.role),
  };
}

export async function requirePortalSession() {
  const session = await getPortalSession();

  if (!session) {
    redirect("/dashboard/login");
  }

  return session;
}
