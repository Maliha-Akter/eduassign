// src/app/dashboard/teacher/submissions/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { 
    CheckSquare, Search, Filter, Loader2, X, 
    CheckCircle2, Clock, MessageSquare, Award, User
} from 'lucide-react';
import { toast } from 'react-toastify';

interface Submission {
    _id: string;
    studentName: string;
    studentEmail: string;
    assignmentTitle: string;
    className: string;
    submittedAt: string | null;
    answerText: string;
    marks: number | null;
    maxMarks: number;
    feedback: string;
    status: 'Submitted' | 'Reviewed' | 'Not Submitted';
}

export default function StudentSubmissionsPage() {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Review form state inside modal/drawer
    const [reviewData, setReviewData] = useState({
        marks: '' as number | string,
        feedback: '',
        status: 'Reviewed' as 'Submitted' | 'Reviewed' | 'Not Submitted'
    });

    useEffect(() => {
        // TODO: Replace with actual API call in Step 4
        const fetchSubmissions = async () => {
            try {
                await new Promise(resolve => setTimeout(resolve, 800)); // Mock API delay
                
                // Mock Submissions Data
                setSubmissions([
                    {
                        _id: 'sub-1',
                        studentName: 'Maliha Akter',
                        studentEmail: 'maliha@example.com',
                        assignmentTitle: 'Mathematics Assignment',
                        className: 'CSE-1',
                        submittedAt: '2026-08-18T10:30:00Z',
                        answerText: 'Here is my solution for Question 1 & 2. Step 1: Derivative of f(x) = 2x + 5...',
                        marks: 85,
                        maxMarks: 100,
                        feedback: 'Great step-by-step clarity. Keep up the good work!',
                        status: 'Reviewed'
                    },
                    {
                        _id: 'sub-2',
                        studentName: 'Nadia Islam',
                        studentEmail: 'nadia@example.com',
                        assignmentTitle: 'Mathematics Assignment',
                        className: 'CSE-1',
                        submittedAt: '2026-08-19T14:15:00Z',
                        answerText: 'Attached equations and derivations for chapter 3 exercises.',
                        marks: null,
                        maxMarks: 100,
                        feedback: '',
                        status: 'Submitted'
                    },
                    {
                        _id: 'sub-3',
                        studentName: 'Sara Khan',
                        studentEmail: 'sara@example.com',
                        assignmentTitle: 'Mathematics Assignment',
                        className: 'CSE-1',
                        submittedAt: null,
                        answerText: '',
                        marks: null,
                        maxMarks: 100,
                        feedback: '',
                        status: 'Not Submitted'
                    }
                ]);
            } catch (error) {
                toast.error("Failed to load submissions.");
            } finally {
                setLoading(false);
            }
        };

        fetchSubmissions();
    }, []);

    const openReviewModal = (submission: Submission) => {
        if (submission.status === 'Not Submitted') {
            toast.info("This student has not submitted their work yet.");
            return;
        }
        setSelectedSubmission(submission);
        setReviewData({
            marks: submission.marks ?? '',
            feedback: submission.feedback || '',
            status: submission.status === 'Submitted' ? 'Reviewed' : submission.status
        });
    };

    const handleSaveReview = async () => {
        if (!selectedSubmission) return;

        setIsSaving(true);
        try {
            // TODO: Replace with PATCH endpoint in Step 4
            await new Promise(resolve => setTimeout(resolve, 600));

            const updatedSubmissions = submissions.map(sub => 
                sub._id === selectedSubmission._id
                    ? {
                        ...sub,
                        marks: Number(reviewData.marks),
                        feedback: reviewData.feedback,
                        status: reviewData.status
                      }
                    : sub
            );

            setSubmissions(updatedSubmissions);
            toast.success("Review saved successfully!");
            setSelectedSubmission(null);
        } catch (error) {
            toast.error("Failed to save review.");
        } finally {
            setIsSaving(false);
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
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-[#374151]">Student Submissions</h1>
                <p className="text-gray-500 text-sm mt-1">Review answers, assign marks, and provide student feedback.</p>
            </div>

            {/* Submissions Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#F9FAFB] border-b border-gray-200 text-sm text-gray-500">
                                <th className="py-4 px-6 font-medium">Student</th>
                                <th className="py-4 px-6 font-medium">Assignment</th>
                                <th className="py-4 px-6 font-medium">Submitted Date</th>
                                <th className="py-4 px-6 font-medium">Marks</th>
                                <th className="py-4 px-6 font-medium">Status</th>
                                <th className="py-4 px-6 font-medium text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {submissions.map((sub) => (
                                <tr key={sub._id} className="border-b border-gray-100 hover:bg-[#F9FAFB] transition-colors">
                                    <td className="py-4 px-6">
                                        <div className="font-semibold text-[#374151]">{sub.studentName}</div>
                                        <div className="text-xs text-gray-400">{sub.studentEmail}</div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="text-[#374151] font-medium">{sub.assignmentTitle}</div>
                                        <div className="text-xs text-gray-500">{sub.className}</div>
                                    </td>
                                    <td className="py-4 px-6 text-gray-600">
                                        {sub.submittedAt ? new Date(sub.submittedAt).toLocaleDateString() : '--'}
                                    </td>
                                    <td className="py-4 px-6 font-medium text-[#374151]">
                                        {sub.marks !== null ? `${sub.marks} / ${sub.maxMarks}` : '--'}
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                            sub.status === 'Reviewed' 
                                                ? 'bg-green-50 text-[#15803D] border border-green-200' 
                                                : sub.status === 'Submitted'
                                                ? 'bg-blue-50 text-blue-600 border border-blue-200'
                                                : 'bg-gray-100 text-gray-500 border border-gray-200'
                                        }`}>
                                            {sub.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <button
                                            onClick={() => openReviewModal(sub)}
                                            disabled={sub.status === 'Not Submitted'}
                                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-50 text-[#374151] hover:bg-green-50 hover:text-[#15803D] border border-gray-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                        >
                                            {sub.status === 'Reviewed' ? 'Edit Review' : 'Review'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* REVIEW MODAL / DRAWER */}
            {selectedSubmission && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh]">
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-[#F9FAFB]">
                            <div>
                                <h3 className="font-bold text-[#374151] text-lg">Review Submission</h3>
                                <p className="text-xs text-gray-500">{selectedSubmission.assignmentTitle} ({selectedSubmission.className})</p>
                            </div>
                            <button 
                                onClick={() => setSelectedSubmission(null)}
                                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-200/50"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 overflow-y-auto space-y-6">
                            {/* Student Info */}
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                                <div className="w-10 h-10 rounded-full bg-[#15803D] text-white flex items-center justify-center font-bold">
                                    {selectedSubmission.studentName.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-semibold text-[#374151] text-sm">{selectedSubmission.studentName}</p>
                                    <p className="text-xs text-gray-500">{selectedSubmission.studentEmail}</p>
                                </div>
                            </div>

                            {/* Student Answer */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                                    Submitted Answer
                                </label>
                                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-sm text-[#374151] whitespace-pre-wrap leading-relaxed">
                                    {selectedSubmission.answerText || "No answer provided."}
                                </div>
                            </div>

                            {/* Marks & Status Inputs */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-[#374151] mb-1.5 flex items-center gap-1.5">
                                        <Award className="w-4 h-4 text-[#15803D]" /> Marks (out of {selectedSubmission.maxMarks})
                                    </label>
                                    <input
                                        type="number"
                                        max={selectedSubmission.maxMarks}
                                        min={0}
                                        value={reviewData.marks}
                                        onChange={(e) => setReviewData(prev => ({ ...prev, marks: e.target.value }))}
                                        placeholder={`0 - ${selectedSubmission.maxMarks}`}
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#15803D] outline-none text-sm transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-[#374151] mb-1.5">
                                        Review Status
                                    </label>
                                    <select
                                        value={reviewData.status}
                                        onChange={(e) => setReviewData(prev => ({ ...prev, status: e.target.value as any }))}
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#15803D] outline-none text-sm bg-white transition-all"
                                    >
                                        <option value="Submitted">Submitted (Pending)</option>
                                        <option value="Reviewed">Reviewed</option>
                                    </select>
                                </div>
                            </div>

                            {/* Feedback Input */}
                            <div>
                                <label className="block text-sm font-semibold text-[#374151] mb-1.5 flex items-center gap-1.5">
                                    <MessageSquare className="w-4 h-4 text-[#15803D]" /> Feedback
                                </label>
                                <textarea
                                    rows={4}
                                    value={reviewData.feedback}
                                    onChange={(e) => setReviewData(prev => ({ ...prev, feedback: e.target.value }))}
                                    placeholder="Write constructive feedback for the student..."
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#15803D] outline-none text-sm transition-all resize-y"
                                />
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 border-t border-gray-200 bg-[#F9FAFB] flex justify-end gap-3">
                            <button
                                onClick={() => setSelectedSubmission(null)}
                                className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-200/60 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveReview}
                                disabled={isSaving}
                                className="inline-flex items-center gap-2 bg-[#15803D] hover:bg-green-700 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
                            >
                                {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                                Save Review
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}