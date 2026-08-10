// src/app/dashboard/layout.tsx
import React from 'react';
import { requireRole } from '../lib/security/session'; // Adjust path as needed
import DashboardLayoutClient from './DashboardLayoutClient';

export const metadata = {
    title: {
        default: "Dashboard | EduAssign",
        template: "%s | EduAssign",
    },
    description: "Manage classes, assignments, and student submissions.",
};

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // ✅ FIX: Allow any of the valid EduAssign roles to access the dashboard base
    const user = await requireRole(['student', 'teacher', 'admin']);

    return (
        <DashboardLayoutClient>
            {children}
        </DashboardLayoutClient>
    );
}