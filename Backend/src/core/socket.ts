import { Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'http';

// Store locked rooms. Key: roomId, Value: user/session info & expiration
interface LockData {
  userId: string;
  expiresAt: number;
}

const lockedRooms = new Map<string, LockData>();
const LOCK_DURATION = 5 * 60 * 1000; // 5 minutes

export function initializeSocket(httpServer: HttpServer) {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: '*', // Adjust to frontend URL in production
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    // User attempts to lock a room when opening the booking modal
    socket.on('LOCK_ROOM', (data: { roomId: string; userId: string }) => {
      const { roomId, userId } = data;
      const currentLock = lockedRooms.get(roomId);
      
      const now = Date.now();
      if (currentLock && currentLock.userId !== userId && currentLock.expiresAt > now) {
        // Room is already locked by someone else
        socket.emit('LOCK_ERROR', { roomId, message: 'Room is currently locked by another user.' });
        return;
      }

      // Grant or renew lock
      lockedRooms.set(roomId, { userId, expiresAt: now + LOCK_DURATION });
      
      // Notify all other clients that the room is locked
      socket.broadcast.emit('ROOM_LOCKED', roomId);
      console.log(`🔒 Room ${roomId} locked by user ${userId}`);

      // Optional: Set a timeout to automatically unlock if the lock expires
      setTimeout(() => {
        const lock = lockedRooms.get(roomId);
        if (lock && lock.expiresAt <= Date.now() + 100) { // Small buffer
          lockedRooms.delete(roomId);
          io.emit('LOCK_EXPIRED', roomId);
          console.log(`🔓 Lock expired for room ${roomId}`);
        }
      }, LOCK_DURATION);
    });

    // User cancels or completes booking
    socket.on('UNLOCK_ROOM', (data: { roomId: string; userId: string }) => {
      const { roomId, userId } = data;
      const currentLock = lockedRooms.get(roomId);

      if (currentLock && currentLock.userId === userId) {
        lockedRooms.delete(roomId);
        io.emit('ROOM_UNLOCKED', roomId);
        console.log(`🔓 Room ${roomId} unlocked by user ${userId}`);
      }
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Socket disconnected: ${socket.id}`);
      // Note: In a robust system, you might want to track socket -> user mappings
      // to clear locks when a user unexpectedly disconnects.
    });
  });

  return io;
}
