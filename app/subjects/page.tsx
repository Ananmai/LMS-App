'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { subjectsApi } from '@/lib/api';
import { BookOpen, Search, Star, Play, ArrowRight, TrendingUp } from 'lucide-react';

interface Subject {
    id: number;
    title: string;
    slug: string;
    description: string;
    created_at: string;
}

// Map course thumbnails and metadata by slug or index
const courseAssets: Record<string, { image: string; badge: string; badgeColor: string; category: string; categoryColor: string; rating: number; reviews: string; price: string; oldPrice: string; discount: string }> = {
    'javascript-masterclass':   { image: '/js_course_thumb.png',       badge: 'BESTSELLER', badgeColor: 'bg-yellow-400 text-yellow-900', category: 'Programming',  categoryColor: 'bg-yellow-100 text-yellow-700', rating: 4.8, reviews: '210,500', price: '899',   oldPrice: '4,000',  discount: '78% off' },
    'python-data-science':      { image: '/python_course_thumb.png',   badge: 'TOP RATED',  badgeColor: 'bg-emerald-500 text-white',     category: 'Data Science', categoryColor: 'bg-purple-100 text-purple-700', rating: 4.4, reviews: '147,840', price: '1,499', oldPrice: '6,392',  discount: '77% off' },
    'typescript-masterclass':   { image: '/ts_course_thumb.png',       badge: 'BESTSELLER', badgeColor: 'bg-yellow-400 text-yellow-900', category: 'Programming',  categoryColor: 'bg-sky-100 text-sky-700',     rating: 4.2, reviews: '85,248',  price: '1,299', oldPrice: '4,246',  discount: '69% off' },
    'devops-docker-kubernetes':  { image: '/docker_course_thumb.png',  badge: 'HOT',        badgeColor: 'bg-red-500 text-white',         category: 'DevOps',       categoryColor: 'bg-orange-100 text-orange-700', rating: 4.0, reviews: '151,145', price: '4,999', oldPrice: '33,197', discount: '85% off' },
    'sql-database-design':      { image: '/sql_course_thumb.png',      badge: 'TOP RATED',  badgeColor: 'bg-emerald-500 text-white',     category: 'Database',     categoryColor: 'bg-teal-100 text-teal-700',   rating: 4.8, reviews: '75,022',  price: '999',   oldPrice: '3,127',  discount: '68% off' },
    'react-nextjs-guide':       { image: '/react_course_thumb.png',    badge: 'NEW',        badgeColor: 'bg-sky-500 text-white',         category: 'Web Dev',      categoryColor: 'bg-cyan-100 text-cyan-700',   rating: 4.7, reviews: '98,312',  price: '1,799', oldPrice: '7,900',  discount: '77% off' },
    'machine-learning-python':  { image: '/ml_course_thumb.png',       badge: 'HOT',        badgeColor: 'bg-red-500 text-white',         category: 'AI & ML',      categoryColor: 'bg-pink-100 text-pink-700',   rating: 4.5, reviews: '65,100',  price: '2,499', oldPrice: '9,999',  discount: '75% off' },
    'aws-cloud-practitioner':   { image: '/aws_course_thumb.png',      badge: 'NEW',        badgeColor: 'bg-sky-500 text-white',         category: 'Cloud',        categoryColor: 'bg-indigo-100 text-indigo-700', rating: 4.3, reviews: '55,000', price: '3,299', oldPrice: '12,000', discount: '73% off' },
    'nodejs-express-backend':   { image: '/nodejs_course_thumb.png',   badge: 'HOT',        badgeColor: 'bg-red-500 text-white',         category: 'Backend',      categoryColor: 'bg-green-100 text-green-700', rating: 4.6, reviews: '120,000', price: '1,599', oldPrice: '6,500',  discount: '75% off' },
    'cybersecurity-fundamentals':{ image: '/cyber_course_thumb.png',   badge: 'NEW',        badgeColor: 'bg-sky-500 text-white',         category: 'Security',     categoryColor: 'bg-blue-100 text-blue-700',   rating: 4.4, reviews: '42,000',  price: '2,199', oldPrice: '8,000',  discount: '73% off' },
    'flutter-dart-mobile':      { image: '/flutter_course_thumb.png',  badge: 'BESTSELLER', badgeColor: 'bg-yellow-400 text-yellow-900', category: 'Mobile',       categoryColor: 'bg-sky-100 text-sky-700',     rating: 4.7, reviews: '88,000',  price: '1,899', oldPrice: '7,500',  discount: '75% off' },
    'graphql-api-design':       { image: '/graphql_course_thumb.png',  badge: 'TOP RATED',  badgeColor: 'bg-emerald-500 text-white',     category: 'APIs',         categoryColor: 'bg-pink-100 text-pink-700',   rating: 4.5, reviews: '38,000',  price: '1,299', oldPrice: '5,500',  discount: '76% off' },
};

// Fallback assets by index for any future courses not in the map
const fallbackAssets = Object.values(courseAssets);

export default function SubjectsPage() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        subjectsApi.getAll()
            .then((res) => setSubjects(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const filtered = subjects.filter((s) =>
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.description?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Banner */}
            <div className="py-14 px-4 text-white" style={{background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #164e63 100%)'}}>
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-2 mb-3">
                        <TrendingUp size={18} className="text-sky-400" />
                        <span className="text-sky-400 text-sm font-bold uppercase tracking-widest">All Courses</span>
                    </div>
                    <h1 className="text-4xl font-extrabold mb-3">
                        Explore Our{' '}
                        <span className="text-transparent bg-clip-text" style={{backgroundImage: 'linear-gradient(135deg, #38bdf8, #2dd4bf)'}}>
                            Course Library
                        </span>
                    </h1>
                    <p className="text-slate-300 mb-8 max-w-xl">Expert-taught courses on programming, data science, cloud, DevOps and more.</p>

                    {/* Search */}
                    <div className="relative max-w-lg">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search courses..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-white/10 backdrop-blur border border-white/20 text-white placeholder-slate-400 rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Course Grid */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                {loading ? (
                    <div className="flex items-center justify-center py-24">
                        <div className="w-12 h-12 border-4 border-sky-500/20 border-t-sky-500 rounded-full animate-spin" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-24">
                        <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg font-medium">No courses found.</p>
                        {search && <button onClick={() => setSearch('')} className="mt-3 text-sky-600 font-bold text-sm hover:underline">Clear search</button>}
                    </div>
                ) : (
                    <>
                        <p className="text-gray-500 text-sm mb-6 font-medium">{filtered.length} course{filtered.length !== 1 ? 's' : ''} available</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {filtered.map((subject, index) => {
                                const assets = courseAssets[subject.slug] || fallbackAssets[index % fallbackAssets.length];
                                return (
                                    <Link key={subject.id} href={`/subjects/${subject.id}`} className="group block">
                                        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">

                                            {/* Thumbnail */}
                                            <div className="relative aspect-video overflow-hidden bg-gray-900">
                                                <img
                                                    src={assets.image}
                                                    alt={subject.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.style.display = 'none';
                                                        target.parentElement!.style.background = 'linear-gradient(135deg, #0f172a, #1e3a5f)';
                                                    }}
                                                />
                                                {/* Badge */}
                                                <div className={`absolute top-2 left-2 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-widest rounded-md shadow ${assets.badgeColor}`}>
                                                    {assets.badge}
                                                </div>
                                                {/* Play overlay */}
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center border border-white/40">
                                                        <Play size={20} className="text-white ml-1" fill="white" />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="p-4 flex flex-col flex-1">
                                                <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-2 w-fit ${assets.categoryColor}`}>
                                                    {assets.category}
                                                </span>

                                                <h2 className="font-bold text-base text-gray-900 mb-1 leading-snug group-hover:text-sky-600 transition-colors line-clamp-2 flex-1">
                                                    {subject.title}
                                                </h2>
                                                <p className="text-sm text-gray-500 mb-3 line-clamp-2 leading-relaxed">
                                                    {subject.description}
                                                </p>

                                                {/* Rating */}
                                                <div className="flex items-center gap-1.5 mb-3">
                                                    <span className="font-bold text-sm text-amber-600">{assets.rating}</span>
                                                    <div className="flex gap-0.5">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} size={11} fill={i < Math.round(assets.rating) ? '#d97706' : 'none'} className={i < Math.round(assets.rating) ? 'text-amber-600' : 'text-gray-300'} />
                                                        ))}
                                                    </div>
                                                    <span className="text-xs text-gray-400">({assets.reviews})</span>
                                                </div>

                                                {/* Price */}
                                                <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                                                    <span className="font-extrabold text-lg text-gray-900">₹{assets.price}</span>
                                                    <span className="text-sm text-gray-400 line-through">₹{assets.oldPrice}</span>
                                                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded ml-auto">{assets.discount}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
