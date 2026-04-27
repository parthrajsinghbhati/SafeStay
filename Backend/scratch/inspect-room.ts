import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const room = await prisma.room.findFirst({ where: { name: 'rishihood' } });
  console.log(JSON.stringify(room, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
