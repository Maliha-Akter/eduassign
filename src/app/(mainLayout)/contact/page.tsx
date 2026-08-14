"use client";

import React, { useState } from 'react';
import { Mail, MapPin, Phone, Send, Sparkles, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-toastify';

export default function ContactPage() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate network request
        setTimeout(() => {
            setLoading(false);
            toast.success("Message sent successfully! We'll get back to you soon.");
            setFormData({ name: '', email: '', subject: '', message: '' });
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-[#F9FAFB] py-16 px-4 sm:px-6 lg:px-8 text-[#374151]">
            <div className="max-w-6xl mx-auto space-y-16">
                
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto space-y-4">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-green-50 border border-green-200 text-[#15803D] text-xs font-bold uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5" /> Get in Touch
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-[#374151]">
                        We'd Love to <span className="text-[#15803D]">Hear From You</span>
                    </h1>
                    <p className="text-gray-500 text-base sm:text-lg leading-relaxed">
                        Have questions about implementation, account roles, or partnership opportunities? Drop us a message below.
                    </p>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    
                    {/* Left Info Column */}
                    <div className="lg:col-span-5 space-y-8 bg-white border border-gray-200 rounded-3xl p-8 shadow-xs flex flex-col justify-between">
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-2xl font-black text-[#374151] mb-2">Contact Information</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">
                                    Fill out the form or reach out directly through our channels. Our support team is available during standard academic hours.
                                </p>
                            </div>

                            <div className="space-y-4 pt-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-green-50 text-[#15803D] flex items-center justify-center shrink-0">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email Support</p>
                                        <p className="text-sm font-semibold text-[#374151]">support@eduassign.edu</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-green-50 text-[#15803D] flex items-center justify-center shrink-0">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Office Location</p>
                                        <p className="text-sm font-semibold text-[#374151]">Dhanmondi, Dhaka, Bangladesh</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-green-50 text-[#15803D] flex items-center justify-center shrink-0">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Helpline</p>
                                        <p className="text-sm font-semibold text-[#374151]">+880 (2) 9876543</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-green-50/60 border border-green-100 rounded-2xl flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-[#15803D] shrink-0" />
                            <p className="text-xs font-semibold text-[#15803D]">Average response time is under 24 hours.</p>
                        </div>
                    </div>

                    {/* Right Form Column */}
                    <div className="lg:col-span-7 bg-white border border-gray-200 rounded-3xl p-8 sm:p-10 shadow-xs">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-gray-600">Your Name</label>
                                    <input 
                                        type="text" 
                                        required
                                        placeholder="Maliha Akter"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className="w-full px-4 py-3 bg-[#F9FAFB] border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#15803D] transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-gray-600">Email Address</label>
                                    <input 
                                        type="email" 
                                        required
                                        placeholder="maliha@university.edu"
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        className="w-full px-4 py-3 bg-[#F9FAFB] border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#15803D] transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-600">Subject</label>
                                <input 
                                    type="text" 
                                    required
                                    placeholder="How can we help you?"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                    className="w-full px-4 py-3 bg-[#F9FAFB] border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#15803D] transition-colors"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-600">Message</label>
                                <textarea 
                                    rows={5}
                                    required
                                    placeholder="Write your message here..."
                                    value={formData.message}
                                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                                    className="w-full px-4 py-3 bg-[#F9FAFB] border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#15803D] transition-colors resize-none"
                                />
                            </div>

                            <button 
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 bg-[#15803D] hover:bg-green-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                            >
                                {loading ? (
                                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                                ) : (
                                    <>
                                        <span>Send Message</span>
                                        <Send className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                </div>

            </div>
        </div>
    );
}