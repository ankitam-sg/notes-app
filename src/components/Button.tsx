import { MouseEvent } from "react";

// Props type definition
type ButtonProps = {
    text: string;
    type?: "button" | "submit" | "reset";
    onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
    disabled?: boolean;
};

export default function Button({
    text,
    type = "button",
    onClick,
    disabled = false
    }: ButtonProps) {
    return (
        <button 
            type={type} 
            onClick={onClick}
            disabled={disabled}
            className={`w-full p-2 rounded-md text-white ${
                disabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
        >
            {text}
        </button>
    );
}