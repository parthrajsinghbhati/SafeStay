import type { Room, MaintenanceTicket, Property, ActivityFeedItem, Addon } from '../types';

export const MOCK_ROOMS: Room[] = [
  { id: '1', name: 'The Meridian Suites', location: 'Kensington District, London', basePrice: 850, images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400'], amenities: ['Free Fiber', 'Gym', 'In-unit'], status: 'AVAILABLE', rating: 4.9, distance: '2.1 miles from Campus' },
  { id: '2', name: 'Atlas Residences', location: 'Midtown, Manchester', basePrice: 1200, images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400'], amenities: ['Pool', '24/7 Guard'], status: 'PENDING_LOCK', rating: 4.7 },
  { id: '3', name: 'The Nordic House', location: 'North Point, Edinburgh', basePrice: 980, images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400'], amenities: ['Sustainable', 'Kitchenette'], status: 'AVAILABLE', rating: 4.8 },
  { id: '4', name: 'Sanctuary Lofts', location: 'Southside, Birmingham', basePrice: 720, images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400'], amenities: ['Bike Storage', 'Lounge'], status: 'AVAILABLE', rating: 4.6 },
  { id: '5', name: 'The Zenith Hub', location: 'Central London', basePrice: 1500, images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400'], amenities: ['Service', 'Roof Deck'], status: 'PENDING_LOCK', rating: 4.9 },
  { id: '6', name: 'Cobblestone Court', location: 'Old Town, Bristol', basePrice: 650, images: ['https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400'], amenities: ['Cafe On-site', 'Near Transit'], status: 'AVAILABLE', rating: 4.5 },
];

export const MOCK_ADDONS: Addon[] = [
  { id: 'ac', name: 'Air Conditioning', description: 'Climate control for your comfort', price: 50 },
  { id: 'meals', name: 'Premium Food Plan', description: '3 gourmet meals daily', price: 150 },
  { id: 'wifi', name: 'High-Speed WiFi', description: 'Gigabit fiber connection', price: 30 },
  { id: 'parking', name: 'Parking Space', description: 'Secure underground parking', price: 80 },
];

export const MOCK_TICKETS: MaintenanceTicket[] = [
  { id: '1', ticketNumber: 'MS-1042', title: 'Water Leakage - Bathroom', description: 'Water is dripping from the ceiling in Unit 402, likely from the shower...', status: 'OPEN', priority: 'URGENT', location: 'Unit 402, Block B', createdAt: '2h ago' },
  { id: '2', ticketNumber: 'MS-1041', title: 'Faulty AC Unit', description: 'The air conditioning makes a loud clicking noise and isn\'t cooling...', status: 'OPEN', priority: 'STANDARD', location: 'Unit 115, Block A', createdAt: '5h ago' },
  { id: '3', ticketNumber: 'MS-1038', title: 'Wi-Fi Connectivity Issue', description: 'Network specialist currently replacing the router in the East Wing lobby.', status: 'IN_PROGRESS', priority: 'STANDARD', location: 'East Wing Lobby', assignee: 'Alex Rivera', createdAt: '1d ago' },
  { id: '4', ticketNumber: 'MS-1035', title: 'Broken Study Lamp', description: 'Bulb and fuse replaced in the communal study area, Table 04.', status: 'RESOLVED', priority: 'LOW', location: 'Study Area', createdAt: '1d ago' },
];

export const MOCK_PROPERTIES: Property[] = [
  { id: '1', name: 'The Berkeley Commons', type: 'Student Studio', occupancy: 92, monthlyRevenue: 12400, status: 'HEALTHY', address: '42 Queen Victoria St, London' },
  { id: '2', name: 'Riverside Heights', type: 'Multi-Room Suite', occupancy: 65, monthlyRevenue: 8150, status: 'PENDING', address: 'Docklands Area, SE1' },
  { id: '3', name: 'Metropolitan Lofts', type: 'Economy Suite', occupancy: 100, monthlyRevenue: 15900, status: 'FULL', address: 'Central Birmingham' },
];

export const MOCK_ACTIVITY: ActivityFeedItem[] = [
  { id: '1', type: 'booking', title: 'New Booking Confirmed', description: 'Unit 402-B at The Berkeley booked by Alex Chen for Fall 2024.', time: '2m ago' },
  { id: '2', type: 'security', title: 'Unusual Entry Detected', description: 'Smart Lock at Riverside Suite 12 accessed outside regular hours.', time: '45m ago', actions: ['Check Cam', 'Dismiss'] },
  { id: '3', type: 'maintenance', title: 'Maintenance Request', description: 'Tenant report: AC unit malfunction in Metropolitan Lofts #09.', time: '3h ago' },
  { id: '4', type: 'payment', title: 'Payout Disbursed', description: 'Total of $18,200.00 was sent to your primary account.', time: 'Yesterday' },
];
