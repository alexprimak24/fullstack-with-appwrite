import React from "react";

interface ButtonProps {
  children?: React.ReactNode;
  type?: string;
  bgColor?: string;
  textColor?: string;
  className?: string;
  onClick?: () => void;
}

function Button({
  children,
  type = "button",
  bgColor = "bg-blue-600",
  textColor = "text-white",
  className = "",
  onClick,
}: ButtonProps) {
  return (
    <button
      className={`px-4 py-2 rounded-lg ${bgColor} ${textColor} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
