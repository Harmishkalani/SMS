import mongoose from 'mongoose';
import FeePayment from '../models/FeePayment.js';
import Student from '../models/Student.js';
import Course from '../models/Course.js';

function genReceiptNo() {
  const now = new Date();
  const datePart = `${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}`;
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `RCP-${datePart}-${rand}`;
}

export async function listPayments(req, res, next) {
  try {
    const page  = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, Number.parseInt(req.query.limit, 10) || 10));
    const filter = { createdBy: req.user.id };
    if (req.query.studentId && mongoose.isValidObjectId(req.query.studentId)) filter.student = req.query.studentId;
    const [items, total] = await Promise.all([
      FeePayment.find(filter)
        .populate('student', 'firstName lastName rollNumber email')
        .populate('course', 'name fees')
        .sort({ paidAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      FeePayment.countDocuments(filter)
    ]);
    res.json({ success: true, data: items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (err) { next(err); }
}

export async function createPayment(req, res, next) {
  try {
    const { studentId, courseId, amount, remarks } = req.body || {};
    if (!mongoose.isValidObjectId(studentId)) return res.status(400).json({ success: false, message: 'Valid student is required.' });
    if (!mongoose.isValidObjectId(courseId))  return res.status(400).json({ success: false, message: 'Valid course is required.' });
    if (isNaN(Number(amount)) || Number(amount) <= 0) return res.status(400).json({ success: false, message: 'A valid payment amount is required.' });

    const [student, course] = await Promise.all([
      Student.findOne({ _id: studentId, createdBy: req.user.id }),
      Course.findOne({ _id: courseId, createdBy: req.user.id })
    ]);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found.' });
    if (!course)  return res.status(404).json({ success: false, message: 'Course not found.' });

    let receiptNo, attempts = 0;
    do {
      receiptNo = genReceiptNo();
      attempts++;
    } while (attempts < 5 && await FeePayment.exists({ receiptNo }));

    const payment = await FeePayment.create({
      student: studentId, course: courseId,
      amount: Number(amount), remarks: remarks || '',
      receiptNo, paidAt: new Date(), createdBy: req.user.id
    });
    const populated = await payment.populate([
      { path: 'student', select: 'firstName lastName rollNumber email' },
      { path: 'course',  select: 'name fees' }
    ]);
    res.status(201).json({ success: true, message: 'Payment recorded.', data: populated });
  } catch (err) { next(err); }
}

export async function getPayment(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid payment ID.' });
    const payment = await FeePayment.findOne({ _id: req.params.id, createdBy: req.user.id })
      .populate('student', 'firstName lastName rollNumber email')
      .populate('course', 'name fees');
    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found.' });
    res.json({ success: true, data: payment });
  } catch (err) { next(err); }
}

export async function searchStudentsForFee(req, res, next) {
  try {
    const q = String(req.query.q || '').slice(0, 80).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (!q) return res.json({ success: true, data: [] });
    const students = await Student.find({
      createdBy: req.user.id,
      $or: ['firstName','lastName','rollNumber','email'].map(k => ({ [k]: { $regex: q, $options: 'i' } }))
    }).limit(10).select('firstName lastName rollNumber email course');
    res.json({ success: true, data: students });
  } catch (err) { next(err); }
}
