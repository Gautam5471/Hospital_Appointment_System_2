const express = require('express');
const router = express.Router();
const { authenticateUser, requireAdmin } = require('../middleware/authMiddleware');
const {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
} = require('../controllers/appointmentController');

router.post('/', authenticateUser, createAppointment);
router.get('/', authenticateUser, getAppointments);
router.get('/:id', authenticateUser, getAppointmentById);
router.put('/:id', authenticateUser, updateAppointment);
router.delete('/:id', authenticateUser, requireAdmin, deleteAppointment);

module.exports = router;
