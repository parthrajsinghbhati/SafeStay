import { Router } from 'express';
import { prisma } from '../../config/database.js';

const router = Router();

// GET all maintenance tickets
router.get('/', async (req, res) => {
  try {
    const tickets = await prisma.maintenanceTicket.findMany({
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
    const { title, description, location, priority } = req.body;
    const ticket = await prisma.maintenanceTicket.create({
      data: {
        ticketNumber: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
        title,
        description,
        location,
        priority: priority || 'STANDARD',
        status: 'OPEN',
      }
    });
    res.status(201).json({ success: true, message: 'Ticket created', data: { ticket } });
  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// PATCH to update a ticket's status
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const ticket = await prisma.maintenanceTicket.update({
      where: { id },
      data: { status }
    });
    res.json({ success: true, message: 'Ticket updated', data: { ticket } });
  } catch (error) {
    console.error('Error updating ticket:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

export default router;
