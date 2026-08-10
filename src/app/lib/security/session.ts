import { headers } from "next/headers";
import { auth, type User } from "../auth"; // Imports your unified User type
import { redirect } from "next/navigation";

export type UserRole = "student" | "teacher" | "admin";

// 1. Create specific interfaces for your roles so TypeScript knows 
// about the extra fields you added to the database.
export interface StudentUser extends User {
    role: "student";
    class: string; 
}

export interface TeacherUser extends User {
    role: "teacher";
    primarySubject: string;
    qualification: string;
}

export const getUserSession = async (): Promise<User | null> => {
    const session = await auth.api.getSession({
        headers: await headers() 
    });

    return (session?.user as User) || null;
};

// 2. Upgraded to accept a single role OR an array of roles
export const requireRole = async (allowedRoles: UserRole | UserRole[]) => {
    const user = await getUserSession();
    
    if (!user) {
        redirect('/auth/login'); 
    }
    
    // Normalize to an array so we can check easily
    const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    // ✅ Checks if the user's role is inside the allowed array
    if (!rolesArray.includes(user.role as UserRole)) {
        redirect('/unauthorized');
    }
    
    return user;
};

// 3. Convenience helpers: Use these in your Server Components!
// When you call these, TypeScript will perfectly autocomplete the custom fields.

export const requireStudent = async (): Promise<StudentUser> => {
    const user = await requireRole("student");
    return user as StudentUser;
};

export const requireTeacher = async (): Promise<TeacherUser> => {
    // Allows both teachers and admins to view teacher pages if needed, 
    // or just "teacher" based on your preference.
    const user = await requireRole("teacher"); 
    return user as TeacherUser;
};