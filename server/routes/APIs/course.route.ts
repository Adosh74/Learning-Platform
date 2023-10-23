import { Router } from 'express';
import * as courseController from '../../controllers/course.controller';

const router = Router();

router.route('/').post(courseController.uploadCourse);

export default router;
