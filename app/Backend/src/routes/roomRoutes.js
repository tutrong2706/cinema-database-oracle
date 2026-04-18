import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';
import * as roomController from '../controllers/roomController.js';

const router = express.Router();

// Public routes
router.get('/rooms', roomController.getAllRooms);
router.get('/rooms/:id', roomController.getRoomById);
router.get('/rooms/cinema/:cinemaId', roomController.getRoomsBycinema);
router.get('/rooms/:id/seats', roomController.getRoomSeats);

// Admin routes (authenticated + admin role)
router.post('/admin/rooms', authMiddleware, roleMiddleware('Admin'), roomController.createRoom);
router.put('/admin/rooms/:id', authMiddleware, roleMiddleware('Admin'), roomController.updateRoom);
router.delete('/admin/rooms/:id', authMiddleware, roleMiddleware('Admin'), roomController.deleteRoom);
router.post('/admin/rooms/:id/seats', authMiddleware, roleMiddleware('Admin'), roomController.addSeat);
router.delete('/admin/seats/:seatId', authMiddleware, roleMiddleware('Admin'), roomController.deleteSeat);

export default router;
