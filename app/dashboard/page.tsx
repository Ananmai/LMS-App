/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { subjectsApi, progressApi, enrollmentApi } from '@/lib/api';
import { BookOpen, PlayCircle, TrendingUp, ArrowRight, CheckCircle, Clock } from 'lucide-react';

interface ProgressItem {
    subject_id: number;
    subject_title: string;
    video_id: number;
    video_title: string;
    is_completed: boolean;
    last_position_seconds: number;
    updated_at: string;
}

interface Subject {
    id: number;
    title: string;
    description: string;
    slug: string;
}

export default function DashboardPage() {
    const { user, isAuthenticated, loading } = useAuth();
    const router = useRouter();
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [progress, setProgress] = useState<ProgressItem[]>([]);
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, loading, router]);

    useEffect(() => {
        if (!isAuthenticated) return;

        const fetchData = async () => {
            try {
                const [subjectsRes, enrollmentRes] = await Promise.all([
                    subjectsApi.getAll(),
                    enrollmentApi.getMyEnrollments()
                ]);
                const subjectsList: Subject[] = subjectsRes.data;
                const enrollments = enrollmentRes.data;

                // Fetch progress for each enrolled subject
                const progressPromises = enrollments.map((enrollment: any) =>
                    progressApi.getSubjectProgress(enrollment.subject_id)
                );
                const progressResults = await Promise.all(progressPromises);

                const allProgress: ProgressItem[] = [];
                progressResults.forEach((res, index) => {
                    const subjectId = enrollments[index].subject_id;
                    const subject = subjectsList.find(s => s.id === subjectId);

                    res.data.forEach((p: any) => {
                        allProgress.push({
                            ...p,
                            subject_id: subjectId,
                            subject_title: subject?.title || 'Unknown Subject',
                        });
                    });
                });

                setSubjects(subjectsList);
                setProgress(allProgress);
            } catch (err) {
                console.error('Dashboard fetch error:', err);
            } finally {
                setLoadingData(false);
            }
        };

        fetchData();
    }, [isAuthenticated]);

    // Filter to only enrolled subjects if we want to be strict, 
    // but for now, we'll show all and highlight progress.
    const subjectsWithProgress = subjects.map((subject) => {
        const subjectProgress = progress.filter((p) => p.subject_id === subject.id);
        const completedCount = subjectProgress.filter((p) => p.is_completed).length;
        const lastActivity = subjectProgress.sort(
            (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        )[0];
        return { ...subject, completedCount, totalStarted: subjectProgress.length, lastActivity };
    });

    const recentActivity = [...progress]
        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
        .slice(0, 5);

    const completedVideos = progress.filter((p) => p.is_completed).length;
    const inProgressVideos = progress.filter((p) => !p.is_completed && p.last_position_seconds > 0).length;

    if (loading || loadingData) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Welcome Header */}
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-white mb-1">
                    Welcome back, <span className="gradient-text">{user?.name}</span> 👋
                </h1>
                <p className="text-gray-400">Here&apos;s an overview of your learning progress.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                {[
                    {
                        icon: <BookOpen className="text-indigo-400" size={22} />,
                        label: 'Subjects Available',
                        value: subjects.length,
                        bg: 'from-indigo-500/10 to-indigo-500/5',
                        border: 'border-indigo-500/20',
                    },
                    {
                        icon: <CheckCircle className="text-green-400" size={22} />,
                        label: 'Videos Completed',
                        value: completedVideos,
                        bg: 'from-green-500/10 to-green-500/5',
                        border: 'border-green-500/20',
                    },
                    {
                        icon: <TrendingUp className="text-purple-400" size={22} />,
                        label: 'Videos In Progress',
                        value: inProgressVideos,
                        bg: 'from-purple-500/10 to-purple-500/5',
                        border: 'border-purple-500/20',
                    },
                ].map((stat) => (
                    <div key={stat.label} className={`card p-6 bg-gradient-to-br ${stat.bg} border ${stat.border}`}>
                        <div className="flex items-center gap-3 mb-3">
                            {stat.icon}
                            <span className="text-sm text-gray-400">{stat.label}</span>
                        </div>
                        <div className="text-4xl font-bold text-white">{stat.value}</div>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Subjects with Progress */}
                <div className="lg:col-span-2">
                    <h2 className="section-header">Your Subjects</h2>
                    <div className="space-y-4">
                        {subjectsWithProgress.length === 0 ? (
                            <div className="card p-8 text-center text-gray-400">
                                No subjects available yet.
                            </div>
                        ) : (
                            subjectsWithProgress.map((subject) => (
                                <div key={subject.id} className="card p-5 flex gap-4 hover:border-gray-700 transition-all duration-200">
                                    <div className="w-20 h-14 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0">
                                        <BookOpen className="text-indigo-500" size={24} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-white text-sm mb-0.5 truncate">{subject.title}</h3>
                                        <p className="text-xs text-gray-500 mb-3 truncate">{subject.description}</p>
                                        {subject.totalStarted > 0 && (
                                            <div className="mb-2">
                                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                                    <span>{subject.completedCount} completed</span>
                                                    <span>{subject.totalStarted} started</span>
                                                </div>
                                                <div className="progress-bar-bg">
                                                    <div
                                                        className="progress-bar-fill"
                                                        style={{ width: `${(subject.completedCount / Math.max(subject.totalStarted, 1)) * 100}%` }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <Link
                                        href={`/subjects/${subject.slug}`}
                                        className="flex-shrink-0 self-center flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                                    >
                                        {subject.lastActivity ? 'Resume' : 'Start'} <ArrowRight size={14} />
                                    </Link>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Recent Activity */}
                <div>
                    <h2 className="section-header">Recent Activity</h2>
                    {recentActivity.length === 0 ? (
                        <div className="card p-6 text-center">
                            <PlayCircle className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                            <p className="text-gray-400 text-sm">No activity yet.</p>
                            <Link href="/subjects" className="text-indigo-400 text-sm hover:text-indigo-300 mt-2 inline-block">
                                Browse subjects →
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {recentActivity.map((item) => (
                                <div key={`${item.video_id}-${item.updated_at}`} className="card p-4">
                                    <div className="flex items-start gap-3">
                                        <div className={`mt-0.5 w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${item.is_completed ? 'bg-green-500/20' : 'bg-indigo-500/20'}`}>
                                            {item.is_completed
                                                ? <CheckCircle size={14} className="text-green-400" />
                                                : <Clock size={14} className="text-indigo-400" />
                                            }
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm text-gray-200 font-medium truncate">{item.video_title}</p>
                                            <p className="text-xs text-gray-500 truncate">{item.subject_title}</p>
                                            <p className="text-xs text-gray-600 mt-1">
                                                {Math.floor(item.last_position_seconds / 60)}m {item.last_position_seconds % 60}s watched
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
