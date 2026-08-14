"use client";

import React from 'react';
import { 
    CheckCircle, ShieldCheck, Zap, BarChart3, Users, 
    Smartphone, Layers, Cpu, ArrowRight, Sparkles 
} from 'lucide-react';
import Link from 'next/link';

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    badge?: string;
    colSpan?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, badge, colSpan = "col-span-1" }) => {
    return (
        <div className={`group relative bg-white border border-slate-200/80 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:border-[#15803D]/40 transition-all duration-300 transform hover:-translate-y-1.5 ${colSpan} overflow-hidden flex flex-col justify-between`}>
            {/* Subtle background gradient glow on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/0 via-emerald-50/0 to-emerald-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            
            <div>
                <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#15803D] flex items-center justify-center group-hover:bg-[#15803D] group-hover:text-white transition-colors duration-300 shadow-xs">
                        {icon}
                    </div>
                    {badge && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-[#15803D] border border-emerald-200/60">
                            {badge}
                        </span>
                    )}
                </div>

                <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-[#15803D] transition-colors duration-200">
                    {title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                    {description}
                </p>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-[#15803D] opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <span>Explore capability</span>
                <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
            </div>
        </div>
    );
};

export default function FeaturesPage() {
    return (
        <div className="min-h-screen bg-slate-50/50 py-16 px-6 sm:px-8 lg:px-12">
            <div className="max-w-7xl mx-auto space-y-20">
                
                {/* Hero Section */}
                <div className="text-center max-w-3xl mx-auto space-y-4">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-[#15803D] text-xs font-bold uppercase tracking-widest shadow-2xs">
                        <Sparkles className="w-3.5 h-3.5" /> Platform Capabilities
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-black text-slate-800 tracking-tight">
                        Designed for Power, <span className="text-[#15803D]">Built for Simplicity</span>
                    </h1>
                    <p className="text-slate-500 text-base sm:text-lg leading-relaxed">
                        Discover how our comprehensive toolset empowers educators and students to streamline workflows, enhance performance tracking, and elevate academic success.
                    </p>
                </div>

                {/* Bento Grid Features Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    
                    <FeatureCard 
                        icon={<Zap className="w-6 h-6" />}
                        title="Lightning Fast Submissions"
                        description="Instant document processing, real-time validation, and automated deadline tracking ensure zero friction for student turn-ins."
                        badge="Popular"
                    />

                    <FeatureCard 
                        icon={<ShieldCheck className="w-6 h-6" />}
                        title="Enterprise Security & Auth"
                        description="Robust session handling powered by advanced cryptographic tokens, securing role-based access for teachers and students alike."
                    />

                    <FeatureCard 
                        icon={<BarChart3 className="w-6 h-6" />}
                        title="Advanced Performance Metrics"
                        description="Gain deep insights into grade distribution, completion rates, and individual student progress with interactive visual charts."
                        badge="Analytics"
                    />

                    <FeatureCard 
                        icon={<Layers className="w-6 h-6" />}
                        title="Multi-Class Organization"
                        description="Seamlessly partition courses, assignments, and subjects into structured workspaces, reducing cognitive load."
                        colSpan="md:col-span-2 lg:col-span-2"
                    />

                    <FeatureCard 
                        icon={<Users className="w-6 h-6" />}
                        title="Collaborative Review Workflow"
                        description="Provide inline feedback, granular rubric scoring, and optional re-submission overrides with a single click."
                    />

                    <FeatureCard 
                        icon={<Smartphone className="w-6 h-6" />}
                        title="Fully Responsive Layout"
                        description="Optimized fluid layouts and touch-friendly components provide an uncompromising experience across desktops, tablets, and phones."
                    />

                    <FeatureCard 
                        icon={<Cpu className="w-6 h-6" />}
                        title="Automated Edge Grading Support"
                        description="Integrate AI-assisted suggestions and automatic rubric mapping to drastically cut down instructor grading turnaround times."
                        badge="AI-Powered"
                        colSpan="md:col-span-2 lg:col-span-2"
                    />

                </div>

                {/* Call to Action Banner */}
                <div className="relative bg-gradient-to-r from-emerald-900 to-[#15803D] rounded-3xl p-10 sm:p-14 text-white overflow-hidden shadow-xl">
                    <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
                    
                    <div className="relative z-10 max-w-2xl space-y-6">
                        <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                            Ready to transform your classroom workflow?
                        </h2>
                        <p className="text-emerald-100 text-base leading-relaxed">
                            Join educators and students experiencing streamlined assignment management, instant grading insights, and frictionless collaboration today.
                        </p>
                        <div className="flex flex-wrap gap-4 pt-2">
                            <Link href="/dashboard" className="px-6 py-3.5 bg-white text-[#15803D] font-bold rounded-xl shadow-md hover:bg-emerald-50 transition-colors inline-flex items-center gap-2">
                                Get Started Now <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link href="/contact" className="px-6 py-3.5 bg-emerald-800/60 border border-emerald-600/40 text-white font-semibold rounded-xl hover:bg-emerald-800 transition-colors">
                                Contact Sales
                            </Link>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}