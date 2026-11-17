import { Router } from 'express';
import { login } from '../controllers/authController.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { loginValidators } from '../validators/authValidators.js';

const router = Router();

router.post('/login', loginValidators, validate, asyncHandler(login));

export default router;
