import { Router } from 'express';
import * as courseController from '../../controllers/course.controller';
import { isAuthenticated, authorizeRoles } from '../../middleware/auth';

const router = Router();

router
	.route('/')
	.post(isAuthenticated, authorizeRoles('admin'), courseController.uploadCourse);

router
	.route('/:id')
	.put(isAuthenticated, authorizeRoles('admin'), courseController.updateCourse);

export default router;
