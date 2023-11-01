import { Router } from 'express';
import * as courseController from '../../controllers/course.controller';
import { isAuthenticated, authorizeRoles } from '../../middleware/auth';

const router = Router();

router
	.route('/')
	.post(isAuthenticated, authorizeRoles('admin'), courseController.uploadCourse);

export default router;
