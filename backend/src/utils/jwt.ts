import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';

interface UserPayload {
    id: number;
    email: string;
    name: string;
}

export const generateAccessToken = (user: UserPayload): string => {
    return jwt.sign(user, ENV.JWT_SECRET, { expiresIn: '15m' });
};

export const generateRefreshToken = (userId: number): string => {
    return jwt.sign({ id: userId }, ENV.REFRESH_TOKEN_SECRET, { expiresIn: '30d' });
};

export const verifyAccessToken = (token: string): UserPayload => {
    return jwt.verify(token, ENV.JWT_SECRET) as UserPayload;
};

export const verifyRefreshToken = (token: string): { id: number } => {
    return jwt.verify(token, ENV.REFRESH_TOKEN_SECRET) as { id: number };
};
