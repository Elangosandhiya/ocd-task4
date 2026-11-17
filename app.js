import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import businessRoutes from './routes/businessRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import locationRoutes from './routes/locationRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { config } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { ApiError } from './utils/ApiError.js';

const app = express();
const allowedOrigins = config.clientOrigins;

app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    // Requests without an Origin header are typically server-to-server.
    callback(null, !origin || allowedOrigins.includes(origin));
  }
}));
app.use(express.json({ limit: '1mb' }));
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false
}));

app.use('/api/auth', authRoutes);
app.use('/api/businesses', businessRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/locations', locationRoutes);

app.use((req, res, next) => {
  next(new ApiError(404, 'Route not found'));
});

app.use(errorHandler);

export default app;
