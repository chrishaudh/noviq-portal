import type { ButtonHTMLAttributes } from "react";

type PrimaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isLoading?: boolean;
};

export function PrimaryButton({ children, isLoading, disabled, ...props }: PrimaryButtonProps) {
  return (
    <button
      className="h-12 w-full rounded bg-brand px-5 text-base font-semibold text-white shadow-soft transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
      disabled={disabled || isLoading}
      type="button"
      {...props}
    >
      {isLoading ? "Please wait..." : children}
    </button>
  );
}
