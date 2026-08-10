"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";

type AssignmentFormInputs = {
    title: string;
    description: string;
    classId: string;
    subjectId: string;
    deadline: string;
    maximumMarks: number;
};

export default function CreateAssignmentPage() {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<AssignmentFormInputs>();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit = async (formDataInputs: AssignmentFormInputs, status: "Draft" | "Published") => {
        setIsSubmitting(true);
        try {
            const formattedData = {
                ...formDataInputs,
                maximumMarks: Number(formDataInputs.maximumMarks),
                status: status,
            };

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/assignments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(formattedData),
            });

            if (!res.ok) {
                if (res.status === 403) {
                    throw new Error("Access Denied: Your account does not have the 'Teacher' role.");
                } else if (res.status === 401) {
                    throw new Error("Unauthorized: Please log in again.");
                } else {
                    let errorMsg = `Server error: ${res.status}`;
                    try {
                        const errJson = await res.json();
                        errorMsg = errJson.message || errorMsg;
                    } catch { }
                    throw new Error(errorMsg);
                }
            }

            // Read response stream only once
            const responseData = await res.json();

            alert(responseData.message || "Assignment saved successfully!");
            reset();
        } catch (error: any) {
            alert(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 text-zinc-100">
            <div className="mb-8">
                <h1 className="text-2xl font-bold">Create New Assignment</h1>
                <p className="text-zinc-400">Fill in the details to publish or draft a new assignment for your students.</p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <form className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-1.5">Title</label>
                        <input
                            type="text"
                            {...register("title", { required: "Title is required" })}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm focus:border-blue-500 outline-none"
                            placeholder="e.g., Mathematics Assignment 1"
                        />
                        {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1.5">Description</label>
                        <textarea
                            {...register("description", { required: "Description is required" })}
                            rows={4}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm focus:border-blue-500 outline-none resize-none"
                            placeholder="Solve questions 1-10..."
                        />
                        {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-1.5">Class / Course</label>
                            <select
                                {...register("classId", { required: "Class is required" })}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm focus:border-blue-500 outline-none"
                                defaultValue=""
                            >
                                <option value="" disabled>Select class ▼</option>
                                {/* Must be a valid 24-char hex string */}
                                <option value="607f1f77bcf86cd799439011">Class 10 - Section A</option>
                            </select>
                            {errors.classId && <p className="text-red-400 text-xs mt-1">{errors.classId.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5">Subject</label>
                            <select
                                {...register("subjectId", { required: "Subject is required" })}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm focus:border-blue-500 outline-none"
                                defaultValue=""
                            >
                                <option value="" disabled>Select subject ▼</option>
                                <option value="sub_123">Mathematics</option>
                            </select>
                            {errors.subjectId && <p className="text-red-400 text-xs mt-1">{errors.subjectId.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5">Deadline</label>
                            <input
                                type="datetime-local"
                                {...register("deadline", { required: "Deadline is required" })}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm focus:border-blue-500 outline-none"
                            />
                            {errors.deadline && <p className="text-red-400 text-xs mt-1">{errors.deadline.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5">Maximum Marks</label>
                            <input
                                type="number"
                                {...register("maximumMarks", {
                                    required: "Marks are required",
                                    min: { value: 1, message: "Marks must be greater than 0" }
                                })}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm focus:border-blue-500 outline-none"
                                placeholder="100"
                            />
                            {errors.maximumMarks && <p className="text-red-400 text-xs mt-1">{errors.maximumMarks.message}</p>}
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-6 border-t border-zinc-800">
                        <button
                            type="button"
                            onClick={handleSubmit((data) => onSubmit(data, "Draft"))}
                            disabled={isSubmitting}
                            className="px-6 py-2 rounded-lg font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 transition-colors"
                        >
                            Save Draft
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit((data) => onSubmit(data, "Published"))}
                            disabled={isSubmitting}
                            className="px-6 py-2 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-500 shadow-md transition-colors"
                        >
                            Publish
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}