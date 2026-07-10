import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const PROJECT_ROLES = [
  "Site Measurement",
  "Document Collection",
  "Panchayat Follow-up",
  "Data Verification",
  "Client Contact",
  "Drawing & Data Verification",
  "K-SMART Updates",
  "Floor Plan",
  "Area Calculation",
  "Rule Chart",
  "K-SMART",
  "Site Plan"
];

const DAILY_TASKS = [
  "Daily Work Allocation",
  "Team Coordination",
  "Conduct Daily Meetings",
  "Monitor Each Project",
  "Fire & Pollution NOC Follow-up"
];

async function main() {
  console.log("Seeding Project Roles...");
  for (const name of PROJECT_ROLES) {
    await prisma.projectRole.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log("Seeding Daily Responsibilities...");
  for (const name of DAILY_TASKS) {
    await prisma.dailyResponsibility.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
