"use client";

import React from "react";
import Link from "next/link";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  ChevronRight,
  FileText,
} from "lucide-react";

export default function StudentDashboardPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 pb-16 px-4 sm:px-6">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-800 via-[#15803D] to-teal-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg border border-emerald-700/50">
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/50 backdrop-blur-md border border-emerald-500/30 text-emerald-200 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 flex-shrink-0" /> Student Portal
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
              Student Dashboard
            </h1>
            <p className="text-emerald-100/90 text-xs sm:text-sm md:text-base leading-relaxed">
              Welcome back! Here is your study overview and quick access hub.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 w-full sm:w-auto">
            <Link
              href="/dashboard/student/assignments"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#15803D] hover:bg-emerald-50 font-semibold text-xs sm:text-sm px-5 py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg w-full sm:w-auto"
            >
              Go to Assignments
              <ArrowRight className="w-4 h-4 flex-shrink-0" />
            </Link>
          </div>
        </div>

        {/* Ambient Decorative Shapes */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -top-12 w-48 h-48 bg-teal-400/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Main Interactive Cards - Each takes 1 full row across all screens */}
      <div className="grid grid-cols-1 gap-5 sm:gap-6">
        
        {/* 1. My Assignments */}
        <Link
          href="/dashboard/student/assignments"
          className="group relative bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all duration-200 flex flex-col justify-between w-full"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="p-3.5 bg-emerald-50 text-[#15803D] rounded-xl group-hover:scale-110 transition-transform duration-200">
                <BookOpen className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                Assignments
              </span>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-800 group-hover:text-[#15803D] transition-colors">
                My Assignments
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                View all posted coursework, requirements, and due dates.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm font-semibold text-[#15803D]">
            <span>View All Assignments</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* 2. My Submissions */}
        <Link
          href="/dashboard/student/submissions"
          className="group relative bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-md hover:border-blue-300 transition-all duration-200 flex flex-col justify-between w-full"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="p-3.5 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-110 transition-transform duration-200">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                Submissions
              </span>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                My Submissions
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                Check submitted work, grades, and teacher feedback.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm font-semibold text-blue-600">
            <span>View All Submissions</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* 3. Pending Tasks */}
        <Link
          href="/dashboard/student/assignments"
          className="group relative bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-md hover:border-amber-300 transition-all duration-200 flex flex-col justify-between w-full"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="p-3.5 bg-amber-50 text-amber-600 rounded-xl group-hover:scale-110 transition-transform duration-200">
                <Clock className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
                Tasks
              </span>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-800 group-hover:text-amber-600 transition-colors">
                Pending Tasks
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                Check assignments to submit your work before the deadline.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm font-semibold text-amber-600">
            <span>Check Assignments</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

      </div>

      {/* Quick Action Bar */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-4">
          <div className="p-3 bg-white border border-slate-200 rounded-xl text-slate-700 shadow-2xs flex-shrink-0">
            <FileText className="w-6 h-6 text-[#15803D]" />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-sm sm:text-base">Need to review graded work?</h4>
            <p className="text-xs text-slate-500 mt-0.5">Jump directly to your submission history to view instructor feedback.</p>
          </div>
        </div>
        <Link
          href="/dashboard/student/submissions"
          className="w-full sm:w-auto text-center bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold px-5 py-3 rounded-xl transition-all shadow-2xs flex-shrink-0"
        >
          Open Submissions
        </Link>
      </div>

    </div>
  );
}