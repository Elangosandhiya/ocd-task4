import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

export function authenticateToken(req, res, next) {
  const authorization = req.get('authorization');
  const [scheme, token] = authorization ? authorization.split(' ') : [];

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({
      success: false,
      message: 'A valid Bearer token is required',
      errors: []
    });
  }

  try {
    const payload = jwt.verify(token, config.jwtSecret);
    if (typeof payload !== 'object' || payload.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Invalid authentication token',
        errors: []
      });
    }

    req.user = payload;
    return next();
  } catch {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token',
      errors: []
    });
  }
}
