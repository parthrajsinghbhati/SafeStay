import { BookingContext } from './BookingContext.js';

/**
 * BookingState Interface
 * 
 * Defines the contract for all concrete states.
 * SOLID Principle: Dependency Inversion Principle (DIP) - BookingContext depends on 
 * an abstraction (BookingState) instead of concrete states.
 */
export interface BookingState {
  nextState(context: BookingContext): void;
  cancel(context: BookingContext): void;
  status(): string;
}
