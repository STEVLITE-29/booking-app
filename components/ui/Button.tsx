import React from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "danger" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  className?: string;
};

const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
}: ButtonProps) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-sm font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-light disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

  const variants: Record<ButtonVariant, string> = {
    primary: "bg-blue-light text-white hover:bg-blue focus:ring-blue-light",
    secondary: "bg-accent text-blue hover:bg-accent/80 focus:ring-blue-light",
    ghost: "bg-background text-blue-light hover:bg-accent/80 focus:ring-blue-light",
    outline:
      "border border-gray-400 text-gray-light hover:bg-background-neutral",
    danger:
      "bg-error-background text-error-foreground hover:bg-error-background/80 focus:ring-error-foreground",
  };

  const sizes: Record<ButtonSize, string> = {
    sm: "h-[32px] px-3 text-sm",
    md: "h-[40px] px-4 text-sm",
    lg: "h-[48px] px-6 text-base",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
