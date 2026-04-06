import "server-only";

import crypto from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const ADMIN_SESSION_COOKIE = "learn_n_fun_admin_session";
const ADMIN_SESSION_MAX_AGE = 60 * 60 * 12;

type EncodedAdminSession = {
  expiresAt: number;
  username: string;
};

function getEnvRaw(name: string) {
  return process.env[name] ?? "";
}

function getEnvTrimmed(name: string) {
  return getEnvRaw(name).trim();
}

function timingSafeEqualText(left: string, right: string) {
  const leftBuffer = crypto.createHash("sha256").update(left).digest();
  const rightBuffer = crypto.createHash("sha256").update(right).digest();

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function getAdminSecret() {
  return getEnvRaw("ADMIN_SESSION_SECRET");
}

function getAdminUsername() {
  return getEnvTrimmed("ADMIN_USERNAME");
}

function isPasswordMatch(password: string) {
  const passwordHash = getEnvTrimmed("ADMIN_PASSWORD_HASH");
  const plainPassword = getEnvRaw("ADMIN_PASSWORD");

  if (passwordHash) {
    if (passwordHash.startsWith("sha256:")) {
      const expectedHash = passwordHash.slice("sha256:".length);
      const submittedHash = crypto
        .createHash("sha256")
        .update(password)
        .digest("hex");

      return timingSafeEqualText(submittedHash, expectedHash);
    }

    if (passwordHash.startsWith("scrypt:")) {
      const [, salt, expectedHash] = passwordHash.split(":");

      if (!salt || !expectedHash) {
        return false;
      }

      const derivedKey = crypto
        .scryptSync(password, salt, Buffer.from(expectedHash, "hex").length)
        .toString("hex");

      return timingSafeEqualText(derivedKey, expectedHash);
    }

    return false;
  }

  if (!plainPassword) {
    return false;
  }

  return timingSafeEqualText(password, plainPassword);
}

function signSessionPayload(payload: string) {
  return crypto
    .createHmac("sha256", getAdminSecret())
    .update(payload)
    .digest("base64url");
}

function encodeSessionValue(session: EncodedAdminSession) {
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  const signature = signSessionPayload(payload);

  return `${payload}.${signature}`;
}

function decodeSessionValue(value: string): EncodedAdminSession | null {
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
    ) as EncodedAdminSession;

    if (
      typeof decoded.username !== "string" ||
      !decoded.username ||
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

export function isAdminAuthConfigured() {
  return Boolean(
    getAdminUsername() &&
      getAdminSecret() &&
      (getEnvRaw("ADMIN_PASSWORD") || getEnvTrimmed("ADMIN_PASSWORD_HASH")),
  );
}

export async function verifyAdminCredentials(
  username: string,
  password: string,
) {
  if (!isAdminAuthConfigured()) {
    return false;
  }

  if (!timingSafeEqualText(username, getAdminUsername())) {
    return false;
  }

  return isPasswordMatch(password);
}

export async function createAdminSession(username: string) {
  const cookieStore = await cookies();
  const expiresAt = Date.now() + ADMIN_SESSION_MAX_AGE * 1000;

  cookieStore.set(
    ADMIN_SESSION_COOKIE,
    encodeSessionValue({ expiresAt, username }),
    {
      httpOnly: true,
      maxAge: ADMIN_SESSION_MAX_AGE,
      path: "/",
      priority: "high",
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    },
  );
}

export async function clearAdminSession() {
  const cookieStore = await cookies();

  cookieStore.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
    priority: "high",
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function getAdminSession() {
  if (!isAdminAuthConfigured()) {
    return null;
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  const session = decodeSessionValue(token);

  if (!session || session.expiresAt <= Date.now()) {
    return null;
  }

  if (!timingSafeEqualText(session.username, getAdminUsername())) {
    return null;
  }

  return {
    expiresAt: session.expiresAt,
    username: session.username,
  };
}

export async function requireAdminSession() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return session;
}
