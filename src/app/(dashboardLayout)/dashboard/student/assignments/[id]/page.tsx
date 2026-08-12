"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
// 👈 NEW: Added Mail icon to imports
import { Loader2, Calendar, FileText, CheckCircle, AlertCircle, User, Mail } from 'lucide-react'; 
import { toast } from 'react-toastify';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5024";

export default function AssignmentSubmissionPage() {
    const { id: assignmentId } = useParams();
    const [assignment, setAssignment] = useState<any>(null);
    const [submission, setSubmission] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [answer, setAnswer] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                // Fetch Assignment Details
                const assRes = await fetch(`${API_BASE_URL}/api/assignments/${assignmentId}`, { credentials: "include" });
                if (assRes.ok) setAssignment(await assRes.json());

                // Fetch Existing Submission (if any)
                const subRes = await fetch(`${API_BASE_URL}/api/submissions/assignment/${assignmentId}`, { credentials: "include" });
                if (subRes.ok && subRes.status === 200) {
                    const data = await subRes.json();
                    if(data) {
                        setSubmission(data);
                        setAnswer(data.answer);
                    }
                }
            } catch (error) {
                console.error(error);
                toast.error("Failed to load assignment details.");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [assignmentId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const url = submission 
                ? `${API_BASE_URL}/api/submissions/${submission.id}` 
                : `${API_BASE_URL}/api/submissions`;
            
            const method = submission ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(submission ? { answer } : { assignmentId, answer })
            });

            if (!response.ok) {
                const err = await response.text();
                throw new Error(err);
            }

            const data = await response.json();
            setSubmission(data);
            toast.success(submission ? "Submission updated!" : "Assignment submitted successfully!");
        } catch (error: any) {
            toast.error(error.message || "Failed to submit");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;
    if (!assignment) return <div className="text-center py-20 text-gray-500">Assignment not found.</div>;

    const isPastDeadline = new Date(assignment.deadline) < new Date();

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
            {/* Assignment Info Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 shadow-sm">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{assignment.title}</h1>
                        <p className="text-gray-500 mt-2 whitespace-pre-wrap">{assignment.description}</p>
                    </div>
                    <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 min-w-[220px]">
                        
                        {/* 👈 UPDATED: Display Teacher Name and Clickable Email */}
                        {assignment.teacherName && (
                            <div className="mb-3 pb-3 border-b border-gray-200">
                                <div className="flex items-center text-sm font-medium text-gray-800 mb-1.5">
                                    <User className="w-4 h-4 mr-2 text-gray-500" />
                                    {assignment.teacherName}
                                </div>
                                {assignment.teacherEmail && (
                                    <a 
                                        href={`mailto:${assignment.teacherEmail}`} 
                                        className="flex items-center text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                                    >
                                        <Mail className="w-4 h-4 mr-2" />
                                        Contact Teacher
                                    </a>
                                )}
                            </div>
                        )}

                        <div className="flex items-center text-sm text-gray-600 mb-2">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span className={isPastDeadline ? "text-red-600 font-medium" : ""}>
                                Due: {new Date(assignment.deadline).toLocaleString()}
                            </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                            <FileText className="w-4 h-4 mr-2" />
                            Max Marks: {assignment.maximumMarks}
                        </div>
                    </div>
                </div>
            </div>

            {/* Submission Status Card */}
            {submission && (
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Submission Status</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-semibold">Status</p>
                            <div className="flex items-center gap-1.5 mt-1 text-sm font-medium text-green-700 bg-green-50 px-2 py-1 rounded w-fit">
                                <CheckCircle size={16} /> {submission.status}
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-semibold">Submitted At</p>
                            <p className="text-sm font-medium mt-1">{new Date(submission.submittedAt).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-semibold">Marks</p>
                            <p className="text-sm font-medium mt-1">{submission.marks !== null ? `${submission.marks} / ${assignment.maximumMarks}` : 'Not graded'}</p>
                        </div>
                    </div>
                    {submission.feedback && (
                        <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                            <p className="text-xs text-blue-800 uppercase font-semibold mb-1">Teacher Feedback</p>
                            <p className="text-sm text-blue-900">{submission.feedback}</p>
                        </div>
                    )}
                </div>
            )}

            {/* Answer Editor */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Your Answer</h3>
                
                {isPastDeadline && !submission ? (
                    <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
                        <AlertCircle size={20} />
                        The deadline has passed. You can no longer submit this assignment.
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <textarea
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            placeholder="Type your answer here..."
                            rows={8}
                            disabled={submitting || (isPastDeadline && !!submission)}
                            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 resize-none"
                            required
                        />
                        
                        <div className="mt-4 flex justify-end">
                            <button
                                type="submit"
                                disabled={submitting || (isPastDeadline && !!submission)}
                                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                            >
                                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                                {submission ? "Update Submission" : "Submit Assignment"}
                            </button>
                        </div>
                        {(isPastDeadline && !!submission) && (
                            <p className="text-sm text-gray-500 mt-2 text-right">Deadline has passed. Editing is locked.</p>
                        )}
                    </form>
                )}
            </div>
        </div>
    );
}