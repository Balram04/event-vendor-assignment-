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

// Get all events (Admin view)
router.get('/events', async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Create Vendor Profile (map to existing user with role vendor)
router.post('/vendors', async (req, res) => {
  try {
    const { userId, serviceType } = req.body;  //using userId to link vendor profile to existing user because we already have role-based users

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

// Update Event Status (lifecycle)
router.patch('/events/:id/status', async (req, res) => {
  try {
    const { status } = req.body; // draft, scheduled, ongoing, completed
    const eventId = req.params.id;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // If trying to mark event as completed, check all assignments
    if (status === 'completed') {
      const pending = await Assignment.find({
        eventId,
        status: { $nin: ['completed', 'rejected'] }
      });

      if (pending.length > 0) {
        return res.status(400).json({
          message: 'Cannot complete event until all vendor assignments are completed or rejected'
        });
      }
    }

    event.status = status;
    await event.save();

    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Evaluate Vendor after Event Completion
router.post('/assignments/:id/evaluate', async (req, res) => {
  try {
    const { score } = req.body; // e.g., 1–5
    const assignmentId = req.params.id;

    const assignment = await Assignment.findById(assignmentId).populate('eventId');
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

    // Rule: Event must be completed
    if (assignment.eventId.status !== 'completed') {
      return res.status(400).json({ message: 'Cannot evaluate vendor before event is completed' });
    }

    assignment.score = score;
    await assignment.save();

    // Update vendor performance
    const vendor = await Vendor.findById(assignment.vendorId);

    const completedAssignments = await Assignment.find({
      vendorId: vendor._id,
      status: 'completed',
      score: { $exists: true }
    });

    const totalScore = completedAssignments.reduce((sum, a) => sum + a.score, 0);
    const avgScore = totalScore / completedAssignments.length;

    vendor.performanceScore = avgScore;
    vendor.totalEventsHandled = completedAssignments.length;
    await vendor.save();

    res.json({ message: 'Evaluation saved', assignment, vendor });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

 

module.exports = router;
