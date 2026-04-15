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

<<<<<<< HEAD
    // Prisma Unique Constraint Error
    if (err.code === 'P2002') {
      statusCode = 409;
      message = `Conflict: Unique constraint failed on the column(s): ${err.meta?.target}`;
    }

    // OCC / Double Booking Error Handling (from BookingService throw logic)
    if (err.message && err.message.includes('Double Booking Detected')) {
      statusCode = 409;
      message = 'Conflict: The room is no longer available or was modified by another process. Double Booking Prevented.';
    }

    if (process.env.NODE_ENV === 'development') {
        console.error(`[ERROR] ${statusCode}: ${err.message}`, err.stack);
    }
    
=======
    console.error(`[ERROR] ${statusCode}: ${err.message}`, err.stack);
>>>>>>> eb7684f9615ba6596c526abcd2ffbdcef2f10fdb
    res.status(statusCode).json({
      success: false,
      statusCode,
      message,
    });
  }
}
