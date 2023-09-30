import { Router } from 'express';
import * as userControllers from '../../controllers/user.controller';

const router = Router();

router.post('/register', userControllers.register);
router.post('/activate-user', userControllers.activateUser);
router.post('/login', userControllers.login);
router.get('/logout', userControllers.logout);

export default router;
