'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// Simplified subject structure for the cart
export interface CartItem {
    id: number;
    title: string;
    price: number;
    image?: string; // We don't have images in the backend yet, but we'll reserve the prop
}

interface CartContextType {
    items: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (itemId: number) => void;
    clearCart: () => void;
    total: number;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    // Initialize from localStorage if we wanted persistence (skipping for now to keep it simple, 
    // but the structure supports it easily)
    useEffect(() => {
        const stored = localStorage.getItem('kodemy_cart');
        if (stored && stored !== 'undefined' && stored !== 'null') {
            try {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) {
                    setItems(parsed);
                } else {
                    console.warn('Cart data is not an array, resetting');
                    setItems([]);
                }
            } catch (e) {
                console.error("Failed to parse cart", e);
                setItems([]);
            }
        }
        setIsInitialized(true);
    }, []);

    // Save to local storage on change
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem('kodemy_cart', JSON.stringify(items));
        }
    }, [items, isInitialized]);

    const addToCart = (item: CartItem) => {
        setItems(prev => {
            // Check if already in cart
            if (prev.find(i => i.id === item.id)) return prev;
            return [...prev, item];
        });
        setIsOpen(true); // Auto open cart when adding
    };

    const removeFromCart = (itemId: number) => {
        setItems(prev => prev.filter(i => i.id !== itemId));
    };

    const clearCart = () => {
        setItems([]);
    };

    const total = items.reduce((sum, item) => sum + item.price, 0);

    return (
        <CartContext.Provider value={{
            items,
            addToCart,
            removeFromCart,
            clearCart,
            total,
            isOpen,
            setIsOpen
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
