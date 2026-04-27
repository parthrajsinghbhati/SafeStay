import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const rooms = await prisma.room.findMany();
  console.log(`Total rooms: ${rooms.length}`);
  rooms.forEach(r => console.log(`- ${r.name} (${r.roomNumber})`));
}

main().catch(console.error).finally(() => prisma.$disconnect());
