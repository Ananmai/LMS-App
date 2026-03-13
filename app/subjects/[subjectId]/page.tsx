'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { subjectsApi, enrollmentApi, progressApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import {
    ChevronRight,
    Play,
    BookOpen,
    CheckCircle,
    Users,
    Clock,
    Lock,
    Unlock,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface Video {
    id: number;
    title: string;
    duration_seconds: number;
    order_index: number;
}

interface Section {
    id: number;
    title: string;
    order_index: number;
    videos: Video[];
}

interface Subject {
    id: number;
    title: string;
    description: string;
    sections: Section[];
}

export default function SubjectDetailPage() {
    const params = useParams();
    const subjectId = params.subjectId as string;
    const router = useRouter();
    const { isAuthenticated, user } = useAuth();
    const { addToCart, items, setIsOpen } = useCart();

    const [subject, setSubject] = useState<Subject | null>(null);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [loading, setLoading] = useState(true);
    const [enrolling, setEnrolling] = useState(false);
    const [progressMap, setProgressMap] = useState<Record<number, boolean>>({});
    const [enrollError, setEnrollError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const id = parseInt(subjectId);
                const res = await subjectsApi.getTree(id);
                setSubject(res.data);

                if (isAuthenticated) {
                    const enrollRes = await enrollmentApi.getMyEnrollments();
                    const enrolled = enrollRes.data.some((e: any) => e.subject_id === id);
                    setIsEnrolled(enrolled);

                    if (enrolled) {
                        const progRes = await progressApi.getSubjectProgress(id);
                        const map: Record<number, boolean> = {};
                        progRes.data.forEach((p: any) => {
                            map[p.video_id] = p.is_completed;
                        });
                        setProgressMap(map);
                    }
                }
            } catch (err) {
                console.error('Fetch error:', err);
                // router.push('/subjects');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [subjectId, isAuthenticated, router]);

    const handleEnroll = async (): Promise<boolean> => {
        if (!isAuthenticated) {
            router.push(`/login?redirect=/subjects/${subjectId}`);
            return false;
        }

        setEnrolling(true);
        setEnrollError(null);
        try {
            await enrollmentApi.enroll(parseInt(subjectId));
            setIsEnrolled(true);
            // Refresh to get progress
            const progRes = await progressApi.getSubjectProgress(parseInt(subjectId));
            const map: Record<number, boolean> = {};
            progRes.data.forEach((p: any) => {
                map[p.video_id] = p.is_completed;
            });
            setProgressMap(map);
            return true;
        } catch (err: any) {
            console.error('Enrollment error:', err);
            setEnrollError(err.response?.data?.message || err.message || 'Enrollment failed');
            return false;
        } finally {
            setEnrolling(false);
        }
    };

    const handleAddToCart = () => {
        if (subject) {
            addToCart({
                id: subject.id,
                title: subject.title,
                price: 9999 // Hardcoded mockup price for now
            });
        }
    };

    const isInCart = subject ? items.some(item => item.id === subject.id) : false;

    const handleBuyNow = async () => {
        const success = await handleEnroll();
        if (success && subject) {
            const firstVideoId = subject.sections[0]?.videos[0]?.id;
            if (firstVideoId) {
                router.push(`/subjects/${subject.id}/video/${firstVideoId}`);
            } else {
                setEnrollError("Enrolled successfully, but course has no content yet.");
            }
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
        </div>
    );

    if (!subject) return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <h1 className="text-2xl font-bold text-white mb-4">Subject Not Found</h1>
            <Link href="/subjects" className="btn-primary">Back to Subjects</Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-white pb-20 relative">
            {/* Dark background band */}
            <div className="absolute top-0 left-0 right-0 h-[380px] bg-[#1c1d1f] z-0" />

            <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10 pt-12">

                {/* Left Column (Info + Content) */}
                <div className="lg:col-span-2">

                    {/* Header Info */}
                    <div className="mb-12 text-white">
                        <h1 className="text-4xl font-bold mb-4">{subject.title}</h1>
                        <p className="text-lg mb-4 text-gray-300">
                            {subject.description}
                        </p>
                        <div className="flex items-center gap-2 text-sm mb-2">
                            <span className="font-bold text-yellow-500">4.8</span>
                            <div className="flex items-center text-yellow-500 text-xs">
                                ★★★★★
                            </div>
                            <span className="underline text-indigo-400 cursor-pointer">(29,462 students)</span>
                        </div>
                        <div className="text-sm text-gray-300 mb-2">
                            Created by <span className="text-indigo-400 underline cursor-pointer">Dr. Instructor</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-300">
                            <span className="flex items-center gap-1"><Clock size={14} /> Last updated 2026</span>
                            <span className="flex items-center gap-1">🌐 English</span>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="mt-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Course content</h2>
                        <div className="text-sm text-gray-500 mb-2 flex items-center justify-between">
                            <span>{subject.sections.length} sections • {subject.sections.reduce((acc, s) => acc + s.videos.length, 0)} lectures</span>
                        </div>

                        <div className="border border-gray-200 border-b-0">
                            {subject.sections.map((section, sIndex) => (
                                <div key={section.id} className="bg-gray-50 border-b border-gray-200">
                                    <div className="px-4 py-4 font-bold text-gray-900 flex justify-between items-center cursor-default">
                                        <div className="flex items-center gap-4">
                                            <ChevronRight size={16} className="text-gray-900 transform rotate-90" />
                                            <span>{section.title}</span>
                                        </div>
                                        <span className="text-sm font-normal text-gray-500">{section.videos.length} lectures</span>
                                    </div>
                                    <div className="bg-white pb-2 flex flex-col">
                                        {section.videos.map((video, vIndex) => {
                                            const isCompleted = progressMap[video.id];

                                            let isLocked = !isEnrolled;
                                            if (isEnrolled) {
                                                if (sIndex === 0 && vIndex === 0) {
                                                    isLocked = false;
                                                } else {
                                                    let prevVideoId: number | null = null;
                                                    if (vIndex > 0) {
                                                        prevVideoId = section.videos[vIndex - 1]?.id || null;
                                                    } else {
                                                        const prevSection = subject.sections[sIndex - 1];
                                                        if (prevSection && prevSection.videos.length > 0) {
                                                            prevVideoId = prevSection.videos[prevSection.videos.length - 1]?.id || null;
                                                        }
                                                    }
                                                    isLocked = prevVideoId ? !progressMap[prevVideoId] : false;
                                                }
                                            }

                                            return (
                                                <div key={video.id} className={`px-4 py-3 flex items-center justify-between ${isLocked ? 'opacity-60' : 'hover:bg-gray-50'} transition-colors ml-4`}>
                                                    <div className="flex items-center gap-4">
                                                        <div className={`flex flex-shrink-0 ${isCompleted ? 'text-green-600' : 'text-gray-400'}`}>
                                                            {isCompleted ? <CheckCircle size={16} /> : isLocked ? <Lock size={16} /> : <Play size={16} />}
                                                        </div>
                                                        <span className={`text-sm ${isLocked ? 'text-gray-500' : 'text-indigo-600 hover:text-indigo-800'} transition-colors ${!isLocked ? 'underline cursor-pointer' : ''}`}>
                                                            {!isLocked ? (
                                                                <Link href={`/subjects/${subject.id}/video/${video.id}`}>
                                                                    {video.title}
                                                                </Link>
                                                            ) : (
                                                                video.title
                                                            )}
                                                        </span>
                                                    </div>
                                                    <span className="text-xs text-gray-500 flex-shrink-0">
                                                        {Math.floor(video.duration_seconds / 60).toString().padStart(2, '0')}:{(video.duration_seconds % 60).toString().padStart(2, '0')}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Floating Pricing Card */}
                <div className="lg:col-span-1">
                    <div className="bg-white border border-gray-200 shadow-xl sticky top-24 z-20 w-full mb-10 text-gray-900 pb-2">
                        {/* Dynamic Course Header Graphic */}
                        <div className="h-48 bg-gradient-to-br from-[#0056b3] to-[#01356b] relative flex flex-col items-center justify-center text-white overflow-hidden p-4 text-center">
                            <div className="absolute top-2 left-2 text-xs font-bold opacity-80 uppercase tracking-widest">
                                Kodemy!
                            </div>
                            <div className="absolute top-2 right-2 text-xs font-bold opacity-80 uppercase bg-blue-500/30 px-2 py-0.5 rounded">
                                Bestseller
                            </div>
                            <div className="z-10 mt-2">
                                <h3 className="font-extrabold text-2xl uppercase tracking-wider leading-none shadow-sm pb-1">
                                    {subject.title.substring(0, 15)}...
                                </h3>
                                <div className="text-sm font-bold uppercase tracking-[0.2em] opacity-90 border-t border-white/20 pt-2 inline-block">
                                    Masterclass
                                </div>
                            </div>
                            <div className="absolute -bottom-10 -right-10 bg-yellow-400 text-blue-900 w-32 h-32 rounded-full flex flex-col items-center justify-center font-black transform rotate-12 opacity-90 shadow-lg">
                                <span className="text-[10px] leading-tight mt-4 uppercase">Million+</span>
                                <span className="text-4xl leading-tight">2.0</span>
                                <span className="text-[10px] uppercase">Views</span>
                            </div>
                        </div>

                        {/* Pricing section */}
                        <div className="p-6">
                            <div className="flex items-end gap-2 mb-1">
                                <span className="text-[32px] font-bold leading-none text-gray-900">₹9,999</span>
                                <span className="text-gray-500 line-through text-base relative top-[-4px]">₹43,529</span>
                                <span className="text-yellow-800 bg-yellow-200 font-bold text-xs px-1.5 py-0.5 rounded mb-1.5 ml-1">77% off</span>
                            </div>
                            <div className="flex items-center gap-1 text-red-600 font-bold text-xs mb-4">
                                <Clock size={14} className="animate-pulse" />
                                <span>2 days left at this price!</span>
                            </div>

                            {isEnrolled ? (() => {
                                // Find first video across ALL sections
                                const firstVideo = subject.sections
                                    .flatMap(s => s.videos)
                                    .find(v => v?.id);
                                return firstVideo ? (
                                    <Link
                                        href={`/subjects/${subject.id}/video/${firstVideo.id}`}
                                        className="block w-full py-3 bg-[#1c1d1f] hover:bg-black text-white font-bold text-center mb-4 transition-colors"
                                    >
                                        Go to course
                                    </Link>
                                ) : (
                                    <div className="w-full py-3 bg-gray-100 text-gray-500 font-bold text-center mb-4 rounded cursor-default">
                                        ✅ Enrolled — Content coming soon!
                                    </div>
                                );
                            })() : (
                                <div className="space-y-4 mb-4">
                                    {enrollError && (
                                        <div className="w-full p-3 bg-red-50 text-red-600 border border-red-200 text-sm font-bold rounded-lg text-center">
                                            {enrollError}
                                        </div>
                                    )}
                                    <div className="space-y-2">
                                        <button
                                            onClick={handleBuyNow}
                                            disabled={enrolling}
                                            className="w-full py-3 bg-[#1c1d1f] hover:bg-black text-white font-bold transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                                        >
                                            {enrolling ? 'Processing...' : 'Buy now'}
                                        </button>
                                        {isInCart ? (
                                            <button
                                                onClick={() => setIsOpen(true)}
                                                className="w-full py-3 border border-indigo-600 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold transition-colors"
                                            >
                                                Go to cart
                                            </button>
                                        ) : (
                                            <button
                                                onClick={handleAddToCart}
                                                className="w-full py-3 border border-gray-900 text-gray-900 hover:bg-gray-100 font-bold transition-colors"
                                            >
                                                Add to cart
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}

                            <p className="text-center text-xs text-gray-500 mb-6 font-medium">
                                30-Day Money-Back Guarantee<br />Full Lifetime Access
                            </p>

                            <div>
                                <h4 className="font-bold text-sm mb-3">This course includes:</h4>
                                <ul className="space-y-3 text-sm text-gray-600">
                                    <li className="flex items-center gap-3">
                                        <Play size={16} /> 17 hours on-demand video
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <BookOpen size={16} /> 59 downloadable resources
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <Unlock size={16} /> Access on mobile and TV
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
