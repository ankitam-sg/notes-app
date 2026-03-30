import { MouseEvent, ReactNode, useState } from "react";

type ButtonProps = {
    text: string;
    type?: "button" | "submit" | "reset";
    onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
    disabled?: boolean;
    variant: "primary" | "danger" | "success";
    icon?: ReactNode;
};

export default function Button({
    text,
    type = "button",
    onClick,
    disabled = false,
    variant,
    icon
}: ButtonProps) {
    const isIconOnly = Boolean(icon);

    const [hover, setHover] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
        setPosition({
            x: e.clientX,
            y: e.clientY
        });
    };

    // Base: padding, width, flex alignment -> same for all states
    const base = "flex items-center justify-center rounded-md transition-all duration-200 px-4 py-2 min-w-[40px]";

    // Variants: color + hover color
    const variants = {
        primary: "bg-blue-600 hover:bg-blue-700 text-white",
        danger: "bg-red-600 hover:bg-red-700 text-white",
        success: "bg-green-600 hover:bg-green-700 text-white"
    };

    // Disabled: overrides only color + cursor + opacity
    const disabledStyle = "bg-gray-400 text-white cursor-not-allowed opacity-50";

    // Icon-only buttons padding override (optional)
    const iconPadding = "p-2";

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
                    disabled
                        ? disabledStyle
                        : isIconOnly
                        ? `${variants[variant]} ${iconPadding}`
                        : variants[variant]
                }`}
            >
                {isIconOnly ? icon : text}
            </button>

            {/* Tooltip for icon-only buttons */}
            {isIconOnly && hover && (
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
