import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  className?: string;
  onClick?: () => void;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-terracotta text-white hover:bg-terracotta-light shadow-sm hover:shadow-md",
  secondary:
    "border border-border text-black hover:border-terracotta hover:text-terracotta bg-transparent",
  ghost: "text-warm-gray hover:text-terracotta bg-transparent",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  className,
  onClick,
}: ButtonProps) {
  const styles = cn(
    "inline-flex items-center justify-center rounded-lg font-heading font-semibold transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta",
    variantStyles[variant],
    sizeStyles[size],
    className
  );

  if (href) {
    return (
      <a href={href} className={styles}>
        {children}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={styles}>
      {children}
    </button>
  );
}
