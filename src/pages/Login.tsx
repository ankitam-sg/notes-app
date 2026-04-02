import { useState, ChangeEvent, SyntheticEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import Button from "../components/Button";
import { auth } from "../utils/auth";

// Define the shape of the form data
type LoginForm = {
    email: string;
    password: string;
};

type FormErrors = {
    email: string;
    password: string;
};

type FormTouched = {
    email: boolean;
    password: boolean;
};

export default function Login() {
    // Initial values
    const initialForm: LoginForm = { email: "", password: "" };
    const initialErrors: FormErrors = { email: "", password: "" };
    const initialTouched: FormTouched = { email: false, password: false };

    const [formData, setFormData] = useState<LoginForm>(initialForm);
    const [errors, setErrors] = useState<FormErrors>(initialErrors);
    const [touched, setTouched] = useState<FormTouched>(initialTouched);

    const navigate = useNavigate();

    // Validation rules for each field
    const validationRules: { [K in keyof LoginForm]: ((value: string) => string)[] } = {
        email: [(value) => (value === "" ? "Email is required." : "")],
        password: [
            (value) => (value === "" ? "Password is required." : ""),
            (value) =>
                value.length < 6 ? "Password must be at least 6 characters." : "",
        ],
    };

    // Validate a single field
    const validateField = (name: keyof LoginForm, value: string): string => {
        const rules = validationRules[name] || [];
        for (const rule of rules) {
            const error = rule(value);
            if (error) return error;
        }
        return "";
    };

    // Handle input change
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({ ...prev, [name]: value }));
        setTouched((prev) => ({ ...prev, [name]: true }));

        const errorMsg = validateField(name as keyof LoginForm, value);
        setErrors((prev) => ({ ...prev, [name]: errorMsg }));
    };

    // Handle form submit
    const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validate all fields
        const newErrors: FormErrors = {
            email: validateField("email", formData.email),
            password: validateField("password", formData.password),
        };

        setErrors(newErrors);
        setTouched({ email: true, password: true });

        const isValid = Object.values(newErrors).every((err) => err === "");

        if (isValid) {
            console.log("Login data:", formData.email, formData.password);

            const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");

            // Find User by email
            const user = storedUsers.find(
                (u: { email: string, password: string}) =>
                    u.email === formData.email
            );

            // User not found
            if (!user) {
                setErrors((prev) => ({
                    ...prev,
                    email: "User not found. Please Sign up first.",
                }));

                return;
            }

            // ❌ WRONG Password
            if (user.password !== formData.password) {
                setErrors((prev) => ({
                    ...prev,
                    password: "Incorrect Password.",
                }));

                return;
            }

            // ✅ SUCCESS LOGIN
            auth.login(user);

            // Reset form
            setFormData(initialForm);
            setErrors(initialErrors);
            setTouched(initialTouched);

            navigate("/notes");
        }
    };

    return (
        <div className="h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <InputField
                        label="Email : "
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Enter Email"
                        value={formData.email}
                        onChange={handleChange}
                        // FIX: Avoid boolean (false) → return string | undefined
                        error={touched.email ? errors.email : undefined}
                    />

                    <InputField
                        label="Password : "
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Enter Password"
                        value={formData.password}
                        onChange={handleChange}
                        // FIX applied here as well
                        error={touched.password ? errors.password : undefined}
                    />

                    <Button text="Login" variant="primary" type="submit" className="w-full"/>
                </form>

                <p className="text-center text-sm mt-2">
                    Don't have an account?{" "}
                    <Link
                        to="/signup"
                        className="text-blue-600 hover:text-blue-600 hover:font-semibold underline cursor-pointer"
                    >
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
}