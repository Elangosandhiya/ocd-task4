import { param } from 'express-validator';

export const idValidator = param('id')
  .isInt({ min: 1 })
  .withMessage('ID must be a positive integer')
  .toInt();
