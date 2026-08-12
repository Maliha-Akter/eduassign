"use client";

import React, { useState, useEffect } from 'react';
import { Loader2, Search, Eye } from 'lucide-react';
import { toast } from 'react-toastify';
import Link from 'next/link';

interface Student {
    id: string;
    name: string;
    email: string;
    class: string; // Matches AppUser model field name
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5024";

export default function MyStudentsPage() {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/students/my`, {
                    method: "GET",
                    credentials: "include",
                });

                if (!response.ok) throw new Error("Failed to load students");
                const data = await response.json();
                setStudents(data);
            } catch (error) {
                console.error(error);
                toast.error("Could not load your students.");
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    const filteredStudents = students.filter(s => 
        s.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        s.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-[#15803D]" />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#374151]">My Students</h1>
                    <p className="text-gray-500 text-sm mt-1">Students enrolled in the classes you teach.</p>
                </div>
                
                <div className="relative">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search students..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#15803D]/20 focus:border-[#15803D] w-full sm:w-64"
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[#F9FAFB] border-b border-gray-200 text-sm text-gray-500">
                            <th className="py-4 px-6 font-medium">Student Name</th>
                            <th className="py-4 px-6 font-medium">Email</th>
                            <th className="py-4 px-6 font-medium">Class</th>
                            <th className="py-4 px-6 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {filteredStudents.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="py-8 text-center text-gray-500">
                                    No students found.
                                </td>
                            </tr>
                        ) : (
                            filteredStudents.map((student) => (
                                <tr key={student.id} className="border-b border-gray-100 hover:bg-[#F9FAFB] transition-colors">
                                    <td className="py-4 px-6 font-medium text-[#374151]">{student.name}</td>
                                    <td className="py-4 px-6 text-gray-500">{student.email}</td>
                                    <td className="py-4 px-6 text-gray-600">Class {student.class || 'N/A'}</td>
                                    <td className="py-4 px-6 text-right">
                                        <Link 
                                            href={`/dashboard/teacher/students/${student.id}`}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#15803D] bg-green-50 hover:bg-green-100 rounded-lg transition-colors font-medium"
                                        >
                                            <Eye className="w-4 h-4" />
                                            View Progress
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