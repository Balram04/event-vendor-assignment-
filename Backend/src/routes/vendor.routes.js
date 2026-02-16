const express = require('express');
const { auth, roleCheck } = require('../middlewares/auth');
const Vendor = require('../models/Vendor');
const Assignment = require('../models/Assignment');

const router = express.Router();

// All vendor routes protected
router.use(auth, roleCheck('vendor'));

// Get My Assignments
router.get('/assignments', async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user.userId });
    if (!vendor) return res.status(404).json({ message: 'Vendor profile not found' });

     const assignments = await Assignment.find({ vendorId: vendor._id })
      .populate('eventId', 'title date status')
      .populate('vendorId', 'serviceType performanceScore');

    res.json(assignments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Accept Assignment
router.patch('/assignments/:id/accept', async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user.userId });
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
    if (!vendor || assignment.vendorId.toString() !== vendor._id.toString()) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    if (assignment.status !== 'assigned') {
      return res.status(400).json({ message: 'Only assigned tasks can be accepted' });
    }

    assignment.status = 'accepted';
    await assignment.save();

    res.json(assignment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// Reject Assignment
router.patch('/assignments/:id/reject', async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user.userId });
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
    if (!vendor || assignment.vendorId.toString() !== vendor._id.toString()) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    if (assignment.status !== 'assigned') {
      return res.status(400).json({ message: 'Only assigned tasks can be rejected' });
    }

    assignment.status = 'rejected';
    await assignment.save();

    res.json(assignment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mark Assignment Completed
router.patch('/assignments/:id/complete', async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user.userId });
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
    if (!vendor || assignment.vendorId.toString() !== vendor._id.toString()) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    if (assignment.status !== 'accepted') {
      return res.status(400).json({ message: 'Only accepted tasks can be completed' });
    }

    assignment.status = 'completed';
    await assignment.save();

    res.json(assignment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Vendor Performance Summary (Aggregation)
router.get('/performance-summary', async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user.userId });
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });

    const summary = await Assignment.aggregate([
      { $match: { vendorId: vendor._id, score: { $exists: true } } },
      {
        $group: {
          _id: '$vendorId',
          totalEventsHandled: { $sum: 1 },
          averageScore: { $avg: '$score' }
        }
      }
    ]);

    const recentEvaluations = await Assignment.find({
      vendorId: vendor._id,
      score: { $exists: true }
    })
      .sort({ updatedAt: -1 })
      .limit(5)
      .populate('eventId', 'title date')
      .populate('vendorId', 'serviceType');

    res.json({
      totalEventsHandled: summary[0]?.totalEventsHandled || 0,
      averageScore: summary[0]?.averageScore || 0,
      recentEvaluations
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
