import { MouseEvent, ReactNode, useState } from "react";

type ButtonProps = {
    text?: string;
    type?: "button" | "submit" | "reset";
    onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
    disabled?: boolean;
    variant: "primary" | "danger" | "success" | "secondary";
    icon?: ReactNode;
    className?: string;
};

export default function Button({
    text,
    type = "button",
    onClick,
    disabled = false,
    variant,
    icon,
    className = ""
}: ButtonProps) {

    // 👉 FIX: icon hai to icon-only treat kar
    const isIconOnly = !!icon;

    const [hover, setHover] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
        setPosition({
            x: e.clientX,
            y: e.clientY
        });
    };

    // Base: padding, width, flex alignment -> same for all states
    const base =
        "flex items-center justify-center rounded-md transition-all duration-200 px-4 py-2";

    // Variants: color + hover color
    const variants = {
        primary: "bg-blue-600 hover:bg-blue-700 text-white",
        danger: "bg-red-600 hover:bg-red-700 text-white",
        success: "bg-green-600 hover:bg-green-700 text-white",
        secondary: "bg-gray-600 hover:bg-gray-700 text-white"
    };
    
    // Disabled: overrides only color + cursor + opacity
    const disabledStyle =
        "bg-gray-400 text-white cursor-not-allowed opacity-50";

    return (
        <>
            <button
                type={type}
                onClick={onClick}
                disabled={disabled}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                onMouseMove={handleMouseMove}
                className={`${base} ${
                    disabled ? disabledStyle : variants[variant]
                } ${isIconOnly ? "p-2" : ""} ${className}`}
            >
                {/* ✅ FIXED LOGIC */}
                {isIconOnly ? (
                    icon
                ) : (
                    text
                )}
            </button>

            {/* ✅ Tooltip only for icon buttons */}
            {isIconOnly && hover && text && (
                <span
                    className="fixed z-50 bg-black text-white text-xs px-2 py-1 rounded-md whitespace-nowrap pointer-events-none"
                    style={{
                        top: position.y + 10,
                        left: position.x + 10
                    }}
                >
                    {text}
                </span>
            )}
        </>
    );
}
