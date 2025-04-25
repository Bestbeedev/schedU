import React from "react";

interface GradientWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  wrapperclassname?: string;
  children: React.ReactNode;
}

export default function GradientWrapper({
  children,
  wrapperclassname = "",
  className = "",
  ...props
}: GradientWrapperProps) {
  return (
    <div {...props} className={`relative ${className}`}>
      <div
        className={`absolute m-auto blur-[160px] ${wrapperclassname}`}
        style={{
          background:
            "linear-gradient(180deg, #7C3AED 0%, rgba(152, 103, 240, 0.984375) 0.01%, rgba(237, 78, 80, 0.2) 100%)",
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
