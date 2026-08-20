import React from "react";

interface FormGroupProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export function FormGroup({ children, title, description }: FormGroupProps) {
  return (
    <div className="space-y-6">
      {(title || description) && (
        <div className="border-b border-border-primary pb-4">
          {title && <h2>{title}</h2>}
          {description && <p className="text-text-tertiary text-sm mt-1">{description}</p>}
        </div>
      )}
      <div className="space-y-4">{children}</div>
    </div>
  );
}
