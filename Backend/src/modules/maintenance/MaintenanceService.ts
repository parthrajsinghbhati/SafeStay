import { MaintenanceContext } from './MaintenanceContext.js';
import { PendingState, UnderRepairState, FixedState } from './ConcreteStates.js';
import { prisma } from '../../config/database.js';

export class MaintenanceService {
  /**
   * Advances the ticket to the next state.
   * Pending -> UnderRepair -> Fixed
   */
  public static async advanceTicketState(ticketId: string): Promise<any> {
    const ticket = await prisma.maintenanceTicket.findUnique({
      where: { id: ticketId },
      include: { room: true }
    });

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    let initialState;
    switch (ticket.status) {
      case 'OPEN':
        initialState = new PendingState();
        break;
      case 'IN_PROGRESS':
        initialState = new UnderRepairState();
        break;
      case 'RESOLVED':
        initialState = new FixedState();
        break;
      default:
        initialState = new PendingState();
    }

    const context = new MaintenanceContext(ticket.id, ticket.roomId, initialState);
    
    // Process the current state (which triggers the transition to the next state or resolution)
    await context.request();

    // Fetch the updated ticket
    return await prisma.maintenanceTicket.findUnique({
      where: { id: ticketId },
      include: { room: true }
    });
  }
}
