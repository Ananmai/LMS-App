import { ENV } from './env';

export const SECURITY_CONFIG = {
    COOKIE_OPTIONS: {
        httpOnly: true,
        secure: ENV.NODE_ENV === 'production',
        sameSite: 'strict' as const,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    },
};
