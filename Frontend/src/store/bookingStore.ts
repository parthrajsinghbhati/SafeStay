import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Room } from '../types';

export interface Booking {
  id: string;
  roomId: string;
  roomName: string;
  location: string;
  image: string;
  bookedAt: string;
  status: 'ACTIVE' | 'PENDING' | 'COMPLETED';
  price: number;
}

interface BookingState {
  bookings: Booking[];
  addBooking: (room: Room, priceTotal: number) => void;
  removeBooking: (id: string) => void;
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      bookings: [],
      addBooking: (room, priceTotal) => set((state) => {
        // Prevent double booking mockup
        if (state.bookings.find(b => b.roomId === room.id)) return state;

        const newBooking: Booking = {
          id: Math.random().toString(36).substr(2, 9),
          roomId: room.id,
          roomName: room.name,
          location: room.location,
          image: room.images[0] || '',
          bookedAt: new Date().toISOString(),
          status: 'PENDING',
          price: priceTotal
        };
        return { bookings: [...state.bookings, newBooking] };
      }),
      removeBooking: (id) => set((state) => ({
        bookings: state.bookings.filter(b => b.id !== id)
      }))
    }),
    {
      name: 'safestay-bookings'
    }
  )
);
