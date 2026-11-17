import { Router } from 'express';
import {
  createCategory,
  deleteCategory,
  listCategories,
  updateCategory
} from '../controllers/categoryController.js';
import { authenticateToken } from '../middleware/authenticateToken.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { idValidator } from '../validators/commonValidators.js';
import { categoryBodyValidator } from '../validators/categoryValidators.js';

const router = Router();

router.get('/', asyncHandler(listCategories));
router.post('/', authenticateToken, categoryBodyValidator, validate, asyncHandler(createCategory));
router.put('/:id', authenticateToken, idValidator, categoryBodyValidator, validate, asyncHandler(updateCategory));
router.delete('/:id', authenticateToken, idValidator, validate, asyncHandler(deleteCategory));

export default router;
