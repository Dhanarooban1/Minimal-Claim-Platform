// models/Claim.js
import mongoose from 'mongoose';

const claimSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please provide name']
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please provide a valid email'
    ]
  },
  claimAmount: {
    type: Number,
    required: [true, 'Please provide claim amount']
  },
  description: {
    type: String,
    required: [true, 'Please provide description']
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  submissionDate: {
    type: Date,
    default: Date.now
  },
  approvedAmount: {
    type: Number,
    default: 0
  },
  insurerComments: {
    type: String,
    default: ''
  },
  documents: [{
    type: String  // Store file paths
  }],
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Claim || mongoose.model('Claim', claimSchema);