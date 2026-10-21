import mongoose from 'mongoose';
const courseSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  fees: { type: Number, required: true, min: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });
courseSchema.index({ createdBy: 1, name: 1 }, { unique: true });
export default mongoose.model('Course', courseSchema);
