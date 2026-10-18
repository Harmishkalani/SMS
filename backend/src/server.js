import 'dotenv/config';
import app from './app.js';
import { connectDB } from './config/db.js';
const port = Number(process.env.PORT) || 5000;
let server;
try {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 24 || process.env.JWT_SECRET.startsWith('replace-this')) throw new Error('Set a strong JWT_SECRET (at least 24 characters) in backend/.env before starting.');
  await connectDB();
  server = app.listen(port, () => console.log(`API listening at http://localhost:${port}`));
} catch (err) {
  console.error(`Startup failed: ${err.message}`);
  process.exitCode = 1;
}
async function shutdown() {
  if (server) server.close();
  const mongoose = await import('mongoose');
  await mongoose.default.disconnect();
  process.exit(0);
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
