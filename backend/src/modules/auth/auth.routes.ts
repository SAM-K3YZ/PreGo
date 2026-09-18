import express from 'express';
import * as controller from './auth.controller';
import validateRequest from '../../middleware/validateRequest';
import { authLimiter } from '../../middleware/rateLimiter';
import { signUpSchema, loginSchema } from './auth.validators';

const router = express.Router();

router.post('/signup', authLimiter, validateRequest(signUpSchema), controller.signUp);
router.post('/login', authLimiter, validateRequest(loginSchema), controller.login);
router.post('/refresh', authLimiter, controller.refresh);
router.post('/logout', controller.logout);

export default router;
