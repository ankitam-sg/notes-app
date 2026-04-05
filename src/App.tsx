import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Notes from "./pages/Notes";
import ProtectedRoutes from "./guards/ProtectedRoute";
import PublicRoute from "./guards/PublicRoute";

export default function App() {
  return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Navigate to="/login" replace />} />

                <Route element={<PublicRoute />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                </Route>
                

                {/* Protected Routes */}
                <Route element={<ProtectedRoutes />}>
                    <Route path="/notes" element={<Notes />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}