// src/app/dashboard/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import {
    BookOpen, CheckSquare, FileText, Clock, 
    Calendar, Loader2, AlertCircle
} from 'lucide-react';
import { authClient } from '../../lib/auth-client';
import { toast } from 'react-toastify';

interface RecentWorkItem {
    _id: string;
    title: string;
    subject: string;
    status: string;
    date: string;
}

interface UpcomingDeadlineItem {
    title: string;
    deadline: string;
}

interface DashboardStats {
    classes: number;
    assignments: number;
    pending: number;
    graded: number;
}

interface DashboardData {
    stats: DashboardStats;
    recentWork: RecentWorkItem[];
    upcomingDeadlines: UpcomingDeadlineItem[];
}

export default function DashboardUI() {
    const [data, setData] = useState<DashboardData | null>(null); 
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchDashboard = async () => {
            try {
                const tokenResponse = await authClient.token();
                const token: string | undefined = tokenResponse?.data?.token;
                
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard`, {
                    headers: { 
                        Authorization: `Bearer ${token}` 
                    }
                });

                if (!isMounted) return;

                if (res.ok) {
                    const result = await res.json();
                    setData(result);
                } else {
                    toast.error("Failed to load dashboard data.");
                }
            } catch (error) {
                if (!isMounted) return;
                console.error("Failed to fetch dashboard:", error);
                toast.error("An error occurred while fetching your dashboard.");
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchDashboard();

        return () => {
            isMounted = false;
        };
    }, []);

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center bg-[#F9FAFB] min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-[#15803D]" />
            </div>
        );
    }

    const getDaysLeft = (deadlineDate: string) => {
        const diff = new Date(deadlineDate).getTime() - new Date().getTime();
        return Math.ceil(diff / (1000 * 3600 * 24));
    };

    return (
        <div className="font-sans space-y-8 max-w-7xl mx-auto">
            
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[#374151] flex items-center gap-2">
                        👋 Welcome Back!
                    </h1>
                    <p className="text-gray-500 mt-1">Manage your academic progress and assignments in one place.</p>
                </div>
            </div>

            {/* STATS ROW */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
                    <div className="p-3 rounded-lg bg-green-50 text-[#15803D]"><BookOpen className="w-6 h-6" /></div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Active Classes</p>
                        <h3 className="text-2xl font-bold text-[#374151]">{data?.stats?.classes ?? 0}</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
                    <div className="p-3 rounded-lg bg-blue-50 text-blue-600"><FileText className="w-6 h-6" /></div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Assignments</p>
                        <h3 className="text-2xl font-bold text-[#374151]">{data?.stats?.assignments ?? 0}</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
                    <div className="p-3 rounded-lg bg-amber-50 text-[#F59E0B]"><AlertCircle className="w-6 h-6" /></div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Pending Actions</p>
                        <h3 className="text-2xl font-bold text-[#374151]">{data?.stats?.pending ?? 0}</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
                    <div className="p-3 rounded-lg bg-emerald-50 text-emerald-600"><CheckSquare className="w-6 h-6" /></div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Graded Work</p>
                        <h3 className="text-2xl font-bold text-[#374151]">{data?.stats?.graded ?? 0}</h3>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* LEFT COLUMN */}
                <div className="lg:col-span-2 space-y-8">
                    {/* RECENT WORK */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h2 className="text-lg font-bold text-[#374151] mb-4">📝 Recent Activity</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-200 text-sm text-gray-500">
                                        <th className="pb-3 font-medium">Assignment</th>
                                        <th className="pb-3 font-medium">Subject</th>
                                        <th className="pb-3 font-medium">Status</th>
                                        <th className="pb-3 font-medium">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {!data?.recentWork || data.recentWork.length === 0 ? (
                                        <tr><td colSpan={4} className="py-6 text-center text-gray-500">No recent activity found.</td></tr>
                                    ) : (
                                        data.recentWork.map((work: RecentWorkItem) => (
                                            <tr key={work._id} className="border-b border-gray-100 hover:bg-[#F9FAFB]">
                                                <td className="py-3 font-medium text-[#374151]">{work.title}</td>
                                                <td className="py-3 text-gray-600">{work.subject}</td>
                                                <td className="py-3">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                                        work.status === 'Graded' ? 'bg-green-50 text-[#15803D]' : 'bg-amber-50 text-[#F59E0B]'
                                                    }`}>
                                                        {work.status}
                                                    </span>
                                                </td>
                                                <td className="py-3 text-gray-600">{new Date(work.date).toLocaleDateString()}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN - SIDEBAR */}
                <div className="space-y-8">
                    {/* UPCOMING DEADLINES */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h2 className="text-lg font-bold text-[#374151] mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-[#F59E0B]" /> Upcoming Deadlines
                        </h2>
                        <div className="space-y-4">
                            {!data?.upcomingDeadlines || data.upcomingDeadlines.length === 0 ? (
                                <p className="text-sm text-gray-500">No upcoming deadlines.</p>
                            ) : (
                                data.upcomingDeadlines.map((item: UpcomingDeadlineItem, idx: number) => (
                                    <div key={idx} className="flex justify-between items-center pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                                        <div>
                                            <h4 className="font-medium text-[#374151] text-sm truncate max-w-[150px]">{item.title}</h4>
                                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                                <Calendar className="w-3 h-3" /> {new Date(item.deadline).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="bg-rose-50 text-rose-600 px-3 py-1 rounded-md text-xs font-bold text-center border border-rose-100">
                                            {getDaysLeft(item.deadline)}<br />Days
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}