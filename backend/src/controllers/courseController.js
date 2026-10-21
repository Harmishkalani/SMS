import mongoose from 'mongoose';
import Course from '../models/Course.js';

export async function listCourses(req, res, next) {
  try {
    const courses = await Course.find({ createdBy: req.user.id }).sort({ name: 1 });
    res.json({ success: true, data: courses });
  } catch (err) { next(err); }
}

export async function createCourse(req, res, next) {
  try {
    const { name, fees } = req.body || {};
    if (!name || String(name).trim().length < 1) return res.status(400).json({ success: false, message: 'Course name is required.' });
    if (fees === undefined || fees === null || isNaN(Number(fees)) || Number(fees) < 0) return res.status(400).json({ success: false, message: 'A valid fee amount is required.' });
    const course = await Course.create({ name: String(name).trim(), fees: Number(fees), createdBy: req.user.id });
    res.status(201).json({ success: true, message: 'Course created.', data: course });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ success: false, message: 'A course with this name already exists.' });
    next(err);
  }
}

export async function updateCourse(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid course ID.' });
    const { name, fees } = req.body || {};
    if (!name || String(name).trim().length < 1) return res.status(400).json({ success: false, message: 'Course name is required.' });
    if (fees === undefined || fees === null || isNaN(Number(fees)) || Number(fees) < 0) return res.status(400).json({ success: false, message: 'A valid fee amount is required.' });
    const course = await Course.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      { name: String(name).trim(), fees: Number(fees) },
      { new: true, runValidators: true }
    );
    if (!course) return res.status(404).json({ success: false, message: 'Course not found.' });
    res.json({ success: true, message: 'Course updated.', data: course });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ success: false, message: 'A course with this name already exists.' });
    next(err);
  }
}

export async function deleteCourse(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid course ID.' });
    const course = await Course.findOneAndDelete({ _id: req.params.id, createdBy: req.user.id });
    if (!course) return res.status(404).json({ success: false, message: 'Course not found.' });
    res.json({ success: true, message: 'Course deleted.' });
  } catch (err) { next(err); }
}
