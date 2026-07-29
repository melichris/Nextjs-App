import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Extend Node's global object type to store the Prisma instance
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Initialize the Prisma PostgreSQL adapter with our connection string
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

// Reuse existing Prisma client in dev mode or create a new instance
export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
