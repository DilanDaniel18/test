import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.commissionRange.deleteMany();
  await prisma.client.deleteMany();

  await prisma.client.create({
    data: {
      name: "Cliente A",
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
      name: "Cliente B",
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

  console.log("Clientes A y B configurados correctamente.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });