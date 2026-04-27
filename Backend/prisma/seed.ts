import { PrismaClient, Role, RoomStatus } from '@prisma/client';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  await prisma.booking.deleteMany();
  await prisma.maintenanceTicket.deleteMany();
  await prisma.room.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  const owners = await Promise.all(
    Array.from({ length: 5 }).map(async () => {
      const passwordHash = await bcrypt.hash('password123', 10);
      return prisma.user.create({
        data: {
          email: faker.internet.email().toLowerCase(),
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

  await Promise.all(
    Array.from({ length: 20 }).map(async () => {
      const passwordHash = await bcrypt.hash('password123', 10);
      return prisma.user.create({
        data: {
          email: faker.internet.email().toLowerCase(),
          passwordHash,
          role: Role.STUDENT,
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

  const properties = await Promise.all(
    Array.from({ length: 10 }).map((_, index) => {
      const owner = owners[index % owners.length]!;
      return prisma.room.create({
        data: {
          ownerId: owner.id,
          name: `${faker.company.name()} Residences`,
          description: faker.lorem.sentences(2),
          location: `${faker.location.city()}, ${faker.location.streetAddress()}`,
          roomNumber: `PROP-${index + 1}-${faker.string.alphanumeric(4).toUpperCase()}`,
          basePrice: faker.number.int({ min: 500, max: 1800 }),
          images: [faker.image.urlPicsumPhotos({ width: 400, height: 300 })],
          amenities: faker.helpers.arrayElements(
            ['WiFi', 'Gym', 'Laundry', 'Food', 'Parking', 'Study Lounge'],
            { min: 2, max: 5 }
          ),
          rating: faker.number.float({ min: 3.5, max: 5, fractionDigits: 1 }),
          status: RoomStatus.AVAILABLE,
          version: 0,
        },
      });
    })
  );

  await Promise.all(
    Array.from({ length: 40 }).map((_, index) => {
      const property = properties[index % properties.length]!;
      const status = faker.helpers.arrayElement([
        RoomStatus.AVAILABLE,
        RoomStatus.BOOKED,
        RoomStatus.MAINTENANCE,
      ]);

      return prisma.room.create({
        data: {
          ownerId: property.ownerId,
          name: `${property.name} - Unit ${index + 1}`,
          description: faker.lorem.sentence(),
          location: property.location,
          roomNumber: `ROOM-${index + 1}-${faker.string.alphanumeric(4).toUpperCase()}`,
          basePrice: faker.number.int({ min: 400, max: 2200 }),
          images: [faker.image.urlPicsumPhotos({ width: 400, height: 300 })],
          amenities: faker.helpers.arrayElements(
            ['WiFi', 'Gym', 'Laundry', 'Food', 'Parking', 'Study Lounge'],
            { min: 1, max: 4 }
          ),
          status,
          rating: faker.number.float({ min: 3.8, max: 5, fractionDigits: 1 }),
          version: 0,
        },
      });
    })
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
