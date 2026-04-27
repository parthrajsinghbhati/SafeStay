import { Router } from 'express';
import { MaintenanceService, TicketStatus } from './services/MaintenanceService.js';
import { authenticate, authorizeRoles } from '../../core/middleware/auth.js';

const router = Router();
const maintenanceService = new MaintenanceService();

// GET all maintenance tickets
router.get('/', authenticate, authorizeRoles('OWNER', 'ADMIN', 'STUDENT'), async (req, res, next) => {
  try {
    const tickets = await maintenanceService.getAllTickets();
    res.json({ success: true, message: 'Tickets fetched', data: { tickets } });
  } catch (error) {
    next(error);
  }
});

// POST a new maintenance ticket (Student/Owner)
router.post('/', authenticate, async (req, res, next) => {
  try {
    const { title, description, location, priority, roomId } = req.body;
    const ticket = await maintenanceService.createTicket({
      title,
      description,
      location,
      priority,
      roomId
    });
    res.status(201).json({ success: true, message: 'Ticket created', data: { ticket } });
  } catch (error) {
    next(error);
  }
});

// PATCH to advance a ticket's state (Uses State Design Pattern)
router.patch('/:id/status', authenticate, authorizeRoles('OWNER', 'ADMIN'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Validate status
    if (!Object.values(TicketStatus).includes(status as TicketStatus)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    if (typeof id !== 'string') return res.status(400).json({ success: false, message: 'Invalid ID' });
    const result = await maintenanceService.updateTicketStatus(id, status as TicketStatus);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
