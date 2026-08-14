"use client";

import { useEffect, useState } from "react";
import { BookOpen, Users, FileText, Clock, Plus, X, AlertCircle } from "lucide-[#15803D]";
import { BookOpen as BookIcon, Users as UsersIcon, FileText as FileIcon, Clock as ClockIcon, Plus as PlusIcon, X as XIcon, AlertCircle as AlertIcon } from "lucide-react";
import Link from "next/link";

interface Assignment {
    id: string;
    title: string;
    deadline: string;
    classId: string;
    subjectId: string;
    status: string;
}

interface Submission {
    id: string;
    answer: string;
    submittedAt: string;
    marks: number;
    feedback: string;
    status: string;
    studentName: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5024";

// ===== 1. HELPER TO EXTRACT BETTER-AUTH TOKEN FROM COOKIES =====
const getCookieToken = (): string => {
    if (typeof document === "undefined") return "";
    const match = document.cookie.match(/(?:^|; )better-auth\.session_token=([^;]*)/)
        || document.cookie.match(/(?:^|; )__Secure-better-auth\.session_token=([^;]*)/);
    return match ? decodeURIComponent(match[1]) : "";
};

export default function TeacherDashboard() {
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [selectedAssignment, setSelectedAssignment] = useState<string | null>(null);
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [hasToken, setHasToken] = useState(true);

    // Modals state
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [gradingSubmission, setGradingSubmission] = useState<Submission | null>(null);

    // New Assignment Form State
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [deadline, setDeadline] = useState("");
    const [maximumMarks, setMaximumMarks] = useState(100);
    const [classId, setClassId] = useState("");
    const [subjectId, setSubjectId] = useState("");

    // Grading Form State
    const [marks, setMarks] = useState<number>(0);
    const [feedback, setFeedback] = useState("");

    // ===== 2. FIXED HEADER HELPER (Combines Cookies & LocalStorage) =====
    const getAuthHeaders = (): Record<string, string> => {
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
        };
        if (typeof window !== "undefined") {
            // Tries Cookie first (BetterAuth default), then localStorage
            const token = getCookieToken() || localStorage.getItem("token");
            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }
        }
        return headers;
    };

    // 1. Fetch Teacher Assignments (Reusable helper)
    const fetchAssignments = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/teacher/assignments`, {
                method: "GET",
                headers: getAuthHeaders(),
                credentials: "include",
            });

            if (res.ok) {
                const data = await res.json();
                setAssignments(data);
                setHasToken(true);
            } else if (res.status === 401) {
                console.error("401 Unauthorized: Session token missing or invalid");
                setHasToken(false);
            } else if (res.status === 403) {
                console.error("403 Forbidden: Logged in, but role is not 'teacher' in DB!");
                setHasToken(true);
                alert("Access Denied: Your account role is not set to 'teacher' in the database.");
            }
        } catch (err) {
            console.error("Failed to fetch assignments", err);
        }
    };

    useEffect(() => {
        let isMounted = true;

        const loadAssignments = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/teacher/assignments`, {
                    method: "GET",
                    headers: getAuthHeaders(),
                    credentials: "include",
                });

                if (res.ok) {
                    const data = await res.json();
                    if (isMounted) {
                        setAssignments(data);
                        setHasToken(true);
                    }
                } else if (res.status === 401) {
                    console.error("401 Unauthorized: Session token missing or invalid");
                    if (isMounted) {
                        setHasToken(false);
                    }
                } else if (res.status === 403) {
                    console.error("403 Forbidden: Logged in, but role is not 'teacher' in DB!");
                    if (isMounted) {
                        setHasToken(true);
                    }
                    alert("Access Denied: Your account role is not set to 'teacher' in the database.");
                }
            } catch (err) {
                console.error("Failed to fetch assignments", err);
            }
        };

        loadAssignments();

        return () => {
            isMounted = false;
        };
    }, []);

    // 2. Fetch Submissions for an Assignment
    const fetchSubmissions = async (assignmentId: string) => {
        setSelectedAssignment(assignmentId);
        try {
            const res = await fetch(`${API_BASE_URL}/api/teacher/assignments/${assignmentId}/submissions`, {
                method: "GET",
                headers: getAuthHeaders(),
                credentials: "include",
            });

            if (res.ok) {
                const data = await res.json();
                setSubmissions(data);
            } else if (res.status === 401) {
                setHasToken(false);
            }
        } catch (err) {
            console.error("Failed to fetch submissions", err);
        }
    };

    // 3. Create Assignment Handler
    const handleCreateAssignment = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_BASE_URL}/api/teacher/assignments`, {
                method: "POST",
                headers: getAuthHeaders(),
                credentials: "include",
                body: JSON.stringify({
                    Title: title,
                    Description: description,
                    Deadline: new Date(deadline).toISOString(),
                    MaximumMarks: Number(maximumMarks),
                    ClassId: classId,
                    SubjectId: subjectId,
                }),
            });

            if (res.ok) {
                setShowCreateModal(false);
                setTitle("");
                setDescription("");
                setDeadline("");
                fetchAssignments();
            } else if (res.status === 401) {
                setHasToken(false);
            }
        } catch (err) {
            console.error("Error creating assignment", err);
        }
    };

    // 4. Grade Submission Handler
    const handleGradeSubmission = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!gradingSubmission) return;

        try {
            const res = await fetch(`${API_BASE_URL}/api/teacher/submissions/${gradingSubmission.id}/grade`, {
                method: "PATCH",
                headers: getAuthHeaders(),
                credentials: "include",
                body: JSON.stringify({ Marks: Number(marks), Feedback: feedback }),
            });

            if (res.ok) {
                setGradingSubmission(null);
                if (selectedAssignment) fetchSubmissions(selectedAssignment);
            } else if (res.status === 401) {
                setHasToken(false);
            }
        } catch (err) {
            console.error("Error grading submission", err);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/60 p-6 md:p-10">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Token Warning Banner if not logged in */}
                {!hasToken && (
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3 text-amber-800">
                        <AlertIcon className="w-5 h-5 flex-shrink-0 text-amber-600" />
                        <p className="text-sm font-medium">
                            You are not logged in or your session token is missing. Please log in as a teacher to view and manage assignments.
                        </p>
                    </div>
                )}

                {/* Header Section */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-widest text-[#15803D]">Teacher Portal</span>
                        <h1 className="text-2xl font-black text-slate-800 mt-1">Assignment Management 📚</h1>
                        <p className="text-sm text-slate-500">Manage your class assignments and grade student submissions.</p>
                    </div>
                    <Link href="/dashboard/teacher/assignments/new">
                        <button
                            className="bg-[#15803D] hover:bg-emerald-700 text-white font-medium px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-2 transition-all cursor-pointer"
                        >
                            <PlusIcon className="w-4 h-4" /> Create Assignment
                        </button>
                    </Link>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex items-center gap-4">
                        <div className="bg-emerald-50 text-[#15803D] p-3 rounded-xl">
                            <BookIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-medium">Total Posted</p>
                            <h3 className="text-xl font-black text-slate-800 mt-0.5">{assignments.length}</h3>
                        </div>
                    </div>
                    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex items-center gap-4">
                        <div className="bg-amber-50 text-amber-600 p-3 rounded-xl">
                            <ClockIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-medium">Portal Status</p>
                            <h3 className="text-sm font-bold text-emerald-600 mt-1 flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Connected
                            </h3>
                        </div>
                    </div>
                </div>

                {/* Content Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">

                    {/* Assignments List */}
                    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <BookIcon className="w-5 h-5 text-[#15803D]" /> Your Assignments
                        </h2>
                        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                            {assignments.length > 0 ? (
                                assignments.map((assignment) => (
                                    <div
                                        key={assignment.id}
                                        onClick={() => fetchSubmissions(assignment.id)}
                                        className={`border p-4 rounded-xl cursor-pointer transition-all ${selectedAssignment === assignment.id
                                                ? "border-[#15803D] bg-emerald-50/40 shadow-sm"
                                                : "border-slate-100 bg-slate-50/50 hover:border-slate-300"
                                            }`}
                                    >
                                        <h4 className="font-bold text-slate-800">{assignment.title}</h4>
                                        <div className="flex justify-between items-center mt-2 text-xs text-slate-500">
                                            <span className="bg-slate-200/60 px-2 py-0.5 rounded font-medium">Class: {assignment.classId}</span>
                                            <span className="text-amber-600 font-semibold">{new Date(assignment.deadline).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 text-slate-400">
                                    <BookIcon className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                    <p className="text-sm italic">No assignments posted yet.</p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}