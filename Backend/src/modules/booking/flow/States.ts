import type { BookingState } from './BookingState.js';
import { BookingContext } from './BookingContext.js';

/**
 * States Implementation
 * 
 * SOLID Principles:
 * - Single Responsibility Principle (SRP): Each state class is responsible for 
 *   its own specific transition and behavior.
 * - Open/Closed Principle (OCP): We can add new states without modifying the Context 
 *   or existing states.
 */

export class PendingState implements BookingState {
  nextState(context: BookingContext): void {
    console.log("Advancing from PENDING to LOCKED state.");
    context.setState(new LockedState());
  }

  cancel(context: BookingContext): void {
    console.log("Booking cancelled from PENDING state.");
    // In a real app we might have a CancelledState 
    // context.setState(new CancelledState());
  }

  status(): string {
    return 'PENDING';
  }
}

export class LockedState implements BookingState {
  nextState(context: BookingContext): void {
    console.log("Advancing from LOCKED to CONFIRMED state.");
    context.setState(new ConfirmedState());
  }

  cancel(context: BookingContext): void {
    console.log("Booking cancelled. Lock released.");
    // Releasing lock and reverting/cancelling
  }

  status(): string {
    return 'LOCKED';
  }
}

export class ConfirmedState implements BookingState {
  nextState(context: BookingContext): void {
    console.log("Booking is already CONFIRMED. No further states.");
  }

  cancel(context: BookingContext): void {
    console.log("Booking cancelled. Applying cancellation policy for confirmed bookings.");
  }

  status(): string {
    return 'CONFIRMED';
  }
}
