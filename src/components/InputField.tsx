import { ChangeEvent } from "react";

type InputFieldProps = {
    label: string;
    type: "text" | "email" | "password";
    placeholder: string;
    name: "email" | "password" | "confirmPassword";
    id: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    error?: string | false;
};

export default function InputField({
    label,
    type,
    placeholder,
    name,
    id,
    value,
    onChange,
    error
    }: InputFieldProps) {
    return (
        <div>
            <label htmlFor={id} className="block mb-1 text-sm font-medium">
                {label}
            </label>

            <input 
                type={type}
                name={name}
                id={id}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={`w-full border rounded-md p-2 focus:outline-none ${
                error 
                    ? "border-red-500 focus:border-red-500" 
                    : "border-gray-300 focus:border-gray-600"
                }`}            
            />

            {error && (
                <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
        </div>
    );
}