'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Bot, User } from 'lucide-react';

interface AIAssistantProps {
    isOpen: boolean;
    onClose: () => void;
}

interface Message {
    id: string;
    type: 'bot' | 'user';
    content: string;
}

export default function AIAssistant({ isOpen, onClose }: AIAssistantProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            type: 'bot',
            content: 'Hi there! I am your LMS PLATFORM AI Assistant. How can I help you with your learning journey today?'
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
            // Reset chat whenever it is opened
            setMessages([
                {
                    id: '1',
                    type: 'bot',
                    content: 'Hi there! I am your LMS PLATFORM AI Assistant. How can I help you with your learning journey today?'
                }
            ]);
            setInputValue('');
            setIsTyping(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const userMsg: Message = { id: Date.now().toString(), type: 'user', content: inputValue.trim() };
        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsTyping(true);

        // Simulate AI response
        setTimeout(() => {
            const lowerInput = inputValue.trim().toLowerCase();
            let botContent = "";

            if (lowerInput.includes("hello") || lowerInput.includes("hi") || lowerInput.match(/\bhlo\b/) || lowerInput.includes("hey")) {
                const greetings = [
                    "Hello there! How can I assist you with LMS PLATFORM today?",
                    "Hi! What would you like to learn today?",
                    "Hey! I'm here to help you navigate our courses."
                ];
                botContent = greetings[Math.floor(Math.random() * greetings.length)];
            } else if (lowerInput.includes("doubt") || lowerInput.includes("question") || lowerInput.includes("help") || lowerInput.includes("problem")) {
                botContent = "I'd be happy to help! What specific course or topic do you have a doubt about?";
            } else if (lowerInput.includes("course") || lowerInput.includes("learn") || lowerInput.includes("path")) {
                botContent = "We have some excellent courses! I highly recommend checking out the TypeScript Masterclass or DevOps with Docker.";
            } else if (lowerInput.includes("price") || lowerInput.includes("cost") || lowerInput.includes("pay") || lowerInput.includes("billing")) {
                botContent = "If you encounter a billing issue or have questions about pricing, please reach out to support@kodemy.com. Our courses often have great discounts on the homepage!";
            } else {
                const genericResponses = [
                    "That's a great question! For beginners, I highly recommend starting with our TypeScript Masterclass. It's comprehensive and sets a strong foundation.",
                    "To access your certificates, visit your Profile page and look for the Completed Courses section.",
                    "Our DevOps course covers Docker, Kubernetes, and CI/CD pipelines in depth. It's project-based!",
                    "I can certainly help you find the right course. Are you more interested in frontend, backend, or data science?",
                    "That's an interesting point. Can you tell me more about what you're looking for?",
                    "I see! If you need specific help with a lesson, revisiting the video often clarifies the concepts."
                ];

                // Try to avoid repeating the last message
                const lastBotMsg = messages.filter(m => m.type === 'bot').pop();
                let availableResponses = genericResponses;
                if (lastBotMsg) {
                    availableResponses = genericResponses.filter(r => r !== lastBotMsg.content);
                }

                botContent = availableResponses[Math.floor(Math.random() * availableResponses.length)];
            }

            const botMsg: Message = { id: (Date.now() + 1).toString(), type: 'bot', content: botContent };
            setMessages(prev => [...prev, botMsg]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <div className="fixed inset-y-0 right-0 w-full sm:w-[400px] bg-slate-900 border-l border-white/10 shadow-2xl z-[100] flex flex-col animate-in slide-in-from-right duration-300">

            {/* Header */}
            <div className="h-16 flex items-center justify-between px-6 bg-slate-950 border-b border-white/5 flex-shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
                        <Sparkles size={16} />
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-sm">LMS PLATFORM AI</h3>
                        <p className="text-[10px] text-green-400 font-medium uppercase tracking-widest leading-none">Online</p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white transition-colors p-1"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex gap-3 max-w-[85%] ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>

                            <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${msg.type === 'user' ? 'bg-gray-700 text-gray-300' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                                }`}>
                                {msg.type === 'user' ? <User size={14} /> : <Bot size={14} />}
                            </div>

                            <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.type === 'user'
                                ? 'bg-indigo-600 text-white rounded-tr-sm'
                                : 'bg-slate-800 text-gray-200 rounded-tl-sm border border-white/5'
                                }`}>
                                {msg.content}
                            </div>

                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="flex justify-start">
                        <div className="flex gap-3 max-w-[85%] flex-row">
                            <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
                                <Bot size={14} />
                            </div>
                            <div className="bg-slate-800 border border-white/5 px-4 py-4 rounded-2xl rounded-tl-sm flex gap-1">
                                <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" />
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-slate-900 border-t border-white/5 flex-shrink-0">
                <form onSubmit={handleSend} className="relative flex items-center">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Ask about courses, learning paths..."
                        className="w-full bg-slate-800 border border-white/10 text-white text-sm rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-gray-500"
                    />
                    <button
                        type="submit"
                        disabled={!inputValue.trim() || isTyping}
                        className="absolute right-2 p-2 text-indigo-400 hover:text-indigo-300 disabled:opacity-50 disabled:hover:text-indigo-400 transition-colors"
                    >
                        <Send size={18} />
                    </button>
                </form>
                <p className="text-center text-[10px] text-gray-500 mt-3">
                    AI generated responses may occasionally be inaccurate.
                </p>
            </div>

        </div>
    );
}
