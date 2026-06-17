import { getInitials } from "@/lib/utils";

interface AvatarProps {
  name: string;
  color: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Avatar({
  name,
  color,
  size = "md",
  className = "",
}: AvatarProps) {
  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-11 w-11 text-sm",
  };
  return (
    <div
      className={`${sizes[size]} rounded-full flex items-center justify-center font-semibold text-white shrink-0 select-none ${className}`}
      style={{ backgroundColor: color, opacity: 0.9 }}
      aria-hidden="true"
    >
      {getInitials(name)}
    </div>
  );
}
