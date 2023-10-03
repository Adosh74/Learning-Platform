import { Router } from 'express';
import * as userControllers from '../../controllers/user.controller';
import { isAuthenticated } from '../../middleware/auth';

const router = Router();

router.post('/register', userControllers.register);
router.post('/activate-user', userControllers.activateUser);
router.post('/login', userControllers.login);
router.get('/logout', isAuthenticated, userControllers.logout);

export default router;
