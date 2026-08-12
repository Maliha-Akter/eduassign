"use client";

import React, { useState, useEffect } from 'react';
import { Loader2, Calendar, FileText, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Assignment {
    id: string;
    title: string;
    description: string;
    deadline: string;
    maximumMarks: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5024";

export default function StudentAssignmentsPage() {
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/assignments/student`, { credentials: "include" });
                if (response.ok) {
                    const data = await response.json();
                    setAssignments(data);
                }
            } catch (error) {
                console.error("Failed to load assignments", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAssignments();
    }, []);

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-20">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">My Class Assignments</h1>
                <p className="text-gray-500 text-sm mt-1">Assignments given to your class by teachers.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {assignments.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
                        No assignments found for your class right now.
                    </div>
                ) : (
                    assignments.map(assignment => (
                        <div key={assignment.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><FileText size={20} /></div>
                                <span className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full font-medium">
                                    {assignment.maximumMarks} Marks
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">{assignment.title}</h3>
                            <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-grow">{assignment.description}</p>
                            
                            <div className="flex items-center text-sm text-gray-500 mb-6">
                                <Calendar className="w-4 h-4 mr-2" />
                                Deadline: {new Date(assignment.deadline).toLocaleDateString()}
                            </div>

                            <Link 
                                href={`/dashboard/student/assignments/${assignment.id}`}
                                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-lg transition-colors border border-gray-200"
                            >
                                View Details <ArrowRight size={16} />
                            </Link>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}