import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { email: "ops@clario.example" },
    update: {},
    create: {
      name: "Clario Ops",
      email: "ops@clario.example",
      role: "ADMIN",
    },
  });

  // Demo data shape mirrors src/internal/data/intelligenceSeed.ts.
  // In production, replace this with imports from a shared seed package or JSON file.
  console.log("Seeded Clario admin user. Add jobs/leads/tasks from intelligence seed data as the backend is connected.");
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });
