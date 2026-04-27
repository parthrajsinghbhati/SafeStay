import { PrismaClient, Role, RoomStatus } from '@prisma/client';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clean existing data
  await prisma.booking.deleteMany();
  await prisma.maintenanceTicket.deleteMany();
  await prisma.room.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  // Create 3 Owners
  const owners = await Promise.all(
    Array.from({ length: 3 }).map(async (_, i) => {
      const passwordHash = await bcrypt.hash('password123', 10);
      return prisma.user.create({
        data: {
          email: `owner${i + 1}@safestay.com`,
          passwordHash,
          role: Role.OWNER,
          profile: {
            create: {
              firstName: faker.person.firstName(),
              lastName: faker.person.lastName(),
              phone: faker.phone.number(),
            },
          },
        },
      });
    })
  );

  // Create 1 Student for testing
  const studentPasswordHash = await bcrypt.hash('password123', 10);
  await prisma.user.create({
    data: {
      email: 'student@safestay.com',
      passwordHash: studentPasswordHash,
      role: Role.STUDENT,
      profile: {
        create: {
          firstName: 'John',
          lastName: 'Doe',
          phone: faker.phone.number(),
        },
      },
    },
  });

  // Create 10 Properties (distributed among owners)
  for (let i = 0; i < 10; i++) {
    const owner = owners[i % owners.length];
    if (!owner) continue;
    
    // Each property has 5 rooms
    for (let j = 0; j < 5; j++) {
      await prisma.room.create({
        data: {
          ownerId: owner.id,
          name: `${faker.company.name()} - ${faker.location.city()}`,
          description: faker.lorem.paragraph(),
          location: faker.location.streetAddress(),
          roomNumber: `RM-${i + 1}-${j + 1}-${faker.string.alphanumeric(3).toUpperCase()}`,
          basePrice: faker.number.int({ min: 500, max: 2000 }),
          status: RoomStatus.AVAILABLE,
          version: 0,
          images: [faker.image.urlPicsumPhotos({ width: 800, height: 600 })],
          amenities: faker.helpers.arrayElements(['WiFi', 'AC', 'Meal Plan', 'Gym', 'Laundry'], { min: 2, max: 4 }),
          rating: faker.number.float({ min: 3.5, max: 5, fractionDigits: 1 }),
        },
      });
    }
  }

  console.log('✅ Seeding complete!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
