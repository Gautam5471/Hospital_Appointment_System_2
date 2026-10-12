const Appointment = require('../models/Appointment');

const createAppointment = async (req, res) => {
  try {
    const { patientName, doctorName, date, time, department } = req.body;

    if (!patientName || !doctorName || !date || !time || !department) {
      return res.status(400).json({ message: 'All appointment fields are required' });
    }

    const appointment = await Appointment.create({
      patientName,
      doctorName,
      date,
      time,
      department,
      userId: req.user.id,
      status: 'Pending',
    });

    res.status(201).json({
      message: 'Appointment booked successfully',
      appointment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to book appointment' });
  }
};

const getAppointments = async (req, res) => {
  try {
    let appointments;

    if (req.user.role === 'Admin') {
      appointments = await Appointment.find().sort({ createdAt: -1 });
    } else {
      appointments = await Appointment.find({ userId: req.user.id }).sort({ createdAt: -1 });
    }

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to fetch appointments' });
  }
};

const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (req.user.role !== 'Admin' && appointment.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied to this appointment' });
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to fetch appointment' });
  }
};

const updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (req.user.role !== 'Admin' && appointment.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied to update this appointment' });
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after', runValidators: true }
    );

    res.json({
      message: 'Appointment updated successfully',
      appointment: updatedAppointment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to update appointment' });
  }
};

const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to delete appointment' });
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
};
