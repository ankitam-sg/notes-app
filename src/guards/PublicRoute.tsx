import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

export default function PublicRoute() {
    const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);
    
    // If already logged in → redirect to notes
    if (isAuth) {
        return <Navigate to="/notes" replace />;
    }

    // Otherwise allow access
    return <Outlet />;
}