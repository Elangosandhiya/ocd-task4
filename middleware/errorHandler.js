import { ApiError } from '../utils/ApiError.js';

export function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  if (error.code === '23505' || error.code === '23503') {
    return res.status(409).json({
      success: false,
      message: error.code === '23505'
        ? 'A record with that value already exists'
        : 'This change conflicts with related records',
      errors: []
    });
  }

  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      message: 'Request body contains invalid JSON',
      errors: []
    });
  }

  const statusCode = error instanceof ApiError
    ? error.statusCode
    : Number.isInteger(error.status) && error.status >= 400 && error.status < 500
      ? error.status
      : 500;

  if (statusCode >= 500) {
    console.error(error);
  }

  return res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? 'Internal server error' : error.message,
    errors: error instanceof ApiError ? error.errors : []
  });
}
