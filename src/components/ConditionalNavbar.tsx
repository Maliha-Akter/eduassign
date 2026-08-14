"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function ConditionalNavbar() {
  const pathname = usePathname() || "";

  // Hide navbar on any dashboard route
  if (pathname.startsWith("/dashboard")) return null;

  const animated = pathname === "/";

  return <Navbar animated={animated} />;
}
