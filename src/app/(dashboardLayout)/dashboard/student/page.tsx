"use client";

import React from 'react';
import Link from 'next/link';
import { BookOpen, CheckCircle, Clock } from 'lucide-react';

export default function StudentDashboardPage() {
    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Student Dashboard</h1>
                <p className="text-gray-500 mt-1">Welcome back! Here's your study overview.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="p-4 bg-blue-50 text-blue-600 rounded-lg"><BookOpen size={24} /></div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">My Assignments</p>
                        <Link href="/dashboard/student/assignments" className="text-sm text-blue-600 hover:underline">View All</Link>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="p-4 bg-green-50 text-green-600 rounded-lg"><CheckCircle size={24} /></div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">My Submissions</p>
                        <Link href="/dashboard/student/submissions" className="text-sm text-green-600 hover:underline">View All</Link>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="p-4 bg-orange-50 text-orange-600 rounded-lg"><Clock size={24} /></div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Pending Tasks</p>
                        <p className="text-xl font-bold text-gray-800">Check Assignments</p>
                    </div>
                </div>
            </div>
        </div>
    );
}