import { prisma } from '../../config/database.js';
import type { Request, Response, NextFunction } from 'express';
import * as jwtCore from 'jsonwebtoken';
// CJS / ESM interop for jsonwebtoken
const jwt = (jwtCore as any).default || jwtCore;
import { AppError } from '../errors.js';

export interface AuthRequest extends Request {
  user?: {
    id?: string;
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
    req.user = {
      ...decoded,
      id: decoded.id ?? decoded.userId,
      userId: decoded.userId ?? decoded.id,
    };
    next();
  } catch (error) {
    return next(new AppError('Unauthorized: Invalid or expired token', 401));
  }
};


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
