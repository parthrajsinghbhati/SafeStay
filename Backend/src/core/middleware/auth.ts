import type { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { AppError } from '../errors.js';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
    [key: string]: any;
  };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Unauthorized: No token provided', 401));
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return next(new AppError('Unauthorized: Malformed token', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretKey') as any;
    req.user = decoded; // The auth service only put userId in the token, let's assume we fetch role or rely on routes
    next();
  } catch (error) {
    return next(new AppError('Unauthorized: Invalid or expired token', 401));
  }
};

/**
 * Ensures req.user exists and retrieves their role from DB since it wasn't in the JWT payload.
 * In a real application, the role should be placed in the JWT during login for stateless auth.
 * For now, we will query Prisma here.
 */
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const authorizeRoles = (...roles: string[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.userId) {
      return next(new AppError('Unauthorized', 401));
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user.userId },
        select: { role: true }
      });

      if (!user) {
         return next(new AppError('User not found', 404));
      }

      if (!roles.includes(user.role)) {
        return next(new AppError('Forbidden: Insufficient privileges', 403));
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
