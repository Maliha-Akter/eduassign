// src/components/Sidebar.tsx
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
    LayoutDashboard, Users, BookOpen, UserPlus, Files, 
    Settings, FilePlus, CheckSquare, FileText, Award,
    LogOut, Loader2, X, GraduationCap, User as UserIcon
} from 'lucide-react';
import { authClient } from '@/app/lib/auth-client';
import { type User } from '@/app/lib/auth';
import { toast } from 'react-toastify';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const { data: session } = authClient.useSession();
    const user = session?.user as User | undefined;
    
    // Safely type cast role or default to student
    const userRole = (user as unknown as { role?: string })?.role || 'student'; 

    // ✅ Dynamic Role-Based Menus
    const getSidebarLinks = (role: string) => {
        const baseLinks = [
            { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> }
        ];

        if (role === 'admin') {
            return [
                ...baseLinks,
                { label: 'Manage Users', href: '/dashboard/admin/users', icon: <Users className="w-5 h-5" /> },
                { label: 'Classes & Subjects', href: '/dashboard/admin/classes', icon: <BookOpen className="w-5 h-5" /> },
                { label: 'Assign Teachers', href: '/dashboard/admin/assign', icon: <UserPlus className="w-5 h-5" /> },
                { label: 'All Assignments', href: '/dashboard/admin/assignments', icon: <Files className="w-5 h-5" /> },
                { label: 'Settings', href: '/dashboard/admin/settings', icon: <Settings className="w-5 h-5" /> },
            ];
        }

        if (role === 'teacher') {
            return [
                ...baseLinks,
                { label: 'My Assignments', href: '/dashboard/teacher/assignments', icon: <Files className="w-5 h-5" /> },
                { label: 'Create Assignment', href: '/dashboard/teacher/assignments/new', icon: <FilePlus className="w-5 h-5" /> },
                { label: 'Student Submissions', href: '/dashboard/teacher/submissions', icon: <CheckSquare className="w-5 h-5" /> },
            ];
        }

        // Default to Student
        return [
            ...baseLinks,
            { label: 'My Classes', href: '/dashboard/student/classes', icon: <BookOpen className="w-5 h-5" /> },
            { label: 'Assigned Work', href: '/dashboard/student/assignments', icon: <FileText className="w-5 h-5" /> },
            { label: 'Grades & Feedback', href: '/dashboard/student/grades', icon: <Award className="w-5 h-5" /> },
        ];
    };

    const sidebarLinks = getSidebarLinks(userRole);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await authClient.signOut({
                fetchOptions: {
                    onSuccess: () => {
                        toast.success("Logged out successfully!");
                        window.location.href = "/";
                    },
                },
            });
        } catch (error) {
            toast.error("Failed to log out cleanly.");
            setIsLoggingOut(false);
        }
    };

    return (
        <>
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-[#374151]/40 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300" 
                    onClick={onClose}
                />
            )}

            <aside 
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white text-[#374151] flex flex-col border-r border-gray-200 transition-transform duration-300 ease-in-out md:translate-x-0 md:sticky md:top-0 md:h-screen ${
                    isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
                }`}
            >
                <div className="h-16 shrink-0 flex items-center justify-between px-6 border-b border-gray-200 bg-[#F9FAFB]">
                    <Link href="/" className="text-xl font-bold flex items-center gap-2 group" onClick={() => onClose()}>
                        <div className="bg-[#15803D] text-[#F59E0B] p-1.5 rounded-lg shadow-sm transition-transform group-hover:scale-105">
                            <GraduationCap className="w-5 h-5" />
                        </div>
                        <span className="text-[#374151] tracking-tight">
                            Edu<span className="text-[#15803D]">Assign</span>
                        </span>
                    </Link>

                    <button 
                        onClick={onClose} 
                        className="md:hidden text-gray-400 hover:text-[#15803D] p-1 rounded-lg hover:bg-green-50 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto p-4 space-y-1.5 custom-scrollbar">
                    {sidebarLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.label}
                                href={link.href}
                                onClick={() => onClose()}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                                    isActive
                                        ? "bg-green-50 text-[#15803D] font-semibold border-l-4 border-[#15803D]"
                                        : "text-[#374151] hover:text-[#15803D] hover:bg-green-50 border-l-4 border-transparent"
                                }`}
                            >
                                {link.icon}
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="shrink-0 p-4 border-t border-gray-200 bg-[#F9FAFB]">
                    {user && (
                        <div className="flex items-center gap-3 mb-4 px-2">
                            <div className="w-9 h-9 rounded-full bg-[#15803D] overflow-hidden border-2 border-white shadow-sm shrink-0 flex items-center justify-center text-white">
                                {user.image ? (
                                    <img src={user.image} alt="User Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="font-bold text-sm">
                                        {user.name?.charAt(0).toUpperCase() || <UserIcon className="w-4 h-4" />}
                                    </span>
                                )}
                            </div>
                            <div className="truncate min-w-0">
                                <p className="text-sm font-bold text-[#374151] truncate">{user.name}</p>
                                <p className="text-xs text-gray-500 truncate capitalize">{userRole}</p>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors cursor-pointer disabled:opacity-50"
                    >
                        {isLoggingOut ? (
                            <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                        ) : (
                            <>
                                <LogOut className="w-5 h-5" />
                                <span>Logout</span>
                            </>
                        )}
                    </button>
                </div>
            </aside>
        </>
    );
}