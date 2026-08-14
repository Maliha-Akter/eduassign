"use client";

import React from 'react';
import { Sparkles, ArrowRight, Zap, Code, Shield, Terminal } from 'lucide-react';
import Link from 'next/link';

export default function AnimatedBanner() {
    return (
        <div className="relative overflow-hidden bg-slate-950 py-20 lg:py-28 px-6 sm:px-8 lg:px-12 rounded-3xl shadow-2xl border border-slate-800">
            
            {/* Animated Background Gradients & Glows */}
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse pointer-events-none" />
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse pointer-events-none [animation-delay:2s]" />

            {/* Subtle Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-25 pointer-events-none" />

            <div className="relative z-10 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                
                {/* Left Content Column */}
                <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                    
                    {/* Pulsing Badge */}
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider shadow-inner animate-fade-in">
                        <Sparkles className="w-3.5 h-3.5 animate-spin duration-3000" /> 
                        <span>Next-Gen Tech Platform</span>
                    </div>

                    {/* Main Title with Gradient Animation */}
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
                        Empowering Minds, <br />
                        <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent animate-gradient">
                            Accelerating Innovation.
                        </span>
                    </h1>

                    {/* Description */}
                    <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
                        Dive deep into modern engineering insights, real-time productivity workflows, and elite developer tools crafted to scale your ambitions.
                    </p>

                    {/* CTA Action Buttons */}
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                        <Link 
                            href="/explore" 
                            className="group relative px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/30 transition-all duration-300 transform hover:-translate-y-0.5 inline-flex items-center gap-2"
                        >
                            <span>Explore Platform</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        
                        <Link 
                            href="/documentation" 
                            className="px-6 py-3.5 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold rounded-xl border border-slate-700/80 transition-all duration-300 backdrop-blur-xs"
                        >
                            View Docs
                        </Link>
                    </div>

                </div>

                {/* Right Column: Floating Interactive Cards Animation */}
                <div className="lg:col-span-5 relative flex items-center justify-center">
                    
                    <div className="relative w-full max-w-sm h-80 flex items-center justify-center">
                        
                        {/* Central Glassmorphic Card */}
                        <div className="absolute w-64 p-6 bg-slate-900/90 border border-slate-700/80 rounded-3xl shadow-2xl backdrop-blur-md transform transition-transform hover:scale-105 duration-500 z-20">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                                    <Terminal className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-white text-sm font-bold">TechWave Core</h4>
                                    <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Live Sync Active
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 w-3/4 animate-pulse"></div>
                                </div>
                                <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                                    <span>Efficiency</span>
                                    <span className="text-emerald-400">98.4%</span>
                                </div>
                            </div>
                        </div>

                        {/* Floating Badge Top-Right */}
                        <div className="absolute -top-4 -right-4 p-3.5 bg-slate-900/80 border border-slate-700/80 rounded-2xl shadow-xl backdrop-blur-md flex items-center gap-3 animate-bounce [animation-duration:4s] z-30">
                            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                                <Zap className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-400 font-medium">Performance</p>
                                <p className="text-xs text-white font-bold">Lightning Fast</p>
                            </div>
                        </div>

                        {/* Floating Badge Bottom-Left */}
                        <div className="absolute -bottom-4 -left-4 p-3.5 bg-slate-900/80 border border-slate-700/80 rounded-2xl shadow-xl backdrop-blur-md flex items-center gap-3 animate-bounce [animation-duration:5s] [animation-delay:1s] z-30">
                            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                                <Shield className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-400 font-medium">Security</p>
                                <p className="text-xs text-white font-bold">Enterprise Grade</p>
                            </div>
                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
}