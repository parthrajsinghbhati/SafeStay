import type { Request, Response, NextFunction } from 'express';

// Unified custom error class
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; 
    Object.setPrototypeOf(this, new.target.prototype); 
    Error.captureStackTrace(this, this.constructor);
  }
}

// Global Singleton Error Handler Middleware
export class ErrorHandler {
  static handle(err: any, req: Request, res: Response, next: NextFunction) {
    let { statusCode, message } = err;

    if (!statusCode) {
      statusCode = 500;
      message = 'Internal Server Error';
    }

    console.error(`[ERROR] ${statusCode}: ${err.message}`, err.stack);
    res.status(statusCode).json({
      success: false,
      statusCode,
      message,
    });
  }
}
