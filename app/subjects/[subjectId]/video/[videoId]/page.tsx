'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { subjectsApi, progressApi, enrollmentApi, videosApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import {
    ChevronLeft,
    ChevronRight,
    CheckCircle,
    Play,
    BookOpen,
    X,
    Menu,
    Clock,
    Lock,
} from 'lucide-react';

// Dynamically import YouTube to avoid SSR issues
const YouTube = dynamic((() => import('react-youtube')) as any, { ssr: false }) as any;

interface Video {
    id: number;
    title: string;
    description: string;
    youtube_url: string;
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
    sections: Section[];
}

function getYouTubeId(url: string) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

export default function VideoViewerPage() {
    const params = useParams();
    const subjectId = parseInt(params?.subjectId as string);
    const videoId = parseInt(params?.videoId as string);
    const router = useRouter();
    const { isAuthenticated, loading: authLoading } = useAuth();

    const [subject, setSubject] = useState<Subject | null>(null);
    const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
    const [allVideos, setAllVideos] = useState<Video[]>([]);
    const [isCompleted, setIsCompleted] = useState(false);
    const [watchedSeconds, setWatchedSeconds] = useState(0);
    const [savedPosition, setSavedPosition] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [progressMap, setProgressMap] = useState<Record<number, boolean>>({});
    const [markingComplete, setMarkingComplete] = useState(false);

    const playerRef = useRef<any>(null);
    const saveIntervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) router.push('/login');
    }, [isAuthenticated, authLoading, router]);

    const fetchData = useCallback(async () => {
        try {
            // 1. Verify Enrollment
            const enrollRes = await enrollmentApi.getMyEnrollments();
            const isEnrolled = enrollRes.data.some((e: any) => e.subject_id === subjectId);
            if (!isEnrolled) {
                router.push(`/subjects/${subjectId}`);
                return;
            }

            // 2. Fetch Subject Tree
            const subjectRes = await subjectsApi.getTree(subjectId);
            const subjectData: Subject = subjectRes.data;
            setSubject(subjectData);

            const videos = subjectData.sections.flatMap((s) => s.videos);
            setAllVideos(videos);

            const video = videos.find((v) => v.id === videoId);
            if (!video) {
                router.push(`/subjects/${subjectId}`);
                return;
            }
            setCurrentVideo(video);

            // 3. Fetch All Progress for sidebar and locking
            const progRes = await progressApi.getSubjectProgress(subjectId);
            const map: Record<number, boolean> = {};
            progRes.data.forEach((p: any) => {
                map[p.video_id] = p.is_completed;
            });
            setProgressMap(map);

            // 4. Check if current video is locked
            const currentIndex = videos.findIndex(v => v.id === videoId);
            if (currentIndex > 0) {
                const prevVideo = videos[currentIndex - 1];
                if (prevVideo && !map[prevVideo.id]) {
                    // Locked!
                    router.push(`/subjects/${subjectId}`);
                    return;
                }
            }

            // 5. Load specific video progress
            const currentProg = await progressApi.get(videoId);
            setIsCompleted(currentProg.data.is_completed);
            setSavedPosition(currentProg.data.last_position_seconds || 0);
            setWatchedSeconds(currentProg.data.last_position_seconds || 0);

        } catch (err) {
            console.error('Fetch error:', err);
            router.push('/subjects');
        } finally {
            setLoading(false);
        }
    }, [subjectId, videoId, router]);

    useEffect(() => {
        if (isAuthenticated) fetchData();
    }, [fetchData, isAuthenticated]);

    const saveProgress = useCallback(async (seconds: number, completed: boolean) => {
        try {
            await progressApi.save(videoId, {
                last_position_seconds: Math.round(seconds),
                is_completed: completed,
            });
            if (completed) {
                setProgressMap(prev => ({ ...prev, [videoId]: true }));
            }
        } catch (err) {
            console.error('Save error:', err);
        }
    }, [videoId]);

    const startTracking = () => {
        if (saveIntervalRef.current) clearInterval(saveIntervalRef.current);
        saveIntervalRef.current = setInterval(() => {
            if (playerRef.current) {
                const time = playerRef.current.getCurrentTime();
                setWatchedSeconds(Math.round(time));
                saveProgress(time, isCompleted);
            }
        }, 5000);
    };

    const stopTracking = () => {
        if (saveIntervalRef.current) {
            clearInterval(saveIntervalRef.current);
            saveIntervalRef.current = null;
        }
    };

    useEffect(() => () => stopTracking(), []);

    const handlePlayerReady = (event: any) => {
        playerRef.current = event.target;
        if (savedPosition > 0) event.target.seekTo(savedPosition, true);
    };

    const handleToggleComplete = async () => {
        setMarkingComplete(true);
        const nextState = !isCompleted;
        setIsCompleted(nextState);
        const time = playerRef.current ? playerRef.current.getCurrentTime() : watchedSeconds;
        await saveProgress(time, nextState);
        setMarkingComplete(false);
    };

    // Navigation logic
    const currentIndex = allVideos.findIndex(v => v.id === videoId);
    const prevVideo = currentIndex > 0 ? allVideos[currentIndex - 1] : null;
    const nextVideo = currentIndex < allVideos.length - 1 ? allVideos[currentIndex + 1] : null;
    const isNextLocked = nextVideo ? !isCompleted : false;

    if (authLoading || loading) return (
        <div className="h-screen flex items-center justify-center bg-gray-950">
            <div className="w-10 h-10 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
        </div>
    );

    if (!currentVideo || !subject) return null;

    return (
        <div className="flex h-[calc(100vh-4rem)] bg-gray-950 text-gray-200 overflow-hidden">
            {/* Sidebar Toggle (Mobile) */}
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="fixed bottom-6 right-6 z-50 p-4 bg-indigo-600 rounded-full shadow-2xl lg:hidden active:scale-95"
            >
                {isSidebarOpen ? <X /> : <Menu />}
            </button>

            {/* Sidebar */}
            <aside className={`fixed lg:relative inset-y-0 left-0 w-80 bg-gray-900 border-r border-gray-800 transition-transform duration-300 z-40
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                <div className="p-6 border-b border-gray-800 flex items-center justify-between">
                    <h2 className="font-bold text-white uppercase tracking-widest text-xs">Curriculum</h2>
                    <Link href={`/subjects/${subjectId}`} className="text-gray-500 hover:text-white transition-colors">
                        <X size={18} className="lg:hidden" />
                        <BookOpen size={18} className="hidden lg:block text-indigo-400" />
                    </Link>
                </div>

                <div className="overflow-y-auto h-[calc(100%-4.5rem)] pb-20">
                    {subject.sections.map((section, sIdx) => (
                        <div key={section.id}>
                            <div className="px-6 py-4 bg-gray-800/30 sticky top-0">
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-tighter">Section {sIdx + 1}</p>
                                <h3 className="text-xs font-bold text-gray-300 truncate">{section.title}</h3>
                            </div>
                            <div className="space-y-1 py-2">
                                {section.videos.map((v) => {
                                    const vCompleted = progressMap[v.id];
                                    const vActive = v.id === videoId;

                                    // Sidebar locking logic
                                    const vIdx = allVideos.findIndex(av => av.id === v.id);
                                    const vLocked = vIdx > 0 ? !progressMap[allVideos[vIdx - 1]?.id || 0] : false;

                                    return (
                                        <button
                                            key={v.id}
                                            disabled={vLocked}
                                            onClick={() => {
                                                router.push(`/subjects/${subjectId}/video/${v.id}`);
                                                setIsSidebarOpen(false);
                                            }}
                                            className={`w-full text-left px-6 py-3 flex items-center gap-4 transition-all
                                                ${vActive ? 'bg-indigo-600/10 border-r-2 border-indigo-500 text-white' : 'hover:bg-gray-800/50 text-gray-400'}
                                                ${vLocked ? 'opacity-40 grayscale cursor-not-allowed' : 'cursor-pointer'}`}
                                        >
                                            <div className={`flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center
                                                ${vCompleted ? 'bg-green-500/20 text-green-400' : vActive ? 'bg-indigo-500/20 text-indigo-400' : 'bg-gray-800'}`}>
                                                {vCompleted ? <CheckCircle size={14} /> : vLocked ? <Lock size={12} /> : <Play size={10} />}
                                            </div>
                                            <span className="text-sm font-medium truncate">{v.title}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </aside>

            {/* Content Area */}
            <main className="flex-1 overflow-y-auto">
                <div className="bg-black aspect-video w-full shadow-2xl relative group">
                    <YouTube
                        videoId={getYouTubeId(currentVideo.youtube_url)}
                        onReady={handlePlayerReady}
                        onPlay={startTracking}
                        onPause={stopTracking}
                        onEnd={handleToggleComplete}
                        className="w-full h-full"
                        iframeClassName="w-full h-full"
                        opts={{ width: '100%', height: '100%', playerVars: { rel: 0, modestbranding: 1 } }}
                    />
                </div>

                <div className="max-w-4xl mx-auto p-8 lg:p-12">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-12">
                        <div className="space-y-2">
                            <h1 className="text-2xl lg:text-3xl font-black text-white">{currentVideo.title}</h1>
                            <p className="text-gray-400 leading-relaxed">{currentVideo.description}</p>
                        </div>

                        <button
                            onClick={handleToggleComplete}
                            disabled={markingComplete}
                            className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-sm transition-all shadow-xl
                                ${isCompleted ? 'bg-green-500/10 text-green-400 border border-green-400/20' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20 active:scale-95'}`}
                        >
                            {markingComplete ? <div className="w-4 h-4 border-2 border-current/20 border-t-current rounded-full animate-spin" /> : <><CheckCircle size={18} /> {isCompleted ? 'Finished' : 'Mark as Done'}</>}
                        </button>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        {prevVideo && (
                            <Link href={`/subjects/${subjectId}/video/${prevVideo.id}`} className="flex-1 bg-gray-900 hover:bg-gray-800 border border-gray-800 p-6 rounded-3xl flex items-center gap-4 transition-all group">
                                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-500 group-hover:bg-indigo-500/10 group-hover:text-indigo-400">
                                    <ChevronLeft />
                                </div>
                                <div className="text-left overflow-hidden">
                                    <p className="text-[10px] font-black uppercase text-gray-600 group-hover:text-indigo-500">Previous</p>
                                    <p className="font-bold text-gray-400 group-hover:text-gray-200 truncate">{prevVideo.title}</p>
                                </div>
                            </Link>
                        )}

                        {nextVideo && (
                            <Link
                                href={isNextLocked ? '#' : `/subjects/${subjectId}/video/${nextVideo.id}`}
                                className={`flex-1 p-6 rounded-3xl flex items-center justify-between transition-all group border
                                    ${isNextLocked ? 'bg-gray-950/50 border-gray-900 opacity-60 cursor-not-allowed' : 'bg-gray-900 hover:bg-gray-800 border-gray-800 group'}`}
                            >
                                <div className="text-left overflow-hidden">
                                    <p className="text-[10px] font-black uppercase text-gray-600 group-hover:text-indigo-500">Next Lesson</p>
                                    <p className="font-bold text-gray-200 truncate">{nextVideo.title}</p>
                                </div>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all
                                    ${isNextLocked ? 'bg-gray-900 text-gray-700' : 'bg-indigo-600 text-white group-hover:scale-110 shadow-lg shadow-indigo-600/20'}`}>
                                    {isNextLocked ? <Lock size={16} /> : <ChevronRight />}
                                </div>
                            </Link>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
