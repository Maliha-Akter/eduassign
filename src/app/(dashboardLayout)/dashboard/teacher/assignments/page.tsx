// src/app/dashboard/teacher/assignments/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Eye, Edit, Trash2, Loader2, Search } from 'lucide-react';
import { toast } from 'react-toastify';

// Placeholder type for our assignment data
interface Assignment {
    _id: string;
    title: string;
    className: string;
    deadline: string;
    status: 'Draft' | 'Published';
}

export default function MyAssignmentsPage() {
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // TODO: Replace with actual API call later in Step 4
        const fetchAssignments = async () => {
            try {
                // Simulating an API delay
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Mock Data based on our design
                setAssignments([
                    { _id: '1', title: 'Math Assignment', className: 'CSE-1', deadline: '2024-08-20', status: 'Published' },
                    { _id: '2', title: 'Physics Task', className: 'CSE-2', deadline: '2024-08-25', status: 'Draft' },
                    { _id: '3', title: 'English Essay', className: 'CSE-1', deadline: '2024-08-30', status: 'Published' },
                ]);
            } catch (error) {
                toast.error("Failed to load assignments.");
            } finally {
                setLoading(false);
            }
        };

        fetchAssignments();
    }, []);

    const handleDelete = (id: string) => {
        // TODO: Wire up actual delete API later
        if (confirm("Are you sure you want to delete this assignment?")) {
            setAssignments(assignments.filter(a => a._id !== id));
            toast.success("Assignment deleted (mock)");
        }
    };

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-[#15803D]" />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#374151]">My Assignments</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage and track the assignments you've created.</p>
                </div>
                <Link 
                    href="/dashboard/teacher/assignments/new"
                    className="inline-flex items-center justify-center gap-2 bg-[#15803D] hover:bg-green-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    Create Assignment
                </Link>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#F9FAFB] border-b border-gray-200 text-sm text-gray-500">
                                <th className="py-4 px-6 font-medium">Assignment</th>
                                <th className="py-4 px-6 font-medium">Class</th>
                                <th className="py-4 px-6 font-medium">Deadline</th>
                                <th className="py-4 px-6 font-medium">Status</th>
                                <th className="py-4 px-6 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {assignments.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-gray-500">
                                        No assignments found. Click "Create Assignment" to get started.
                                    </td>
                                </tr>
                            ) : (
                                assignments.map((assignment) => (
                                    <tr key={assignment._id} className="border-b border-gray-100 hover:bg-[#F9FAFB] transition-colors">
                                        <td className="py-4 px-6 font-medium text-[#374151]">{assignment.title}</td>
                                        <td className="py-4 px-6 text-gray-600">{assignment.className}</td>
                                        <td className="py-4 px-6 text-gray-600">
                                            {new Date(assignment.deadline).toLocaleDateString()}
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                                assignment.status === 'Published' 
                                                    ? 'bg-green-50 text-[#15803D] border border-green-200' 
                                                    : 'bg-amber-50 text-[#F59E0B] border border-amber-200'
                                            }`}>
                                                {assignment.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button title="View Details" className="p-1.5 text-gray-400 hover:text-blue-600 rounded-md hover:bg-blue-50 transition-colors">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button title="Edit" className="p-1.5 text-gray-400 hover:text-[#15803D] rounded-md hover:bg-green-50 transition-colors">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDelete(assignment._id)} title="Delete" className="p-1.5 text-gray-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}