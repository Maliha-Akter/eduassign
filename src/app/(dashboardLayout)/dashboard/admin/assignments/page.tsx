"use client";

import { useEffect, useState, useCallback } from "react";
import { authClient } from "@/app/lib/auth-client";
import {
  Trash2,
  Edit3,
  Calendar,
  FileText,
  CheckCircle,
  Clock,
  Loader2,
  BookOpen,
  User,
  AlertTriangle,
  X,
  Check,
  AlertCircle,
} from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5024";

interface Submission {
  id: string;
  assignmentId: string;
  studentName: string;
  answer: string;
  marks?: number | null;
  feedback?: string | null;
  status: string;
  submittedAt: string;
  updatedAt?: string | null;
}

interface AssignmentOverview {
  id: string;
  title: string;
  description?: string;
  teacherName: string;
  className: string;
  subjectName: string;
  deadline: string;
  createdAt: string;
  submissionsCount: number;
  submissions: Submission[];
}

interface Toast {
  message: string;
  type: "success" | "error";
}

export default function AdminAssignmentsPage() {
  const [assignments, setAssignments] = useState<AssignmentOverview[]>([]);
  const [loading, setLoading] = useState(true);

  // Toast State
  const [toast, setToast] = useState<Toast | null>(null);

  // Delete Modal State
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Edit Modal State
  const [editingAssignment, setEditingAssignment] = useState<AssignmentOverview | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const getAuthHeaders = useCallback(async () => {
    const tokenResponse = await authClient.token();
    const token = tokenResponse?.data?.token;

    if (!token) {
      console.error("No token found. Please log in.");
      return null;
    }

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }, []);

  const fetchAssignments = useCallback(async () => {
    try {
      const headers = await getAuthHeaders();
      if (!headers) return;

      const res = await fetch(`${API_BASE_URL}/api/admin/assignments`, {
        headers,
      });
      if (res.ok) {
        const data = await res.json();
        setAssignments(data);
      } else {
        console.error("Failed to fetch assignments:", res.status);
      }
    } catch (error) {
      console.error("Failed to fetch assignments", error);
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders]);

  // Safe async execution inside useEffect to prevent synchronous setState cascading renders
  useEffect(() => {
    let isMounted = true;

    const loadAssignments = async () => {
      await Promise.resolve(); // Async boundary
      if (isMounted) {
        await fetchAssignments();
      }
    };

    loadAssignments();

    return () => {
      isMounted = false;
    };
  }, [fetchAssignments]);

  // Keyboard shortcut (Escape to close modals)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (!isDeleting && !isUpdating) {
          setDeletingId(null);
          setEditingAssignment(null);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDeleting, isUpdating]);

  // Handle Delete Confirmation
  const confirmDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);

    try {
      const headers = await getAuthHeaders();
      if (headers) {
        const res = await fetch(`${API_BASE_URL}/api/admin/assignments/${deletingId}`, {
          method: "DELETE",
          headers,
        });

        if (res.ok) {
          showToast("Assignment deleted successfully!", "success");
          await fetchAssignments();
        } else {
          showToast("Failed to delete assignment.", "error");
        }
      }
    } catch (error) {
      console.error("Failed to delete assignment", error);
      showToast("An error occurred while deleting.", "error");
    } finally {
      setIsDeleting(false);
      setDeletingId(null);
    }
  };

  // Handle Edit Submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAssignment) return;
    setIsUpdating(true);

    try {
      const headers = await getAuthHeaders();
      if (!headers) return;

      const res = await fetch(`${API_BASE_URL}/api/admin/assignments/${editingAssignment.id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          title: editingAssignment.title,
          description: editingAssignment.description,
          className: editingAssignment.className,
          subjectName: editingAssignment.subjectName,
          deadline: editingAssignment.deadline,
        }),
      });

      if (res.ok) {
        showToast("Assignment updated successfully!", "success");
        await fetchAssignments();
        setEditingAssignment(null);
      } else {
        showToast("Failed to update assignment.", "error");
      }
    } catch (error) {
      console.error("Failed to update assignment", error);
      showToast("An error occurred while updating.", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-xs">
        <Loader2 className="w-8 h-8 animate-spin text-[#15803D] mx-auto mb-3" />
        <p className="text-slate-500 font-medium text-sm">Loading assignments and student submissions...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed top-5 right-5 z-60 animate-in fade-in slide-in-from-top-4 duration-300">
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg border text-sm font-semibold ${
              toast.type === "success"
                ? "bg-emerald-900 text-emerald-50 border-emerald-700"
                : "bg-rose-900 text-rose-50 border-rose-700"
            }`}
          >
            {toast.type === "success" ? (
              <Check className="w-5 h-5 text-emerald-300" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-300" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Platform Assignments & Submissions</h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Monitor all assignments created by teachers and review student submissions across the system.
        </p>
      </div>

      {/* Assignment List */}
      <div className="space-y-6">
        {assignments.map((a) => (
          <div key={a.id} className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
            {/* Assignment Header Info */}
            <div className="p-4 sm:p-6 bg-slate-50/70 border-b border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-slate-800">{a.title}</h3>
                  <span className="bg-blue-50 text-blue-700 font-semibold px-2.5 py-0.5 rounded-full text-xs border border-blue-200/60">
                    {a.className}
                  </span>
                  <span className="bg-emerald-50 text-[#15803D] font-semibold px-2.5 py-0.5 rounded-full text-xs border border-emerald-200/60">
                    {a.subjectName}
                  </span>
                </div>

                {a.description && <p className="text-xs sm:text-sm text-slate-600 line-clamp-2">{a.description}</p>}

                <div className="text-xs text-slate-500 flex flex-wrap items-center gap-x-4 gap-y-1 pt-1">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    Teacher: <strong className="text-slate-700 font-semibold">{a.teacherName}</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Deadline: <strong className="text-slate-700 font-semibold">{new Date(a.deadline).toLocaleDateString()}</strong>
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-end md:self-center">
                <span className="text-xs sm:text-sm font-semibold text-slate-700 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
                  Submissions: <strong className="text-[#15803D]">{a.submissionsCount}</strong>
                </span>

                {/* <button
                  onClick={() => setEditingAssignment(a)}
                  className="text-slate-600 hover:text-blue-600 p-2 bg-white hover:bg-blue-50 rounded-xl border border-slate-200 shadow-2xs transition-all cursor-pointer"
                  title="Edit Assignment"
                >
                  <Edit3 className="w-4 h-4" />
                </button> */}

                <button
                  onClick={() => setDeletingId(a.id)}
                  className="text-rose-500 hover:text-rose-700 p-2 bg-white hover:bg-rose-50 rounded-xl border border-slate-200 shadow-2xs transition-all cursor-pointer"
                  title="Delete Assignment"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Submissions Section */}
            <div className="p-4 sm:p-6">
              <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#15803D]" /> Student Submissions
              </h4>

              {a.submissions && a.submissions.length > 0 ? (
                <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-2xs">
                  {/* Table Header (Desktop) */}
                  <div className="hidden md:grid grid-cols-12 gap-3 px-4 py-3 bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <div className="col-span-2">Student</div>
                    <div className="col-span-4">Answer</div>
                    <div className="col-span-1">Marks</div>
                    <div className="col-span-2">Feedback</div>
                    <div className="col-span-1">Status</div>
                    <div className="col-span-2 text-right">Submitted At</div>
                  </div>

                  {/* Rows */}
                  <div className="divide-y divide-slate-100 text-xs sm:text-sm">
                    {a.submissions.map((sub) => (
                      <div
                        key={sub.id}
                        className="p-4 md:px-4 md:py-3 hover:bg-slate-50/60 transition-colors flex flex-col md:grid md:grid-cols-12 gap-2 md:gap-3 items-start md:items-center"
                      >
                        <div className="md:col-span-2 font-bold text-slate-800">{sub.studentName}</div>

                        <div className="md:col-span-4 text-slate-600 line-clamp-2 md:truncate w-full" title={sub.answer}>
                          <span className="text-slate-400 font-semibold md:hidden">Answer: </span>
                          {sub.answer}
                        </div>

                        <div className="md:col-span-1 font-semibold text-slate-800">
                          <span className="text-slate-400 md:hidden">Marks: </span>
                          {sub.marks !== null && sub.marks !== undefined ? sub.marks : "-"}
                        </div>

                        <div className="md:col-span-2 text-slate-500">
                          <span className="text-slate-400 font-semibold md:hidden">Feedback: </span>
                          {sub.feedback || "No feedback yet"}
                        </div>

                        <div className="md:col-span-1">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              sub.status?.toLowerCase() === "graded"
                                ? "bg-emerald-50 text-[#15803D] border border-emerald-200/60"
                                : "bg-amber-50 text-amber-700 border border-amber-200/60"
                            }`}
                          >
                            {sub.status?.toLowerCase() === "graded" ? (
                              <CheckCircle className="w-3 h-3" />
                            ) : (
                              <Clock className="w-3 h-3" />
                            )}
                            {sub.status}
                          </span>
                        </div>

                        <div className="md:col-span-2 text-slate-400 text-xs md:text-right w-full">
                          {new Date(sub.submittedAt).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-xs sm:text-sm text-slate-400 italic py-4 bg-slate-50/50 rounded-xl text-center border border-dashed border-slate-200">
                  No submissions have been made for this assignment yet.
                </p>
              )}
            </div>
          </div>
        ))}

        {assignments.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center text-slate-500 shadow-xs">
            <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            No assignments have been created across the platform yet.
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div
          onClick={() => !isDeleting && setDeletingId(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-opacity"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200/80 space-y-4 animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <button
                onClick={() => setDeletingId(null)}
                disabled={isDeleting}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-800">Delete Assignment?</h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
                Are you sure you want to delete this assignment and all associated student submissions? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingId(null)}
                disabled={isDeleting}
                className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl flex items-center gap-2 transition-all shadow-xs cursor-pointer"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                {isDeleting ? "Deleting..." : "Delete Assignment"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Assignment Modal */}
      {editingAssignment && (
        <div
          onClick={() => !isUpdating && setEditingAssignment(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-opacity"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200/80 space-y-4 animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold text-slate-800">Edit Assignment</h3>
              </div>
              <button
                onClick={() => setEditingAssignment(null)}
                disabled={isUpdating}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editingAssignment.title}
                  onChange={(e) =>
                    setEditingAssignment({ ...editingAssignment, title: e.target.value })
                  }
                  className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Class Name</label>
                  <input
                    type="text"
                    required
                    value={editingAssignment.className}
                    onChange={(e) =>
                      setEditingAssignment({ ...editingAssignment, className: e.target.value })
                    }
                    className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Subject Name</label>
                  <input
                    type="text"
                    required
                    value={editingAssignment.subjectName}
                    onChange={(e) =>
                      setEditingAssignment({ ...editingAssignment, subjectName: e.target.value })
                    }
                    className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Deadline</label>
                <input
                  type="date"
                  required
                  value={
                    editingAssignment.deadline
                      ? new Date(editingAssignment.deadline).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    setEditingAssignment({ ...editingAssignment, deadline: e.target.value })
                  }
                  className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingAssignment.description || ""}
                  onChange={(e) =>
                    setEditingAssignment({ ...editingAssignment, description: e.target.value })
                  }
                  className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingAssignment(null)}
                  disabled={isUpdating}
                  className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center gap-2 transition-all shadow-xs cursor-pointer"
                >
                  {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  {isUpdating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}