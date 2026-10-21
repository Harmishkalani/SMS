import mongoose from 'mongoose';
const feePaymentSchema = new mongoose.Schema({
  student:    { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  course:     { type: mongoose.Schema.Types.ObjectId, ref: 'Course',  required: true },
  amount:     { type: Number, required: true, min: 0 },
  paidAt:     { type: Date, default: Date.now },
  receiptNo:  { type: String, required: true, unique: true },
  remarks:    { type: String, trim: true, maxlength: 300 },
  createdBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });
feePaymentSchema.index({ createdBy: 1, student: 1 });
export default mongoose.model('FeePayment', feePaymentSchema);
