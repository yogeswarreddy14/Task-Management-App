const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 50
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 200
  },
  dueDate: {
    type: Date,
    required: true
  },
  priority: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high']
  },
  completed: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    required: true,
    enum: ['work', 'personal', 'shopping', 'health', 'other'],
    default: 'other'
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: 20
  }],
  reminderDate: {
    type: Date
  },
  notes: {
    type: String,
    trim: true,
    maxlength: 500
  },
  status: {
    type: String,
    enum: ['not-started', 'in-progress', 'completed', 'on-hold'],
    default: 'not-started'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Task', taskSchema); 