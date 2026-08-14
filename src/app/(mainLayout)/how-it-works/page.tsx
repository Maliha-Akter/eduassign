"use client";

import React from 'react';
import { UserCheck, BookOpen, Send, Award, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function HowItWorksPage() {
    const steps = [
        {
            step: "01",
            icon: <UserCheck className="w-6 h-6" />,
            title: "Create Your Role-Based Account",
            description: "Sign up securely as a student, teacher, or administrator. Your account automatically provisions the correct tools, permissions, and workspace layouts tailored to your academic role."
        },
        {
            step: "02",
            icon: <BookOpen className="w-6 h-6" />,
            title: "Join or Set Up Class Workspaces",
            description: "Teachers can effortlessly organize subjects, publish custom assignment rubrics, and set deadlines. Students join course rooms using secure codes with one click."
        },
        {
            step: "03",
            icon: <Send className="w-6 h-6" />,
            title: "Submit & Process Assignments",
            description: "Upload code repositories, documents, or research notes with instant validation checks and real-time tracking to ensure zero missed deadlines."
        },
        {
            step: "04",
            icon: <Award className="w-6 h-6" />,
            title: "Review, Grade & Analyze Metrics",
            description: "Leverage automated evaluation insights and inline instructor feedback to review performance metrics, grade distributions, and growth reports instantly."
        }
    ];

    return (
        <div className="min-h-screen bg-[#F9FAFB] py-16 px-4 sm:px-6 lg:px-8 text-[#374151]">
            <div className="max-w-6xl mx-auto space-y-20">
                
                {/* Header Section */}
                <div className="text-center max-w-3xl mx-auto space-y-4">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-green-50 border border-green-200 text-[#15803D] text-xs font-bold uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5" /> Simple & Efficient Workflow
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-[#374151]">
                        How <span className="text-[#15803D]">EduAssign</span> Works
                    </h1>
                    <p className="text-gray-500 text-base sm:text-lg leading-relaxed">
                        Discover how our streamlined platform connects educators and students, eliminating administrative friction and accelerating academic success.
                    </p>
                </div>

                {/* Steps Timeline Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {steps.map((item, index) => (
                        <div 
                            key={index} 
                            className="bg-white border border-gray-200 rounded-3xl p-8 shadow-xs hover:shadow-lg hover:border-[#15803D]/40 transition-all duration-300 flex flex-col justify-between group"
                        >
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-green-50 text-[#15803D] flex items-center justify-center group-hover:bg-[#15803D] group-hover:text-white transition-colors duration-300">
                                        {item.icon}
                                    </div>
                                    <span className="text-3xl font-black text-gray-200 group-hover:text-green-100 transition-colors">
                                        {item.step}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-[#374151] mb-3 group-hover:text-[#15803D] transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-gray-500 text-sm leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs font-semibold text-[#15803D]">
                                <CheckCircle2 className="w-4 h-4" /> Fully Optimized Process
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom CTA Banner */}
                <div className="bg-gradient-to-r from-green-900 to-[#15803D] rounded-3xl p-10 text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8 shadow-xl">
                    <div className="space-y-3 max-w-xl">
                        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                            Ready to experience a smarter classroom?
                        </h2>
                        <p className="text-green-100 text-sm leading-relaxed">
                            Join educators and students transforming their academic management workflows today.
                        </p>
                    </div>
                    <Link 
                        href="/auth/register" 
                        className="px-6 py-3.5 bg-white text-[#15803D] font-bold rounded-xl shadow-md hover:bg-green-50 transition-colors inline-flex items-center gap-2 whitespace-nowrap"
                    >
                        Get Started Now <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

            </div>
        </div>
    );
}