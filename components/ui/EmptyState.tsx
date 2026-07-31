import Link from "next/link";
import { ReactNode } from "react";

interface EmptyStateProps {
    icon?: ReactNode;
    title: string;
    description: string;
    actionLabel?: string;
    actionHref?: string;
}

export default function EmptyState({
    icon,
    title,
    description,
    actionLabel,
    actionHref,
}: EmptyStateProps) {
    return (
        <div className="py-20 text-center">
            {icon && (
                <div className="mb-4 flex justify-center text-gray-400">
                    {icon}
                </div>
            )}

            <h2 className="text-3xl font-bold">
                {title}
            </h2>

            <p className="mt-3 text-gray-500">
                {description}
            </p>

            {actionLabel && actionHref && (
                <Link
                    href={actionHref}
                    className="
                        mt-6
                        inline-block
                        rounded-lg
                        bg-black
                        px-6
                        py-3
                        text-white
                    "
                >
                    {actionLabel}
                </Link>
            )}
        </div>
    );
}