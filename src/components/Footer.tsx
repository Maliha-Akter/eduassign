import React from "react";
import Link from "next/link";
import { GraduationCap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#F9FAFB] border-t border-gray-200 text-[#374151] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        
        {/* Brand Section */}
        <div className="space-y-4 md:col-span-1">
          <Link href="/" className="text-xl font-bold flex items-center gap-2 group inline-flex">
            <div className="bg-[#15803D] text-[#F59E0B] p-1.5 rounded-lg shadow-sm transition-transform group-hover:scale-105">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="text-[#374151] tracking-tight text-xl font-black">
              Edu<span className="text-[#15803D]">Assign</span>
            </span>
          </Link>
          <p className="text-sm text-gray-500 leading-relaxed">
            Streamlining class assignments, automated grading insights, and frictionless academic collaboration.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#15803D] mb-4">Navigation</h4>
          <ul className="space-y-2 text-sm font-medium">
            <li><Link href="/" className="hover:text-[#15803D] transition-colors">Home</Link></li>
            <li><Link href="/FeaturesPage" className="hover:text-[#15803D] transition-colors">Features</Link></li>
            <li><Link href="/how-it-works" className="hover:text-[#15803D] transition-colors">How It Works</Link></li>
            <li><Link href="/about" className="hover:text-[#15803D] transition-colors">About</Link></li>
            <li><Link href="/contact" className="hover:text-[#15803D] transition-colors">Contact</Link></li>
          </ul>
        </div>

        {/* Resources & Support */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#15803D] mb-4">Resources</h4>
          <ul className="space-y-2 text-sm font-medium">
            <li><Link href="/auth/login" className="hover:text-[#15803D] transition-colors">Login Portal</Link></li>
            <li><Link href="/auth/register" className="hover:text-[#15803D] transition-colors">Create Account</Link></li>
            <li><a href="#" className="hover:text-[#15803D] transition-colors">Documentation</a></li>
            <li><a href="#" className="hover:text-[#15803D] transition-colors">Support Center</a></li>
          </ul>
        </div>

        {/* Legal & Policy */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#15803D] mb-4">Legal</h4>
          <ul className="space-y-2 text-sm font-medium">
            <li><a href="#" className="hover:text-[#15803D] transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-[#15803D] transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-[#15803D] transition-colors">Cookie Preferences</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
        <p>&copy; {new Date().getFullYear()} EduAssign. All rights reserved.</p>
        <p className="mt-2 sm:mt-0 font-medium text-[#15803D]">Designed for Modern Education</p>
      </div>
    </footer>
  );
}