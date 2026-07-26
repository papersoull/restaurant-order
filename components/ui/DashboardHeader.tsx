"use client";

import React, { useState, useEffect } from "react";

interface DashboardHeaderProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

export function DashboardHeader({ title, description, children }: DashboardHeaderProps) {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }) +
          " • " +
          now.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary-text tracking-tight">
            {title}
          </h1>
          {children}
        </div>
        <p className="text-secondary-text text-sm">{description}</p>
        <p className="text-xs text-muted-text">{currentTime}</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative">
          <svg className="w-5 h-5 text-secondary-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-danger rounded-full"></span>
        </div>
        <div className="flex items-center gap-2.5 pl-3 border-l border-default">
          <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center">
            <span className="text-xs font-semibold text-primary-color">AD</span>
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-primary-text">Admin</p>
            <p className="text-xs text-muted-text">Manager</p>
          </div>
        </div>
      </div>
    </div>
  );
}