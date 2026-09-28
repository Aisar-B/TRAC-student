import React from 'react';

export default function Button({
  children,
  className = "",
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  fullWidth = false,
  icon = null,
  iconPosition = "left",
  onClick,
  type = "button",
  ...props
}) {

  const baseStyles = "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "trac-button focus:ring-[#1B5E20]",
    secondary: "trac-button-outline focus:ring-green-400",
    outline: "trac-button-outline focus:ring-[#1B5E20]",
    danger: "trac-button focus:ring-red-500",
    success: "trac-button focus:ring-green-500",
    warning: "trac-button focus:ring-amber-400",
    ghost: "trac-button-outline focus:ring-green-400",
    gold: "trac-button focus:ring-amber-400"
  };

  const sizes = {
    xs: "px-3 py-1.5 text-xs",
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-2.5 text-base",
    lg: "px-8 py-3 text-lg",
    xl: "px-10 py-4 text-xl"
  };

  const widthStyle = fullWidth ? "w-full" : "";

  const LoadingSpinner = () => (
    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`}
      {...props}
    >
      {loading && <LoadingSpinner />}
      {!loading && icon && iconPosition === "left" && icon}
      {children}
      {!loading && icon && iconPosition === "right" && icon}
    </button>
  );
}
