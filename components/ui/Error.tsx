import React from "react";

interface ErrorProps {
  title?: string;
  message: string;
}

export function Error({ title = "Something went wrong", message }: ErrorProps) {
  return (
    <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-red-700 shadow-sm">
      <h2 className="mb-2 text-lg font-semibold">{title}</h2>
      <p className="text-sm leading-6">{message}</p>
    </div>
  );
}
