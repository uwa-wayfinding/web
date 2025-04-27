import { serverEnv } from "@/lib/env";
import { PrismaClient } from "@/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const db = globalForPrisma.prisma || new PrismaClient();

if (serverEnv.NODE_ENV !== "production") globalForPrisma.prisma = db;
