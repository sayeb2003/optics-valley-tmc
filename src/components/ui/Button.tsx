import { forwardRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "md" | "lg";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-gold text-ink hover:bg-gold-soft active:bg-gold shadow-sm hover:shadow-md",
  secondary:
    "bg-transparent text-navy border border-navy/30 hover:border-navy hover:bg-navy/5",
  ghost: "bg-transparent text-ink hover:bg-ink/5",
};

const sizeStyles: Record<ButtonSize, string> = {
  md: "px-6 py-2.5 text-sm",
  lg: "px-8 py-3.5 text-base",
};

const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-[var(--radius-pill)] font-body font-semibold transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none";

type ButtonOwnProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsButton = ButtonOwnProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonOwnProps>;

/**
 * Renders a <Link> when `href` is passed, otherwise a <button>.
 * Keep variant/size options limited on purpose — every new variant added
 * here should earn its place across multiple pages, not one-off styling.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonAsButton>(
  ({ variant = "primary", size = "md", href, className, children, ...props }, ref) => {
    const classes = cn(baseStyles, variantStyles[variant], sizeStyles[size], className);

    if (href) {
      return (
        <Link href={href} className={classes}>
          {children}
        </Link>
      );
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
