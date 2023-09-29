import { Router } from 'express';
import userRoutes from './APIs/user.route';

const router = Router();

router.use('/users', userRoutes);

export default router;
