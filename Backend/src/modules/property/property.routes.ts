import { Router } from 'express';
import { prisma } from '../../config/database.js';

const router = Router();

// No longer needed for PostgreSQL since it natively supports arrays
const parseRoom = (room: any) => {
  return room;
};

// Seed data if database is empty
const seedDatabaseIfEmpty = async () => {
  const count = await prisma.room.count();
  console.log('Current room count:', count);
  if (count === 0) {
    const imagesList = [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400'
    ];
    const prefixList = ['The', 'Lux', 'Grand', 'Elite', 'Campus', 'Metro', 'Urban', 'Central'];
    const suffixList = ['Suites', 'Lofts', 'Residences', 'Court', 'Hub', 'House', 'Village', 'Quarters'];
    const locationsList = ['London', 'Manchester', 'Edinburgh', 'Birmingham', 'Bristol', 'Oxford', 'Cambridge'];
    const amenitiesList = ['Free Fiber', 'Gym', 'In-unit', 'Pool', '24/7 Guard', 'Sustainable', 'Kitchenette', 'Bike Storage', 'Lounge', 'Service', 'Roof Deck', 'Cafe On-site', 'Near Transit'];

    console.log('Seeding properties database...');
    for (let i = 1; i <= 30; i++) {
      const p1 = prefixList[Math.floor(Math.random() * prefixList.length)];
      const p2 = suffixList[Math.floor(Math.random() * suffixList.length)];
      const price = 500 + Math.floor(Math.random() * 1500); 
      const ratingValue = Math.min(3.5 + Math.random() * 1.5, 5.0);
      const rating = Number(ratingValue.toFixed(1));
      const isAvailable = Math.random() > 0.3;
      const amCount = 2 + Math.floor(Math.random() * 4); 
      const amMap: Record<string, boolean> = {};
      while(Object.keys(amMap).length < amCount) {
        const am = amenitiesList[Math.floor(Math.random() * amenitiesList.length)] as string;
        amMap[am] = true;
      }

      await prisma.room.create({
        data: {
          name: `${p1} ${p2}`,
          roomNumber: `ROOM-${i}-${Date.now()}`,
          location: `${locationsList[Math.floor(Math.random() * locationsList.length)]} Campus`,
          basePrice: price,
          images: [imagesList[Math.floor(Math.random() * imagesList.length)] as string],
          amenities: Object.keys(amMap),
          status: isAvailable ? 'AVAILABLE' : 'BOOKED',
          rating,
        }
      });
    }
    console.log('Seeding complete.');
  }
};

// Call seeder immediately (don't block the startup)
seedDatabaseIfEmpty().catch(console.error);

router.get('/', async (req, res) => {
  try {
    const rooms = await prisma.room.findMany();
    console.log(`Fetching properties: found ${rooms.length} records`);
    const properties = rooms.map(parseRoom);
    res.json({ success: true, message: 'Properties fetched', data: { properties } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const property = await prisma.room.create({
      data: {
        name: req.body.name,
        description: req.body.description,
        roomNumber: `ROOM-${Date.now()}`,
        location: req.body.location || 'Unknown',
        basePrice: req.body.basePrice || 1000,
        images: req.body.images || ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400'],
        amenities: req.body.amenities || [],
        status: 'AVAILABLE',
        rating: req.body.rating || 5.0,
      }
    });

    res.status(201).json({ success: true, message: 'Property created', data: { property: parseRoom(property) } });
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

export default router;
