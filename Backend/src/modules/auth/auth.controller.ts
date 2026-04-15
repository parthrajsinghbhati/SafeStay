import type { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service.js';
import type { RegisterDTO, LoginDTO } from '../../interfaces/auth.dto.js';

export class AuthController {
  
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body as RegisterDTO;
      
      const { user, token } = await AuthService.registerUser(payload);
      res.status(201).json({ success: true, message: 'User registered successfully', data: { user, tokens: { accessToken: token } } });
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body as LoginDTO;

      if (!payload.email || !payload.password) {
         res.status(400).json({ success: false, message: 'Email and password are required' });
         return;
      }
      
      const { user, token } = await AuthService.loginUser(payload.email, payload.password, req.body.role);
      res.status(200).json({ success: true, message: 'Login successful', data: { user, tokens: { accessToken: token } } });
    } catch (error) {
       next(error);
    }
  }
}
