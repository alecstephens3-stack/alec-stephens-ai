import { cn } from "@/lib/utils";

interface MetricProps {
  value: string;
  label: string;
  className?: string;
}

export function Metric({ value, label, className }: MetricProps) {
  return (
    <div className={cn("text-center", className)}>
      <div className="font-heading text-4xl font-bold text-terracotta md:text-5xl">
        {value}
      </div>
      <div className="mt-1 text-sm font-medium text-white/70">{label}</div>
    </div>
  );
}
