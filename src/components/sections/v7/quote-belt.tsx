import { cn } from "@/lib/utils";
import type { Testimonial } from "@/lib/testimonials";
import styles from "./quote-belt.module.css";

/**
 * Real quotes from real people, sliding past slowly. The words come from the
 * quote book in the vault (generated into lib/testimonials.ts), so nothing here
 * is retyped. The list is drawn twice for a seamless loop; the second copy is
 * hidden from screen readers so each quote is read once.
 */
export function QuoteBelt({
  items,
  label,
  className,
  cardClassName,
}: {
  items: Testimonial[];
  label: string;
  className?: string;
  cardClassName?: string;
}) {
  // About 9 seconds a card keeps the pace readable at any count.
  const style = { "--qb-dur": `${items.length * 9}s` } as React.CSSProperties;
  const list = (copy: boolean) => (
    <ul className={cn(styles.list, copy && styles.copy)} aria-hidden={copy || undefined}>
      {items.map((q) => (
        <li key={q.id} className="flex">
          <figure className={cn("sai-pane-strong rounded-card", styles.card, cardClassName)}>
            <blockquote className="m-0">
              <p className={styles.text}>
                <span className="text-accent-display">&ldquo;</span>
                {q.text}
                <span className="text-accent-display">&rdquo;</span>
              </p>
            </blockquote>
            <figcaption className={styles.who}>
              <span>
                <strong>{q.name}</strong>
                {q.role}
              </span>
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
  return (
    <div className={cn(styles.belt, className)} style={style} role="region" aria-label={label}>
      <div className={styles.track}>
        {list(false)}
        {list(true)}
      </div>
    </div>
  );
}
