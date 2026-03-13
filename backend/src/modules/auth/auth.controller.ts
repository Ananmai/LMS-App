import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { SECURITY_CONFIG } from '../../config/security';

const authService = new AuthService();

export class AuthController {
    async register(req: Request, res: Response) {
        try {
            const { name, email, password } = req.body;
            const { user, accessToken, refreshToken } = await authService.register(name, email, password);

            res.cookie('refreshToken', refreshToken, SECURITY_CONFIG.COOKIE_OPTIONS);
            res.status(201).json({ user, token: accessToken });
        } catch (err: any) {
            res.status(400).json({ message: err.message });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const { user, accessToken, refreshToken } = await authService.login(email, password);

            res.cookie('refreshToken', refreshToken, SECURITY_CONFIG.COOKIE_OPTIONS);
            res.json({ user, token: accessToken });
        } catch (err: any) {
            res.status(401).json({ message: err.message });
        }
    }

    async refresh(req: Request, res: Response) {
        try {
            const oldRefreshToken = req.cookies.refreshToken;
            if (!oldRefreshToken) throw new Error('Refresh token required');

            const { accessToken, refreshToken } = await authService.refresh(oldRefreshToken);

            res.cookie('refreshToken', refreshToken, SECURITY_CONFIG.COOKIE_OPTIONS);
            res.json({ accessToken });
        } catch (err: any) {
            res.status(401).json({ message: err.message });
        }
    }

    async logout(req: Request, res: Response) {
        try {
            const refreshToken = req.cookies.refreshToken;
            await authService.logout(refreshToken);
            res.clearCookie('refreshToken', SECURITY_CONFIG.COOKIE_OPTIONS);
            res.json({ message: 'Logged out successfully' });
        } catch (err: any) {
            res.status(500).json({ message: 'Logout failed' });
        }
    }
}
