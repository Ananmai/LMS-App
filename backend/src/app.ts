import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { ENV } from './config/env';
import { errorHandler } from './middleware/errorHandler';

// Module Routes
import authRoutes from './modules/auth/auth.routes';
import subjectRoutes from './modules/subjects/subjects.routes';
import videoRoutes from './modules/videos/videos.routes';
import progressRoutes from './modules/progress/progress.routes';
import enrollmentRoutes from './modules/enrollments/enrollments.routes';
import healthRoutes from './modules/health/health.routes';

const app = express();

// Standard Middleware
app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = [ENV.FRONTEND_URL, 'https://ananmai-lms-app.vercel.app'];
        if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Route Registration
app.use('/api/auth', authRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/health', healthRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;
