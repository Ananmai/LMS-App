import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const ENV = {
    PORT: process.env.PORT || '5000',
    NODE_ENV: process.env.NODE_ENV || 'development',
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_PORT: parseInt(process.env.DB_PORT || '3306'),
    DB_USER: process.env.DB_USER || 'root',
    DB_PASSWORD: process.env.DB_PASSWORD || '',
    DB_NAME: process.env.DB_NAME || 'lms_db',
    DATABASE_URL: process.env.DATABASE_URL, 
    JWT_SECRET: process.env.JWT_SECRET || 'secret_key_123',
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || 'refresh_secret_456',
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
};
