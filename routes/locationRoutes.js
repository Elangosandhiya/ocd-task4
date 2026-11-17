import { Router } from 'express';
import { listLocations } from '../controllers/locationController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get('/', asyncHandler(listLocations));

export default router;
