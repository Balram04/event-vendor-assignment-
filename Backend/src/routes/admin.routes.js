const express = require('express');
const { auth, roleCheck } = require('../middlewares/auth');
const Event = require('../models/Event');
const Vendor = require('../models/Vendor');
const Assignment = require('../models/Assignment');

const router = express.Router();

// All admin routes protected
router.use(auth, roleCheck('admin'));

// Create Event
router.post('/events', async (req, res) => {
  try {
    const { title, date } = req.body;

    const event = await Event.create({
      title,
      date,
      createdBy: req.user.userId
    });

    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create Vendor Profile (map to existing user with role vendor)
router.post('/vendors', async (req, res) => {
  try {
    const { userId, serviceType } = req.body;

    const vendor = await Vendor.create({ userId, serviceType });

    res.json(vendor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Assign Vendor to Event
router.post('/assignments', async (req, res) => {
  try {
    const { eventId, vendorId } = req.body;

    const assignment = await Assignment.create({ eventId, vendorId });

    res.json(assignment);
  } catch (err) {
    // Duplicate assignment case
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Vendor already assigned to this event' });
    }
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
