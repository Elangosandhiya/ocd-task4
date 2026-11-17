import 'dotenv/config';

const required = [
  'DATABASE_URL',
  'JWT_SECRET',
  'CLIENT_ORIGIN',
  'ADMIN_USERNAME',
  'ADMIN_PASSWORD_HASH'
];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

if (process.env.JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must be at least 32 characters long');
}

export const config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
  clientOrigins: process.env.CLIENT_ORIGIN.split(',').map((origin) => origin.trim()),
  adminUsername: process.env.ADMIN_USERNAME,
  adminPasswordHash: process.env.ADMIN_PASSWORD_HASH
};
