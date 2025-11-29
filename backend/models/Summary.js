import mongoose from 'mongoose';

const summarySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    fileName: {
      type: String,
      required: true,
    },
    originalText: {
      type: String, // We store this to allow re-summarizing later (optional)
      required: false,
    },
    summaryText: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      default: 'English',
    },
  },
  {
    timestamps: true,
  }
);

const Summary = mongoose.model('Summary', summarySchema);
export default Summary;