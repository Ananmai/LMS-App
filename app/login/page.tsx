'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { authApi } from '@/lib/api';
import { Mail, Lock, ArrowRight, BookOpen, Star, Zap } from 'lucide-react';

function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await authApi.login({ email, password });
            login(res.data.token, res.data.user);

            const redirectPath = searchParams.get('redirect');
            if (redirectPath) {
                router.push(redirectPath);
            } else {
                router.push('/dashboard');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex" style={{background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #164e63 100%)'}}>
            {/* Left Panel — Branding */}
            <div className="hidden lg:flex flex-col justify-between w-1/2 p-14 relative overflow-hidden">
                {/* Background glow */}
                <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full opacity-20 blur-3xl pointer-events-none" style={{background: 'radial-gradient(circle, #0ea5e9, #14b8a6)'}} />
                <div className="absolute bottom-0 right-0 w-60 h-60 rounded-full opacity-10 blur-3xl pointer-events-none" style={{background: 'radial-gradient(circle, #6366f1, #8b5cf6)'}} />

                <div className="relative z-10">
                    <div className="text-2xl font-extrabold text-transparent bg-clip-text mb-2" style={{backgroundImage: 'linear-gradient(135deg, #38bdf8, #2dd4bf)'}}>
                        LMS PLATFORM
                    </div>
                    <p className="text-slate-400 text-sm">The #1 Tech Learning Platform</p>
                </div>

                <div className="relative z-10 space-y-8">
                    <h2 className="text-4xl font-extrabold text-white leading-tight">
                        Learn from the best.<br />
                        <span className="text-transparent bg-clip-text" style={{backgroundImage: 'linear-gradient(135deg, #38bdf8, #2dd4bf)'}}>
                            Build your future.
                        </span>
                    </h2>
                    <div className="space-y-4">
                        {[
                            { icon: <BookOpen size={18} className="text-sky-400" />, text: 'Access 12+ expert-crafted courses' },
                            { icon: <Star size={18} className="text-yellow-400" />, text: '4.7★ rated by 500,000+ students' },
                            { icon: <Zap size={18} className="text-teal-400" />, text: 'Learn at your own pace, anytime' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">{item.icon}</div>
                                <span className="text-slate-300 text-sm font-medium">{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative z-10 text-slate-500 text-xs">
                    © {new Date().getFullYear()} LMS PLATFORM. All rights reserved.
                </div>
            </div>

            {/* Right Panel — Form */}
            <div className="flex-1 flex items-center justify-center p-6 lg:p-14">
                <div className="w-full max-w-md">
                    {/* Card */}
                    <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-10">
                        <div className="mb-8">
                            <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Welcome back 👋</h1>
                            <p className="text-sm text-gray-500">Sign in to continue your learning journey</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {error && (
                                <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl border border-red-200 flex items-start gap-2">
                                    <span className="text-red-500 mt-0.5">⚠</span>
                                    {error}
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Email</label>
                                <div className="relative">
                                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        className="w-full border border-gray-200 bg-gray-50 rounded-xl pl-11 pr-4 py-3.5 text-sm text-gray-900 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:bg-white transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Password</label>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full border border-gray-200 bg-gray-50 rounded-xl pl-11 pr-4 py-3.5 text-sm text-gray-900 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 focus:bg-white transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full text-white font-bold py-3.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-sky-500/30 hover:scale-[1.01] disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                                style={{background: 'linear-gradient(135deg, #0ea5e9, #14b8a6)'}}
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <> Sign In <ArrowRight size={16} /> </>
                                )}
                            </button>
                        </form>

                        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                            <p className="text-sm text-gray-500">
                                Don&apos;t have an account?{' '}
                                <Link href="/register" className="font-bold text-sky-600 hover:text-sky-700 hover:underline transition-colors">
                                    Sign up free
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center" style={{background: 'linear-gradient(135deg, #0f172a, #1e3a5f)'}}>
                <div className="w-8 h-8 border-4 border-sky-500/30 border-t-sky-500 rounded-full animate-spin" />
            </div>
        }>
            <LoginForm />
        </Suspense>
    );
}
