import { PrismaClient } from "@prisma/client";
const state = globalThis as unknown as { prisma?: PrismaClient };
export const db = state.prisma ?? new PrismaClient({ log: ["error"] });
if (process.env.NODE_ENV !== "production") state.prisma = db;
