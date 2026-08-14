"use client";

import React, { useState, useEffect } from 'react';
import { 
    Loader2, X, FileText, CheckCircle2, BookOpen, MessageSquare, 
    ExternalLink, Award, TrendingUp, CheckCircle, Clock, Eye, ArrowRight 
} from 'lucide-react';

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

export default function StudentGradesPage() {
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
                console.error("Error fetching student grades:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSubmissions();
    }, []);

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

    const getSubmittedAt = (sub: Submission): string => {
        const dateStr = sub.SubmittedAt || sub.submittedAt;
        return dateStr ? new Date(dateStr).toLocaleDateString() : "N/A";
    };

    const totalSubmissions = submissions.length;
    const gradedCount = submissions.filter(s => getStatus(s) === 'Graded').length;
    const gradedSubmissions = submissions.filter(s => getMarks(s) !== null);
    const totalMarksEarned = gradedSubmissions.reduce((acc, s) => acc + (getMarks(s) || 0), 0);
    const averageMarks = gradedSubmissions.length > 0 ? (totalMarksEarned / gradedSubmissions.length).toFixed(1) : "0";

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
                        className="text-emerald-600 hover:text-emerald-800 underline underline-offset-2 font-medium break-all inline-flex items-center gap-1 mx-0.5"
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
            <div className="flex justify-center items-center py-20 min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20 px-4 sm:px-0">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">My Academic Grades</h1>
                <p className="text-gray-500 text-sm mt-1">Review your assignment scores, instructor feedback, and overall progress.</p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Total Submissions</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">{totalSubmissions}</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <FileText className="w-6 h-6" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Graded Assignments</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">{gradedCount}</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <CheckCircle className="w-6 h-6" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Average Score</p>
                        <p className="text-3xl font-bold text-emerald-600 mt-1">{averageMarks} <span className="text-sm font-normal text-gray-400">pts</span></p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                </div>
            </div>

            {/* Section Header */}
            <div className="flex items-center justify-between px-2">
                <h3 className="font-bold text-gray-900 text-lg">Grading History</h3>
                <span className="text-xs text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full">{submissions.length} total record(s)</span>
            </div>

            {/* Card-Based Layout (Completely Non-Tabular) */}
            <div className="space-y-4">
                {submissions.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-400">
                        No grades or submissions recorded yet.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {submissions.map((sub) => {
                            const status = getStatus(sub);
                            const marks = getMarks(sub);
                            return (
                                <div 
                                    key={sub._id} 
                                    className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5"
                                >
                                    {/* Top Row: Subject & Status */}
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="space-y-1.5">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                                                <BookOpen className="w-3.5 h-3.5" />
                                                {getSubject(sub)}
                                            </span>
                                            <p className="text-xs text-gray-400 font-mono">ID: {getAssignmentId(sub)}</p>
                                        </div>
                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${
                                            status === 'Graded'
                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                : 'bg-amber-50 text-amber-700 border-amber-200'
                                        }`}>
                                            {status === 'Graded' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                                            {status}
                                        </span>
                                    </div>

                                    {/* Middle Details Grid */}
                                    <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100 text-xs">
                                        <div>
                                            <p className="text-gray-400 uppercase tracking-wider font-semibold">Marks Awarded</p>
                                            <p className="font-bold text-gray-900 mt-1 text-sm">
                                                {marks !== null ? (
                                                    <span className="text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100 inline-block">
                                                        {marks} {sub.assignment?.MaximumMarks ? `/ ${sub.assignment.MaximumMarks}` : ''}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400 font-normal">Pending Review</span>
                                                )}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 uppercase tracking-wider font-semibold">Submitted On</p>
                                            <p className="font-medium text-gray-700 mt-1">{getSubmittedAt(sub)}</p>
                                        </div>
                                    </div>

                                    {/* Footer / Action */}
                                    <div className="pt-2 flex justify-end">
                                        <button
                                            onClick={() => setSelectedSubmission(sub)}
                                            className="group relative inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-semibold shadow-sm shadow-emerald-500/20 hover:shadow-md hover:from-emerald-700 hover:to-teal-700 active:scale-95 transition-all duration-200"
                                        >
                                            <Eye className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
                                            <span>View Feedback</span>
                                            <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Submission & Grade Detail Modal */}
            {selectedSubmission && (
                <div 
                    className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
                    onClick={() => setSelectedSubmission(null)}
                >
                    <div 
                        className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden transform transition-all max-h-[90vh] flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                                    <Award className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg">Grade & Evaluation Report</h3>
                                    <p className="text-xs text-gray-500">Detailed overview of your submission</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setSelectedSubmission(null)}
                                className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 p-1.5 rounded-xl transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto space-y-6 text-sm">
                            {/* Summary Metadata Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-semibold">Subject</p>
                                    <p className="text-sm font-bold text-emerald-700 mt-0.5">{getSubject(selectedSubmission)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-semibold">Status</p>
                                    <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                        getStatus(selectedSubmission) === 'Graded'
                                            ? 'bg-emerald-100 text-emerald-800'
                                            : 'bg-amber-100 text-amber-800'
                                    }`}>
                                        {getStatus(selectedSubmission)}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-semibold">Final Grade</p>
                                    <p className="text-base font-extrabold text-gray-900 mt-0.5">
                                        {getMarks(selectedSubmission) !== null ? (
                                            <span className="text-emerald-600">
                                                {getMarks(selectedSubmission)}
                                                {selectedSubmission.assignment?.MaximumMarks ? ` / ${selectedSubmission.assignment.MaximumMarks}` : ''}
                                            </span>
                                        ) : (
                                            <span className="text-amber-600 font-medium">Pending Grade</span>
                                        )}
                                    </p>
                                </div>
                            </div>

                            {/* Assignment Information */}
                            {selectedSubmission.assignment && (
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-gray-800 flex items-center gap-1.5">
                                        <BookOpen className="w-4 h-4 text-emerald-600" />
                                        Assignment Overview
                                    </h4>
                                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-1.5">
                                        {selectedSubmission.assignment.Title && (
                                            <p className="font-bold text-gray-900">{selectedSubmission.assignment.Title}</p>
                                        )}
                                        {selectedSubmission.assignment.Description && (
                                            <p className="text-gray-600 text-xs leading-relaxed">{selectedSubmission.assignment.Description}</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Student's Answer */}
                            <div className="space-y-2">
                                <h4 className="font-semibold text-gray-800 flex items-center gap-1.5">
                                    <FileText className="w-4 h-4 text-emerald-600" />
                                    Your Submission Content
                                </h4>
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-gray-800 text-xs whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                                    {renderAnswerContent(selectedSubmission.Answer || selectedSubmission.answer || "")}
                                </div>
                            </div>

                            {/* Teacher Feedback Box */}
                            {(selectedSubmission.Feedback || selectedSubmission.feedback) ? (
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-gray-800 flex items-center gap-1.5">
                                        <MessageSquare className="w-4 h-4 text-emerald-600" />
                                        Instructor Feedback & Remarks
                                    </h4>
                                    <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 text-sm italic leading-relaxed">
                                        "{selectedSubmission.Feedback || selectedSubmission.feedback}"
                                    </div>
                                </div>
                            ) : (
                                <div className="p-4 bg-gray-50 rounded-2xl text-xs text-gray-500 border border-gray-100 flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-amber-500" />
                                    Instructor feedback has not been provided yet. Check back soon.
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                            <button
                                onClick={() => setSelectedSubmission(null)}
                                className="px-5 py-2 bg-gray-900 hover:bg-black text-white rounded-xl text-sm font-semibold transition-colors"
                            >
                                Close Report
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}