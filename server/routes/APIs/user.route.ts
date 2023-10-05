import { Router } from 'express';
import * as authControllers from '../../controllers/auth.controller';
import { isAuthenticated } from '../../middleware/auth';

const router = Router();

router.post('/register', authControllers.register);
router.post('/activate-user', authControllers.activateUser);
router.post('/login', authControllers.login);
router.get('/logout', isAuthenticated, authControllers.logout);

router.get('/refresh', authControllers.updateAccessToken);

export default router;
