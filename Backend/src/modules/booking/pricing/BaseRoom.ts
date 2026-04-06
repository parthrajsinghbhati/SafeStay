import type { RoomPricing } from './RoomPricing.js';

/**
 * BaseRoom Class
 * 
 * Demonstrates the core component in the Decorator Pattern.
 * This class provides the base functionality (base price and description) that decorators will build upon.
 */
export class BaseRoom implements RoomPricing {
  constructor(private basePrice: number, private roomNumber: string) {}

  calculate(): number {
    return this.basePrice;
  }

  getDescription(): string {
    return `Base Room (${this.roomNumber})`;
  }
}
