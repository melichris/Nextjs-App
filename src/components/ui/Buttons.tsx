import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export function Button({ children, variant = "primary", className = "", ...props }: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg text-sm transition-all px-4 py-2.5 cursor-pointer";

  const variants = {
    // Uses your brand tokens cleanly!
    primary: "bg-primary-brand text-text-inverse hover:bg-primary-brand-hover",
    secondary: "bg-bg-secondary text-text-primary border border-border-primary hover:bg-bg-tertiary",
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
