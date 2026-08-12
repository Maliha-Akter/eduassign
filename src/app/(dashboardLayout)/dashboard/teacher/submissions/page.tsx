"use client";

import React, { useState, useEffect } from 'react';
import { 
    Loader2, X, MessageSquare, Award, ExternalLink, RefreshCw 
} from 'lucide-react';
import { toast } from 'react-toastify';

interface Submission {
    id: string;
    studentId: string;
    studentName: string;
    studentEmail: string;
    assignmentId: string;
    assignmentTitle: string;
    className: string;
    submittedAt: string | null;
    deadline: string;
    answer: string;
    marks: number | null;
    maxMarks: number;
    feedback: string | null;
    status: 'Submitted' | 'Graded' | 'Pending' | 'Late';
}

export default function StudentSubmissionsPage() {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const [connectionError, setConnectionError] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Review form state inside modal
    const [reviewData, setReviewData] = useState({
        marks: '' as number | string,
        feedback: '',
        status: 'Graded' as 'Submitted' | 'Graded' | 'Pending'
    });

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5024';

    const getAuthToken = () => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('token') || localStorage.getItem('accessToken') || '';
        }
        return '';
    };

    const fetchSubmissions = async () => {
        setLoading(true);
        setConnectionError(false);
        try {
            const token = getAuthToken();
            const headers: HeadersInit = {
                'Content-Type': 'application/json'
            };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`${API_BASE_URL}/api/submissions/teacher`, {
                headers,
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error(`Server returned status ${response.status}`);
            }

            const data = await response.json();
            
            // Normalize ID fields mapping safely
            const dataArray = Array.isArray(data) ? data : data.$values || data.items || [];
            const normalizedData: Submission[] = dataArray.map((item: any) => ({
                ...item,
                id: String(item.id || item.submissionId || item._id || '')
            }));

            setSubmissions(normalizedData);
        } catch (error: any) {
            console.error("Error fetching submissions:", error);
            setConnectionError(true);
            toast.error("Could not connect to backend server.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const openReviewModal = (submission: Submission) => {
        setSelectedSubmission(submission);
        setReviewData({
            marks: submission.marks ?? '',
            feedback: submission.feedback || '',
            status: submission.status === 'Submitted' || submission.status === 'Late' ? 'Graded' : (submission.status as any)
        });
    };

    const handleSaveReview = async () => {
        if (!selectedSubmission || !selectedSubmission.id) {
            toast.error("Invalid submission ID.");
            return;
        }

        // Frontend Validation for Marks
        if (reviewData.status !== 'Pending') {
            const numericMarks = Number(reviewData.marks);

            if (reviewData.marks === '' || isNaN(numericMarks)) {
                toast.error("Please enter a valid number for marks.");
                return;
            }

            if (numericMarks < 0) {
                toast.error("Marks cannot be negative.");
                return;
            }

            if (numericMarks > selectedSubmission.maxMarks) {
                toast.error(`Marks cannot be greater than the maximum allowed (${selectedSubmission.maxMarks}).`);
                return;
            }
        }

        setIsSaving(true);
        try {
            const token = getAuthToken();
            const headers: HeadersInit = {
                'Content-Type': 'application/json'
            };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`${API_BASE_URL}/api/submissions/${selectedSubmission.id}/grade`, {
                method: 'PUT',
                headers,
                credentials: 'include',
                body: JSON.stringify({
                    marks: reviewData.status === 'Pending' ? null : Number(reviewData.marks),
                    feedback: reviewData.feedback,
                    status: reviewData.status
                }),
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.message || "Failed to update submission");
            }

            if (reviewData.status === 'Pending') {
                setSubmissions(prev => prev.filter(sub => sub.id !== selectedSubmission.id));
                toast.success("Submission reset & deleted for student re-submission.");
            } else {
                setSubmissions(prev => prev.map(sub => 
                    sub.id === selectedSubmission.id
                        ? {
                            ...sub,
                            marks: Number(reviewData.marks),
                            feedback: reviewData.feedback,
                            status: reviewData.status,
                          }
                        : sub
                ));
                toast.success("Review saved successfully!");
            }

            setSelectedSubmission(null);
        } catch (error: any) {
            console.error("Error saving review:", error);
            toast.error(error.message || "Failed to save review.");
        } finally {
            setIsSaving(false);
        }
    };

    const renderAnswerContent = (text: string) => {
        if (!text || text.trim() === "") {
            return <span className="text-gray-400 italic">No response content provided.</span>;
        }

        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const parts = text.split(urlRegex);

        return parts.map((part, index) => {
            if (part.match(urlRegex)) {
                return (
                    <a
                        key={index}
                        href={part}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline underline-offset-2 font-medium break-all inline-flex items-center gap-1 mx-0.5"
                    >
                        {part}
                        <ExternalLink className="w-3.5 h-3.5 inline-block"/>
                    </a>
                );
            }
            return part;
        });
    };

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-[#15803D]"/>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[#374151]">Student Submissions</h1>
                    <p className="text-gray-500 text-sm mt-1">Review answers, assign marks, and provide student feedback.</p>
                </div>
                <button 
                    onClick={fetchSubmissions}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 transition-colors"
                >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Refresh
                </button>
            </div>

            {/* Connection Error Banner */}
            {connectionError && (
                <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm flex items-center justify-between">
                    <div>
                        <strong>Connection Error:</strong> Could not reach backend server at <code className="bg-red-100 px-1 py-0.5 rounded">{API_BASE_URL}</code>.
                    </div>
                    <button 
                        onClick={fetchSubmissions} 
                        className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            )}

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
                            {submissions.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center text-gray-500">
                                        No submissions found for your assignments.
                                    </td>
                                </tr>
                            ) : (
                                submissions.map((sub) => (
                                    <tr key={sub.id} className="border-b border-gray-100 hover:bg-[#F9FAFB] transition-colors">
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
                                            {sub.marks !== null && sub.marks !== undefined ? `${sub.marks} / ${sub.maxMarks}` : '--'}
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                                sub.status === 'Graded' 
                                                    ? 'bg-green-50 text-[#15803D] border border-green-200' 
                                                    : sub.status === 'Submitted'
                                                    ? 'bg-blue-50 text-blue-600 border border-blue-200'
                                                    : 'bg-yellow-50 text-yellow-600 border border-yellow-200'
                                            }`}>
                                                {sub.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <button
                                                onClick={() => openReviewModal(sub)}
                                                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-50 text-[#374151] hover:bg-green-50 hover:text-[#15803D] border border-gray-200 transition-colors"
                                            >
                                                {sub.status === 'Graded' ? 'Edit Review' : 'Review'}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* REVIEW MODAL */}
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
                                <X className="w-5 h-5"/>
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 overflow-y-auto space-y-6">
                            {/* Student Info */}
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                                <div className="w-10 h-10 rounded-full bg-[#15803D] text-white flex items-center justify-center font-bold">
                                    {selectedSubmission.studentName?.charAt(0) || 'S'}
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
                                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-sm text-[#374151] whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                                    {renderAnswerContent(selectedSubmission.answer)}
                                </div>
                            </div>

                            {/* Marks & Status Inputs */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-[#374151] mb-1.5 flex items-center gap-1.5">
                                        <Award className="w-4 h-4 text-[#15803D]"/> Marks (out of {selectedSubmission.maxMarks})
                                    </label>
                                    <input
                                        type="number"
                                        max={selectedSubmission.maxMarks}
                                        min={0}
                                        value={reviewData.marks}
                                        onChange={(e) => setReviewData(prev => ({ ...prev, marks: e.target.value }))}
                                        disabled={reviewData.status === 'Pending'}
                                        placeholder={reviewData.status === 'Pending' ? "N/A" : `0 - ${selectedSubmission.maxMarks}`}
                                        className={`w-full px-4 py-2.5 rounded-lg border outline-none text-sm transition-all disabled:opacity-50 disabled:bg-gray-100 ${
                                            reviewData.status !== 'Pending' && Number(reviewData.marks) > selectedSubmission.maxMarks 
                                                ? 'border-red-500 focus:ring-2 focus:ring-red-200' 
                                                : 'border-gray-300 focus:ring-2 focus:ring-[#15803D]'
                                        }`}
                                    />
                                    {reviewData.status !== 'Pending' && Number(reviewData.marks) > selectedSubmission.maxMarks && (
                                        <p className="text-xs text-red-600 mt-1">Marks cannot be greater than {selectedSubmission.maxMarks}</p>
                                    )}
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
                                        <option value="Submitted">Submitted (Needs Grading)</option>
                                        <option value="Graded">Graded</option>
                                        <option value="Pending">Pending (Delete & Force Re-submit)</option>
                                    </select>
                                </div>
                            </div>

                            {/* Feedback Input */}
                            <div>
                                <label className="block text-sm font-semibold text-[#374151] mb-1.5 flex items-center gap-1.5">
                                    <MessageSquare className="w-4 h-4 text-[#15803D]"/> Feedback / Re-submit Instructions
                                </label>
                                <textarea
                                    rows={4}
                                    value={reviewData.feedback}
                                    onChange={(e) => setReviewData(prev => ({ ...prev, feedback: e.target.value }))}
                                    placeholder={reviewData.status === 'Pending' ? "Tell the student why this is being reset..." : "Write constructive feedback for the student..."}
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
                                disabled={isSaving || (reviewData.status === 'Graded' && (reviewData.marks === '' || Number(reviewData.marks) < 0 || Number(reviewData.marks) > selectedSubmission.maxMarks))}
                                className={`inline-flex items-center gap-2 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 ${reviewData.status === 'Pending' ? 'bg-red-600 hover:bg-red-700' : 'bg-[#15803D] hover:bg-green-700'}`}
                            >
                                {isSaving && <Loader2 className="w-4 h-4 animate-spin"/>}
                                {reviewData.status === 'Pending' ? 'Force Re-submit (Delete)' : 'Save Review'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}