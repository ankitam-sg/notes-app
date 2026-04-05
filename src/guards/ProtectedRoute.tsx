import { Navigate, Outlet } from "react-router-dom";
import { auth } from "../utils/auth";

export default function ProtectedRoutes() {
    // If no token → redirect to login
    if (!auth.isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    // If authenticated → allow access
    return <Outlet />;
}