"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  LogOut,
  User as UserIcon,
  GraduationCap,
  LayoutDashboard,
} from "lucide-react";
import { toast } from "react-toastify";

import { authClient } from "@/app/lib/auth-client";
import { type User } from "@/app/lib/auth";

interface NavLink {
  label: string;
  href: string;
}

export default function Navbar({ animated }: { animated?: boolean } = {}) {
  const pathname = usePathname();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [imageError, setImageError] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user as User | undefined;
  const isLoggedIn = !!user;

  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setEntered(!!animated);
    });
    return () => cancelAnimationFrame(id);
  }, [animated]);

  const getDashboardPath = (role?: string) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "/dashboard/admin";
      case "teacher":
        return "/dashboard/teacher";
      case "student":
        return "/dashboard/student";
      default:
        return "/dashboard";
    }
  };

  const navLinks: NavLink[] = [
    { label: "Home", href: "/" },
    { label: "Features", href: "/FeaturesPage" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "About", href: "/about" },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;

      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setIsProfileDropdownOpen(false);
      }

      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        !target.closest(".hamburger-btn")
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setIsProfileDropdownOpen(false);
    setIsOpen(false);

    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Logged out successfully!");
            setIsLoggingOut(false);
            router.push("/");
          },
          onError: () => {
            toast.error("Failed to log out cleanly.");
            setIsLoggingOut(false);
          },
        },
      });
    } catch (error) {
      toast.error("Failed to log out cleanly.");
      setIsLoggingOut(false);
    }
  };

  if (isPending) {
    return (
      <div className="w-full h-20 bg-[#F9FAFB] border-b border-gray-200 sticky top-0 z-60 animate-pulse" />
    );
  }

  const animatedClass = animated
    ? `${entered ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-8 scale-95"} transition-all duration-700 ease-out`
    : "";

  return (
    <nav className={`w-full bg-[#F9FAFB]/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-60 shadow-sm text-[#374151] ${animatedClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">

          {/* Brand Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-xl font-bold flex items-center gap-2 group">
              <div className="bg-[#15803D] text-[#F59E0B] p-1.5 rounded-lg shadow-sm transition-transform group-hover:scale-105">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-[#374151] tracking-tight text-xl font-black">
                Edu<span className="text-[#15803D]">Assign</span>
              </span>
            </Link>
          </div>

          {/* DESKTOP Main Links */}
          <div className="hidden lg:flex space-x-2 items-center">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "text-[#15803D] bg-green-50/80 font-bold"
                      : "text-[#374151] hover:text-[#15803D] hover:bg-gray-100"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right Side: Auth / Profile */}
          <div className="flex items-center space-x-4">
            {isLoggingOut ? (
              <div className="flex items-center justify-center h-10 w-10">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#15803D] border-t-transparent"></span>
              </div>
            ) : isLoggedIn ? (

              /* Logged In: Profile Dropdown with Dashboard */
              <div className="relative hidden lg:block" ref={dropdownRef}>
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2 focus:outline-none p-1 rounded-full hover:bg-gray-200/50 transition-colors"
                >
                  <div className="h-10 w-10 rounded-full border border-gray-200 shadow-sm bg-[#15803D] text-white flex items-center justify-center font-bold overflow-hidden">
                    {user?.image && !imageError ? (
                      <img
                        src={user.image}
                        alt="User profile"
                        className="h-full w-full object-cover"
                        onError={() => setImageError(true)}
                      />
                    ) : (
                      <span>{user?.name?.charAt(0).toUpperCase() || <UserIcon className="w-5 h-5" />}</span>
                    )}
                  </div>
                  <div className="text-left hidden xl:block mr-2">
                    <p className="text-xs font-bold text-[#374151] truncate max-w-[100px]">{user?.name}</p>
                    <p className="text-[10px] uppercase text-[#15803D] font-bold">{user?.role || "User"}</p>
                  </div>
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 top-14 mt-2 w-56 rounded-xl shadow-xl py-1 bg-white ring-1 ring-black/5 z-50 border border-gray-100 overflow-hidden">
                    <Link
                      href={getDashboardPath(user?.role)}
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center w-full text-left px-4 py-2.5 text-sm text-[#374151] hover:bg-gray-50 font-semibold transition-colors border-b border-gray-100"
                    >
                      <LayoutDashboard className="w-4 h-4 mr-2.5 text-[#15803D]" /> Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-semibold transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-2.5" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (

              /* Logged Out: Auth Buttons */
              <div className="hidden lg:flex items-center space-x-3">
                <Link
                  href="/auth/login"
                  className="text-sm font-semibold text-[#374151] hover:text-[#15803D] px-4 py-2 rounded-lg transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="text-sm font-bold text-white bg-[#15803D] hover:bg-green-700 px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg active:scale-[0.98] transition-all"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Hamburger Trigger (Mobile) */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="hamburger-btn text-[#374151] hover:text-[#15803D] hover:bg-gray-100 p-2 rounded-lg focus:outline-none transition-colors"
                aria-label="Toggle Menu"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 shadow-xl pb-6" ref={menuRef}>
          <div className="px-4 pt-4 pb-2 space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-base font-medium transition-all ${
                    isActive
                      ? "text-[#15803D] bg-green-50 font-bold"
                      : "text-[#374151] hover:text-[#15803D] hover:bg-gray-50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="px-4 border-t border-gray-100 pt-4 mt-2">
            {isLoggedIn ? (
              <div className="space-y-1">
                <Link
                  href={getDashboardPath(user?.role)}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center w-full text-left px-4 py-3 rounded-lg text-base font-semibold text-[#374151] hover:bg-gray-50"
                >
                  <LayoutDashboard className="w-5 h-5 mr-3 text-[#15803D]" /> Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full text-left px-4 py-3 rounded-lg text-base font-bold text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-5 h-5 mr-3" /> Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-3 pt-2">
                <Link
                  href="/auth/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center text-base font-semibold text-[#374151] border border-gray-300 bg-white py-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center text-base font-bold text-white bg-[#15803D] py-3 rounded-xl shadow-md active:scale-95 transition-all"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}