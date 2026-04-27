import type { MaintenanceState } from './MaintenanceState.js';
import { prisma } from '../../config/database.js';

/**
 * MaintenanceContext Class
 * 
 * The context class that maintains a reference to an instance of a MaintenanceState 
 * subclass, which represents the current state of the MaintenanceTicket.
 */
export class MaintenanceContext {
  private state: MaintenanceState;
  private ticketId: string;
  private roomId: string;

  constructor(ticketId: string, roomId: string, initialState: MaintenanceState) {
    this.ticketId = ticketId;
    this.roomId = roomId;
    this.state = initialState;
  }

  public setState(state: MaintenanceState): void {
    this.state = state;
    console.log(`Ticket ${this.ticketId} transitioned to ${state.getStatus()} state.`);
  }

  public async request(): Promise<void> {
    await this.state.handle(this);
  }

  public getTicketId(): string {
    return this.ticketId;
  }

  public getRoomId(): string {
    return this.roomId;
  }

  /**
   * Automatically updates the RoomStatus in the database.
   * Demonstrates Encapsulation by hiding the DB logic.
   */
  public async updateRoomStatus(status: 'AVAILABLE' | 'MAINTENANCE' | 'BOOKED'): Promise<void> {
    await prisma.room.update({
      where: { id: this.roomId },
      data: { status },
    });
    console.log(`Room ${this.roomId} status updated to ${status}.`);
  }

  /**
   * Updates the TicketStatus in the database.
   */
  public async updateTicketStatus(status: 'REPORTED' | 'IN_PROGRESS' | 'RESOLVED'): Promise<void> {
    await prisma.maintenanceTicket.update({
      where: { id: this.ticketId },
      data: { status },
    });
  }
}
