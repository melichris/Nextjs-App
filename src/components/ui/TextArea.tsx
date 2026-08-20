import React from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className = "", ...props }: TextareaProps) {
  return (
    <div className="input-wrapper mb-4">
      {label && (
        <label className="block font-body text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
          {label}
        </label>
      )}
      <textarea
        className={`px-3 py-2 bg-bg-secondary text-text-primary border rounded-lg font-body text-sm placeholder:text-text-tertiary outline-hidden transition-all focus:border-primary-brand focus:ring-2 focus:ring-primary-brand-soft/50 min-h-[120px] resize-y ${error ? "border-color-error focus:border-color-error" : "border-border-primary"
          } ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 font-mono text-xs text-color-error">{error}</p>
      )}
    </div>
  );
}
