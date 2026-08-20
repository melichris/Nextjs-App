import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = "", ...props }: InputProps) {
  return (
    /* Removed w-full from the outer box wrapper */
    <div className="input-wrapper mb-4">
      {label && (
        <label className="block font-body text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
          {label}
        </label>
      )}
      {/* Removed w-full from the HTML tag */}
      <input
        className={`px-3 py-2 bg-bg-secondary text-text-primary border rounded-lg font-body text-sm placeholder:text-text-tertiary outline-hidden transition-all focus:border-primary-brand focus:ring-2 focus:ring-primary-brand-soft/50 ${error ? "border-color-error focus:border-color-error" : "border-border-primary"
          } ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 font-mono text-xs text-color-error">{error}</p>
      )}
    </div>
  );
}
