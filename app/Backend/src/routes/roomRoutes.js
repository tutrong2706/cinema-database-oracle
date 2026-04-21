import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { roleRequired } from '../middleware/roleMiddleware.js';
import * as roomController from '../controllers/roomController.js';

const router = express.Router();

// Public routes
router.get('/rooms', roomController.getAllRooms);
router.get('/rooms/:id', roomController.getRoomById);
router.get('/rooms/cinema/:cinemaId', roomController.getRoomsBycinema);
router.get('/rooms/:id/seats', roomController.getRoomSeats);

// Admin routes (authenticated + admin role)
router.post('/admin/rooms', authenticateToken, roleRequired(['Admin']), roomController.createRoom);
router.put('/admin/rooms/:id', authenticateToken, roleRequired(['Admin']), roomController.updateRoom);
router.delete('/admin/rooms/:id', authenticateToken, roleRequired(['Admin']), roomController.deleteRoom);
router.post('/admin/rooms/:id/seats', authenticateToken, roleRequired(['Admin']), roomController.addSeat);
router.delete('/admin/seats/:seatId', authenticateToken, roleRequired(['Admin']), roomController.deleteSeat);

export default router;
