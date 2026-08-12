"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Eye, Edit, Trash2, Loader2, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { useForm } from "react-hook-form";
import { authClient } from "@/app/lib/auth-client"; 

interface Assignment {
    id: string; 
    teacherId: string;
    classId: string;
    subjectId: string;
    title: string;
    description: string;
    deadline: string;
    maximumMarks: number;
    status: 'Draft' | 'Published';
    createdAt: string;
    updatedAt: string;
}

type AssignmentFormInputs = {
    title: string;
    description: string;
    classId: string;
    subjectId: string;
    deadlineDate: string;
    deadlineTime: string;
    maximumMarks: number;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5024";

// Shared options
const classOptions = Array.from({ length: 10 }, (_, i) => ({ id: `class_${i + 1}`, name: `Class ${i + 1}` }));
const subjectOptions = [
    { id: "sub_bangla", name: "Bangla" }, { id: "sub_english", name: "English" },
    { id: "sub_math", name: "Mathematics" }, { id: "sub_phy", name: "Physics" },
    { id: "sub_che", name: "Chemistry" }, { id: "sub_bio", name: "Biology" },
    { id: "sub_ict", name: "ICT" }, { id: "sub_history", name: "History" },
    { id: "sub_geo", name: "Geography" }, { id: "sub_rel", name: "Religion" },
];

export default function MyAssignmentsPage() {
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Modal States
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitType, setSubmitType] = useState<"Draft" | "Published" | null>(null);

    const { data: session, isPending: sessionPending } = authClient.useSession();
    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<AssignmentFormInputs>();

    useEffect(() => {
        if (sessionPending) return;

        if (!session?.user?.id) {
            setAssignments([]);
            setLoading(false);
            return;
        }

        const fetchAssignments = async () => {
            try {
                setLoading(true);
                const response = await fetch(
                    `${API_BASE_URL}/api/assignments/my?user=${session.user.id}`,
                    {
                        method: "GET",
                        credentials: "include",
                        cache: "no-store",
                        headers: { "Cache-Control": "no-cache", "Pragma": "no-cache" },
                    }
                );

                const text = await response.text();
                if (!response.ok) throw new Error(`Error ${response.status}: ${text}`);

                const data = text ? JSON.parse(text) : [];
                setAssignments(data);
            } catch (error) {
                console.error("Error fetching assignments:", error);
                toast.error("Failed to load assignments.");
                setAssignments([]);
            } finally {
                setLoading(false);
            }
        };

        fetchAssignments();
    }, [session?.user?.id, sessionPending]);

    // --- Delete Handlers ---
    const confirmDelete = (assignment: Assignment) => {
        setSelectedAssignment(assignment);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!selectedAssignment) return;
        setIsSubmitting(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/assignments/${selectedAssignment.id}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (!response.ok) throw new Error('Failed to delete assignment');

            setAssignments((prev) => prev.filter(a => a.id !== selectedAssignment.id));
            toast.success("Assignment deleted successfully");
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.error("Error deleting assignment:", error);
            toast.error("Failed to delete the assignment.");
        } finally {
            setIsSubmitting(false);
            setSelectedAssignment(null);
        }
    };

    // --- Edit Handlers ---
    const openEditModal = (assignment: Assignment) => {
        setSelectedAssignment(assignment);
        
        // Parse the UTC date for inputs
        const dateObj = new Date(assignment.deadline);
        const yyyy = dateObj.getFullYear();
        const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
        const dd = String(dateObj.getDate()).padStart(2, '0');
        const time = dateObj.toTimeString().slice(0, 5); // HH:MM

        setValue("title", assignment.title);
        setValue("description", assignment.description);
        setValue("classId", assignment.classId);
        setValue("subjectId", assignment.subjectId);
        setValue("deadlineDate", `${yyyy}-${mm}-${dd}`);
        setValue("deadlineTime", time);
        setValue("maximumMarks", assignment.maximumMarks);

        setIsEditModalOpen(true);
    };

    const onUpdateSubmit = async (data: AssignmentFormInputs, status: "Draft" | "Published") => {
        if (!selectedAssignment) return;
        
        setIsSubmitting(true);
        setSubmitType(status);

        try {
            const combinedDateTime = new Date(`${data.deadlineDate}T${data.deadlineTime}:00`).toISOString();
            const formattedData = {
                title: data.title,
                description: data.description,
                classId: data.classId,
                subjectId: data.subjectId,
                maximumMarks: Number(data.maximumMarks),
                deadline: combinedDateTime,
                status: status,
            };

            const res = await fetch(`${API_BASE_URL}/api/assignments/${selectedAssignment.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(formattedData),
            });

            if (!res.ok) {
                const errJson = await res.json().catch(() => ({}));
                throw new Error(errJson.message || `Server error: ${res.status}`);
            }

            const responseData = await res.json();
            toast.success("Assignment updated successfully!");
            
            // Update UI list
            setAssignments(prev => prev.map(a => a.id === selectedAssignment.id ? responseData.assignment : a));
            setIsEditModalOpen(false);
            reset();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
            setSubmitType(null);
        }
    };

    // UI Styles
    const inputClasses = "w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl p-2.5 text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-200";
    const labelClasses = "block text-sm font-semibold text-gray-700 mb-1.5";

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-[#15803D]" />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-20">
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
                                    <tr key={assignment.id} className="border-b border-gray-100 hover:bg-[#F9FAFB] transition-colors">
                                        <td className="py-4 px-6 font-medium text-[#374151]">
                                            {assignment.title}
                                            <div className="text-xs text-gray-400 mt-1 truncate max-w-xs">
                                                {assignment.description}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-gray-600">{assignment.classId}</td>
                                        <td className="py-4 px-6 text-gray-600">
                                            {new Date(assignment.deadline).toLocaleDateString(undefined, {
                                                year: 'numeric', month: 'short', day: 'numeric'
                                            })}
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${assignment.status === 'Published'
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
                                                <button onClick={() => openEditModal(assignment)} title="Edit" className="p-1.5 text-gray-400 hover:text-[#15803D] rounded-md hover:bg-green-50 transition-colors">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => confirmDelete(assignment)} title="Delete" className="p-1.5 text-gray-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition-colors">
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

            {/* DELETE CONFIRMATION MODAL */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Assignment?</h3>
                        <p className="text-gray-500 mb-6">
                            Are you sure you want to delete <strong>"{selectedAssignment?.title}"</strong>? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                disabled={isSubmitting}
                                className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isSubmitting}
                                className="px-4 py-2 rounded-lg font-medium text-white bg-rose-600 hover:bg-rose-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* EDIT MODAL */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full my-8 relative">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900">Edit Assignment</h2>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="p-6">
                            <form className="space-y-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className={labelClasses}>Assignment Title</label>
                                        <input type="text" {...register("title", { required: "Title is required" })} className={inputClasses} />
                                        {errors.title && <p className="text-red-500 text-xs mt-1 font-medium">{errors.title.message}</p>}
                                    </div>
                                    <div>
                                        <label className={labelClasses}>Instructions / Description</label>
                                        <textarea {...register("description", { required: "Description required" })} rows={4} className={`${inputClasses} resize-none`} />
                                        {errors.description && <p className="text-red-500 text-xs mt-1 font-medium">{errors.description.message}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClasses}>Target Class</label>
                                        <select {...register("classId", { required: "Class required" })} className={inputClasses}>
                                            <option value="" disabled>Select a class...</option>
                                            {classOptions.map((cls) => <option key={cls.id} value={cls.id}>{cls.name}</option>)}
                                        </select>
                                        {errors.classId && <p className="text-red-500 text-xs mt-1 font-medium">{errors.classId.message}</p>}
                                    </div>
                                    <div>
                                        <label className={labelClasses}>Subject</label>
                                        <select {...register("subjectId", { required: "Subject required" })} className={inputClasses}>
                                            <option value="" disabled>Select a subject...</option>
                                            {subjectOptions.map((sub) => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
                                        </select>
                                        {errors.subjectId && <p className="text-red-500 text-xs mt-1 font-medium">{errors.subjectId.message}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div>
                                        <label className={labelClasses}>Due Date</label>
                                        <input type="date" {...register("deadlineDate", { required: "Date required" })} className={inputClasses} />
                                        {errors.deadlineDate && <p className="text-red-500 text-xs mt-1 font-medium">{errors.deadlineDate.message}</p>}
                                    </div>
                                    <div>
                                        <label className={labelClasses}>Due Time</label>
                                        <input type="time" {...register("deadlineTime", { required: "Time required" })} className={inputClasses} />
                                        {errors.deadlineTime && <p className="text-red-500 text-xs mt-1 font-medium">{errors.deadlineTime.message}</p>}
                                    </div>
                                    <div>
                                        <label className={labelClasses}>Maximum Marks</label>
                                        <input type="number" {...register("maximumMarks", { required: "Marks required", min: 1 })} className={inputClasses} />
                                        {errors.maximumMarks && <p className="text-red-500 text-xs mt-1 font-medium">{errors.maximumMarks.message}</p>}
                                    </div>
                                </div>

                                <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-gray-100">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditModalOpen(false)}
                                        className="px-5 py-2.5 rounded-xl font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSubmit((data) => onUpdateSubmit(data, "Draft"))}
                                        disabled={isSubmitting}
                                        className="px-5 py-2.5 rounded-xl font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50 shadow-sm"
                                    >
                                        {isSubmitting && submitType === "Draft" ? "Saving..." : "Save Draft"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSubmit((data) => onUpdateSubmit(data, "Published"))}
                                        disabled={isSubmitting}
                                        className="px-6 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-colors disabled:opacity-50 shadow-md"
                                    >
                                        {isSubmitting && submitType === "Published" ? "Publishing..." : "Publish Changes"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}