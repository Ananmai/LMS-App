import pool from '../../config/db';
import { hashPassword, comparePassword } from '../../utils/password';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../utils/jwt';

export class AuthService {
    async register(name: string, email: string, password: string) {
        const [existing]: any = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) throw new Error('Email already in use');

        const hashedPassword = await hashPassword(password);
        const [result]: any = await pool.query(
            'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );

        const userId = result.insertId;
        const user = { id: userId, name, email };
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(userId);

        // Store refresh token
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);
        await pool.query(
            'INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)',
            [userId, refreshToken, expiresAt]
        );

        return { user, accessToken, refreshToken };
    }

    async login(email: string, password: string) {
        const [rows]: any = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        const user = rows[0];

        if (!user || !(await comparePassword(password, user.password_hash))) {
            throw new Error('Invalid credentials');
        }

        const accessToken = generateAccessToken({ id: user.id, email: user.email, name: user.name });
        const refreshToken = generateRefreshToken(user.id);

        // Store refresh token
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);
        await pool.query(
            'INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)',
            [user.id, refreshToken, expiresAt]
        );

        return { user: { id: user.id, name: user.name, email: user.email }, accessToken, refreshToken };
    }

    async refresh(oldRefreshToken: string) {
        const decoded = verifyRefreshToken(oldRefreshToken);
        const [stored]: any = await pool.query(
            'SELECT * FROM refresh_tokens WHERE token_hash = ? AND revoked_at IS NULL AND expires_at > NOW()',
            [oldRefreshToken]
        );

        if (!stored.length) throw new Error('Invalid refresh token');

        const [userRows]: any = await pool.query('SELECT id, name, email FROM users WHERE id = ?', [decoded.id]);
        const user = userRows[0];
        if (!user) throw new Error('User not found');

        const accessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user.id);

        // Rotate tokens
        await pool.query('UPDATE refresh_tokens SET revoked_at = NOW() WHERE token_hash = ?', [oldRefreshToken]);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);
        await pool.query(
            'INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)',
            [user.id, newRefreshToken, expiresAt]
        );

        return { accessToken, refreshToken: newRefreshToken };
    }

    async logout(refreshToken?: string) {
        if (refreshToken) {
            await pool.query('UPDATE refresh_tokens SET revoked_at = NOW() WHERE token_hash = ?', [refreshToken]);
        }
    }
}
