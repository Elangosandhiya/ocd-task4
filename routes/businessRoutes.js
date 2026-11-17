import { Router } from 'express';
import {
  createBusiness,
  deleteBusiness,
  getBusiness,
  listBusinesses,
  setBusinessFeatured,
  updateBusiness
} from '../controllers/businessController.js';
import { authenticateToken } from '../middleware/authenticateToken.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { idValidator } from '../validators/commonValidators.js';
import {
  businessBodyValidators,
  featuredBodyValidator,
  listBusinessesValidators
} from '../validators/businessValidators.js';

const router = Router();

router.get('/', listBusinessesValidators, validate, asyncHandler(listBusinesses));
router.get('/:id', idValidator, validate, asyncHandler(getBusiness));
router.post('/', authenticateToken, businessBodyValidators, validate, asyncHandler(createBusiness));
router.put('/:id', authenticateToken, idValidator, businessBodyValidators, validate, asyncHandler(updateBusiness));
router.delete('/:id', authenticateToken, idValidator, validate, asyncHandler(deleteBusiness));
router.patch('/:id/featured', authenticateToken, idValidator, featuredBodyValidator, validate, asyncHandler(setBusinessFeatured));

export default router;
