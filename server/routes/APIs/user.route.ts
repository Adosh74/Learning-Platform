import { Router } from 'express';
import * as authControllers from '../../controllers/auth.controller';
import * as userControllers from '../../controllers/user.controller';
import { isAuthenticated } from '../../middleware/auth';

const router = Router();

router.post('/register', authControllers.register);
router.post('/activate-user', authControllers.activateUser);
router.post('/login', authControllers.login);
router.get('/logout', isAuthenticated, authControllers.logout);
router.patch('/update-password', isAuthenticated, authControllers.updatePassword);

router.get('/refresh', authControllers.updateAccessToken);
router.get('/me', isAuthenticated, userControllers.getMe);
router.post('/social-auth', authControllers.socialAuth);
router.patch('/update-user-info', isAuthenticated, userControllers.updateUserInfo);
router.patch(
	'/update-profile-picture',
	isAuthenticated,
	userControllers.updateProfilePicture
);

export default router;
