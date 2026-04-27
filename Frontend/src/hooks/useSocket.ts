/** useSocket — Socket.io real-time room locking hook */
import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { BASE_URL } from '../lib/api';

export type RoomEvent =
  | { type: 'room:locked'; roomId: string }
  | { type: 'room:lock_expired'; roomId: string }
  | { type: 'room:unlocked'; roomId: string };

/**
 * Connects to the Socket.io server and calls `onEvent` for room lock events.
 * Automatically disconnects on unmount.
 */
export function useSocket(onEvent: (event: RoomEvent) => void) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_SOCKET_URL || BASE_URL.replace('/api', ''), {
      transports: ['websocket'],
      autoConnect: true,
    });
    socketRef.current = socket;

    socket.on('room:locked', (roomId: string) => onEvent({ type: 'room:locked', roomId }));
    socket.on('room:lock_expired', (roomId: string) => onEvent({ type: 'room:lock_expired', roomId }));
    socket.on('room:unlocked', (roomId: string) => onEvent({ type: 'room:unlocked', roomId }));

    return () => { socket.disconnect(); };
  }, [onEvent]);

  return socketRef;
}
