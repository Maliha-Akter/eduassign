"use client";

import React, { useState, useEffect } from 'react';
import { Loader2, FileCheck } from 'lucide-react';
import Link from 'next/link';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5024";

export default function MySubmissionsPage() {
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/submissions/my`, { credentials: "include" });
                if (res.ok) setSubmissions(await res.json());
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchSubmissions();
    }, []);

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-green-600" /></div>;

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-20">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">My Submissions</h1>
                <p className="text-gray-500 text-sm mt-1">Track the status and grades of your submitted work.</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-500">
                            <th className="py-4 px-6 font-medium">Assignment ID</th>
                            <th className="py-4 px-6 font-medium">Status</th>
                            <th className="py-4 px-6 font-medium">Marks</th>
                            <th className="py-4 px-6 font-medium">Submitted On</th>
                            <th className="py-4 px-6 font-medium text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {submissions.length === 0 ? (
                            <tr><td colSpan={5} className="py-8 text-center text-gray-500">You haven't submitted any assignments yet.</td></tr>
                        ) : (
                            submissions.map(sub => (
                                <tr key={sub.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-4 px-6 font-medium text-gray-700 font-mono text-xs">{sub.assignmentId}</td>
                                    <td className="py-4 px-6">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${sub.status === 'Graded' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                                            {sub.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 font-medium">
                                        {sub.marks !== null ? <span className="text-green-600">{sub.marks}</span> : <span className="text-gray-400">-</span>}
                                    </td>
                                    <td className="py-4 px-6 text-gray-500">{new Date(sub.submittedAt).toLocaleDateString()}</td>
                                    <td className="py-4 px-6 text-right">
                                        <Link href={`/dashboard/student/assignments/${sub.assignmentId}`} className="text-blue-600 hover:underline text-sm font-medium">
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}