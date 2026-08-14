"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Trash2,
  Plus,
  Pencil,
  X,
  Check,
  Loader2,
  BookOpen,
  Layers,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { authClient } from "@/app/lib/auth-client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5024";

interface Course {
  id: string;
  code: string;
  name: string;
}

interface Toast {
  message: string;
  type: "success" | "error";
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Modal Controls
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Course | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast Notification State
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
  };

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const fetchCourses = useCallback(async () => {
    try {
      const tokenResponse = await authClient.token();
      const token = tokenResponse?.data?.token;

      if (!token) {
        console.error("No token found. Please log in.");
        showToast("Authentication required. Please log in.", "error");
        return;
      }

      const res = await fetch(`${API_BASE_URL}/api/admin/courses`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setCourses(data);
      } else {
        console.error("Failed to fetch courses:", res.status);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      showToast("Failed to connect to backend server.", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  // Safe async execution inside useEffect to prevent synchronous setState cascading renders
  useEffect(() => {
    let isMounted = true;

    const loadCourses = async () => {
      await Promise.resolve();
      if (isMounted) {
        await fetchCourses();
      }
    };

    loadCourses();

    return () => {
      isMounted = false;
    };
  }, [fetchCourses]);

  // Handle Escape key to close open modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isModalOpen) handleCancelEdit();
        if (deleteTarget) setDeleteTarget(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, deleteTarget]);

  const handleOpenCreateModal = () => {
    handleCancelEdit();
    setIsModalOpen(true);
  };

  const handleStartEdit = (course: Course) => {
    setEditingId(course.id);
    setName(course.name);
    setCode(course.code);
    setIsModalOpen(true);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setName("");
    setCode("");
    setIsModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const tokenResponse = await authClient.token();
      const token = tokenResponse?.data?.token;

      if (!token) {
        showToast("Authentication required.", "error");
        return;
      }

      const isEditing = Boolean(editingId);
      const url = isEditing
        ? `${API_BASE_URL}/api/admin/courses/${editingId}`
        : `${API_BASE_URL}/api/admin/courses`;

      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, code }),
      });

      if (res.ok) {
        handleCancelEdit();
        fetchCourses();
        showToast(
          isEditing
            ? "Course updated successfully!"
            : "Course created successfully!",
          "success"
        );
      } else {
        showToast("Failed to save course. Please try again.", "error");
      }
    } catch (error) {
      console.error(`Failed to ${editingId ? "update" : "add"} course:`, error);
      showToast("An unexpected error occurred.", "error");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      const tokenResponse = await authClient.token();
      const token = tokenResponse?.data?.token;

      if (!token) {
        showToast("Authentication required.", "error");
        return;
      }

      const res = await fetch(
        `${API_BASE_URL}/api/admin/courses/${deleteTarget.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        if (editingId === deleteTarget.id) handleCancelEdit();
        fetchCourses();
        showToast("Course deleted successfully.", "success");
      } else {
        showToast("Failed to delete course.", "error");
      }
    } catch (error) {
      console.error("Failed to delete course:", error);
      showToast("An error occurred while deleting.", "error");
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-xs">
        <Loader2 className="w-8 h-8 animate-spin text-[#15803D] mx-auto mb-3" />
        <p className="text-slate-500 font-medium text-sm">
          Loading academic courses...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium ${
              toast.type === "success"
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-rose-50 text-rose-800 border-rose-200"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            )}
            <span>{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="ml-2 text-slate-400 hover:text-slate-600 p-0.5 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
            Manage Courses
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Create, edit, and organize core academic degree programs and courses.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="bg-[#15803D] hover:bg-emerald-700 text-white py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Course
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Table Header (Desktop Only) */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3.5 bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <div className="col-span-3">Course Code</div>
          <div className="col-span-7">Course Name</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {/* Rows Container */}
        <div className="divide-y divide-slate-100 text-sm">
          {courses.length === 0 ? (
            <div className="px-6 py-12 text-center text-slate-500">
              <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              No courses found in the database.
            </div>
          ) : (
            courses.map((c) => (
              <div
                key={c.id}
                className="p-4 sm:px-6 sm:py-4 hover:bg-slate-50/60 transition-colors flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-4 items-start md:items-center"
              >
                {/* Column 1: Course Code */}
                <div className="md:col-span-3 flex items-center justify-between md:justify-start w-full">
                  <span className="text-xs font-semibold text-slate-400 md:hidden">
                    Code:
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                    <Layers className="w-3.5 h-3.5 text-slate-500" />
                    {c.code}
                  </span>
                </div>

                {/* Column 2: Course Name */}
                <div className="md:col-span-7 w-full">
                  <p className="font-bold text-slate-800 text-sm">{c.name}</p>
                </div>

                {/* Column 3: Actions */}
                <div className="md:col-span-2 flex items-center justify-end gap-1 w-full pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <button
                    onClick={() => handleStartEdit(c)}
                    title="Edit Course"
                    className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-xl transition-all"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(c)}
                    title="Delete Course"
                    className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add / Edit Course Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleCancelEdit();
          }}
        >
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#15803D] flex items-center justify-center border border-emerald-100">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">
                    {editingId ? "Edit Course" : "Add New Course"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {editingId
                      ? "Update existing course information."
                      : "Enter details to create a new course."}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Course Name
                </label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Computer Science & Engineering 3rd Year"
                  className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#15803D] focus:bg-white transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Course Code
                </label>
                <input
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="e.g. CSE-300"
                  className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#15803D] focus:bg-white transition-all"
                />
              </div>

              {/* Modal Footer Actions */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs sm:text-sm font-semibold transition-all"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-[#15803D] hover:bg-emerald-700 text-white py-2 px-5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  {editingId ? "Save Changes" : "Create Course"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isDeleting) {
              setDeleteTarget(null);
            }
          }}
        >
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
            {/* Modal Body */}
            <div className="p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-100">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  Delete Course?
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Are you sure you want to delete this course? This action cannot be undone.
                </p>
              </div>

              {/* Course details box */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-left text-xs space-y-1 mt-3">
                <p className="text-slate-700">
                  <span className="font-semibold">Course Code:</span>{" "}
                  {deleteTarget.code}
                </p>
                <p className="text-slate-700">
                  <span className="font-semibold">Course Name:</span>{" "}
                  {deleteTarget.name}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 px-6 py-4 bg-slate-50/50 border-t border-slate-100">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs sm:text-sm font-semibold transition-all disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="bg-rose-600 hover:bg-rose-700 text-white py-2 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete Course
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}