import Image from "next/image";

export default function Logo({
  variant = "full",
  className = "h-10 w-auto",
  alt = "Majedaar Restaurant",
  priority = false,
  ...props
}) {
  const isMark = variant === "mark";

  const src = isMark ? "/brand/logo-mark.svg" : "/brand/logo-full.svg";
  const intrinsicWidth = isMark ? 152 : 626;
  const intrinsicHeight = isMark ? 215 : 286;

  return (
    <Image
      src={src}
      alt={alt}
      width={intrinsicWidth}
      height={intrinsicHeight}
      priority={priority}
      className={`select-none object-contain ${className}`}
      {...props}
    />
  );
}
