import "server-only";

import crypto from "node:crypto";
import { PortalRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const MAX_NAME_LENGTH = 80;
const MAX_CITY_LENGTH = 80;
const MIN_PASSWORD_LENGTH = 8;

export type PortalSignupField =
  | "city"
  | "confirmPassword"
  | "email"
  | "fullName"
  | "password"
  | "phone"
  | "role"
  | "studentAge"
  | "studentName";

export type PortalSignupInput = {
  city: string;
  email: string;
  fullName: string;
  password: string;
  phone: string;
  role: PortalRole;
  studentAge: string;
  studentName: string;
};

export type PortalSignupResult =
  | {
      fieldErrors: Partial<Record<PortalSignupField, string>>;
      ok: false;
    }
  | {
      accountId: string;
      email: string;
      ok: true;
      role: "parent" | "student";
    };

function normalizeText(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

export function readPortalSignupInput(formData: FormData): PortalSignupInput {
  const rawRole = normalizeText(formData.get("role")).toUpperCase();

  return {
    city: normalizeText(formData.get("city")),
    email: normalizeText(formData.get("email")).toLowerCase(),
    fullName: normalizeText(formData.get("fullName")),
    password: typeof formData.get("password") === "string" ? String(formData.get("password")) : "",
    phone: normalizeText(formData.get("phone")),
    role: rawRole === "STUDENT" ? PortalRole.STUDENT : PortalRole.PARENT,
    studentAge: normalizeText(formData.get("studentAge")),
    studentName: normalizeText(formData.get("studentName")),
  };
}

export function readPortalEmail(value: FormDataEntryValue | null) {
  return normalizeText(value).toLowerCase();
}

export function readPortalPassword(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value : "";
}

export function validatePortalPassword(password: string) {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return "Use at least 8 characters for the password.";
  }

  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    return "Use a password with at least one letter and one number.";
  }

  return null;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone: string) {
  return /^\+?[0-9]{7,15}$/.test(phone.replace(/[^\d+]/g, ""));
}

function normalizePhone(phone: string) {
  return phone.replace(/[^\d+]/g, "");
}

function parseNotesValue(notes: string | null | undefined, label: string) {
  if (!notes) {
    return null;
  }

  const pattern = new RegExp(`${label}:\\s*([^|]+)`);
  const match = notes.match(pattern);
  return match?.[1]?.trim() ?? null;
}

export function getRecommendedLevel(programName: string | null) {
  switch (programName) {
    case "Spark Beginners":
      return "Foundation Entry";
    case "Focus Builders":
      return "Level 2 Starter";
    case "Championship Track":
      return "Advanced Track";
    case "Need guidance":
      return "Recommendation pending";
    default:
      return null;
  }
}

export function hashPortalPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, 64).toString("hex");
  return `scrypt:${salt}:${derivedKey}`;
}

export function verifyPortalPassword(password: string, passwordHash: string) {
  if (!passwordHash.startsWith("scrypt:")) {
    return false;
  }

  const [, salt, expectedHash] = passwordHash.split(":");

  if (!salt || !expectedHash) {
    return false;
  }

  const derivedKey = crypto
    .scryptSync(password, salt, Buffer.from(expectedHash, "hex").length)
    .toString("hex");

  const derivedBuffer = crypto.createHash("sha256").update(derivedKey).digest();
  const expectedBuffer = crypto
    .createHash("sha256")
    .update(expectedHash)
    .digest();

  return crypto.timingSafeEqual(derivedBuffer, expectedBuffer);
}

export async function registerPortalAccount(
  input: PortalSignupInput,
  confirmPassword: string,
): Promise<PortalSignupResult> {
  const fieldErrors: Partial<Record<PortalSignupField, string>> = {};
  const normalizedPhone = normalizePhone(input.phone);
  const ageValue = Number.parseInt(input.studentAge, 10);

  if (!input.fullName) {
    fieldErrors.fullName = "Please enter the account holder's name.";
  } else if (input.fullName.length > MAX_NAME_LENGTH) {
    fieldErrors.fullName = "Please keep the name under 80 characters.";
  }

  if (!input.studentName) {
    fieldErrors.studentName = "Please enter the student's name.";
  } else if (input.studentName.length > MAX_NAME_LENGTH) {
    fieldErrors.studentName = "Please keep the student's name under 80 characters.";
  }

  if (!input.email || !isValidEmail(input.email)) {
    fieldErrors.email = "Please enter a valid email address.";
  }

  if (!input.phone || !isValidPhone(normalizedPhone)) {
    fieldErrors.phone = "Please enter a valid phone number.";
  }

  if (!input.city) {
    fieldErrors.city = "Please enter your city.";
  } else if (input.city.length > MAX_CITY_LENGTH) {
    fieldErrors.city = "Please keep the city name under 80 characters.";
  }

  if (!Number.isInteger(ageValue) || ageValue < 4 || ageValue > 16) {
    fieldErrors.studentAge = "Please choose a valid student age.";
  }

  const passwordError = validatePortalPassword(input.password);
  if (passwordError) {
    fieldErrors.password = passwordError;
  }

  if (!confirmPassword) {
    fieldErrors.confirmPassword = "Please confirm the password.";
  } else if (input.password !== confirmPassword) {
    fieldErrors.confirmPassword = "The passwords do not match.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors, ok: false };
  }

  const existingAccount = await prisma.portalAccount.findUnique({
    where: { email: input.email },
    select: { id: true },
  });

  if (existingAccount) {
    return {
      fieldErrors: {
        email: "An account with this email already exists.",
      },
      ok: false,
    };
  }

  const linkedDemoRequest = await prisma.demoRequest.findFirst({
    orderBy: { createdAt: "desc" },
    where: { email: input.email },
  });

  const modePreference = parseNotesValue(linkedDemoRequest?.notes, "Demo mode");

  const account = await prisma.portalAccount.create({
    data: {
      email: input.email,
      passwordHash: hashPortalPassword(input.password),
      role: input.role,
      profile: {
        create: {
          city: linkedDemoRequest?.city ?? input.city,
          fullName: input.fullName,
          modePreference,
          phone: normalizedPhone,
          preferredSlot: linkedDemoRequest?.preferredSlot ?? null,
          programName: linkedDemoRequest?.programInterest ?? null,
          recommendedLevel: getRecommendedLevel(
            linkedDemoRequest?.programInterest ?? null,
          ),
          sourceDemoRequestId: linkedDemoRequest?.id ?? null,
          studentAge: linkedDemoRequest?.childAge ?? ageValue,
          studentName: linkedDemoRequest?.childName ?? input.studentName,
        },
      },
    },
    select: {
      email: true,
      id: true,
      role: true,
    },
  });

  return {
    accountId: account.id,
    email: account.email,
    ok: true,
    role: account.role === PortalRole.PARENT ? "parent" : "student",
  };
}
