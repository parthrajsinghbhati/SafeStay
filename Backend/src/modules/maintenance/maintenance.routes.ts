import { Router } from 'express';
import { prisma } from '../../config/database.js';
import { MaintenanceService } from './MaintenanceService.js';

const router = Router();

/**
 * Maintenance Module Routes
 * Demonstrates the State Design Pattern for ticket management.
 */

// GET all maintenance tickets
router.get('/', async (req, res) => {
  try {
    const tickets = await prisma.maintenanceTicket.findMany({
      include: { room: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, message: 'Tickets fetched', data: { tickets } });
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// POST a new maintenance ticket
router.post('/', async (req, res) => {
  try {
    const { title, description, location, priority, roomId } = req.body;
    
    if (!roomId) {
      return res.status(400).json({ success: false, message: 'roomId is required' });
    }

    const ticket = await prisma.maintenanceTicket.create({
      data: {
        ticketNumber: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
        title,
        description,
        location,
        priority: priority || 'STANDARD',
        status: 'REPORTED',
        roomId
      }
    });

    // Automatically set RoomStatus to MAINTENANCE
    await prisma.room.update({
      where: { id: roomId },
      data: { status: 'MAINTENANCE' }
    });

    res.status(201).json({ success: true, message: 'Ticket created and Room status set to Maintenance', data: { ticket } });
  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// PATCH to advance a ticket's state (REPORTED -> IN_PROGRESS -> RESOLVED)
router.patch('/:id/advance', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTicket = await MaintenanceService.advanceTicketState(id);
    res.json({ success: true, message: 'Ticket state advanced', data: { ticket: updatedTicket } });
  } catch (error: any) {
    console.error('Error advancing ticket state:', error);
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
});

export default router;
