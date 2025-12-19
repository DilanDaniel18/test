import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.commissionRange.deleteMany();
  await prisma.client.deleteMany();

  await prisma.client.create({
    data: {
      name: "Dilan",
      commissions: {
        create: [
          { minDays: 0, maxDays: 7, percentage: 25 },
          { minDays: 8, maxDays: 14, percentage: 20 },
          { minDays: 15, maxDays: 21, percentage: 15 },
          { minDays: 22, maxDays: 30, percentage: 10 },
          { minDays: 31, maxDays: null, percentage: 0 },
        ]
      }
    }
  });

  await prisma.client.create({
    data: {
      name: "Yair",
      commissions: {
        create: [
          { minDays: 0, maxDays: 10, percentage: 20 },
          { minDays: 11, maxDays: 20, percentage: 15 },
          { minDays: 21, maxDays: 30, percentage: 8 },
          { minDays: 31, maxDays: null, percentage: 0 },
        ]
      }
    }
  });

  console.log("Clientes 1 y 2 configurados correctamente.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });