"use client";

import React from "react";
import Link from "next/link";
import {
  Users,
  BookOpen,
  UserPlus,
  Files,
  ShieldCheck,
  ArrowRight,
  ChevronRight,
  UserCheck,
} from "lucide-react";

export default function AdminDashboard() {
  const adminModules = [
    {
      title: "Manage Users",
      description: "View, create, edit, and manage student, teacher, and admin accounts.",
      href: "/dashboard/admin/users",
      icon: Users,
      badge: "User Management",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-100",
      iconBg: "bg-blue-50 text-blue-600",
      hoverBorder: "hover:border-blue-300",
      linkText: "Go to Users",
      textColor: "group-hover:text-blue-600",
    },
    {
      title: "Classes & Subjects",
      description: "Configure active courses, class schedules, and curriculum structure.",
      href: "/dashboard/admin/courses",
      icon: BookOpen,
      badge: "Curriculum",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-100",
      iconBg: "bg-emerald-50 text-[#15803D]",
      hoverBorder: "hover:border-emerald-300",
      linkText: "Manage Courses",
      textColor: "group-hover:text-[#15803D]",
    },
    {
      title: "Assign Teachers",
      description: "Link faculty members to specific subjects, classes, and sections.",
      href: "/dashboard/admin/teacher-assignments",
      icon: UserPlus,
      badge: "Faculty Allocation",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-100",
      iconBg: "bg-purple-50 text-purple-600",
      hoverBorder: "hover:border-purple-300",
      linkText: "Assign Faculty",
      textColor: "group-hover:text-purple-600",
    },
    {
      title: "All Assignments",
      description: "Oversee all posted tasks, submission statuses, and overall course activity.",
      href: "/dashboard/admin/assignments",
      icon: Files,
      badge: "Academic Oversight",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-100",
      iconBg: "bg-amber-50 text-amber-600",
      hoverBorder: "hover:border-amber-300",
      linkText: "View Assignments",
      textColor: "group-hover:text-amber-600",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16 px-4 sm:px-6">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg border border-slate-700/50">
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 backdrop-blur-md border border-slate-600/50 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" /> System Administrator
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Admin Control Center
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Manage accounts, assign faculty, oversee courses, and monitor academic progress.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard/admin/users"
              className="inline-flex items-center gap-2 bg-[#15803D] hover:bg-emerald-700 text-white font-semibold text-sm px-5 py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <Users className="w-4 h-4" />
              Manage Users
            </Link>
          </div>
        </div>

        {/* Decorative background glows */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -top-12 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Admin Route Navigation Grid (4 Active Modules) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminModules.map((module, idx) => {
          const Icon = module.icon;
          return (
            <Link
              key={idx}
              href={module.href}
              className={`group relative bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs hover:shadow-md ${module.hoverBorder} transition-all duration-200 flex flex-col justify-between`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`p-3.5 ${module.iconBg} rounded-xl group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${module.badgeColor}`}>
                    {module.badge}
                  </span>
                </div>

                <div>
                  <h2 className={`text-lg font-bold text-slate-800 ${module.textColor} transition-colors`}>
                    {module.title}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {module.description}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-600 group-hover:text-slate-900">
                <span>{module.linkText}</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Action Bar (Redirects to Teacher Allocation) */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white border border-slate-200 rounded-xl text-slate-700 shadow-2xs">
            <UserCheck className="w-6 h-6 text-[#15803D]" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Need to assign faculty to courses?</h3>
            <p className="text-xs text-slate-500">Quickly allocate teachers to active subjects and sections.</p>
          </div>
        </div>
        <Link
          href="/dashboard/admin/teacher-assignments"
          className="w-full sm:w-auto text-center bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-2xs flex-shrink-0 flex items-center justify-center gap-1.5"
        >
          Assign Teachers <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  );
}