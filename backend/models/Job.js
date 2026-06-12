const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  companyName: {
    type: String,
    required: [true, 'Please add a company name'],
    trim: true,
  },
  jobTitle: {
    type: String,
    required: [true, 'Please add a job title'],
    trim: true,
  },
  location: {
    type: String,
    trim: true,
    default: '',
  },
  dateApplied: {
    type: Date,
    default: Date.now,
  },
  interviewDate: {
    type: Date,
  },
  status: {
    type: String,
    required: [true, 'Please specify status'],
    enum: [
      'Applied',
      'Phone Screen',
      'Interview',
      'Offer',
      'Rejected'
    ],
    default: 'Applied',
  },
  resume: {
    type: String,
    default: '',
  },
  jobUrl: {
    type: String,
    trim: true,
    default: '',
  },
  notes: {
    type: String,
    trim: true,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Job', JobSchema);
