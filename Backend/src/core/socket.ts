import { Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'http';

interface LockData {
  userId: string;
  expiresAt: number;
}

/**
 * SocketService Class
 * 
 * Handles real-time room locking/unlocking to prevent double-bookings at the UI level.
 * 
 * SOLID Principle: Single Responsibility Principle (SRP) - This class is solely
 * responsible for managing socket connections and room lock states.
 */
export class SocketService {
  private static instance: SocketService;
  private io: SocketIOServer | null = null;
  private lockedRooms = new Map<string, LockData>();
  private readonly LOCK_DURATION = 5 * 60 * 1000; // 5 minutes

  private constructor() {}

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public initialize(httpServer: HttpServer): SocketIOServer {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: '*', // Adjust to frontend URL in production
        methods: ['GET', 'POST']
      }
    });

    this.io.on('connection', (socket) => {
      console.log(`🔌 Socket connected: ${socket.id}`);

      socket.on('room:lock', (data: { roomId: string; userId: string }) => {
        this.handleLock(socket, data);
      });

      socket.on('room:unlock', (data: { roomId: string; userId: string }) => {
        this.handleUnlock(socket, data);
      });

      socket.on('disconnect', () => {
        console.log(`🔌 Socket disconnected: ${socket.id}`);
      });
    });

    return this.io;
  }

  private handleLock(socket: any, data: { roomId: string; userId: string }) {
    const { roomId, userId } = data;
    const currentLock = this.lockedRooms.get(roomId);
    const now = Date.now();

    if (currentLock && currentLock.userId !== userId && currentLock.expiresAt > now) {
      socket.emit('room:lock_error', { roomId, message: 'Room is currently locked by another user.' });
      return;
    }

    this.lockedRooms.set(roomId, { userId, expiresAt: now + this.LOCK_DURATION });
    socket.broadcast.emit('room:locked', roomId);
    console.log(`🔒 Room ${roomId} locked by user ${userId}`);

    setTimeout(() => {
      const lock = this.lockedRooms.get(roomId);
      if (lock && lock.expiresAt <= Date.now() + 100) {
        this.lockedRooms.delete(roomId);
        this.io?.emit('room:lock_expired', roomId);
        console.log(`🔓 Lock expired for room ${roomId}`);
      }
    }, this.LOCK_DURATION);
  }

  private handleUnlock(socket: any, data: { roomId: string; userId: string }) {
    const { roomId, userId } = data;
    const currentLock = this.lockedRooms.get(roomId);

    if (currentLock && currentLock.userId === userId) {
      this.lockedRooms.delete(roomId);
      this.io?.emit('room:unlocked', roomId);
      console.log(`🔓 Room ${roomId} unlocked by user ${userId}`);
    }
  }

  public emit(event: string, data: any) {
    this.io?.emit(event, data);
  }
}

export const initializeSocket = (httpServer: HttpServer) => {
  return SocketService.getInstance().initialize(httpServer);
};
