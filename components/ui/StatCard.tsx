"use client";

import React, { useEffect, useState } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: { value: string; positive: boolean };
  color?: "primary" | "success" | "warning" | "info";
  isLoading?: boolean;
}

const colorVariants = {
  primary: {
    bg: "bg-primary-light",
    text: "text-primary-color",
    dot: "bg-primary",
  },
  success: {
    bg: "bg-success-light",
    text: "text-success",
    dot: "bg-success",
  },
  warning: {
    bg: "bg-warning-light",
    text: "text-warning",
    dot: "bg-warning",
  },
  info: {
    bg: "bg-info-light",
    text: "text-info",
    dot: "bg-info",
  },
};

export function StatCard({ title, value, subtitle, icon, trend, color = "primary", isLoading }: StatCardProps) {
  const [displayValue, setDisplayValue] = useState<string | number>(0);
  const colors = colorVariants[color];

  useEffect(() => {
    if (isLoading) return;
    const numValue = typeof value === "string" ? parseInt(value.replace(/[^0-9]/g, "")) : Number(value);
    if (isNaN(numValue)) {
      setDisplayValue(value);
      return;
    }
    
    // Animate count up
    let start = 0;
    const duration = 800;
    const step = Math.max(1, Math.floor(numValue / 30));
    const interval = setInterval(() => {
      start += step;
      if (start >= numValue) {
        setDisplayValue(value);
        clearInterval(interval);
      } else {
        const prefix = typeof value === "string" ? value.replace(/[0-9]/g, "") : "";
        setDisplayValue(prefix + start);
      }
    }, 30);
    
    return () => clearInterval(interval);
  }, [value, isLoading]);

  if (isLoading) {
    return (
      <div className="bg-card rounded-card-xl p-5 border border-default shadow-card animate-fade-in">
        <div className="skeleton h-4 w-24 mb-3" />
        <div className="skeleton h-8 w-32 mb-2" />
        <div className="skeleton h-3 w-20" />
      </div>
    );
  }

  return (
    <div className="bg-card rounded-card-xl p-5 border border-default shadow-card hover-lift cursor-default animate-fade-in">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-secondary-text font-medium">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold text-primary-text tracking-tight animate-count-up">
            {displayValue}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-text">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center ${colors.text}`}>
            {icon}
          </div>
        )}
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1.5">
          <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${trend.positive ? "text-success" : "text-danger"}`}>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={trend.positive ? "M5 10l7-7m0 0l7 7m-7-7v18" : "M19 14l-7 7m0 0l-7-7m7 7V3"} />
            </svg>
            {trend.value}
          </span>
          <span className="text-xs text-muted-text">vs last period</span>
        </div>
      )}
    </div>
  );
}