import { Router } from 'express';
import courseRoutes from './APIs/course.route';
import userRoutes from './APIs/user.route';

const router = Router();

router.use('/users', userRoutes);
router.use('/courses', courseRoutes);

export default router;
