"use client";

import { forwardRef, ReactNode, ComponentPropsWithoutRef } from "react";
import Link from "next/link";

type CommonProps = {
  icon: ReactNode;
  label: string;
  expandedWidthClass?: string;
  collapsedWidthClass?: string;
  durationClass?: string;
  transitionClass?: string;
  disabled?: boolean;
  className?: string;
  title?: string;
};

type ButtonVariantProps = CommonProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof CommonProps> & {
    as?: "button";
    href?: never;
  };

type LinkVariantProps = CommonProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, keyof CommonProps> & {
    as: "link";
    href: string;
  };

type Props = ButtonVariantProps | LinkVariantProps;

const ExpandableIconButton = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  Props
>(function ExpandableIconButton(props, ref) {
  const {
    icon,
    label,
    expandedWidthClass = "hover:w-32",
    collapsedWidthClass = "w-10",
    durationClass = "duration-300",
    transitionClass = "transition-[width] ease-out",
    disabled,
    className = "",
    title,
    ...rest
  } = props;

  const baseClass = [
    "group relative inline-flex h-10 items-center overflow-hidden rounded-full bg-black text-white",
    "px-3",
    collapsedWidthClass,
    expandedWidthClass,
    transitionClass,
    durationClass,
    disabled
      ? "pointer-events-none cursor-not-allowed opacity-50"
      : "hover:bg-neutral-800",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {/* icon */}
      <span className="flex h-4 w-4 shrink-0 items-center justify-center">
        {icon}
      </span>

      {/* label */}
      <span
        className="
          whitespace-nowrap
          opacity-0
          -translate-x-0
          transition-all
          duration-200
          ease-out
          group-hover:translate-x-2
          group-hover:opacity-100
        "
      >
        {label}
      </span>
    </>
  );

  if (props.as === "link") {
    return (
      <Link
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={props.href}
        title={title ?? label}
        aria-disabled={disabled}
        className={baseClass}
        onClick={
          disabled
            ? (e) => e.preventDefault()
            : props.onClick
        }
      >
        {content}
      </Link>
    );
  }

  const {
    type = "button",
    onClick,
    ...buttonProps
  } = rest as ButtonVariantProps;

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type={type}
      disabled={disabled}
      title={title ?? label}
      className={baseClass}
      onClick={onClick}
      {...buttonProps}
    >
      {content}
    </button>
  );
});

export default ExpandableIconButton;