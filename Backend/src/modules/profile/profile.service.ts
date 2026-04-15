import { PrismaClient } from '@prisma/client';
import { AppError } from '../../core/errors.js';

const prisma = new PrismaClient();

export class ProfileService {
  /**
   * Retrieves the profile linked to the authenticated userId.
   * NOTE: The Profile is automatically created together with the User inside AuthService.registerUser.
   */
  static async getProfileByUserId(userId: string) {
    const profile = await prisma.profile.findUnique({
      where: { userId },
      include: {
        user: {
          select: { email: true, role: true }
        }
      }
    });

    if (!profile) {
      throw new AppError('Profile not found', 404);
    }
    return profile;
  }

  /**
   * Updates only fields found in Profile model
   */
  static async updateProfile(userId: string, data: { firstName?: string; lastName?: string; phone?: string }) {
    // Check if profile exists
    const existing = await prisma.profile.findUnique({ where: { userId } });
    if (!existing) {
      throw new AppError('Profile not found', 404);
    }
    
    return await prisma.profile.update({
      where: { userId },
      data,
    });
  }
}
