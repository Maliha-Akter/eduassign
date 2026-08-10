// src/app/dashboard/DashboardLayoutClient.tsx
"use client";

import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from '@/components/Sidebar';

export default function DashboardLayoutClient({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex w-full min-h-screen bg-[#F9FAFB] text-[#374151]">
            <Sidebar 
                isOpen={isSidebarOpen} 
                onClose={() => setIsSidebarOpen(false)} 
            />

            <div className="flex-1 flex flex-col min-w-0">
                {/* Mobile Top Header Bar */}
                <header className="md:hidden flex items-center justify-between h-16 px-4 bg-[#15803D] text-[#F9FAFB] border-b border-[#15803D] sticky top-0 z-30">
                    <button 
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 text-white/80 hover:text-white rounded-lg hover:bg-[#166534] transition-colors"
                        aria-label="Open sidebar"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <span className="font-bold text-sm tracking-wider">EduAssign</span>
                    <div className="w-6" /> 
                </header>

                <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}