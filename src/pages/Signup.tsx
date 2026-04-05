import { useState, ChangeEvent, SyntheticEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputField from "../shared/InputField";
import Button from "../shared/Button";


// Form types
type SignupForm = {
    email: string;
    password: string;
    confirmPassword: string;
};

type FormErrors = {
    email: string;
    password: string;
    confirmPassword: string;
};

type FormTouched = {
    email: boolean;
    password: boolean;
    confirmPassword: boolean;
};

export default function Signup() {
    const initialForm: SignupForm = { email: "", password: "", confirmPassword: "" };
    const initialErrors: FormErrors = { email: "", password: "", confirmPassword: "" };
    const initialTouched: FormTouched = { email: false, password: false, confirmPassword: false };

    const [formData, setFormData] = useState<SignupForm>(initialForm);
    const [errors, setErrors] = useState<FormErrors>(initialErrors);
    const [touched, setTouched] = useState<FormTouched>(initialTouched);

    const navigate = useNavigate();

    // Validation rules
    const validationRules: { [K in keyof SignupForm]: ((value: string) => string)[] } = {
        email: [(value) => (value === "" ? "Email is required." : "")],
        password: [
            (value) => (value === "" ? "Password is required." : ""),
            (value) => (value.length < 6 ? "Password must be at least 6 characters." : ""),
        ],
        confirmPassword: [
            (value) => (value === "" ? "Confirm Password is required." : ""),
            (value) => (value !== formData.password ? "Passwords do not match." : ""),
        ],
    };

    // Validate a single field
    const validateField = (name: keyof SignupForm, value: string): string => {
        const rules = validationRules[name] || [];
        for (const rule of rules) {
            const error = rule(value);
            if (error) return error;
        }
        return "";
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({ ...prev, [name]: value }));
        setTouched((prev) => ({ ...prev, [name]: true }));

        const errorMsg = validateField(name as keyof SignupForm, value);
        setErrors((prev) => ({ ...prev, [name]: errorMsg }));
    };

    const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newErrors: FormErrors = {
            email: validateField("email", formData.email),
            password: validateField("password", formData.password),
            confirmPassword: validateField("confirmPassword", formData.confirmPassword),
        };

        setErrors(newErrors);
        setTouched({ email: true, password: true, confirmPassword: true });

        const isValid = Object.values(newErrors).every((err) => err === "");

        if (isValid) {
            // Save user in localStorage
            const storedUsersRaw = localStorage.getItem("users");
            const storedUsers = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];

            if (!Array.isArray(storedUsers)) {
                console.error("Users are corrupted: ", storedUsers);
                return;
            }

            // Check if User already exists
            const userExists = storedUsers.find(
                (user: {email: string}) => user.email === formData.email
            );

            if (userExists) {
                setErrors((prev) => ({
                    ...prev,
                    email: "User already exists with this email.",
                }));

                return;
            }

            // Store new user
            storedUsers.push({email: formData.email, password: formData.password});
            localStorage.setItem("users", JSON.stringify(storedUsers));

            // Fake token + current user
            const fakeToken = Math.random().toString(36).substring(2);
            localStorage.setItem("authToken", fakeToken);
            localStorage.setItem("currentUser", JSON.stringify({ email: formData.email }));

            // Reset
            setFormData(initialForm);
            setErrors(initialErrors);
            setTouched(initialTouched);

            navigate("/notes");
        }
    };

    return (
        <div className="h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <InputField
                        label="Email : "
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Enter Email"
                        value={formData.email}
                        onChange={handleChange}
                        // FIX
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
                        // FIX
                        error={touched.password ? errors.password : undefined}
                    />

                    <InputField
                        label="Confirm Password : "
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        placeholder="Enter Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        // FIX
                        error={touched.confirmPassword ? errors.confirmPassword : undefined}
                    />

                    <Button text="Sign Up" variant="primary" type="submit" className="w-full" />
                </form>

                <p className="text-center text-sm mt-2">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="text-blue-600 hover:text-blue-600 hover:font-semibold underline cursor-pointer"
                    >
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}