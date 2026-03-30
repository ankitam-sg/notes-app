import Button from "../components/Button";
import { useNavigate } from 'react-router-dom';
import { auth } from "../utils/auth";

export default function Notes() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

    const handleLogout = () => {
        auth.logout(); // clears authToken + currentUser
        navigate("/login", { replace: true }); // replace prevents /notes from being in history
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">
                Welcome, {user.email}
            </h1>

            <div className="mt-4 w-40">
                <Button 
                    text="Logout"
                    onClick={handleLogout}
                    variant="danger"
                />
            </div>
        </div>
    );
}