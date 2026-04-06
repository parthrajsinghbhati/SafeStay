import type { BookingState } from './BookingState.js';

/**
 * BookingContext Class
 * 
 * Manages the current state of a booking and allows it to transition 
 * between states without changing its interface.
 */
export class BookingContext {
  private state: BookingState;

  constructor(initialState: BookingState) {
    this.state = initialState;
  }

  /**
   * Sets the new state at runtime.
   */
  setState(state: BookingState): void {
    this.state = state;
  }

  /**
   * Delegates the next state transition to the current state object.
   */
  nextState(): void {
    this.state.nextState(this);
  }

  /**
   * Delegates the cancellation to the current state object.
   */
  cancel(): void {
    this.state.cancel(this);
  }

  /**
   * Retrieves the current status string.
   */
  status(): string {
    return this.state.status();
  }
}
