import { Router } from 'express';
import { createStudent, deleteStudent, getStudent, listStudents, updateStudent, dashboard } from '../controllers/studentController.js';
import { requireAuth } from '../middleware/auth.js';
const router = Router();
router.use(requireAuth);
router.get('/dashboard', dashboard);
router.route('/').get(listStudents).post(createStudent);
router.route('/:id').get(getStudent).put(updateStudent).delete(deleteStudent);
export default router;
