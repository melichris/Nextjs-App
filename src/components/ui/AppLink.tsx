import Link, { LinkProps } from "next/link";
import React from "react";

interface AppLinkProps extends LinkProps {
  children: React.ReactNode;
  variant?: "nav" | "footer" | "arrow";
  className?: string;
}

export function AppLink({
  children,
  variant = "nav",
  className = "",
  ...props
}: AppLinkProps) {

  const baseStyles = "transition-all font-medium text-sm";

  const variants = {
    nav: "text-ink hover:text-accent",
    footer: "text-ink-muted hover:text-ink text-xs font-mono",
    arrow: "inline-block font-mono text-xs uppercase tracking-wider text-accent hover:underline",
  };

  return (
    <Link className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </Link>
  );
}
