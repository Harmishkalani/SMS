import 'dotenv/config';
import mongoose from 'mongoose';
import Student from '../src/models/Student.js';
import User from '../src/models/User.js';
const email = process.argv[2];
if (!email) { console.error('Usage: npm run seed --prefix backend -- admin@example.com'); process.exit(1); }
try {
  await mongoose.connect(process.env.MONGODB_URI);
  const user = await User.findOne({email:email.toLowerCase()});
  if (!user) throw new Error('Create an account in the app first, then pass its email.');
  const samples = [
    {rollNumber:'STU-1001',firstName:'Aarav',lastName:'Shah',email:'aarav.shah@example.com',course:'Computer Applications',year:1,status:'Active'},
    {rollNumber:'STU-1002',firstName:'Mira',lastName:'Patel',email:'mira.patel@example.com',course:'Information Technology',year:2,status:'Active'},
    {rollNumber:'STU-1003',firstName:'Kabir',lastName:'Desai',email:'kabir.desai@example.com',course:'Computer Science',year:3,status:'Graduated'}
  ].map(s=>({...s,createdBy:user._id}));
  for (const s of samples) await Student.updateOne({createdBy:user._id,rollNumber:s.rollNumber},{$setOnInsert:s},{upsert:true});
  console.log('Sample records ensured.');
} catch(e) { console.error(e.message); process.exitCode=1; }
finally { await mongoose.disconnect(); }
