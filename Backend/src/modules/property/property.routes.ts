import { Router } from 'express';

const router = Router();

const generateProperties = (count: number) => {
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

  const properties = [];
  for (let i = 1; i <= count; i++) {
    const p1 = prefixList[Math.floor(Math.random() * prefixList.length)];
    const p2 = suffixList[Math.floor(Math.random() * suffixList.length)];
    const price = 500 + Math.floor(Math.random() * 1500); // 500 to 2000
    const ratingValue = Math.min(3.5 + Math.random() * 1.5, 5.0);
    const rating = Number(ratingValue.toFixed(1));
    const isAvailable = Math.random() > 0.3; // 70% available
    const amCount = 2 + Math.floor(Math.random() * 4); // 2 to 5 amenities
    const amMap: Record<string, boolean> = {};
    while(Object.keys(amMap).length < amCount) {
      const am = amenitiesList[Math.floor(Math.random() * amenitiesList.length)] as string;
      amMap[am] = true;
    }

    properties.push({
      id: `prop_${i}`,
      name: `${p1} ${p2}`,
      location: `${locationsList[Math.floor(Math.random() * locationsList.length)]} Campus`,
      basePrice: price,
      images: [imagesList[Math.floor(Math.random() * imagesList.length)]],
      amenities: Object.keys(amMap),
      status: isAvailable ? 'AVAILABLE' : 'BOOKED',
      rating,
    });
  }
  return properties;
};

// Cache exactly 30 properties in memory so it's consistent across requests
const propertiesCache = generateProperties(30);

router.get('/', (req, res) => {
  res.json({ success: true, message: 'Properties fetched', data: { properties: propertiesCache } });
});

router.post('/', (req, res) => {
  const newProperty = {
    ...req.body,
    id: `prop_${Date.now()}`,
    status: 'AVAILABLE',
    rating: req.body.rating || 5.0,
    images: req.body.images || ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400'],
    amenities: req.body.amenities || []
  };
  propertiesCache.unshift(newProperty); // Add to the top of the array
  res.status(201).json({ success: true, message: 'Property created', data: { property: newProperty } });
});

export default router;
