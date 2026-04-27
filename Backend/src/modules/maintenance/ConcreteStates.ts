import type { MaintenanceState } from './MaintenanceState.js';
import type { MaintenanceContext } from './MaintenanceContext.js';

/**
 * PendingState
 * Initial state when a ticket is created.
 */
export class PendingState implements MaintenanceState {
  public async handle(context: MaintenanceContext): Promise<void> {
    console.log("Maintenance ticket is pending. Room remains in MAINTENANCE status.");
    // Transition to UnderRepair
    context.setState(new UnderRepairState());
    await context.updateTicketStatus('IN_PROGRESS');
  }

  public getStatus(): string {
    return "Pending";
  }
}

/**
 * UnderRepairState
 * State when the repair work is in progress.
 */
export class UnderRepairState implements MaintenanceState {
  public async handle(context: MaintenanceContext): Promise<void> {
    console.log("Room is currently under repair.");
    // Transition to Fixed
    context.setState(new FixedState());
    await context.updateTicketStatus('RESOLVED');
  }

  public getStatus(): string {
    return "UnderRepair";
  }
}

/**
 * FixedState
 * Final state when the issue is resolved.
 * Automatically updates RoomStatus to AVAILABLE.
 */
export class FixedState implements MaintenanceState {
  public async handle(context: MaintenanceContext): Promise<void> {
    console.log("Repair finished. Updating room status to AVAILABLE.");
    // RoomStatus update logic
    await context.updateRoomStatus('AVAILABLE');
  }

  public getStatus(): string {
    return "Fixed";
  }
}
