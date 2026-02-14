const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  serviceType: { type: String, required: true }, // catering, security, AV, etc.
  performanceScore: { type: Number, default: 0 },
  totalEventsHandled: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Vendor', vendorSchema);
