import express from 'express';
import { json } from 'body-parser';
import rateLimit from 'express-rate-limit';
import { serve, setup } from 'swagger-ui-express';
import swaggerDocument from './public/swagger.json' assert { type: 'json' };
import authRoutes from './routes/authRoutes.js';
import todoRoutes from './routes/todoRoutes.js';
import { connectToDb } from './config/db.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

// Middleware
app.use(json());

// Rate Limiting Middleware
app.use(rateLimit);


// Swagger Documentation
app.use('/api-docs', serve, setup(swaggerDocument));

// Routes
app.use('/auth', authRoutes);
app.use('/todos', todoRoutes);

// Database Connection
connectToDb();

// Error Handling Middleware
app.use(errorHandler);

export default app; // Export the app to use in index.js
