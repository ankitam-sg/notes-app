import { ChangeEvent, SyntheticEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import InputField from "../shared/InputField";
import Button from "../shared/Button";
import { login as loginAction } from "../features/auth/authSlice";
import type { RootState, AppDispatch } from "../store/store";

// Form types
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
    // ✅ Initial form + errors + touched
    const initialForm: LoginForm = { email: "", password: "" };
    const initialErrors: FormErrors = { email: "", password: "" };
    const initialTouched: FormTouched = { email: false, password: false };

    const [formData, setFormData] = useState<LoginForm>(initialForm);
    const [errors, setErrors] = useState<FormErrors>(initialErrors);
    const [touched, setTouched] = useState<FormTouched>(initialTouched);

    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    // ✅ Access users from redux
    const users = useSelector((state: RootState) => state.auth.users);

    // Validation rules
    const validationRules: { [K in keyof LoginForm]: ((value: string) => string)[] } = {
        email: [(value) => (value === "" ? "Email is required." : "")],
        password: [
            (value) => (value === "" ? "Password is required." : ""),
            (value) => (value.length < 6 ? "Password must be at least 6 characters." : ""),
        ],
    };

    // ✅ Validate single field
    const validateField = (name: keyof LoginForm, value: string): string => {
        const rules = validationRules[name] || [];
        for (const rule of rules) {
            const error = rule(value);
            if (error) return error;
        }
        return "";
    };

    // ✅ Handle input change
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({ ...prev, [name]: value }));
        setTouched((prev) => ({ ...prev, [name]: true }));

        const errorMsg = validateField(name as keyof LoginForm, value);
        setErrors((prev) => ({ ...prev, [name]: errorMsg }));
    };

    // ✅ Handle form submit
    const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        // ✅ Validate all fields first
        const newErrors: FormErrors = {
            email: validateField("email", formData.email),
            password: validateField("password", formData.password),
        };

        setErrors(newErrors);
        setTouched({ email: true, password: true });

        const isValid = Object.values(newErrors).every((err) => err === "");
        if (!isValid) return;

        // ✅ Find user in redux store
        const user = users.find((u) => u.email === formData.email);

        if (!user) {
            // ❌ USER NOT FOUND -> only email error
            setErrors((prev) => ({
                ...prev,
                email: "User not found. Please Sign up first.",
                password: "", // reset password error
            }));
            return;
        }

        if (user.password !== formData.password) {
            // ❌ WRONG PASSWORD -> only password error
            setErrors((prev) => ({
                ...prev,
                email: "", // reset email error
                password: "Incorrect Password.",
            }));
            return;
        }

        // ✅ SUCCESS LOGIN
        dispatch(loginAction({ email: formData.email, password: formData.password }));

        // ✅ Reset form
        setFormData(initialForm);
        setErrors(initialErrors);
        setTouched(initialTouched);

        navigate("/notes");
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
                        error={touched.password ? errors.password : undefined}
                    />

                    <Button text="Login" variant="primary" type="submit" className="w-full" />
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