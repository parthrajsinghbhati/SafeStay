/**
 * RoomPricing Interface
 * 
 * Defines the standard calculate() method that all room variants and decorators must implement.
 * SOLID Principle: Dependency Inversion Principle (DIP) - Decorators depend on this abstraction,
 * not on concrete room implementations.
 */
export interface RoomPricing {
  calculate(): number;
  getDescription(): string;
}
