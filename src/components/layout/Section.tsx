import { cn } from "@/lib/utils";

type SectionProps = React.HTMLAttributes<HTMLElement> & {
  tone?: "cream" | "navy";
  eyebrow?: string;
  heading?: string;
  id?: string;
};

const toneStyles = {
  cream: "bg-cream text-ink",
  navy: "bg-gradient-to-b from-navy to-navy-deep text-cream",
};

/**
 * Every homepage section should be wrapped in this, alternating tone to
 * create the cream/navy rhythm from the design plan. Don't introduce a
 * third background tone without updating this file first.
 */
export function Section({
  tone = "cream",
  eyebrow,
  heading,
  id,
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section id={id} className={cn("py-20 md:py-28 px-6", toneStyles[tone], className)} {...props}>
      <div className="mx-auto max-w-6xl">
        {(eyebrow || heading) && (
          <div className="mb-12 text-center">
            {eyebrow && (
              <p
                className={cn(
                  "font-mono text-xs tracking-[0.2em] uppercase mb-3",
                  tone === "navy" ? "text-gold-soft" : "text-slate"
                )}
              >
                {eyebrow}
              </p>
            )}
            {heading && (
              <h2 className="font-display text-3xl md:text-5xl font-light">{heading}</h2>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
