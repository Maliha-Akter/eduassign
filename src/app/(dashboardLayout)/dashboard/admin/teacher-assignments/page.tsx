"use client";

import { useState, useEffect, useCallback } from "react";
import { authClient } from "@/app/lib/auth-client";
import {
  Trash2,
  Pencil,
  X,
  Check,
  Users,
  Loader2,
  Plus,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Link as LinkIcon,
} from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5024";

interface Assignment {
  id: string;
  teacherId?: string;
  TeacherId?: string;
  teacherName: string;
  assignedClass: string;
  section: string;
  primarySubject?: string;
  PrimarySubject?: string;
}

interface User {
  id: string;
  name: string;
  role: string;
  primarySubject?: string;
  PrimarySubject?: string;
  subject?: string;
  Subject?: string;
}

interface RawUser {
  id?: string;
  _id?: string;
  Id?: string;
  name?: string;
  role?: string;
  primarySubject?: string;
  PrimarySubject?: string;
  subject?: string;
  Subject?: string;
}

interface Toast {
  message: string;
  type: "success" | "error";
}

const CLASS_OPTIONS = Array.from({ length: 12 }, (_, i) => `Class-${i + 1}`);
const SECTION_OPTIONS = ["Section-A", "Section-B", "Section-C", "Section-D"];

export default function TeacherAssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [teacherId, setTeacherId] = useState("");
  const [assignedClass, setAssignedClass] = useState("");
  const [section, setSection] = useState("");
  const [teacherSubject, setTeacherSubject] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Assignment | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast Notification
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

  const getAuthHeaders = useCallback(async () => {
    const tokenResponse = await authClient.token();
    const token = tokenResponse?.data?.token;

    if (!token) {
      console.error("No token found. Please log in.");
      showToast("Authentication required. Please log in.", "error");
      return null;
    }

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const headers = await getAuthHeaders();
      if (!headers) {
        setLoading(false);
        return;
      }

      const [assignRes, usersRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/admin/teacher-assignments`, { headers }),
        fetch(`${API_BASE_URL}/api/admin/users`, { headers }),
      ]);

      if (assignRes.ok) {
        const data: Assignment[] = await assignRes.json();
        setAssignments(data);
      } else {
        console.error("Failed to fetch teacher assignments:", assignRes.status);
      }

      if (usersRes.ok) {
        const users: RawUser[] = await usersRes.json();
        const mappedUsers: User[] = users.map((u) => ({
          id: String(u.id || u._id || u.Id || ""),
          name: u.name || "Unknown Teacher",
          role: u.role || "",
          primarySubject: u.primarySubject,
          PrimarySubject: u.PrimarySubject,
          subject: u.subject,
          Subject: u.Subject,
        }));

        setTeachers(
          mappedUsers.filter((u) => u.role.toLowerCase() === "teacher")
        );
      } else {
        console.error("Failed to fetch users:", usersRes.status);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      showToast("Failed to connect to backend server.", "error");
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders]);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      await Promise.resolve();
      if (isMounted) {
        await fetchData();
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [fetchData]);

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

  const handleTeacherChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setTeacherId(selectedId);

    const foundTeacher = teachers.find(
      (t) => String(t.id) === String(selectedId)
    );

    const sub =
      foundTeacher?.primarySubject ||
      foundTeacher?.PrimarySubject ||
      foundTeacher?.subject ||
      foundTeacher?.Subject ||
      "N/A";

    setTeacherSubject(sub);
  };

  const handleOpenCreateModal = () => {
    handleCancelEdit();
    setIsModalOpen(true);
  };

  const handleStartEdit = (assignment: Assignment) => {
    setEditingId(assignment.id);
    const tId = assignment.teacherId || assignment.TeacherId || "";
    setTeacherId(tId);
    setAssignedClass(assignment.assignedClass);
    setSection(assignment.section);

    const foundTeacher = teachers.find((t) => String(t.id) === String(tId));

    const sub =
      (assignment.primarySubject && assignment.primarySubject !== "N/A"
        ? assignment.primarySubject
        : null) ||
      (assignment.PrimarySubject && assignment.PrimarySubject !== "N/A"
        ? assignment.PrimarySubject
        : null) ||
      foundTeacher?.primarySubject ||
      foundTeacher?.PrimarySubject ||
      foundTeacher?.subject ||
      foundTeacher?.Subject ||
      "N/A";

    setTeacherSubject(sub);
    setIsModalOpen(true);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTeacherId("");
    setAssignedClass("");
    setSection("");
    setTeacherSubject("");
    setIsModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const headers = await getAuthHeaders();
      if (!headers) return;

      const isEditing = Boolean(editingId);
      const url = isEditing
        ? `${API_BASE_URL}/api/admin/teacher-assignments/${editingId}`
        : `${API_BASE_URL}/api/admin/teacher-assignments`;

      const method = isEditing ? "PUT" : "POST";
      const subjectToSave = teacherSubject || "N/A";

      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify({
          teacherId,
          TeacherId: teacherId,
          assignedClass,
          section,
          primarySubject: subjectToSave,
          PrimarySubject: subjectToSave,
        }),
      });

      if (res.ok) {
        handleCancelEdit();
        fetchData();
        showToast(
          isEditing
            ? "Assignment updated successfully!"
            : "Teacher assigned successfully!",
          "success"
        );
      } else {
        showToast("Failed to save assignment. Please try again.", "error");
      }
    } catch (error) {
      console.error(
        `Failed to ${editingId ? "update" : "assign"} teacher:`,
        error
      );
      showToast("An unexpected error occurred.", "error");
    }
  };

  // Confirm and Execute Delete
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      const headers = await getAuthHeaders();
      if (!headers) return;

      const res = await fetch(
        `${API_BASE_URL}/api/admin/teacher-assignments/${deleteTarget.id}`,
        {
          method: "DELETE",
          headers,
        }
      );

      if (res.ok) {
        if (editingId === deleteTarget.id) handleCancelEdit();
        fetchData();
        showToast("Assignment removed successfully.", "success");
      } else {
        showToast("Failed to delete assignment.", "error");
      }
    } catch (error) {
      console.error("Failed to delete assignment:", error);
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
          Loading assignments...
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

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
            Assign Teachers to Classes
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Link registered teachers to specific classes and sections.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="bg-[#15803D] hover:bg-emerald-700 text-white py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Assign Teacher
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3.5 bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <div className="col-span-4">Teacher</div>
          <div className="col-span-3">Subject</div>
          <div className="col-span-2">Class</div>
          <div className="col-span-1">Section</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {/* Table Content */}
        <div className="divide-y divide-slate-100 text-sm">
          {assignments.length === 0 ? (
            <div className="px-6 py-12 text-center text-slate-500">
              <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              No teacher assignments found.
            </div>
          ) : (
            assignments.map((a) => {
              const matchedTeacherId = a.teacherId || a.TeacherId;
              const teacher = teachers.find(
                (t) => String(t.id) === String(matchedTeacherId)
              );

              const subjectName =
                (a.primarySubject && a.primarySubject !== "N/A"
                  ? a.primarySubject
                  : null) ||
                (a.PrimarySubject && a.PrimarySubject !== "N/A"
                  ? a.PrimarySubject
                  : null) ||
                teacher?.primarySubject ||
                teacher?.PrimarySubject ||
                teacher?.subject ||
                teacher?.Subject ||
                "N/A";

              return (
                <div
                  key={a.id}
                  className="p-4 sm:px-6 sm:py-4 hover:bg-slate-50/60 transition-colors flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-4 items-start md:items-center"
                >
                  {/* Teacher Name */}
                  <div className="md:col-span-4 flex items-center gap-3 w-full">
                    <div className="w-9 h-9 rounded-full bg-emerald-50 text-[#15803D] font-bold text-xs flex items-center justify-center border border-emerald-100 flex-shrink-0">
                      {a.teacherName
                        ? a.teacherName.charAt(0).toUpperCase()
                        : "T"}
                    </div>
                    <span className="font-bold text-slate-800 text-sm truncate">
                      {a.teacherName}
                    </span>
                  </div>

                  {/* Subject */}
                  <div className="md:col-span-3 flex items-center justify-between md:justify-start w-full">
                    <span className="text-xs font-semibold text-slate-400 md:hidden">
                      Subject:
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                      {subjectName}
                    </span>
                  </div>

                  {/* Class */}
                  <div className="md:col-span-2 flex items-center justify-between md:justify-start w-full">
                    <span className="text-xs font-semibold text-slate-400 md:hidden">
                      Class:
                    </span>
                    <span className="text-xs font-medium text-slate-700">
                      {a.assignedClass}
                    </span>
                  </div>

                  {/* Section */}
                  <div className="md:col-span-1 flex items-center justify-between md:justify-start w-full">
                    <span className="text-xs font-semibold text-slate-400 md:hidden">
                      Section:
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-[#15803D] border border-emerald-200">
                      {a.section}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="md:col-span-2 flex items-center justify-end gap-1 w-full pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <button
                      onClick={() => handleStartEdit(a)}
                      title="Edit Assignment"
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-xl transition-all"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(a)}
                      title="Delete Assignment"
                      className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Assignment Modal Dialog */}
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
                  <LinkIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">
                    {editingId ? "Edit Assignment" : "Assign Teacher"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {editingId
                      ? "Update existing teacher class mapping."
                      : "Select teacher, class, and section to link."}
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

            {/* Modal Body / Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Teacher Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Teacher
                </label>
                <select
                  required
                  value={teacherId}
                  onChange={handleTeacherChange}
                  className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#15803D] focus:bg-white transition-all"
                >
                  <option value="">Select Teacher...</option>
                  {teachers.map((t) => {
                    const subject =
                      t.primarySubject ||
                      t.PrimarySubject ||
                      t.subject ||
                      t.Subject;
                    return (
                      <option key={t.id} value={t.id}>
                        {t.name} {subject ? `(${subject})` : ""}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Subject Preview Badge */}
              {teacherSubject && (
                <div className="flex items-center justify-between px-3 py-2 bg-blue-50/60 border border-blue-100 rounded-xl text-xs">
                  <span className="text-slate-500 font-medium flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                    Detected Subject:
                  </span>
                  <span className="font-bold text-blue-700">
                    {teacherSubject}
                  </span>
                </div>
              )}

              {/* Class & Section Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Assign Class
                  </label>
                  <select
                    required
                    value={assignedClass}
                    onChange={(e) => setAssignedClass(e.target.value)}
                    className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#15803D] focus:bg-white transition-all"
                  >
                    <option value="">Select Class...</option>
                    {CLASS_OPTIONS.map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Section
                  </label>
                  <select
                    required
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#15803D] focus:bg-white transition-all"
                  >
                    <option value="">Select Section...</option>
                    {SECTION_OPTIONS.map((sec) => (
                      <option key={sec} value={sec}>
                        {sec}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Modal Actions */}
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
                  {editingId ? "Save Changes" : "Assign Class"}
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
            {/* Header */}
            <div className="p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-100">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  Delete Assignment?
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Are you sure you want to remove this assignment? This action cannot be undone.
                </p>
              </div>

              {/* Details card */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-left text-xs space-y-1 mt-3">
                <p className="text-slate-700">
                  <span className="font-semibold">Teacher:</span>{" "}
                  {deleteTarget.teacherName}
                </p>
                <p className="text-slate-700">
                  <span className="font-semibold">Class & Section:</span>{" "}
                  {deleteTarget.assignedClass} ({deleteTarget.section})
                </p>
              </div>
            </div>

            {/* Modal Actions */}
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
                    Delete Assignment
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