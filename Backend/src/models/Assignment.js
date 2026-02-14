const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  status: {
    type: String,
    enum: ['assigned', 'accepted', 'rejected', 'completed'],
    default: 'assigned'
  },
  score: { type: Number } // filled after evaluation
}, { timestamps: true });

// Prevent duplicate vendor assignment to same event
assignmentSchema.index({ eventId: 1, vendorId: 1 }, { unique: true });

module.exports = mongoose.model('Assignment', assignmentSchema);
