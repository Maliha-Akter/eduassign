"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Trash2,
  Lock,
  Unlock,
  Users,
  Search,
  Shield,
  ShieldAlert,
  UserCheck,
  UserX,
  X,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/app/lib/auth-client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5024";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isBlocked: boolean;
}

type ModalType = "role" | "block" | "delete" | null;

export default function ManageUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State Management
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [targetUser, setTargetUser] = useState<User | null>(null);
  const [pendingRole, setPendingRole] = useState<string | null>(null);

  // Helper to fetch authorization token
  const getAuthToken = async (): Promise<string | null> => {
    try {
      const tokenResponse = await authClient.token();
      const token: string | undefined = tokenResponse?.data?.token;
      if (!token) {
        toast.error("Authentication expired. Please log in again.");
        return null;
      }
      return token;
    } catch {
      toast.error("Failed to retrieve authentication token.");
      return null;
    }
  };

  // Fetch users directory
  const fetchUsers = useCallback(async () => {
    try {
      const token = await getAuthToken();
      if (!token) {
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_BASE_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to load users from server.");

      const data = await res.json();
      setUsers(data);
    } catch (error: any) {
      toast.error(error?.message || "Failed to fetch users directory.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadUsersData = async () => {
      await Promise.resolve();
      if (isMounted) await fetchUsers();
    };

    loadUsersData();

    return () => {
      isMounted = false;
    };
  }, [fetchUsers]);

  // Modal Handlers
  const closeModal = () => {
    setActiveModal(null);
    setTargetUser(null);
    setPendingRole(null);
  };

  const handleRoleSelect = (user: User, newRole: string) => {
    if (user.role === newRole) return;
    setTargetUser(user);
    setPendingRole(newRole);
    setActiveModal("role");
  };

  const handleBlockClick = (user: User) => {
    setTargetUser(user);
    setActiveModal("block");
  };

  const handleDeleteClick = (user: User) => {
    setTargetUser(user);
    setActiveModal("delete");
  };

  // Action Confirmations
  const confirmRoleChange = async () => {
    if (!targetUser || !pendingRole) return;
    setIsSubmitting(true);

    try {
      const token = await getAuthToken();
      if (!token) return;

      const res = await fetch(`${API_BASE_URL}/api/admin/users/${targetUser.id}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: pendingRole }),
      });

      if (!res.ok) throw new Error("Failed to update role.");

      toast.success(`Role updated to "${pendingRole}" for ${targetUser.name}`);
      await fetchUsers();
      closeModal();
    } catch (error: any) {
      toast.error(error?.message || "Failed to update user role.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmBlockToggle = async () => {
    if (!targetUser) return;
    setIsSubmitting(true);
    const newStatus = !targetUser.isBlocked;

    try {
      const token = await getAuthToken();
      if (!token) return;

      const res = await fetch(`${API_BASE_URL}/api/admin/users/${targetUser.id}/block`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isBlocked: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update block status.");

      toast.success(
        `User ${targetUser.name} has been ${newStatus ? "blocked" : "unblocked"}.`
      );
      await fetchUsers();
      closeModal();
    } catch (error: any) {
      toast.error(error?.message || "Failed to update account status.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!targetUser) return;
    setIsSubmitting(true);

    try {
      const token = await getAuthToken();
      if (!token) return;

      const res = await fetch(`${API_BASE_URL}/api/admin/users/${targetUser.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete user.");

      setUsers((prev) => prev.filter((u) => u.id !== targetUser.id));
      toast.success(`User ${targetUser.name} has been deleted.`);
      closeModal();
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete user.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Search Filtering
  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Helper Badge Renderer
  const renderRoleBadge = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            <Shield className="w-3 h-3" /> Admin
          </span>
        );
      case "teacher":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            Teacher
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-[#15803D] border border-emerald-200">
            Student
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-xs">
        <Loader2 className="w-8 h-8 animate-spin text-[#15803D] mx-auto mb-3" />
        <p className="text-slate-500 font-medium text-sm">Loading user directory...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Controls Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/80 shadow-xs space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">User Management</h2>
            <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-slate-200">
              {users.length} Users
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage user roles, account block status, and system access.
          </p>
        </div>

        {/* Quick Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#15803D] focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Container - Responsive Layout */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Desktop Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3.5 bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <div className="col-span-4">User</div>
          <div className="col-span-3">Role</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-3 text-right">Actions</div>
        </div>

        {/* User Rows */}
        <div className="divide-y divide-slate-100 text-sm">
          {filteredUsers.length === 0 ? (
            <div className="px-6 py-12 text-center text-slate-500">
              <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              No users found matching your search.
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                className="p-4 sm:px-6 sm:py-4 hover:bg-slate-50/60 transition-colors flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-4 items-start md:items-center"
              >
                {/* User Info */}
                <div className="md:col-span-4 flex items-center gap-3 w-full">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 text-[#15803D] font-bold text-sm flex items-center justify-center border border-emerald-100 flex-shrink-0">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-800 truncate">{user.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>
                </div>

                {/* Role Selection */}
                <div className="md:col-span-3 flex items-center gap-2 justify-between md:justify-start w-full">
                  <span className="text-xs font-semibold text-slate-400 md:hidden">Role:</span>
                  <div className="flex items-center gap-2">
                    {renderRoleBadge(user.role)}
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleSelect(user, e.target.value)}
                      className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 focus:ring-2 focus:ring-[#15803D] focus:outline-none cursor-pointer hover:bg-slate-100 transition-colors"
                    >
                      <option value="admin">Admin</option>
                      <option value="teacher">Teacher</option>
                      <option value="student">Student</option>
                    </select>
                  </div>
                </div>

                {/* Status */}
                <div className="md:col-span-2 flex items-center justify-between md:justify-start w-full">
                  <span className="text-xs font-semibold text-slate-400 md:hidden">Status:</span>
                  {user.isBlocked ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                      <UserX className="w-3.5 h-3.5" /> Blocked
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-[#15803D] border border-emerald-200">
                      <UserCheck className="w-3.5 h-3.5" /> Active
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="md:col-span-3 flex items-center justify-end gap-2 w-full pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <button
                    onClick={() => handleBlockClick(user)}
                    title={user.isBlocked ? "Unblock User" : "Block User"}
                    className={`flex items-center gap-1.5 px-3 py-1.5 md:p-2 rounded-xl transition-all text-xs font-semibold cursor-pointer ${
                      user.isBlocked
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200 md:bg-transparent md:border-0 md:text-emerald-600 md:hover:bg-emerald-50"
                        : "bg-amber-50 text-amber-700 border border-amber-200 md:bg-transparent md:border-0 md:text-amber-600 md:hover:bg-amber-50"
                    }`}
                  >
                    {user.isBlocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                    <span className="md:hidden">{user.isBlocked ? "Unblock" : "Block"}</span>
                  </button>

                  <button
                    onClick={() => handleDeleteClick(user)}
                    title="Delete User"
                    className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 border border-rose-100 md:border-0 rounded-xl transition-all cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Role Change Modal */}
      {activeModal === "role" && targetUser && (
        <Modal
          isOpen={true}
          onClose={closeModal}
          icon={<Shield className="w-6 h-6 text-[#15803D]" />}
          iconBg="bg-emerald-50"
          title="Confirm Role Change"
          subtitle="Modify user access permissions"
          confirmText="Yes, Change Role"
          confirmClass="bg-[#15803D] hover:bg-emerald-700 text-white"
          onConfirm={confirmRoleChange}
          isSubmitting={isSubmitting}
        >
          Are you sure you want to reassign user{" "}
          <span className="font-semibold text-slate-900">"{targetUser.name}"</span> to the{" "}
          <span className="font-bold text-[#15803D]">"{pendingRole}"</span> role?
        </Modal>
      )}

      {/* Block/Unblock Modal */}
      {activeModal === "block" && targetUser && (
        <Modal
          isOpen={true}
          onClose={closeModal}
          icon={
            !targetUser.isBlocked ? (
              <ShieldAlert className="w-6 h-6 text-amber-600" />
            ) : (
              <UserCheck className="w-6 h-6 text-[#15803D]" />
            )
          }
          iconBg={!targetUser.isBlocked ? "bg-amber-50" : "bg-emerald-50"}
          title={!targetUser.isBlocked ? "Block User Account" : "Unblock User Account"}
          subtitle="Update system access status"
          confirmText={!targetUser.isBlocked ? "Yes, Block User" : "Yes, Unblock User"}
          confirmClass={
            !targetUser.isBlocked
              ? "bg-amber-600 hover:bg-amber-700 text-white"
              : "bg-[#15803D] hover:bg-emerald-700 text-white"
          }
          onConfirm={confirmBlockToggle}
          isSubmitting={isSubmitting}
        >
          Are you sure you want to{" "}
          <span className="font-bold text-slate-900">
            {!targetUser.isBlocked ? "block" : "unblock"}
          </span>{" "}
          user <span className="font-semibold text-slate-900">"{targetUser.name}"</span>?
        </Modal>
      )}

      {/* Delete User Confirmation Modal */}
      {activeModal === "delete" && targetUser && (
        <Modal
          isOpen={true}
          onClose={closeModal}
          icon={<AlertTriangle className="w-6 h-6 text-rose-600" />}
          iconBg="bg-rose-50"
          title="Delete User Account"
          subtitle="Permanent action"
          confirmText="Yes, Delete User"
          confirmClass="bg-rose-600 hover:bg-rose-700 text-white"
          onConfirm={confirmDelete}
          isSubmitting={isSubmitting}
        >
          Are you sure you want to permanently delete user{" "}
          <span className="font-semibold text-slate-900">"{targetUser.name}"</span>? This action
          cannot be undone.
        </Modal>
      )}
    </div>
  );
}

{/* Reusable Modal Component */}
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  confirmText: string;
  confirmClass: string;
  onConfirm: () => void;
  isSubmitting?: boolean;
}

function Modal({
  isOpen,
  onClose,
  icon,
  iconBg,
  title,
  subtitle,
  children,
  confirmText,
  confirmClass,
  onConfirm,
  isSubmitting,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl border border-slate-100 space-y-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl ${iconBg}`}>{icon}</div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">{title}</h3>
            <p className="text-xs text-slate-500">{subtitle}</p>
          </div>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed">{children}</p>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="w-full sm:w-auto px-4 py-2.5 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isSubmitting}
            className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer ${confirmClass} disabled:opacity-50`}
          >
            {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}