import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};
const requiredModelDelegates = [
  "program",
  "testimonial",
  "demoRequest",
  "contactMessage",
  "franchiseApplication",
  "portalAccount",
  "portalProfile",
  "enrollment",
  "attendance",
  "progress",
  "payment",
  "teacherNote",
] as const;

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is not configured.");
  }

  return new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

function getPrismaClient() {
  if (
    !globalForPrisma.prisma ||
    requiredModelDelegates.some(
      (delegate) =>
        typeof Reflect.get(globalForPrisma.prisma as object, delegate) ===
        "undefined",
    )
  ) {
    globalForPrisma.prisma = createPrismaClient();
  }

  return globalForPrisma.prisma;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, property) {
    const client = getPrismaClient();
    const value = Reflect.get(client, property);

    return typeof value === "function" ? value.bind(client) : value;
  },
});
