import type { MaintenanceContext } from './MaintenanceContext.js';

/**
 * MaintenanceState Interface
 * 
 * Defines the contract for all maintenance states (Pending, UnderRepair, Fixed).
 * Demonstrates Abstraction and Encapsulation.
 */
export interface MaintenanceState {
  handle(context: MaintenanceContext): Promise<void>;
  getStatus(): string;
}
