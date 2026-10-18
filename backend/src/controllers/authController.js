import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { validEmail } from '../utils/validators.js';
const makeToken = user => jwt.sign({ role: user.role }, process.env.JWT_SECRET, { subject: user._id.toString(), expiresIn: process.env.JWT_EXPIRES_IN || '2h' });
export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body || {};
    if (typeof name !== 'string' || name.trim().length < 2) return res.status(400).json({ success:false, message:'Name must contain at least 2 characters.' });
    if (!validEmail(email)) return res.status(400).json({ success:false, message:'Enter a valid email address.' });
    if (typeof password !== 'string' || password.length < 8 || password.length > 128) return res.status(400).json({ success:false, message:'Password must be 8–128 characters.' });
    const normalized = email.trim().toLowerCase();
    if (await User.exists({ email: normalized })) return res.status(409).json({ success:false, message:'An account with this email already exists.' });
    const user = await User.create({ name: name.trim(), email: normalized, passwordHash: await bcrypt.hash(password, 12) });
    return res.status(201).json({ success:true, message:'Account created.', data:{ user:{ id:user.id, name:user.name, email:user.email, role:user.role }, token:makeToken(user) } });
  } catch (err) { next(err); }
}
export async function login(req, res, next) {
  try {
    const { email, password } = req.body || {};
    if (!validEmail(email) || typeof password !== 'string') return res.status(400).json({ success:false, message:'Email and password are required.' });
    const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+passwordHash');
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) return res.status(401).json({ success:false, message:'Invalid email or password.' });
    return res.json({ success:true, message:'Signed in.', data:{ user:{ id:user.id, name:user.name, email:user.email, role:user.role }, token:makeToken(user) } });
  } catch (err) { next(err); }
}
