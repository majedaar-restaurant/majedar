"use client";

export default function DiscountBadge({ label, size = "md", className = "" }) {
  if (!label) return null;

  const sizeClasses = {
    sm: "text-[9px] px-1.5 py-0.5",
    md: "text-[10px] sm:text-[11px] px-2 sm:px-2.5 py-0.5 sm:py-1",
    lg: "text-xs sm:text-sm px-3 py-1",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-extrabold uppercase tracking-wider rounded-md bg-[#FFF5EE] text-[#C85A17] border border-[#FED7AA] shadow-2xs ${sizeClasses[size] || sizeClasses.md} ${className}`}
    >
      <span>{label}</span>
    </span>
  );
}

