import mongoose from 'mongoose';
import Student from '../models/Student.js';
import { validateStudent } from '../utils/validators.js';
const clean = body => ({ rollNumber:body.rollNumber, firstName:body.firstName, lastName:body.lastName, email:body.email, course:body.course, year:Number(body.year), status:body.status || 'Active' });
export async function listStudents(req, res, next) {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page,10) || 1);
    const limit = Math.min(100, Math.max(1, Number.parseInt(req.query.limit,10) || 10));
    const filter = { createdBy:req.user.id };
    if (req.query.status && ['Active','Inactive','Graduated'].includes(req.query.status)) filter.status = req.query.status;
    if (req.query.search) {
      const escaped = String(req.query.search).slice(0,80).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = ['firstName','lastName','rollNumber','email','course'].map(k => ({ [k]: { $regex:escaped, $options:'i' } }));
    }
    const [items,total] = await Promise.all([Student.find(filter).sort({ createdAt:-1 }).skip((page-1)*limit).limit(limit), Student.countDocuments(filter)]);
    res.json({ success:true, data:items, pagination:{ page, limit, total, pages:Math.ceil(total/limit) } });
  } catch (err) { next(err); }
}
export async function getStudent(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success:false,message:'Invalid student ID.' });
    const item = await Student.findOne({ _id:req.params.id, createdBy:req.user.id });
    if (!item) return res.status(404).json({ success:false,message:'Student not found.' });
    res.json({ success:true,data:item });
  } catch (err) { next(err); }
}
export async function createStudent(req, res, next) {
  try {
    const errors = validateStudent(req.body || {});
    if (errors.length) return res.status(400).json({ success:false,message:'Please correct the student details.',errors });
    const item = await Student.create({ ...clean(req.body), createdBy:req.user.id });
    res.status(201).json({ success:true,message:'Student created.',data:item });
  } catch (err) { next(err); }
}
export async function updateStudent(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success:false,message:'Invalid student ID.' });
    const errors = validateStudent(req.body || {});
    if (errors.length) return res.status(400).json({ success:false,message:'Please correct the student details.',errors });
    const item = await Student.findOneAndUpdate({ _id:req.params.id, createdBy:req.user.id }, clean(req.body), { new:true, runValidators:true });
    if (!item) return res.status(404).json({ success:false,message:'Student not found.' });
    res.json({ success:true,message:'Student updated.',data:item });
  } catch (err) { next(err); }
}
export async function deleteStudent(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success:false,message:'Invalid student ID.' });
    const item = await Student.findOneAndDelete({ _id:req.params.id, createdBy:req.user.id });
    if (!item) return res.status(404).json({ success:false,message:'Student not found.' });
    res.json({ success:true,message:'Student deleted.' });
  } catch (err) { next(err); }
}
export async function dashboard(req, res, next) {
  try {
    const [total,active,graduated] = await Promise.all([
      Student.countDocuments({createdBy:req.user.id}), Student.countDocuments({createdBy:req.user.id,status:'Active'}), Student.countDocuments({createdBy:req.user.id,status:'Graduated'})
    ]);
    res.json({success:true,data:{total,active,graduated,inactive:total-active-graduated}});
  } catch(err) { next(err); }
}
