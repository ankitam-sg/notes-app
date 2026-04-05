import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

export default function ProtectedRoutes() {
    const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);
    
    // If no token → redirect to login
    if (!isAuth) {
        return <Navigate to="/login" replace />;
    }

    // If authenticated → allow access
    return <Outlet />;
}

