import { body } from 'express-validator';

export const loginValidators = [
  body('username').isString().withMessage('Username is required')
    .trim().notEmpty().withMessage('Username is required'),
  body('password').isString().withMessage('Password is required')
    .notEmpty().withMessage('Password is required')
];
