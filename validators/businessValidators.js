import { body, query } from 'express-validator';

const phonePattern = /^\+?[0-9\s().-]{7,20}$/;

export const listBusinessesValidators = [
  query('search').optional().trim().isLength({ max: 100 })
    .withMessage('Search must be 100 characters or fewer'),
  query('category').optional().isInt({ min: 1 }).withMessage('Category must be a positive integer').toInt(),
  query('location').optional().trim().isLength({ max: 100 })
    .withMessage('Location must be 100 characters or fewer'),
  query('featured').optional().isBoolean({ strict: true })
    .withMessage('Featured must be true or false').toBoolean(),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer').toInt(),
  query('limit').optional().isInt({ min: 1, max: 50 })
    .withMessage('Limit must be an integer between 1 and 50').toInt(),
  query('sort').optional().isIn(['newest', 'name'])
    .withMessage('Sort must be newest or name')
];

export const businessBodyValidators = [
  body('name').trim().notEmpty().withMessage('Name is required')
    .isLength({ max: 150 }).withMessage('Name must be 150 characters or fewer'),
  body('description').trim().notEmpty().withMessage('Description is required')
    .isLength({ max: 2000 }).withMessage('Description must be 2000 characters or fewer'),
  body('category_id').isInt({ min: 1 }).withMessage('Category ID must be a positive integer').toInt(),
  body('address').trim().notEmpty().withMessage('Address is required')
    .isLength({ max: 300 }).withMessage('Address must be 300 characters or fewer'),
  body('location').trim().notEmpty().withMessage('Location is required')
    .isLength({ max: 100 }).withMessage('Location must be 100 characters or fewer'),
  body('contact_number').trim().matches(phonePattern)
    .withMessage('Contact number must be a valid phone number (7-20 characters)'),
  body('whatsapp_number').trim().matches(phonePattern)
    .withMessage('WhatsApp number must be a valid phone number (7-20 characters)'),
  body('website_url').optional({ values: 'null' }).trim().isURL({ require_protocol: true })
    .withMessage('Website URL must be a valid URL including its protocol')
    .isLength({ max: 2048 }).withMessage('Website URL must be 2048 characters or fewer'),
  body('image_url').optional({ values: 'null' }).trim().isURL({ require_protocol: true })
    .withMessage('Image URL must be a valid URL including its protocol')
    .isLength({ max: 2048 }).withMessage('Image URL must be 2048 characters or fewer'),
  body('is_featured').optional().isBoolean({ strict: true })
    .withMessage('Featured must be true or false').toBoolean()
];

export const featuredBodyValidator = body('is_featured')
  .exists().withMessage('is_featured is required')
  .bail()
  .isBoolean({ strict: true }).withMessage('is_featured must be true or false')
  .toBoolean();
