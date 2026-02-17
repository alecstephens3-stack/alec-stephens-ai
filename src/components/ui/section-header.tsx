import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  label: string;
  heading: string;
  description?: string;
  align?: "left" | "center";
  light?: boolean;
}

export function SectionHeader({
  label,
  heading,
  description,
  align = "center",
  light = false,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-12 md:mb-16",
        align === "center" && "text-center",
        align === "left" && "text-left"
      )}
    >
      <div
        className={cn(
          "mb-4 flex items-center gap-3",
          align === "center" && "justify-center"
        )}
      >
        <div className="h-1 w-8 rounded-full bg-terracotta" />
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-terracotta">
          {label}
        </span>
      </div>
      <h2
        className={cn(
          "font-heading text-3xl font-bold md:text-4xl lg:text-5xl",
          light ? "text-white" : "text-black"
        )}
      >
        {heading}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-4 max-w-2xl text-lg",
            light ? "text-warm-gray" : "text-warm-gray",
            align === "center" && "mx-auto"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
