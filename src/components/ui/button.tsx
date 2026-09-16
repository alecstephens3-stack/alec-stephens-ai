import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "ghost";

/**
 * The Lens button: an ink pill that warms to terracotta and lifts on hover
 * (primary), or a translucent glass pill (ghost). Never a gradient fill.
 */
export function ButtonLink({
  href,
  variant = "primary",
  children,
  className,
  external = false,
  download = false,
}: {
  href: string;
  variant?: ButtonVariant;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
  /** A file on this site (a PDF, say): a plain anchor with the download attribute. */
  download?: boolean;
}) {
  const classes = cn("sai-btn", variant, className);
  if (download) {
    return (
      <a href={href} className={classes} download>
        {children}
      </a>
    );
  }
  if (external) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}

export function Button({
  variant = "primary",
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
}) {
  return (
    <button className={cn("sai-btn", variant, className)} {...props}>
      {children}
    </button>
  );
}
