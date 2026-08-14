"use client";

import React, { useState, useEffect } from 'react';
import { Loader2, X, FileText, CheckCircle2, BookOpen, MessageSquare, ExternalLink, ArrowRight, Eye } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5024";

interface AssignmentDetails {
    _id?: string;
    SubjectId?: string;
    ClassId?: string;
    Title?: string;
    Description?: string;
    MaximumMarks?: number;
    Deadline?: string;
    SubjectName?: string;
    subjectName?: string;
}

interface Submission {
    _id: string;
    AssignmentId: string;
    assignmentId?: string;
    StudentId: string;
    studentId?: string;
    Answer: string;
    answer?: string;
    SubmittedAt: string;
    submittedAt?: string;
    UpdatedAt?: string | null;
    updatedAt?: string | null;
    Status: string;
    status?: string;
    Marks: number | null;
    marks?: number | null;
    Feedback?: string | null;
    feedback?: string | null;
    assignment?: AssignmentDetails;
    subjectName?: string;
    SubjectName?: string;
    subjectId?: string;
    SubjectId?: string;
    subject?: string;
    Subject?: string;
}

export default function MySubmissionsPage() {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/submissions/my`, { credentials: "include" });
                if (res.ok) {
                    const data = await res.json();
                    setSubmissions(data);
                }
            } catch (error) {
                console.error("Error fetching submissions:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSubmissions();
    }, []);

    // Helper to resolve subject name across property name conventions
    const getSubject = (sub: Submission): string => {
        return (
            sub.SubjectName ||
            sub.subjectName ||
            sub.assignment?.SubjectName ||
            sub.assignment?.subjectName ||
            sub.Subject ||
            sub.subject ||
            "General Assignment"
        );
    };

    const getAssignmentId = (sub: Submission): string => {
        return sub.AssignmentId || sub.assignmentId || sub.assignment?._id || "N/A";
    };

    const getMarks = (sub: Submission): number | null => {
        return sub.Marks ?? sub.marks ?? null;
    };

    const getStatus = (sub: Submission): string => {
        return sub.Status || sub.status || "Submitted";
    };

    // Helper to auto-detect and render URLs as underlined clickable links
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
                        <ExternalLink className="w-3 h-3 inline-block" />
                    </a>
                );
            }
            return part;
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20 min-h-[300px]">
                <Loader2 className="w-8 h-8 animate-spin text-green-600" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-20 px-4 sm:px-0">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">My Submissions</h1>
                <p className="text-gray-500 text-sm mt-1">Track the status and grades of your submitted work.</p>
            </div>

            {/* Submissions List Container */}
            <div className="space-y-3">
                {submissions.length === 0 ? (
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm py-12 text-center text-gray-500 text-sm">
                        You haven't submitted any assignments yet.
                    </div>
                ) : (
                    submissions.map((sub) => {
                        const status = getStatus(sub);
                        const marks = getMarks(sub);
                        const submittedDateStr = sub.SubmittedAt || sub.submittedAt;
                        const formattedDate = submittedDateStr ? new Date(submittedDateStr).toLocaleDateString() : "N/A";

                        return (
                            <div 
                                key={sub._id} 
                                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                            >
                                {/* Left Info Section */}
                                <div className="space-y-2 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-100">
                                            <BookOpen className="w-3.5 h-3.5 flex-shrink-0" />
                                            {getSubject(sub)}
                                        </span>
                                        <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                                            status === 'Graded'
                                                ? 'bg-green-50 text-green-700 border-green-200'
                                                : 'bg-blue-50 text-blue-700 border-blue-200'
                                        }`}>
                                            {status}
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                                        <span className="font-mono text-gray-600 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                                            ID: {getAssignmentId(sub)}
                                        </span>
                                        <span>Submitted: {formattedDate}</span>
                                        {marks !== null && (
                                            <span className="text-green-600 font-semibold">
                                                Marks: {marks} {sub.assignment?.MaximumMarks ? `/ ${sub.assignment.MaximumMarks}` : ''}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Right Action Button */}
                                <div className="flex items-center justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                                    <button
                                        onClick={() => setSelectedSubmission(sub)}
                                        className="group relative inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs sm:text-sm font-semibold shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 hover:from-blue-700 hover:to-indigo-700 active:scale-95 transition-all duration-200"
                                    >
                                        <Eye className="w-4 h-4 transition-transform group-hover:scale-110" />
                                        <span>View Details</span>
                                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Submission Detail Modal */}
            {selectedSubmission && (
                <div 
                    className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={() => setSelectedSubmission(null)}
                >
                    <div 
                        className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden transform transition-all max-h-[90vh] flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                            <div className="flex items-center gap-2">
                                <FileText className="w-5 h-5 text-blue-600" />
                                <h3 className="font-semibold text-gray-900 text-lg">Submission Details</h3>
                            </div>
                            <button 
                                onClick={() => setSelectedSubmission(null)}
                                className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 p-1 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto space-y-6 text-sm">
                            {/* Key Metadata Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-semibold">Subject</p>
                                    <p className="text-sm font-bold text-purple-700 mt-0.5">{getSubject(selectedSubmission)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-semibold">Assignment ID</p>
                                    <p className="text-xs font-mono font-medium text-gray-700 mt-1 truncate">{getAssignmentId(selectedSubmission)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-semibold">Status</p>
                                    <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-semibold ${
                                        getStatus(selectedSubmission) === 'Graded'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-blue-100 text-blue-800'
                                    }`}>
                                        {getStatus(selectedSubmission)}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-semibold">Marks</p>
                                    <p className="text-sm font-bold text-gray-800 mt-0.5">
                                        {getMarks(selectedSubmission) !== null ? (
                                            <span className="text-green-600">
                                                {getMarks(selectedSubmission)}
                                                {selectedSubmission.assignment?.MaximumMarks ? ` / ${selectedSubmission.assignment.MaximumMarks}` : ''}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400">Pending Grade</span>
                                        )}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-semibold">Submitted On</p>
                                    <p className="text-sm font-medium text-gray-700 mt-0.5">
                                        {(selectedSubmission.SubmittedAt || selectedSubmission.submittedAt)
                                            ? new Date(selectedSubmission.SubmittedAt || selectedSubmission.submittedAt!).toLocaleString()
                                            : 'N/A'}
                                    </p>
                                </div>
                            </div>

                            {/* Assignment Info */}
                            {selectedSubmission.assignment && (
                                <div className="space-y-2">
                                    <h4 className="font-medium text-gray-800 flex items-center gap-1.5">
                                        <BookOpen className="w-4 h-4 text-gray-500" />
                                        Assignment Details
                                    </h4>
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-1">
                                        {selectedSubmission.assignment.Title && (
                                            <p className="font-semibold text-gray-900">{selectedSubmission.assignment.Title}</p>
                                        )}
                                        {selectedSubmission.assignment.Description && (
                                            <p className="text-gray-600 text-xs">{selectedSubmission.assignment.Description}</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Student's Submitted Answer */}
                            <div className="space-y-2">
                                <h4 className="font-medium text-gray-800 flex items-center gap-1.5">
                                    <CheckCircle2 className="w-4 h-4 text-gray-500" />
                                    Your Submitted Answer
                                </h4>
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-gray-800 text-xs whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                                    {renderAnswerContent(selectedSubmission.Answer || selectedSubmission.answer || "")}
                                </div>
                            </div>

                            {/* Teacher Feedback */}
                            {(selectedSubmission.Feedback || selectedSubmission.feedback) ? (
                                <div className="space-y-2">
                                    <h4 className="font-medium text-gray-800 flex items-center gap-1.5">
                                        <MessageSquare className="w-4 h-4 text-green-600" />
                                        Teacher Feedback
                                    </h4>
                                    <div className="p-4 bg-green-50 rounded-xl border border-green-200 text-green-900 text-sm italic">
                                        "{selectedSubmission.Feedback || selectedSubmission.feedback}"
                                    </div>
                                </div>
                            ) : (
                                <div className="p-3 bg-gray-50 rounded-lg text-xs text-gray-500 border border-gray-100">
                                    Teacher feedback is not yet available for this submission.
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                            <button
                                onClick={() => setSelectedSubmission(null)}
                                className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg text-sm font-medium transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}