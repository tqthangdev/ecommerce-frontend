import {
    ButtonHTMLAttributes,
} from "react";


type Props =
    ButtonHTMLAttributes<HTMLButtonElement> & {
        variant?: "primary" | "danger" | "outline";
    };



export default function Button({
    children,
    variant = "primary",
    className = "",
    ...props
}: Props) {


    const variants = {

        primary:
            "bg-black text-white hover:bg-gray-800",

        danger:
            "bg-red-600 text-white hover:bg-red-700",

        outline:
            "border hover:bg-gray-100",

    };



    return (

        <button
            className={`
        rounded-lg
        px-5
        py-3
        font-semibold
        transition
        ${variants[variant]}
        ${className}
      `}
            {...props}
        >

            {children}

        </button>

    );

}