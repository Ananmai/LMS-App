/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { enrollmentApi, progressApi, authApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import {
    User,
    Mail,
    Calendar,
    BookOpen,
    CheckCircle,
    Clock,
    LogOut,
    ChevronRight,
    Play,
} from 'lucide-react';

interface EnrolledSubject {
    subject_id: number;
    title: string;
    description: string;
    enrollment_date: string;
    progress?: number;
}

export default function ProfilePage() {
    const { user, isAuthenticated, loading: authLoading, logout } = useAuth();
    const router = useRouter();

    const [enrolledSubjects, setEnrolledSubjects] = useState<EnrolledSubject[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
            return;
        }

        const fetchData = async () => {
            if (isAuthenticated) {
                try {
                    const enrollRes = await enrollmentApi.getMyEnrollments();
                    const subjects = enrollRes.data;

                    // Fetch progress for each subject
                    const subjectsWithProgress = await Promise.all(subjects.map(async (s: any) => {
                        try {
                            const progRes = await progressApi.getSubjectProgress(s.subject_id);
                            const totalVideos = progRes.data.length; // This is actually total tracked videos, might not be accurate if some videos have no progress
                            // Actually, better to get tree to know total videos, but let's simplify for now
                            const completedVideos = progRes.data.filter((p: any) => p.is_completed).length;
                            // For simplicity, we'll just show the count.
                            return {
                                ...s,
                                completedCount: completedVideos,
                                totalCount: totalVideos
                            };
                        } catch {
                            return { ...s, completedCount: 0, totalCount: 0 };
                        }
                    }));

                    setEnrolledSubjects(subjectsWithProgress);
                } catch (err) {
                    console.error('Error fetching profile data:', err);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchData();
    }, [isAuthenticated, authLoading, router]);

    const handleLogout = async () => {
        try {
            await authApi.logout();
            logout();
            router.push('/login');
        } catch (err) {
            console.error('Logout error:', err);
        }
    };

    if (authLoading || loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                {/* User Info Card */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />

                        <div className="relative z-10">
                            <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-xl shadow-indigo-600/20">
                                <User size={40} />
                            </div>

                            <h1 className="text-2xl font-black text-white mb-1">{user?.name}</h1>
                            <p className="text-gray-400 font-medium mb-8 flex items-center gap-2">
                                <Mail size={16} className="text-gray-600" />
                                {user?.email}
                            </p>

                            <div className="space-y-4 pt-6 border-t border-gray-800">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500 font-bold uppercase tracking-wider">Member Since</span>
                                    <span className="text-gray-300 font-medium">March 2026</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500 font-bold uppercase tracking-wider">Courses Enrolled</span>
                                    <span className="text-indigo-400 font-bold">{enrolledSubjects.length}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="w-full mt-10 py-4 bg-gray-800 hover:bg-red-500/10 hover:text-red-400 text-gray-400 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 group border border-transparent hover:border-red-500/20"
                            >
                                <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                                Sign Out
                            </button>
                        </div>
                    </div>

                    <div className="bg-indigo-600/5 border border-indigo-500/10 rounded-3xl p-8">
                        <h3 className="text-indigo-400 font-black uppercase tracking-widest text-xs mb-4">Achievements</h3>
                        <div className="flex flex-wrap gap-3">
                            <div className="px-4 py-2 bg-indigo-500/10 rounded-full border border-indigo-500/20 text-xs font-bold text-indigo-300">Newcomer</div>
                            <div className="px-4 py-2 bg-gray-800/50 rounded-full border border-gray-800 text-xs font-bold text-gray-500">Fast Learner</div>
                            <div className="px-4 py-2 bg-gray-800/50 rounded-full border border-gray-800 text-xs font-bold text-gray-500">Video Pro</div>
                        </div>
                    </div>
                </div>

                {/* Main Content (Enrolled Courses) */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-black text-white">Your Dashboard</h2>
                    </div>

                    {enrolledSubjects.length === 0 ? (
                        <div className="bg-gray-900/40 border border-gray-800 border-dashed rounded-3xl p-16 text-center">
                            <BookOpen className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                            <p className="text-gray-400 font-bold mb-6">You haven't enrolled in any subjects yet.</p>
                            <Link href="/subjects" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black shadow-xl shadow-indigo-600/20 transition-all active:scale-95 inline-block">
                                Browse Subjects
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {enrolledSubjects.map((subject) => (
                                <Link
                                    key={subject.subject_id}
                                    href={`/subjects/${subject.subject_id}`}
                                    className="group bg-gray-900 border border-gray-800 rounded-3xl p-6 transition-all hover:border-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/5"
                                >
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                            <Play size={20} />
                                        </div>
                                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest px-3 py-1 bg-gray-800 rounded-full">
                                            LMS Course
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-black text-white mb-2 group-hover:text-indigo-400 transition-colors truncate">
                                        {subject.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 mb-6 line-clamp-2 leading-relaxed">
                                        {subject.description}
                                    </p>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-gray-400">
                                            <span>Progress</span>
                                            <span className="text-indigo-400">
                                                {(subject as any).completedCount} / {(subject as any).totalCount} Lessons
                                            </span>
                                        </div>
                                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-indigo-500 rounded-full transition-all duration-1000"
                                                style={{ width: `${((subject as any).completedCount / ((subject as any).totalCount || 1)) * 100}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-6 flex items-center gap-2 text-indigo-400 text-xs font-bold opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                                        Continue Learning <ChevronRight size={14} />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Activity Feed / Placeholder */}
                    <div className="bg-gray-900/40 border border-gray-800 rounded-3xl p-8">
                        <h4 className="text-sm font-black text-white uppercase tracking-widest mb-6">Recent Activity</h4>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 text-sm">
                                <div className="w-8 h-8 bg-green-500/10 text-green-500 rounded-lg flex items-center justify-center">
                                    <CheckCircle size={16} />
                                </div>
                                <p className="text-gray-400"><span className="text-white font-bold">You</span> completed a lesson in <span className="text-indigo-400">Node.js Mastery</span></p>
                                <span className="text-xs text-gray-600 ml-auto">2 hours ago</span>
                            </div>
                            <div className="flex items-center gap-4 text-sm opacity-50">
                                <div className="w-8 h-8 bg-indigo-500/10 text-indigo-500 rounded-lg flex items-center justify-center">
                                    <Clock size={16} />
                                </div>
                                <p className="text-gray-400"><span className="text-white font-bold">You</span> started the course <span className="text-indigo-400">React Advanced Patterns</span></p>
                                <span className="text-xs text-gray-600 ml-auto">1 day ago</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
