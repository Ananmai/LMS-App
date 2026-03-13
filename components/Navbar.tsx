'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { User, Menu, X, ShoppingCart, Sparkles, Trash2 } from 'lucide-react';
import { useState } from 'react';
import AIAssistant from './AIAssistant';
import { enrollmentApi } from '@/lib/api';

export default function Navbar() {
    const { isAuthenticated, user, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [assistantOpen, setAssistantOpen] = useState(false);
    const { items, isOpen, setIsOpen, removeFromCart, total, clearCart } = useCart();

    const handleLogout = () => {
        logout();
        router.push('/');
        setMobileOpen(false);
    };

    const [isCheckingOut, setIsCheckingOut] = useState(false);

    const handleCheckout = async () => {
        if (!isAuthenticated) {
            setIsOpen(false);
            router.push('/login?redirect=/');
            return;
        }

        setIsCheckingOut(true);
        try {
            // Enroll in all items in the cart
            await Promise.all(items.map(item => enrollmentApi.enroll(item.id)));
            clearCart();
            setIsOpen(false);

            // Redirect to the first item added or just subjects list
            if (items.length > 0) {
                router.push(`/subjects/${items[0].id}`);
            } else {
                router.push('/subjects');
            }
        } catch (error) {
            console.error('Checkout failed:', error);
            alert("Checkout failed. Please try again.");
        } finally {
            setIsCheckingOut(false);
        }
    };

    const isActive = (href: string) => pathname === href;
    const isLightMode = pathname === '/login' || pathname === '/register';

    return (
        <nav className={isLightMode ? 'kodemy-nav-light' : 'kodemy-nav'}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="flex items-center justify-between h-16">
                    {/* Logo & AI Assistant */}
                    <div className="flex items-center gap-6">
                        <Link href="/" className="flex items-center gap-2 group">
                            <span className={`font-extrabold text-xl tracking-tight ${isLightMode ? 'text-gray-900' : 'text-transparent bg-clip-text'}`}
                              style={isLightMode ? {} : {backgroundImage: 'linear-gradient(135deg, #38bdf8, #2dd4bf)'}}>
                              LMS PLATFORM
                            </span>
                        </Link>

                        <div className="hidden sm:flex items-center">
                            <div
                                className={`${isLightMode ? 'kodemy-badge-ai-light' : 'kodemy-badge-ai'} cursor-pointer hover:opacity-80 transition-opacity`}
                                onClick={() => setAssistantOpen(true)}
                            >
                                <Sparkles size={14} className={isLightMode ? "text-yellow-500" : "text-yellow-400"} />
                                AI Assistant
                            </div>
                        </div>
                    </div>

                    {/* Desktop Right Nav */}
                    <div className="hidden md:flex items-center gap-6">
                        <div className="relative">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className={`p-2 transition-colors relative ${isLightMode ? 'text-gray-600 hover:text-gray-900' : 'btn-kodemy-ghost'}`}
                            >
                                <ShoppingCart size={22} />
                                {items.length > 0 && (
                                    <span className="absolute top-0 right-0 bg-indigo-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                        {items.length}
                                    </span>
                                )}
                            </button>

                            {/* Cart Dropdown */}
                            {isOpen && (
                                <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-200 shadow-xl z-50 rounded-xl overflow-hidden">
                                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                        <h3 className="font-bold text-gray-900">Your Cart</h3>
                                        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                                            <X size={18} />
                                        </button>
                                    </div>
                                    <div className="max-h-80 overflow-y-auto">
                                        {items.length === 0 ? (
                                            <div className="p-8 text-center text-gray-500 text-sm">
                                                Your cart is empty.
                                                <div className="mt-4">
                                                    <button onClick={() => setIsOpen(false)} className="text-indigo-600 font-bold hover:underline">
                                                        Keep shopping
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="p-2">
                                                {items.map(item => (
                                                    <div key={item.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg group">
                                                        <div className="w-16 h-12 bg-indigo-100 rounded bg-cover bg-center" style={item.image ? { backgroundImage: `url(${item.image})` } : {}}></div>
                                                        <div className="flex-1 min-w-0">
                                                            <Link href={`/subjects/${item.id}`} className="block text-sm font-bold text-gray-900 truncate hover:text-indigo-600" onClick={() => setIsOpen(false)}>
                                                                {item.title}
                                                            </Link>
                                                            <div className="text-indigo-600 font-bold text-sm">₹{item.price.toLocaleString('en-IN')}</div>
                                                        </div>
                                                        <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    {items.length > 0 && (
                                        <div className="p-4 border-t border-gray-100 bg-gray-50">
                                            <div className="flex justify-between items-center mb-4 text-gray-900">
                                                <span className="font-bold">Total:</span>
                                                <span className="font-bold text-lg">₹{total.toLocaleString('en-IN')}</span>
                                            </div>
                                            <button
                                                onClick={handleCheckout}
                                                disabled={isCheckingOut}
                                                className="w-full py-3 bg-[#1c1d1f] hover:bg-black text-white font-bold rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                                            >
                                                {isCheckingOut ? 'Processing...' : 'Checkout'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <Link
                            href="/"
                            className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${isActive('/') ? (isLightMode ? 'bg-gray-100 text-gray-900' : 'bg-white text-black') : (isLightMode ? 'text-gray-600 hover:text-gray-900' : 'text-white/70 hover:text-white')}`}
                        >
                            Home
                        </Link>
                        <Link
                            href="/subjects"
                            className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${isActive('/subjects') ? (isLightMode ? 'bg-gray-100 text-gray-900' : 'bg-white text-black') : (isLightMode ? 'text-gray-600 hover:text-gray-900' : 'text-white/70 hover:text-white')}`}
                        >
                            Courses
                        </Link>

                        {isAuthenticated ? (
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/profile"
                                    className={`flex items-center gap-2 text-sm font-bold hover:opacity-80 transition-opacity ${isLightMode ? 'text-gray-900' : 'text-white'}`}
                                    title="View Profile"
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${isLightMode ? 'bg-sky-100 text-sky-700' : 'bg-sky-600 text-white'}`}>
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="hidden lg:inline">{user?.name}</span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className={`!py-1.5 !px-4 !text-sm ${isLightMode ? 'border border-gray-300 text-gray-700 hover:bg-gray-50' : 'btn-kodemy-outline'} rounded-lg font-bold transition-all`}
                                >
                                    Log out
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link href="/login" className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${isLightMode ? 'text-gray-900 hover:bg-gray-100 border border-gray-300' : 'text-white hover:bg-white/5 border border-transparent'}`}>
                                    Log in
                                </Link>
                                <Link href="/register" className={`${isLightMode ? 'btn-kodemy-primary-light' : 'btn-kodemy-primary'} !py-2 !px-6 !text-sm`}>
                                    Sign up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="flex md:hidden items-center gap-4">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className={`p-1 transition-colors relative ${isLightMode ? 'text-gray-600 hover:text-gray-900' : 'btn-kodemy-ghost'}`}
                        >
                            <ShoppingCart size={20} />
                            {items.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-indigo-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                    {items.length}
                                </span>
                            )}
                        </button>
                        <button
                            className={`p-2 rounded-lg transition-colors ${isLightMode ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' : 'text-white/70 hover:text-white hover:bg-white/5'}`}
                            onClick={() => setMobileOpen(!mobileOpen)}
                        >
                            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile nav */}
                {mobileOpen && (
                    <div className={`md:hidden pb-6 pt-4 border-t flex flex-col gap-4 ${isLightMode ? 'border-gray-200 bg-white' : 'border-white/5 bg-[#0a0a0a]'}`}>
                        <Link
                            href="/"
                            onClick={() => setMobileOpen(false)}
                            className={`px-4 py-2 rounded-lg text-lg font-bold ${isActive('/') ? (isLightMode ? 'bg-gray-100 text-gray-900' : 'bg-white text-black') : (isLightMode ? 'text-gray-600' : 'text-white/70')}`}
                        >
                            Home
                        </Link>

                        <div className="px-4 py-2">
                            <div
                                className={`${isLightMode ? 'kodemy-badge-ai-light' : 'kodemy-badge-ai'} !w-fit cursor-pointer hover:opacity-80 transition-opacity`}
                                onClick={() => {
                                    setAssistantOpen(true);
                                    setMobileOpen(false);
                                }}
                            >
                                <Sparkles size={14} className={isLightMode ? "text-yellow-500" : "text-yellow-400"} />
                                AI Assistant
                            </div>
                        </div>

                        {isAuthenticated ? (
                            <>
                                <div className={`px-4 py-2 flex items-center gap-3 font-bold border-t pt-4 ${isLightMode ? 'border-gray-200 text-gray-900' : 'border-white/5 text-white'}`}>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isLightMode ? 'bg-gray-100 text-gray-600' : 'bg-gray-800 text-white'}`}>
                                        <User size={20} />
                                    </div>
                                    <span>{user?.name}</span>
                                </div>
                                <button onClick={handleLogout} className={`mx-4 text-left !py-2 !px-4 rounded-lg font-bold transition-all ${isLightMode ? 'border border-gray-300 text-gray-700 hover:bg-gray-50' : 'btn-kodemy-outline'}`}>
                                    Log out
                                </button>
                            </>
                        ) : (
                            <div className={`flex flex-col gap-3 px-4 pt-2 border-t mt-4 ${isLightMode ? 'border-gray-200' : 'border-white/5'}`}>
                                <Link href="/login" onClick={() => setMobileOpen(false)} className={`px-4 py-2 font-bold ${isLightMode ? 'text-gray-600' : 'text-white/70'}`}>Log in</Link>
                                <Link href="/register" onClick={() => setMobileOpen(false)} className={`${isLightMode ? 'btn-kodemy-primary-light' : 'btn-kodemy-primary'} text-center`}>Sign up</Link>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* AI Assistant Overlay */}
            <AIAssistant isOpen={assistantOpen} onClose={() => setAssistantOpen(false)} />
        </nav>
    );
}
