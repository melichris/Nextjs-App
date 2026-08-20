import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverable?: boolean;
}

export function Card({ children, hoverable = false, className = "", ...props }: CardProps) {
  return (
    <div
      className={`surface-card ${hoverable ? "hover:shadow-sm hover:border-primary-brand/30" : ""} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
