import { prisma } from '../../config/database.js';
import bcrypt from 'bcrypt';
import * as jwtCore from 'jsonwebtoken';
// CJS / ESM interop for jsonwebtoken
const jwt = (jwtCore as any).default || jwtCore;
import type { RegisterDTO } from '../../interfaces/auth.dto.js';
import { AppError } from '../../core/errors.js';
import { Role } from '@prisma/client';

export class AuthService {
  
  static async registerUser(data: RegisterDTO) {
    if(data.password.length < 6) throw new AppError("Invalid credentials - password must be >= 6", 401);
    
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
      throw new AppError("User with this email already exists", 409);
    }
    
    const passwordHash = await bcrypt.hash(data.password, 10);
    
    const newUser = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        role: (data.role as Role) || Role.STUDENT,
        profile: {
          create: {
            firstName: data.firstName || '',
            lastName: data.lastName || ''
          }
        }
      },
      include: { profile: true }
    });
    
    const token = jwt.sign(
      { userId: newUser.id, role: newUser.role }, 
      process.env.JWT_SECRET || 'secretKey', 
      { expiresIn: '7d' }
    );
    
    return {
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        name: `${newUser.profile?.firstName} ${newUser.profile?.lastName}`.trim(),
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt
      },
      token
    };
  }

  static async loginUser(email: string, passwordString: string, requestedRole?: string) {
     if(passwordString.length < 6) throw new AppError("Invalid credentials - password must be >= 6", 401);
     
     const storedUser = await prisma.user.findUnique({ 
       where: { email },
       include: { profile: true }
     });

     if (!storedUser) {
        throw new AppError("No account found with this email. Please sign up.", 404);
     }
     
     // Hack for demo users if their password isn't hashed
     let isValid = false;
     if (storedUser.passwordHash === passwordString) {
       isValid = true; // For pre-seeded unhashed mock users
     } else {
       isValid = await bcrypt.compare(passwordString, storedUser.passwordHash);
     }

     if (!isValid) {
        throw new AppError("Invalid password.", 401);
     }

     if (requestedRole && storedUser.role !== requestedRole) {
        throw new AppError(`Invalid role. This account is registered as a ${storedUser.role.toLowerCase()}.`, 403);
     }
     
     const token = jwt.sign(
       { userId: storedUser.id, role: storedUser.role }, 
       process.env.JWT_SECRET || 'secretKey', 
       { expiresIn: '7d' }
     );
     
     return { 
       user: {
         id: storedUser.id,
         email: storedUser.email,
         role: storedUser.role,
         name: `${storedUser.profile?.firstName} ${storedUser.profile?.lastName}`.trim(),
         createdAt: storedUser.createdAt,
         updatedAt: storedUser.updatedAt
       }, 
       token 
     };
  }

  // Pre-seed owner and student
  static async seedMockUsers() {
    const usersCount = await prisma.user.count();
    if (usersCount === 0) {
      console.log('Seeding mock users...');
      const pwHash = await bcrypt.hash('password123', 10);
      await prisma.user.create({
        data: {
          email: 'owner@safestay.com',
          passwordHash: pwHash,
          role: Role.OWNER,
          profile: { create: { firstName: 'Demo', lastName: 'Owner' } }
        }
      });
      await prisma.user.create({
        data: {
          email: 'student@safestay.com',
          passwordHash: pwHash,
          role: Role.STUDENT,
          profile: { create: { firstName: 'Demo', lastName: 'Student' } }
        }
      });
    }
  }
}

// Automatically seed users
AuthService.seedMockUsers().catch(console.error);
