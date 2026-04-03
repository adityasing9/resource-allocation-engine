/**
 * Task Model
 * Represents a task that needs volunteer assignment.
 * Tracks status lifecycle: open → assigned → completed
 */
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: 2000
  },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  requiredSkills: {
    type: [String],
    required: [true, 'At least one skill is required'],
    validate: {
      validator: (v) => v.length > 0,
      message: 'At least one required skill must be specified'
    }
  },
  urgency: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['open', 'assigned', 'completed'],
    default: 'open'
  },
  // Reference to the assigned volunteer
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  // Reference to the admin who created it
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Task', taskSchema);
