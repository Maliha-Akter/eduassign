"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Footer from "./Footer"; // Adjust path to your Footer component

export default function ConditionalFooter() {
  const pathname = usePathname() || "";

  // Hide footer on any dashboard route (matching the navbar logic)
  if (pathname.startsWith("/dashboard")) return null;

  return <Footer />;
}