import type { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service.js';
import type { RegisterDTO, LoginDTO } from '../../interfaces/auth.dto.js';

export class AuthController {
  
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body as RegisterDTO;
      
      const user = await AuthService.registerUser(payload);
      res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body as LoginDTO;

      if (!payload.email || !payload.password) {
         res.status(400).json({ error: 'Email and password are required' });
         return;
      }
      
      const { user, token } = await AuthService.loginUser(payload.email, payload.password);
      res.status(200).json({ message: 'Login successful', user, token });
    } catch (error) {
       next(error);
    }
  }
}
