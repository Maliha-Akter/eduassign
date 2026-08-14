import React from 'react';
import { GraduationCap, Shield, Zap, Users, Target, CheckCircle2 } from 'lucide-react';

export default function AboutPage() {
    const values = [
        {
            icon: <Zap className="w-6 h-6" />,
            title: "Uncompromising Speed",
            description: "We optimize every query and UI transition to ensure instant assignment turn-ins and smooth grading workflows."
        },
        {
            icon: <Shield className="w-6 h-6" />,
            title: "Enterprise Security",
            description: "Role-based access tokens and strict authentication layers protect student records and academic submissions."
        },
        {
            icon: <Target className="w-6 h-6" />,
            title: "Clarity & Precision",
            description: "Designed specifically to minimize cognitive overhead, helping teachers grade faster and students focus on learning."
        },
        {
            icon: <Users className="w-6 h-6" />,
            title: "Community Driven",
            description: "Built with continuous feedback from academic environments to meet real-world classroom challenges."
        }
    ];

    return (
        <div className="min-h-screen bg-[#F9FAFB] py-16 px-4 sm:px-6 lg:px-8 text-[#374151]">
            <div className="max-w-6xl mx-auto space-y-20">
                
                {/* Hero / Header */}
                <div className="text-center max-w-3xl mx-auto space-y-4">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-green-50 border border-green-200 text-[#15803D] text-xs font-bold uppercase tracking-wider">
                        <GraduationCap className="w-4 h-4" /> About EduAssign
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-[#374151]">
                        Transforming the Future of <span className="text-[#15803D]">Academic Management</span>
                    </h1>
                    <p className="text-gray-500 text-base sm:text-lg leading-relaxed">
                        EduAssign is built to bridge the gap between rigorous coursework and seamless digital collaboration. We empower educational institutions with tools designed for modern learning.
                    </p>
                </div>

                {/* Mission Statement Box */}
                <div className="bg-white border border-gray-200 rounded-3xl p-8 sm:p-12 shadow-xs grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <div className="space-y-4">
                        <h2 className="text-2xl sm:text-3xl font-black text-[#374151]">Our Mission</h2>
                        <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
                            Education shouldn't be bogged down by messy paperwork and disorganized submission trackers. Our goal is to automate the mundane administrative tasks so educators can focus on teaching and students can focus on building their future.
                        </p>
                        <ul className="space-y-2 pt-2 text-sm font-semibold text-[#374151]">
                            <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-[#15803D]" /> Real-time feedback and rubric mapping</li>
                            <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-[#15803D]" /> Role-tailored dashboards for instant clarity</li>
                            <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-[#15803D]" /> Secure cryptographic token session handling</li>
                        </ul>
                    </div>
                    <div className="bg-green-50 border border-green-100 rounded-2xl p-8 flex flex-col justify-center space-y-6">
                        <div className="space-y-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-[#15803D]">Platform Statistics</span>
                            <h3 className="text-3xl font-black text-[#374151]">Engineered for Reliability</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-2">
                            <div className="bg-white p-4 rounded-xl shadow-2xs border border-gray-100">
                                <p className="text-2xl font-black text-[#15803D]">99.9%</p>
                                <p className="text-xs text-gray-500 font-medium">Uptime Guarantee</p>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow-2xs border border-gray-100">
                                <p className="text-2xl font-black text-[#15803D]">100%</p>
                                <p className="text-xs text-gray-500 font-medium">Secure Workspaces</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Core Values Grid */}
                <div className="space-y-10">
                    <div className="text-center">
                        <h2 className="text-2xl sm:text-3xl font-black text-[#374151]">Our Core Values</h2>
                        <p className="text-gray-500 text-sm mt-2">The guiding principles behind every feature we ship.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((val, idx) => (
                            <div key={idx} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs hover:border-[#15803D]/40 transition-colors">
                                <div className="w-10 h-10 rounded-xl bg-green-50 text-[#15803D] flex items-center justify-center mb-4">
                                    {val.icon}
                                </div>
                                <h3 className="text-base font-bold text-[#374151] mb-2">{val.title}</h3>
                                <p className="text-xs text-gray-500 leading-relaxed">{val.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}