import { cn } from "@/lib/utils";

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  hoverLift?: boolean;
};

/**
 * Base card used across meeting info, exec team bios, testimonials, etc.
 * Keep this the single place that defines "what a card looks like" —
 * page-specific content goes in children, not new card variants.
 */
export function Card({ hoverLift = false, className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-lg)] border border-slate-soft/60 bg-white/60 p-6",
        hoverLift && "transition-transform duration-200 hover:-translate-y-1",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
