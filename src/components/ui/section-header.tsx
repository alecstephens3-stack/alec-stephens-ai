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
      {/* Label with double rule */}
      <div
        className={cn(
          "mb-6 flex items-center gap-3",
          align === "center" && "justify-center"
        )}
      >
        <span className="block h-px w-6 bg-terracotta" />
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-terracotta">
          {label}
        </span>
        <span className="block h-px w-6 bg-terracotta" />
      </div>

      <h2
        className={cn(
          "font-heading font-bold leading-tight tracking-tight",
          "text-4xl md:text-5xl lg:text-[3.5rem]",
          light ? "text-white" : "text-black"
        )}
      >
        {heading}
      </h2>

      {description && (
        <p
          className={cn(
            "mt-5 max-w-2xl text-lg leading-relaxed text-warm-gray",
            align === "center" && "mx-auto"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
