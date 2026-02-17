import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-terracotta/10 px-3 py-1 text-xs font-semibold text-terracotta",
        className
      )}
    >
      {children}
    </span>
  );
}
