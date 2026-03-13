'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight, Star, Play, Users, Award, Zap, BookOpen, TrendingUp } from 'lucide-react';
import { subjectsApi } from '@/lib/api';

interface Subject {
  id: number;
  title: string;
  description: string;
  slug: string;
}

// Static course display info (badges, prices, etc.) mapped by position
const courseExtras = [
  { badge: 'BESTSELLER', badgeColor: 'bg-yellow-400 text-yellow-900', category: 'Programming', categoryColor: 'bg-sky-100 text-sky-700', rating: 4.8, reviews: '85,248', price: '1,299', oldPrice: '4,246', discount: '69% off', image: '/ts_course_thumb.png', students: '85K' },
  { badge: 'TOP RATED', badgeColor: 'bg-emerald-500 text-white', category: 'Data Science', categoryColor: 'bg-purple-100 text-purple-700', rating: 4.4, reviews: '147,840', price: '1,499', oldPrice: '6,392', discount: '77% off', image: '/python_course_thumb.png', students: '147K' },
  { badge: 'HOT', badgeColor: 'bg-red-500 text-white', category: 'DevOps', categoryColor: 'bg-orange-100 text-orange-700', rating: 4.0, reviews: '151,145', price: '4,999', oldPrice: '33,197', discount: '85% off', image: '/docker_course_thumb.png', students: '151K' },
  { badge: 'NEW', badgeColor: 'bg-sky-500 text-white', category: 'Database', categoryColor: 'bg-teal-100 text-teal-700', rating: 4.8, reviews: '75,022', price: '999', oldPrice: '3,127', discount: '68% off', image: '/sql_course_thumb.png', students: '75K' },
  { badge: 'BESTSELLER', badgeColor: 'bg-yellow-400 text-yellow-900', category: 'Web Dev', categoryColor: 'bg-cyan-100 text-cyan-700', rating: 4.7, reviews: '98,312', price: '1,799', oldPrice: '7,900', discount: '77% off', image: '/react_course_thumb.png', students: '98K' },
  { badge: 'TOP RATED', badgeColor: 'bg-emerald-500 text-white', category: 'Programming', categoryColor: 'bg-yellow-100 text-yellow-700', rating: 4.6, reviews: '210,500', price: '899', oldPrice: '4,000', discount: '78% off', image: '/js_course_thumb.png', students: '210K' },
  { badge: 'HOT', badgeColor: 'bg-red-500 text-white', category: 'AI & ML', categoryColor: 'bg-pink-100 text-pink-700', rating: 4.5, reviews: '65,100', price: '2,499', oldPrice: '9,999', discount: '75% off', image: '/ml_course_thumb.png', students: '65K' },
  { badge: 'NEW', badgeColor: 'bg-sky-500 text-white', category: 'Cloud', categoryColor: 'bg-indigo-100 text-indigo-700', rating: 4.3, reviews: '55,000', price: '3,299', oldPrice: '12,000', discount: '73% off', image: '/aws_course_thumb.png', students: '55K' },
  { badge: 'HOT', badgeColor: 'bg-red-500 text-white', category: 'Backend', categoryColor: 'bg-green-100 text-green-700', rating: 4.6, reviews: '120,000', price: '1,599', oldPrice: '6,500', discount: '75% off', image: '/nodejs_course_thumb.png', students: '120K' },
  { badge: 'NEW', badgeColor: 'bg-sky-500 text-white', category: 'Security', categoryColor: 'bg-blue-100 text-blue-700', rating: 4.4, reviews: '42,000', price: '2,199', oldPrice: '8,000', discount: '73% off', image: '/cyber_course_thumb.png', students: '42K' },
  { badge: 'BESTSELLER', badgeColor: 'bg-yellow-400 text-yellow-900', category: 'Mobile', categoryColor: 'bg-sky-100 text-sky-700', rating: 4.7, reviews: '88,000', price: '1,899', oldPrice: '7,500', discount: '75% off', image: '/flutter_course_thumb.png', students: '88K' },
  { badge: 'TOP RATED', badgeColor: 'bg-emerald-500 text-white', category: 'APIs', categoryColor: 'bg-pink-100 text-pink-700', rating: 4.5, reviews: '38,000', price: '1,299', oldPrice: '5,500', discount: '76% off', image: '/graphql_course_thumb.png', students: '38K' },
];


export default function HomePage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    subjectsApi.getAll().then(res => {
      setSubjects(res.data || []);
    }).catch(() => {
      setSubjects([]);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero Section */}
      <section className="kodemy-hero px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 relative z-10">
          <div className="flex-1 space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-sky-500/20 border border-sky-400/30 rounded-full text-sky-300 text-sm font-semibold">
              <Zap size={14} className="text-sky-400" />
              The #1 Learning Platform for Tech Professionals
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight text-white">
              Skills for your{' '}
              <span className="text-transparent bg-clip-text" style={{backgroundImage: 'linear-gradient(135deg, #38bdf8, #2dd4bf)'}}>
                present
              </span>{' '}
              and future.
            </h1>
            <p className="text-xl text-slate-300 max-w-xl leading-relaxed">
              World-class courses taught by expert instructors. Start learning today and unlock your potential.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/subjects" className="btn-kodemy-primary !px-8 !py-4 !text-base flex items-center gap-2">
                Browse Courses <ArrowRight size={18} />
              </Link>
              <Link href="/register" className="btn-kodemy-secondary !px-8 !py-4 !text-base">
                Sign up free
              </Link>
            </div>
            <div className="flex items-center gap-6 pt-2">
              <div className="flex -space-x-3">
                {['#0ea5e9','#14b8a6','#6366f1','#f59e0b'].map((c, i) => (
                  <div key={i} className="w-9 h-9 rounded-full border-2 border-slate-800 flex items-center justify-center text-white text-xs font-bold" style={{background: c}}>{i+1}</div>
                ))}
              </div>
              <p className="text-slate-300 text-sm"><span className="font-bold text-white">500K+</span> students already learning</p>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-2 gap-4">
            {[
              { value: `${subjects.length || '—'}`, label: 'Expert Courses', icon: <BookOpen size={22} className="text-sky-400" /> },
              { value: '500K+', label: 'Students Enrolled', icon: <Users size={22} className="text-teal-400" /> },
              { value: '4.7★', label: 'Average Rating', icon: <Star size={22} className="text-yellow-400" /> },
              { value: '100%', label: 'Free to Try', icon: <Award size={22} className="text-purple-400" /> },
            ].map((stat, i) => (
              <div key={i} className="kodemy-stat-box group">
                <div className="mb-2 flex justify-center">{stat.icon}</div>
                <div className="text-2xl font-extrabold text-white">{stat.value}</div>
                <div className="text-xs text-slate-400 uppercase tracking-widest mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* Course Grid Section */}
      <section className="max-w-7xl mx-auto px-4 pb-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={20} className="text-sky-500" />
              <span className="text-sm font-bold text-sky-600 uppercase tracking-widest">Most Popular</span>
            </div>
            <h2 className="lms-section-title">All Courses</h2>
            <p className="text-gray-500 font-medium text-lg mt-1">
              {loading ? 'Loading...' : `${subjects.length} course${subjects.length !== 1 ? 's' : ''} available`}
            </p>
          </div>
          <Link href="/subjects" className="hidden sm:flex items-center gap-2 text-sky-600 font-bold hover:gap-3 transition-all text-sm">
            View all <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-sky-500/20 border-t-sky-500 rounded-full animate-spin" />
          </div>
        ) : subjects.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <BookOpen size={48} className="mx-auto mb-4 opacity-40" />
            <p className="text-lg font-medium">No courses available yet.</p>
            <p className="text-sm mt-1">Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {subjects.map((subject, index) => {
              const extra = courseExtras[index % courseExtras.length];
              return (
                <Link key={subject.id} href={`/subjects/${subject.id}`} className="group block">
                  <div className="kodemy-card h-full flex flex-col">
                    {/* Thumbnail */}
                    <div className="relative aspect-video overflow-hidden bg-gray-900">
                      <img
                        src={extra.image}
                        alt={subject.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-sky-900/60 to-indigo-900/60 opacity-0 group-hover:opacity-0 transition-opacity" />
                      {/* Badge */}
                      <div className={`absolute top-2 left-2 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-widest rounded-md shadow ${extra.badgeColor}`}>
                        {extra.badge}
                      </div>
                      {/* Play overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center border border-white/40">
                          <Play size={20} className="text-white ml-1" fill="white" />
                        </div>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-4 flex flex-col flex-1">
                      <span className={`lms-category-badge ${extra.categoryColor} mb-2 w-fit`}>{extra.category}</span>

                      <h3 className="font-bold text-base text-gray-900 mb-1 leading-snug group-hover:text-sky-600 transition-colors line-clamp-2 flex-1">
                        {subject.title}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2 line-clamp-1">{subject.description}</p>

                      {/* Rating */}
                      <div className="flex items-center gap-1.5 mb-3">
                        <span className="font-bold text-sm text-amber-600">{extra.rating}</span>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={11} fill={i < Math.round(extra.rating) ? '#d97706' : 'none'} className={i < Math.round(extra.rating) ? 'text-amber-600' : 'text-gray-300'} />
                          ))}
                        </div>
                        <span className="text-xs text-gray-400">({extra.reviews})</span>
                      </div>

                      {/* Price */}
                      <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                        <span className="font-extrabold text-lg text-gray-900">₹{extra.price}</span>
                        <span className="text-sm text-gray-400 line-through">₹{extra.oldPrice}</span>
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded ml-auto">{extra.discount}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* CTA Banner */}
      <section className="mx-4 mb-20 rounded-3xl overflow-hidden relative" style={{background: 'linear-gradient(135deg, #0f172a, #1e3a5f, #164e63)'}}>
        <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(circle at 20% 50%, #0ea5e9 0%, transparent 50%), radial-gradient(circle at 80% 20%, #14b8a6 0%, transparent 40%)'}} />
        <div className="relative z-10 max-w-3xl mx-auto text-center py-20 px-8">
          <h2 className="text-4xl font-extrabold text-white mb-4">Ready to level up your skills?</h2>
          <p className="text-slate-300 mb-8 text-lg">Join 500,000+ learners who are already building their careers with LMS PLATFORM.</p>
          <Link href="/register" className="btn-kodemy-primary !px-10 !py-4 !text-base inline-flex items-center gap-2 font-extrabold">
            Get started for free <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-white py-12 border-t border-white/5" style={{background: 'linear-gradient(135deg, #0f172a, #0c2340)'}}>
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
          <div className="font-extrabold text-3xl mb-1 text-transparent bg-clip-text" style={{backgroundImage: 'linear-gradient(135deg, #38bdf8, #2dd4bf)'}}>
            LMS PLATFORM
          </div>
          <p className="text-slate-500 text-sm mb-6">Empowering learners worldwide since 2023.</p>
          <div className="flex gap-8 text-sm text-slate-400 mb-8 font-medium flex-wrap justify-center">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/login" className="hover:text-white transition-colors">Log in</Link>
            <Link href="/register" className="hover:text-white transition-colors">Sign up</Link>
            <Link href="/subjects" className="hover:text-white transition-colors">Courses</Link>
          </div>
          <div className="text-slate-600 text-xs">
            © {new Date().getFullYear()} LMS PLATFORM. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
