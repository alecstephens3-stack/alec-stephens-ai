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
          "transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_10px_40px_rgba(220,104,67,0.10),0_4px_16px_rgba(0,0,0,0.06)] hover:border-terracotta/40",
        className
      )}
    >
      {children}
    </div>
  );
}
