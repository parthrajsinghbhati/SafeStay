import { useState, useCallback } from 'react';
import { useSocket, type RoomEvent } from './useSocket';
import { useAuthStore } from '../store/authStore';

export function useRoomLock() {
  const [lockedRooms, setLockedRooms] = useState<Set<string>>(new Set());
  const user = useAuthStore(state => state.user);

  const handleSocketEvent = useCallback((event: RoomEvent) => {
    if (event.type === 'room:locked') {
      setLockedRooms((prev) => {
        const next = new Set(prev);
        next.add(event.roomId);
        return next;
      });
    } else if (event.type === 'room:lock_expired' || event.type === 'room:unlocked') {
      setLockedRooms((prev) => {
        const next = new Set(prev);
        next.delete(event.roomId);
        return next;
      });
    }
  }, []);

  const socketRef = useSocket(handleSocketEvent);

  const lockRoom = useCallback((roomId: string) => {
    if (!socketRef.current || !user?.id) return;
    socketRef.current.emit('room:lock', { roomId, userId: user.id });
  }, [socketRef, user?.id]);

  const unlockRoom = useCallback((roomId: string) => {
    if (!socketRef.current || !user?.id) return;
    socketRef.current.emit('room:unlock', { roomId, userId: user.id });
  }, [socketRef, user?.id]);

  const isRoomLocked = useCallback((roomId: string) => {
    return lockedRooms.has(roomId);
  }, [lockedRooms]);

  return {
    lockedRooms,
    lockRoom,
    unlockRoom,
    isRoomLocked
  };
}
