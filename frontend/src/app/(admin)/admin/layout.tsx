'use client';

import { useState } from 'react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Admin Sidebar */}
            <aside className={`
                fixed lg:static inset-y-0 left-0 z-50
                w-64 lg:w-64 bg-slate-900 text-white
                transform transition-transform duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                flex-shrink-0
            `}>
                <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                    <h1 className="font-bold text-xl tracking-tight">Admin CMS</h1>
                    {/* Close button for mobile */}
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden text-slate-400 hover:text-white p-1"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <nav className="p-4 space-y-1">
                    <a href="/admin/courses" className="block px-4 py-3 rounded-lg bg-slate-800 text-white font-medium touch-target">
                        Courses
                    </a>
                    <a href="#" className="block px-4 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors touch-target">
                        Users (Coming Soon)
                    </a>
                    <a href="#" className="block px-4 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors touch-target">
                        Settings
                    </a>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto w-full">
                {/* Mobile Header */}
                <header className="bg-white border-b border-slate-200 h-14 md:h-16 flex items-center justify-between px-4 md:px-8 shadow-sm sticky top-0 z-30">
                    {/* Hamburger Menu - Mobile Only */}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="lg:hidden text-slate-600 hover:text-slate-900 p-2 -ml-2 touch-target"
                        aria-label="Toggle menu"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    <h2 className="font-semibold text-slate-700 text-sm md:text-base">Course Builder</h2>

                    <div className="flex items-center gap-2 md:gap-4">
                        <span className="text-xs md:text-sm text-slate-500 hidden sm:inline">Admin User</span>
                        <div className="w-8 h-8 rounded-full bg-slate-200"></div>
                    </div>
                </header>
                <div className="p-4 md:p-6 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
