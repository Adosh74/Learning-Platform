import { Router } from 'express';
import * as userControllers from '../../controllers/user.controller';

const router = Router();

router.post('/register', userControllers.register);
router.post('/activate-user', userControllers.activateUser);

export default router;
