"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-page">
      <Sidebar currentPath={pathname} />
      <div className="pl-[260px] transition-all duration-300">
        <div className="max-w-[1400px] mx-auto px-6 py-6 sm:px-8 lg:px-10">
          {children}
        </div>
      </div>
    </div>
  );
}