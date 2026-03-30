import { Navigate, Outlet } from "react-router-dom";
import { auth } from "../utils/auth";

export default function PublicRoute() {
    // If already logged in → redirect to notes
    if (auth.isAuthenticated()) {
        return <Navigate to="/notes" replace />;
    }

    // Otherwise allow access
    return <Outlet />;
}