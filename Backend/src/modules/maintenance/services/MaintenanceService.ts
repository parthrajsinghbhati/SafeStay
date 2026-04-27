import { prisma } from '../../../config/database.js';
import { AppError } from '../../../core/errors.js';

export enum TicketStatus {
  REPORTED = 'REPORTED',
  IN_REPAIR = 'IN_PROGRESS', // Mapping IN_REPAIR to DB's IN_PROGRESS
  RESOLVED = 'RESOLVED',
}

export enum RoomStatus {
  AVAILABLE = 'AVAILABLE',
  BOOKED = 'BOOKED',
  MAINTENANCE = 'MAINTENANCE',
}

/**
 * MaintenanceState Interface
 */
interface MaintenanceState {
  handle(ticketId: string, roomId: string): Promise<void>;
  status: TicketStatus;
}

/**
 * ReportedState
 */
class ReportedState implements MaintenanceState {
  status = TicketStatus.REPORTED;
  async handle(ticketId: string, roomId: string) {
    // Just ensure the ticket is marked as REPORTED
    await prisma.maintenanceTicket.update({
      where: { id: ticketId },
      data: { status: 'REPORTED' as any }
    });
  }
}

/**
 * InRepairState
 */
class InRepairState implements MaintenanceState {
  status = TicketStatus.IN_REPAIR;
  async handle(ticketId: string, roomId: string) {
    await prisma.$transaction([
      prisma.maintenanceTicket.update({
        where: { id: ticketId },
        data: { status: 'IN_PROGRESS' as any }
      }),
      prisma.room.update({
        where: { id: roomId },
        data: { status: RoomStatus.MAINTENANCE as any }
      })
    ]);
    console.log(`🛠️ Room ${roomId} set to MAINTENANCE due to ticket ${ticketId}`);
  }
}

/**
 * ResolvedState
 */
class ResolvedState implements MaintenanceState {
  status = TicketStatus.RESOLVED;
  async handle(ticketId: string, roomId: string) {
    await prisma.$transaction([
      prisma.maintenanceTicket.update({
        where: { id: ticketId },
        data: { status: 'RESOLVED' as any }
      }),
      prisma.room.update({
        where: { id: roomId },
        data: { status: RoomStatus.AVAILABLE as any }
      })
    ]);
    console.log(`✅ Room ${roomId} set back to AVAILABLE after ticket ${ticketId} resolved`);
  }
}

/**
 * MaintenanceService Class
 * 
 * SOLID Principle: Open/Closed Principle (OCP) - New states can be added without modifying the service.
 */
export class MaintenanceService {
  private states: Record<TicketStatus, MaintenanceState> = {
    [TicketStatus.REPORTED]: new ReportedState(),
    [TicketStatus.IN_REPAIR]: new InRepairState(),
    [TicketStatus.RESOLVED]: new ResolvedState(),
  };

  async updateTicketStatus(ticketId: string, status: TicketStatus) {
    const ticket = await prisma.maintenanceTicket.findUnique({
      where: { id: ticketId },
      include: { room: true }
    });

    if (!ticket) throw new AppError('Ticket not found', 404);

    const state = this.states[status];
    if (!state) throw new AppError('Invalid status', 400);

    await state.handle(ticketId, ticket.roomId);
    return { success: true, message: `Ticket status updated to ${status}` };
  }

  async createTicket(data: { title: string; description: string; location: string; roomId: string; priority: any }) {
    const ticketNumber = `TKT-${Date.now()}`;
    const ticket = await prisma.maintenanceTicket.create({
      data: {
        ...data,
        ticketNumber,
        status: 'REPORTED' as any
      }
    });
    return ticket;
  }

  async getAllTickets() {
    return prisma.maintenanceTicket.findMany({
      include: { room: true },
      orderBy: { createdAt: 'desc' }
    });
  }
}
