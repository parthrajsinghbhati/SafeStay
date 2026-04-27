import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || (window.location.hostname === 'localhost' ? 'http://localhost:3000' : '/');

let socketInstance: Socket | null = null;

const getSocket = () => {
  if (!socketInstance) {
    socketInstance = io(SOCKET_URL);
  }
  return socketInstance;
};

/**
 * useRoomSync Hook
 * 
 * Synchronizes room lock states across clients using Socket.io.
 * Disables the "Book" button when a room is locked by another user.
 * 
 * @param roomId - The ID of the room to sync.
 * @returns { isLocked: boolean, lockRoom: function, unlockRoom: function }
 */
export const useRoomSync = (roomId: string, userId?: string) => {
  const [isLocked, setIsLocked] = useState(false);
  const socket = getSocket();

  useEffect(() => {
    if (!roomId) return;

    const handleLocked = (lockedRoomId: string) => {
      if (lockedRoomId === roomId) {
        setIsLocked(true);
      }
    };

    const handleUnlocked = (unlockedRoomId: string) => {
      if (unlockedRoomId === roomId) {
        setIsLocked(false);
      }
    };

    const handleExpired = (expiredRoomId: string) => {
      if (expiredRoomId === roomId) {
        setIsLocked(false);
      }
    };

    socket.on('room:locked', handleLocked);
    socket.on('room:unlocked', handleUnlocked);
    socket.on('room:lock_expired', handleExpired);

    return () => {
      socket.off('room:locked', handleLocked);
      socket.off('room:unlocked', handleUnlocked);
      socket.off('room:lock_expired', handleExpired);
    };
  }, [roomId, socket]);

  const lockRoom = () => {
    if (roomId && userId) {
      socket.emit('room:lock', { roomId, userId });
    }
  };

  const unlockRoom = () => {
    if (roomId && userId) {
      socket.emit('room:unlock', { roomId, userId });
    }
  };

  return { isLocked, lockRoom, unlockRoom };
};
