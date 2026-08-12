"use client";

import { useState, Suspense } from "react";
import { Button, Link, TextField, Label, InputGroup, Input } from "@heroui/react";
import { Eye, EyeOff, AtSign, Lock, User, RefreshCw, GraduationCap, School, Image as ImageIcon } from "lucide-react";
import { authClient } from "@/app/lib/auth-client";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";
import { FcGoogle } from "react-icons/fc";

type Role = "student" | "teacher";

function RegisterForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/";

    // Core fields
    const [role, setRole] = useState<Role>("student");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Photo fields
    const [image, setImage] = useState("");
    const [fileName, setFileName] = useState("");

    // Student fields
    const [studentClass, setStudentClass] = useState("");

    // Teacher fields
    const [primarySubject, setPrimarySubject] = useState("");
    const [qualification, setQualification] = useState("");

    // Form state
    const [errors, setErrors] = useState<Record<string, string | null>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isConfirmVisible, setIsConfirmVisible] = useState(false);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (name.trim().length < 2) newErrors.name = "Name must be at least 2 characters.";
        if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Please enter a valid email address.";

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
        if (!passwordRegex.test(password)) {
            newErrors.password = "Must be 6+ chars, 1 number, 1 upper & lower case.";
        }

        if (password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match.";
        }

        if (role === "student" && !studentClass.trim()) {
            newErrors.studentClass = "Please specify your Class/Grade.";
        }

        if (role === "teacher") {
            if (!primarySubject) newErrors.primarySubject = "Please select your primary subject.";
            if (!qualification) newErrors.qualification = "Please select your highest qualification.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFileName(file.name);
        setIsLoading(true);
        const formData = new FormData();
        formData.append("image", file);

        try {
            const response = await fetch("/api/upload", { method: "POST", body: formData });
            const data = await response.json();

            if (data.success) {
                setImage(data.data.url);
                setFileName("");
                toast.success("Profile picture uploaded!");
            } else {
                toast.error("Upload failed: " + (data.message || "Unknown error"));
                setFileName("");
            }
        } catch (err: unknown) {
            toast.error("Failed to upload the image.");
            setFileName("");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);

        const registrationPayload = {
            email,
            password,
            name,
            role,
            image: image || "", // Added image payload
            ...(role === "student" && { class: studentClass }),
            ...(role === "teacher" && {
                primarySubject,
                qualification,
            }),
        };

        try {
            const { error: authError } = await authClient.signUp.email(registrationPayload);

            if (authError) {
                toast.error(authError.message || "Signup failed.");
            } else {
                toast.success("Account created successfully!");
                await authClient.signOut();
                const redirectTo = `/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`;
                router.push(redirectTo);
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "An unexpected error occurred.";
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignup = async () => {
        try {
            await authClient.signIn.social({
                provider: "google",
                callbackURL: window.location.origin + callbackUrl,
            });
        } catch (err: unknown) {
            toast.error("Failed to authenticate with Google.");
        }
    };

    return (
        <div className="w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl bg-white border border-slate-200 p-8 sm:p-10 my-8">
            <div className="pb-6 text-center sm:text-left">
                <h1 className="text-3xl font-black text-[#0F172A] tracking-tight">Create Account</h1>
                <p className="text-sm text-slate-500 mt-1">Join the portal to start managing assignments.</p>
            </div>

            <form onSubmit={handleSignup} className="flex flex-col gap-4">
                {/* Role Selection Cards */}
                <div className="flex flex-col gap-1.5">
                    <Label className="text-xs font-semibold text-slate-700">Choose Your Role</Label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => setRole("student")}
                            className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border-2 transition-all ${role === "student"
                                    ? "border-amber-500 bg-amber-50/50 text-amber-900 shadow-sm"
                                    : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300"
                                }`}
                        >
                            <GraduationCap className={role === "student" ? "text-amber-600" : "text-slate-400"} size={24} />
                            <span className="text-sm font-bold mt-1">🎓 Student</span>
                            <span className="text-[10px] text-slate-500">Submit assignments</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setRole("teacher")}
                            className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border-2 transition-all ${role === "teacher"
                                    ? "border-amber-500 bg-amber-50/50 text-amber-900 shadow-sm"
                                    : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300"
                                }`}
                        >
                            <School className={role === "teacher" ? "text-amber-600" : "text-slate-400"} size={24} />
                            <span className="text-sm font-bold mt-1">👨‍🏫 Teacher</span>
                            <span className="text-[10px] text-slate-500">Create assignments</span>
                        </button>
                    </div>
                </div>

                {/* Common Fields */}
                <TextField isRequired name="name" className="flex flex-col gap-1.5">
                    <Label className="text-xs font-medium text-slate-600">Full Name</Label>
                    <InputGroup className={`flex items-center gap-2 border rounded-xl px-3 bg-slate-50 focus-within:border-amber-500 transition-colors ${errors.name ? "border-red-500" : "border-slate-200"}`}>
                        <User className="text-slate-400" size={16} />
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="John Doe"
                            className="w-full bg-transparent py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                        />
                    </InputGroup>
                    {errors.name && <p className="text-[10px] text-red-500 mt-0.5">{errors.name}</p>}
                </TextField>

                <TextField isRequired name="email" className="flex flex-col gap-1.5">
                    <Label className="text-xs font-medium text-slate-600">Email Address</Label>
                    <InputGroup className={`flex items-center gap-2 border rounded-xl px-3 bg-slate-50 focus-within:border-amber-500 transition-colors ${errors.email ? "border-red-500" : "border-slate-200"}`}>
                        <AtSign className="text-slate-400" size={16} />
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="john@example.com"
                            className="w-full bg-transparent py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                        />
                    </InputGroup>
                    {errors.email && <p className="text-[10px] text-red-500 mt-0.5">{errors.email}</p>}
                </TextField>

                {/* Photo Upload Field */}
                <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center">
                        <Label className="text-xs font-medium text-slate-600">Profile Picture (Optional)</Label>
                        {/* Updated helper text here */}
                        <span className="text-[9px] text-slate-400">URL must start with http:// or https://</span>
                    </div>
                    <InputGroup className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 bg-slate-50 focus-within:border-amber-500 transition-colors">
                        <ImageIcon className="text-slate-400" size={16} />
                        <Input
                            placeholder="https://example.com/avatar.png"
                            type="url"
                            pattern="^https?://.*" // Added HTML5 pattern validation
                            title="URL must start with http:// or https://" // Added tooltip for validation
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            className="w-full bg-transparent py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                        />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                            id="file-upload"
                            disabled={isLoading}
                        />
                        <label
                            htmlFor="file-upload"
                            className="cursor-pointer text-amber-600 text-xs font-bold whitespace-nowrap hover:text-amber-700 transition-colors"
                        >
                            {isLoading && fileName ? "Uploading..." : "Upload"}
                        </label>
                    </InputGroup>
                </div>

                <TextField isRequired name="password" className="flex flex-col gap-1.5">
                    <Label className="text-xs font-medium text-slate-600">Password</Label>
                    <InputGroup className={`flex items-center gap-2 border rounded-xl px-3 bg-slate-50 focus-within:border-amber-500 transition-colors ${errors.password ? "border-red-500" : "border-slate-200"}`}>
                        <Lock className="text-slate-400" size={16} />
                        <Input
                            type={isVisible ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-transparent py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                        />
                        <button type="button" onClick={() => setIsVisible(!isVisible)} className="text-slate-400 focus:outline-none">
                            {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </InputGroup>
                    {errors.password && <p className="text-[10px] text-red-500 mt-0.5">{errors.password}</p>}
                </TextField>

                <TextField isRequired name="confirmPassword" className="flex flex-col gap-1.5">
                    <Label className="text-xs font-medium text-slate-600">Confirm Password</Label>
                    <InputGroup className={`flex items-center gap-2 border rounded-xl px-3 bg-slate-50 focus-within:border-amber-500 transition-colors ${errors.confirmPassword ? "border-red-500" : "border-slate-200"}`}>
                        <Lock className="text-slate-400" size={16} />
                        <Input
                            type={isConfirmVisible ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-transparent py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                        />
                        <button type="button" onClick={() => setIsConfirmVisible(!isConfirmVisible)} className="text-slate-400 focus:outline-none">
                            {isConfirmVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </InputGroup>
                    {errors.confirmPassword && <p className="text-[10px] text-red-500 mt-0.5">{errors.confirmPassword}</p>}
                </TextField>

                {/* Conditional Fields: Student */}
                {role === "student" && (
                    <TextField isRequired name="class" className="flex flex-col gap-1.5">
                        <Label className="text-xs font-medium text-slate-600">Class / Grade</Label>
                        <InputGroup className={`flex items-center gap-2 border rounded-xl px-3 bg-slate-50 focus-within:border-amber-500 transition-colors ${errors.studentClass ? "border-red-500" : "border-slate-200"}`}>
                            <Input
                                value={studentClass}
                                onChange={(e) => setStudentClass(e.target.value)}
                                placeholder="e.g., Grade 10 or Class 12"
                                className="w-full bg-transparent py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                            />
                        </InputGroup>
                        {errors.studentClass && <p className="text-[10px] text-red-500 mt-0.5">{errors.studentClass}</p>}
                    </TextField>
                )}

                {/* Conditional Fields: Teacher */}
                {role === "teacher" && (
                    <div className="flex flex-col gap-4 p-4 rounded-2xl bg-amber-50/40 border border-amber-200/60">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-amber-800">Teacher Details</h2>

                        <div className="flex flex-col gap-1.5">
                            <Label className="text-xs font-medium text-slate-600">Primary Subject</Label>
                            <select
                                value={primarySubject}
                                onChange={(e) => setPrimarySubject(e.target.value)}
                                className={`w-full border rounded-xl px-3 py-2 bg-white text-sm text-slate-900 outline-none focus:border-amber-500 transition-colors ${errors.primarySubject ? "border-red-500" : "border-slate-200"}`}
                            >
                                <option value="" disabled>Select Subject</option>
                                <option value="Mathematics">Mathematics</option>
                                <option value="Physics">Physics</option>
                                <option value="Chemistry">Chemistry</option>
                                <option value="Biology">Biology</option>
                                <option value="ICT">ICT</option>
                                <option value="English">English</option>
                                <option value="Bangla">Bangla</option>
                                <option value="Accounting">Accounting</option>
                                <option value="Finance">Finance</option>
                            </select>
                            {errors.primarySubject && <p className="text-[10px] text-red-500 mt-0.5">{errors.primarySubject}</p>}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label className="text-xs font-medium text-slate-600">Highest Qualification</Label>
                            <select
                                value={qualification}
                                onChange={(e) => setQualification(e.target.value)}
                                className={`w-full border rounded-xl px-3 py-2 bg-white text-sm text-slate-900 outline-none focus:border-amber-500 transition-colors ${errors.qualification ? "border-red-500" : "border-slate-200"}`}
                            >
                                <option value="" disabled>Select Qualification</option>
                                <option value="Bachelor's">Bachelor's</option>
                                <option value="Master's">Master's</option>
                                <option value="MPhil">MPhil</option>
                                <option value="PhD">PhD</option>
                            </select>
                            {errors.qualification && <p className="text-[10px] text-red-500 mt-0.5">{errors.qualification}</p>}
                        </div>
                    </div>
                )}

                <Button
                    type="submit"
                    className="w-full h-11 mt-2 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-amber-500 to-orange-600 shadow-md shadow-orange-950/10 hover:opacity-95 active:scale-[0.99] transition-all"
                    isDisabled={isLoading}
                >
                    {isLoading ? "Registering..." : `Register as ${role === "teacher" ? "Teacher" : "Student"}`}
                </Button>

                <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t border-slate-200"></div>
                    <span className="flex-shrink-0 mx-4 text-xs font-medium text-slate-400">OR</span>
                    <div className="flex-grow border-t border-slate-200"></div>
                </div>

                <Button
                    type="button"
                    onClick={handleGoogleSignup}
                    className="w-full h-11 rounded-xl font-medium text-sm text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm"
                    isDisabled={isLoading}
                >
                    <FcGoogle size={20} />
                    Sign up with Google
                </Button>

                <p className="text-center text-xs text-slate-500 mt-2">
                    Already have an account?{" "}
                    <Link
                        href={`/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}
                        className="text-amber-600 font-semibold hover:underline"
                    >
                        Log in
                    </Link>
                </p>
            </form>
        </div>
    );
}

export default function RegisterComponent() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[#F8FAFC]">
            <Suspense
                fallback={
                    <div className="flex items-center justify-center">
                        <RefreshCw className="animate-spin text-amber-500" size={32} />
                    </div>
                }
            >
                <RegisterForm />
            </Suspense>
        </div>
    );
}