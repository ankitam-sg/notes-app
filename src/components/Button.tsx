import { MouseEvent } from "react";

// Props type definition
type ButtonProps = {
    text: string;
    type?: "button" | "submit" | "reset";
    onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
    disabled?: boolean;
    variant?: "primary" | "danger";
};

export default function Button({
    text,
    type = "button",
    onClick,
    disabled = false,
    variant = "primary"
    }: ButtonProps) {
        const baseStyle = "w-full p-2 rounded-md text-white";

        const variants = {
            primary: "bg-blue-500 hover:bg-blue-600",
            danger: "bg-red-500 hover:bg-red-600"
        }
    return (
        <button 
            type={type} 
            onClick={onClick}
            disabled={disabled}
            className= { `${baseStyle} ${
                disabled
                ? "bg-gray-400 cursor-not-allowed"
                : variants[variant]
            }`}
        >
            {text}
        </button>
    );
}