/** useSocket — Socket.io real-time room locking hook */
import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { BASE_URL } from '../lib/api';

export type RoomEvent =
  | { type: 'ROOM_LOCKED'; roomId: string }
  | { type: 'LOCK_EXPIRED'; roomId: string };

/**
 * Connects to the Socket.io server and calls `onEvent` for room lock events.
 * Automatically disconnects on unmount.
 */
export function useSocket(onEvent: (event: RoomEvent) => void) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io(BASE_URL.replace('/api', ''), {
      transports: ['websocket'],
      autoConnect: true,
    });
    socketRef.current = socket;

    socket.on('ROOM_LOCKED', (roomId: string) => onEvent({ type: 'ROOM_LOCKED', roomId }));
    socket.on('LOCK_EXPIRED', (roomId: string) => onEvent({ type: 'LOCK_EXPIRED', roomId }));

    return () => { socket.disconnect(); };
  }, [onEvent]);

  return socketRef;
}
