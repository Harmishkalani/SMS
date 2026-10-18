import mongoose from 'mongoose';
const studentSchema = new mongoose.Schema({
  rollNumber: { type: String, required: true, trim: true, uppercase: true, maxlength: 30 },
  firstName: { type: String, required: true, trim: true, minlength: 1, maxlength: 80 },
  lastName: { type: String, required: true, trim: true, minlength: 1, maxlength: 80 },
  email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
  course: { type: String, required: true, trim: true, maxlength: 120 },
  year: { type: Number, required: true, min: 1, max: 8 },
  status: { type: String, enum: ['Active', 'Inactive', 'Graduated'], default: 'Active' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });
studentSchema.index({ createdBy: 1, rollNumber: 1 }, { unique: true });
studentSchema.index({ createdBy: 1, lastName: 1, firstName: 1 });
export default mongoose.model('Student', studentSchema);
