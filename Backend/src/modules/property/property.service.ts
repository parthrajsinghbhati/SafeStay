import { prisma } from '../../config/database.js';
import { AppError } from '../../core/errors.js';

export interface PropertyPayload {
  name?: string;
  description?: string;
  location?: string;
  basePrice?: number;
  images?: string[];
  amenities?: string[];
  rating?: number;
  status?: 'AVAILABLE' | 'BOOKED' | 'MAINTENANCE';
}

export class PropertyService {
  static async getPublicProperties() {
    return prisma.room.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getOwnerProperties(ownerId: string) {
    return prisma.room.findMany({
      where: { ownerId },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getOwnerPropertyById(ownerId: string, propertyId: string) {
    const property = await prisma.room.findFirst({
      where: { id: propertyId, ownerId },
    });

    if (!property) {
      throw new AppError('Property not found', 404);
    }

    return property;
  }

  static async createProperty(ownerId: string, payload: PropertyPayload) {
    const createData: any = {
      ownerId,
      location: payload.location ?? 'Unknown',
      roomNumber: `ROOM-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      basePrice: payload.basePrice ?? 1000,
      images: payload.images ?? [],
      amenities: payload.amenities ?? [],
      status: payload.status ?? 'AVAILABLE',
      rating: payload.rating ?? 5.0,
    };
    if (payload.name !== undefined) createData.name = payload.name;
    if (payload.description !== undefined) createData.description = payload.description;

    return prisma.room.create({
      data: createData,
    });
  }

  static async updateProperty(ownerId: string, propertyId: string, payload: PropertyPayload) {
    await this.getOwnerPropertyById(ownerId, propertyId);

    const updateData: any = {};
    if (payload.name !== undefined) updateData.name = payload.name;
    if (payload.description !== undefined) updateData.description = payload.description;
    if (payload.location !== undefined) updateData.location = payload.location;
    if (payload.basePrice !== undefined) updateData.basePrice = payload.basePrice;
    if (payload.images !== undefined) updateData.images = payload.images;
    if (payload.amenities !== undefined) updateData.amenities = payload.amenities;
    if (payload.rating !== undefined) updateData.rating = payload.rating;
    if (payload.status !== undefined) updateData.status = payload.status;

    return prisma.room.update({ where: { id: propertyId }, data: updateData });
  }

  static async deleteProperty(ownerId: string, propertyId: string) {
    await this.getOwnerPropertyById(ownerId, propertyId);
    await prisma.room.delete({ where: { id: propertyId } });
  }
}
