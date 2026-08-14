"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";

type AssignmentFormInputs = {
    title: string;
    description: string;
    classId: string;
    subjectId: string;
    deadlineDate: string;
    deadlineTime: string;
    maximumMarks: number;
};

// Fallback prevents fetching from `undefined/api/assignments` if env var is missing
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5024";

export default function CreateAssignmentPage() {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<AssignmentFormInputs>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitType, setSubmitType] = useState<"Draft" | "Published" | null>(null);

    // If your backend expects integer or GUID IDs, match those exact values here
    const classOptions = Array.from({ length: 10 }, (_, i) => ({
        id: `${i + 1}`,
        name: `Class ${i + 1}`
    }));

    const subjectOptions = [
        { id: "1", name: "Bangla" },
        { id: "2", name: "English" },
        { id: "3", name: "Mathematics" },
        { id: "4", name: "Physics" },
        { id: "5", name: "Chemistry" },
        { id: "6", name: "Biology" },
        { id: "7", name: "ICT" },
        { id: "8", name: "History" },
        { id: "9", name: "Geography" },
        { id: "10", name: "Religion" },
    ];

    const onSubmit = async (data: AssignmentFormInputs, status: "Draft" | "Published") => {
        setIsSubmitting(true);
        setSubmitType(status);
        try {
            // Validate date string before converting to ISO format to prevent RangeError
            const dateObj = new Date(`${data.deadlineDate}T${data.deadlineTime}`);
            if (isNaN(dateObj.getTime())) {
                throw new Error("Invalid date or time selected. Please select a valid deadline.");
            }
            const combinedDateTime = dateObj.toISOString();

            const formattedData = {
                title: data.title,
                description: data.description,
                classId: data.classId,
                subjectId: data.subjectId,
                maximumMarks: Number(data.maximumMarks),
                deadline: combinedDateTime,
                status: status,
            };

            const res = await fetch(`${API_BASE_URL}/api/assignments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(formattedData),
            });

            if (!res.ok) {
                if (res.status === 403) throw new Error("Access Denied: Your account does not have the 'Teacher' role.");
                if (res.status === 401) throw new Error("Unauthorized: Please log in again.");
                
                let errorMsg = `Server error: ${res.status}`;
                try {
                    const errJson = await res.json();
                    errorMsg = errJson.message || errJson.title || errorMsg;
                } catch { }
                throw new Error(errorMsg);
            }

            const responseData = await res.json();
            alert(responseData.message || `Assignment ${status === "Draft" ? "saved as draft" : "published"} successfully!`);
            reset();
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
            alert(errorMessage);
        } finally {
            setIsSubmitting(false);
            setSubmitType(null);
        }
    };

    const inputClasses = "w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl p-3.5 text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-200";
    const labelClasses = "block text-sm font-semibold text-gray-700 mb-2";

    return (
        <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                
                <div className="mb-10 text-center sm:text-left">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Create Assignment</h1>
                    <p className="mt-2 text-gray-500 text-sm sm:text-base">
                        Design and distribute new coursework for your students.
                    </p>
                </div>

                <div className="bg-white border border-gray-100 shadow-xl shadow-gray-200/40 rounded-3xl p-6 sm:p-10">
                    <form className="space-y-8">
                        
                        <div className="space-y-6">
                            <div>
                                <label className={labelClasses}>Assignment Title</label>
                                <input
                                    type="text"
                                    {...register("title", { required: "Title is required" })}
                                    className={inputClasses}
                                    placeholder="e.g., Chapter 4: Thermodynamics Final Project"
                                />
                                {errors.title && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.title.message}</p>}
                            </div>

                            <div>
                                <label className={labelClasses}>Instructions / Description</label>
                                <textarea
                                    {...register("description", { required: "Description is required" })}
                                    rows={5}
                                    className={`${inputClasses} resize-none`}
                                    placeholder="Provide clear instructions, reading materials, or questions here..."
                                />
                                {errors.description && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.description.message}</p>}
                            </div>
                        </div>

                        <hr className="border-gray-100" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className={labelClasses}>Target Class</label>
                                <select
                                    {...register("classId", { required: "Class is required" })}
                                    className={inputClasses}
                                    defaultValue=""
                                >
                                    <option value="" disabled>Select a class...</option>
                                    {classOptions.map((cls) => (
                                        <option key={cls.id} value={cls.id}>{cls.name}</option>
                                    ))}
                                </select>
                                {errors.classId && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.classId.message}</p>}
                            </div>

                            <div>
                                <label className={labelClasses}>Subject</label>
                                <select
                                    {...register("subjectId", { required: "Subject is required" })}
                                    className={inputClasses}
                                    defaultValue=""
                                >
                                    <option value="" disabled>Select a subject...</option>
                                    {subjectOptions.map((sub) => (
                                        <option key={sub.id} value={sub.id}>{sub.name}</option>
                                    ))}
                                </select>
                                {errors.subjectId && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.subjectId.message}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div>
                                <label className={labelClasses}>Due Date</label>
                                <input
                                    type="date"
                                    {...register("deadlineDate", { required: "Date is required" })}
                                    className={inputClasses}
                                />
                                {errors.deadlineDate && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.deadlineDate.message}</p>}
                            </div>

                            <div>
                                <label className={labelClasses}>Due Time</label>
                                <input
                                    type="time"
                                    {...register("deadlineTime", { required: "Time is required" })}
                                    className={inputClasses}
                                />
                                {errors.deadlineTime && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.deadlineTime.message}</p>}
                            </div>

                            <div>
                                <label className={labelClasses}>Maximum Marks</label>
                                <input
                                    type="number"
                                    {...register("maximumMarks", {
                                        required: "Marks are required",
                                        min: { value: 1, message: "Must be > 0" }
                                    })}
                                    className={inputClasses}
                                    placeholder="e.g., 100"
                                />
                                {errors.maximumMarks && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.maximumMarks.message}</p>}
                            </div>
                        </div>

                        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={handleSubmit((data) => onSubmit(data, "Draft"))}
                                disabled={isSubmitting}
                                className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 focus:ring-4 focus:ring-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                            >
                                {isSubmitting && submitType === "Draft" ? "Saving..." : "Save Draft"}
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmit((data) => onSubmit(data, "Published"))}
                                disabled={isSubmitting}
                                className="w-full sm:w-auto px-8 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                            >
                                {isSubmitting && submitType === "Published" ? "Publishing..." : "Publish Assignment"}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}