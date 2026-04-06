import { prisma } from '../../config/database.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { RegisterDTO } from '../../interfaces/auth.dto.js';
import { AppError } from '../../core/errors.js';

export class AuthService {
  
  /**
   * Register a new Student or Staff
   * SOLID Single Responsibility: Only handles Registration logic.
   */
  static async registerUser(data: RegisterDTO) {
    
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (existingUser) {
      throw new AppError("User with this email already exists", 409);
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const newUser = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        role: data.role || 'STUDENT',
        profile: {
          create: {
            firstName: data.firstName,
            lastName: data.lastName,
          }
        }
      },
      include: {
        profile: true
      }
    });

    const { passwordHash: _, ...safeUser } = newUser;
    return safeUser;
  }

  /**
   * Login Authentication
   */
  static async loginUser(email: string, passwordString: string) {
     const user = await prisma.user.findUnique({ where: { email }});
     if(!user) throw new AppError("Invalid credentials", 401);
     
     const isValid = await bcrypt.compare(passwordString, user.passwordHash);
     if (!isValid) throw new AppError("Invalid credentials", 401);

     const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'secretKey', {
       expiresIn: '7d'
     });
     
     const { passwordHash: _, ...safeUser } = user;
     return { user: safeUser, token };
  }
}
