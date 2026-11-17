import { body } from 'express-validator';

export const categoryBodyValidator = body('name')
  .trim()
  .notEmpty().withMessage('Name is required')
  .isLength({ max: 100 }).withMessage('Name must be 100 characters or fewer');
