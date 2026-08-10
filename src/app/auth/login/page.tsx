"use client";

import React, { useState, Suspense } from "react";
import { Button, Link, TextField, Label, InputGroup, Input } from "@heroui/react";
import { Eye, EyeOff, AtSign, Lock, RefreshCw } from "lucide-react";
import { authClient } from "@/app/lib/auth-client";
import { type User } from "@/app/lib/auth";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";
import { FcGoogle } from "react-icons/fc";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const { error } = await authClient.signIn.email({
                email,
                password,
                callbackURL: callbackUrl,
            });

            if (error) {
                toast.error(error.message || "Login failed.");
            } else {
                toast.success("Welcome back!");
                const sessionResult = await authClient.getSession();
                const userRole = (sessionResult?.data?.user as User)?.role;

                let targetDestination = callbackUrl;
                
                // Route to appropriate dashboard based on educational role
                if (callbackUrl === "/dashboard" || callbackUrl === "/") {
                    if (userRole === "admin") targetDestination = "/dashboard";
                    else if (userRole === "teacher") targetDestination = "/dashboard";
                    else if (userRole === "student") targetDestination = "/dashboard";
                    else targetDestination = "/dashboard";
                }
                
                window.location.href = targetDestination;
            }
        } catch (err) {
            toast.error("An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDemoLogin = async () => {
        setIsLoading(true);
        setEmail("student@eduassign.com");
        setPassword("Demo123!");
        await new Promise(resolve => setTimeout(resolve, 100));
        try {
            const { error } = await authClient.signIn.email({
                email: "student@eduassign.com",
                password: "Demo123!",
                callbackURL: "/",
            });
            if (error) toast.error("Demo login failed: " + error.message);
            else window.location.href = "/dashboard";
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        await authClient.signIn.social({
            provider: "google",
            callbackURL: `${window.location.origin}${callbackUrl}`
        });
    };

    return (
        <div className="w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl bg-white border border-gray-200 p-8 sm:p-10">
            <div className="pb-8 text-center sm:text-left">
                <h1 className="text-3xl font-black text-[#374151] tracking-tight">Welcome Back</h1>
                <p className="text-sm text-gray-500 mt-2">Continue your journey toward academic excellence.</p>
            </div>

            <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <TextField isRequired name="email" className="flex flex-col gap-1.5">
                    <Label className="text-xs font-bold text-[#374151]">Email Address</Label>
                    <InputGroup className="flex items-center gap-2 border border-gray-300 rounded-xl px-3 bg-[#F9FAFB] focus-within:border-[#15803D] focus-within:ring-1 focus-within:ring-[#15803D]/20 transition-all">
                        <AtSign className="text-gray-400" size={16} />
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-transparent py-2.5 text-sm text-[#374151] outline-none placeholder:text-gray-400"
                            placeholder="student@university.edu"
                        />
                    </InputGroup>
                </TextField>

                <TextField isRequired name="password" className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center">
                        <Label className="text-xs font-bold text-[#374151]">Password</Label>
                        <Link href="/auth/ForgotPassword" className="text-[11px] font-semibold text-[#15803D] hover:text-[#F59E0B] transition-colors hover:underline">
                            Forgot password?
                        </Link>
                    </div>
                    <InputGroup className="flex items-center gap-2 border border-gray-300 rounded-xl px-3 bg-[#F9FAFB] focus-within:border-[#15803D] focus-within:ring-1 focus-within:ring-[#15803D]/20 transition-all">
                        <Lock className="text-gray-400" size={16} />
                        <Input
                            type={isVisible ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-transparent py-2.5 text-sm text-[#374151] outline-none placeholder:text-gray-400"
                            placeholder="••••••••"
                        />
                        <button type="button" onClick={toggleVisibility} className="text-gray-400 hover:text-[#15803D] transition-colors focus:outline-none">
                            {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </InputGroup>
                </TextField>

                <Button
                    type="submit"
                    isDisabled={isLoading}
                    className="w-full h-11 mt-2 rounded-xl font-bold text-sm text-white bg-[#15803D] hover:bg-green-700 shadow-md shadow-[#15803D]/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                >
                    {isLoading ? <RefreshCw className="animate-spin" size={16} /> : "Log In"}
                </Button>
                
                <Button
                    type="button"
                    onClick={handleDemoLogin}
                    isDisabled={isLoading}
                    className="w-full h-11 rounded-xl font-semibold text-sm text-[#374151] border border-gray-200 bg-white hover:bg-green-50 hover:border-[#15803D]/30 hover:text-[#15803D] transition-all"
                >
                    Login as Demo Student
                </Button>
            </form>

            <div className="mt-6 flex flex-col gap-3">
                <div className="relative flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <span className="relative bg-white px-3 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        or continue with
                    </span>
                </div>

                <Button
                    onClick={handleGoogleLogin}
                    className="w-full h-11 rounded-xl font-semibold text-sm bg-white border border-gray-200 text-[#374151] hover:bg-gray-50 flex items-center justify-center transition-all shadow-sm"
                >
                    <FcGoogle size={18} className="mr-2" /> Google
                </Button>

                <p className="text-center text-xs text-[#374151] mt-2 font-medium">
                    New here? <Link href={`/auth/register?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="text-[#15803D] hover:text-[#F59E0B] hover:underline font-bold ml-1 transition-colors">Create Account</Link>
                </p>
            </div>
        </div>
    );
}

export default function LoginComponent() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[#F9FAFB]">
            <Suspense
                fallback={
                    <div className="flex items-center justify-center">
                        <RefreshCw className="animate-spin text-[#15803D]" size={32} />
                    </div>
                }
            >
                <LoginForm />
            </Suspense>
        </div>
    );
}