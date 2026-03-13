'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (token: string, user: User) => void;
    logout: () => void;
    isAuthenticated: boolean;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedToken = localStorage.getItem('lms_token');
        const savedUser = localStorage.getItem('lms_user');
        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);

        // Listen for the custom event dispatched by the axios interceptor on fatal token expiration
        const handleAuthExpired = () => {
            // we bypass the `logout` function here only because we are inside useEffect,
            // but we can just clear state manually here as local storage is already cleared by axios
            setToken(null);
            setUser(null);
        };
        window.addEventListener('lms_auth_expired', handleAuthExpired);

        return () => window.removeEventListener('lms_auth_expired', handleAuthExpired);
    }, []);

    const login = (newToken: string, newUser: User) => {
        localStorage.setItem('lms_token', newToken);
        localStorage.setItem('lms_user', JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
    };

    const logout = () => {
        localStorage.removeItem('lms_token');
        localStorage.removeItem('lms_user');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
}
