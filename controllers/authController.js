import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { matchedData } from 'express-validator';
import { config } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

export async function login(req, res) {
  const { username, password } = matchedData(req, { locations: ['body'] });
  const usernameMatches = username === config.adminUsername;
  const passwordMatches = await bcrypt.compare(password, config.adminPasswordHash);

  if (!usernameMatches || !passwordMatches) {
    throw new ApiError(401, 'Invalid username or password');
  }

  const token = jwt.sign(
    { sub: config.adminUsername, role: 'admin' },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );

  return res.status(200).json({
    success: true,
    data: { token, token_type: 'Bearer', expires_in: config.jwtExpiresIn }
  });
}
