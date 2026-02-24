import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover = true }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-white p-6",
        hover &&
          "transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/8 hover:border-terracotta/25",
        className
      )}
    >
      {children}
    </div>
  );
}
