import { prisma } from '../../config/database.js';
import bcrypt from 'bcrypt';
import * as jwtCore from 'jsonwebtoken';
// CJS / ESM interop for jsonwebtoken
const jwt = (jwtCore as any).default || jwtCore;
import type { RegisterDTO } from '../../interfaces/auth.dto.js';
import { AppError } from '../../core/errors.js';

// In-Memory User Store for Demo
const MOCK_USERS: Record<string, any> = {
  // Pre-seed an owner and student
  'owner@safestay.com': { password: 'password123', role: 'OWNER', id: 'mocked_owner_1', firstName: 'Demo', lastName: 'Owner' },
  'student@safestay.com': { password: 'password123', role: 'STUDENT', id: 'mocked_student_1', firstName: 'Demo', lastName: 'Student' }
};

export class AuthService {
  
  static async registerUser(data: RegisterDTO) {
    if(data.password.length < 6) throw new AppError("Invalid credentials - password must be >= 6", 401);
    
    if (MOCK_USERS[data.email]) {
      throw new AppError("User with this email already exists", 409);
    }
    
    const newId = `mock_user_${Date.now()}`;
    MOCK_USERS[data.email] = {
      password: data.password,
      role: data.role || 'STUDENT',
      id: newId,
      firstName: data.firstName,
      lastName: data.lastName
    };
    
    const token = jwt.sign({ userId: newId }, process.env.JWT_SECRET || 'secretKey', {
      expiresIn: '7d'
    });
    
    return {
      user: {
        id: newId,
        email: data.email,
        role: MOCK_USERS[data.email].role,
        name: `${MOCK_USERS[data.email].firstName} ${MOCK_USERS[data.email].lastName}`,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      token
    };
  }

  static async loginUser(email: string, passwordString: string, requestedRole?: string) {
     if(passwordString.length < 6) throw new AppError("Invalid credentials - password must be >= 6", 401);
     
     const storedUser = MOCK_USERS[email];
     if (!storedUser) {
        throw new AppError("No account found with this email. Please sign up.", 404);
     }
     
     if (storedUser.password !== passwordString) {
        throw new AppError("Invalid password.", 401);
     }

     if (requestedRole && storedUser.role !== requestedRole) {
        throw new AppError(`Invalid role. This account is registered as a ${storedUser.role.toLowerCase()}.`, 403);
     }
     
     const token = jwt.sign({ userId: storedUser.id }, process.env.JWT_SECRET || 'secretKey', {
       expiresIn: '7d'
     });
     
     return { 
       user: {
         id: storedUser.id,
         email: email,
         role: storedUser.role,
         name: `${storedUser.firstName} ${storedUser.lastName}`,
         createdAt: new Date(),
         updatedAt: new Date()
       }, 
       token 
     };
  }
}
