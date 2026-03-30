import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { auth } from "../utils/auth";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faRightFromBracket,
    faPlus,
    faFloppyDisk,
    faTrash
} from "@fortawesome/free-solid-svg-icons";

export default function Notes() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

    const handleLogout = () => {
        auth.logout();
        navigate("/login", { replace: true });
    };

    return (
        <div className="h-screen flex flex-col bg-gray-900 text-white overflow-hidden">

            {/* HEADER */}
            <div className="flex items-center justify-between px-6 py-3 bg-white border-b-2 border-gray-300 shadow-md z-50">

                <h1 className="text-lg font-semibold text-gray-800">
                    Notes App
                </h1>

                <div className="flex items-center gap-3 min-w-0">
                    <p className="text-sm text-gray-700 whitespace-nowrap">
                        {user.email}
                    </p>

                    <Button
                        text="Logout"
                        variant="danger"
                        icon={<FontAwesomeIcon icon={faRightFromBracket} />}
                        onClick={handleLogout}
                    />
                </div>
            </div>

            {/* MAIN */}
            <div className="flex flex-1 overflow-hidden">

                {/* LEFT PANEL */}
                <div className="flex flex-col w-[30%] bg-gray-900 border-r border-gray-700 p-4">

                    <div className="flex gap-2 mb-4">

                        <input
                            type="text"
                            placeholder="Search..."
                            className="bg-or flex-1 min-w-0 bg-gray-800 border border-gray-600 text-white placeholder-gray-400 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                        />

                        <Button
                            text="New Note"
                            variant="success"
                            icon={<FontAwesomeIcon icon={faPlus} />}
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        <p className="text-sm text-gray-400">
                            No notes yet
                        </p>
                    </div>
                </div>

                {/* RIGHT PANEL */}
                <div className="flex flex-col w-[70%] bg-gray-800 p-5">

                    <div className="flex gap-2 mb-4">

                        <input
                            type="text"
                            placeholder="Title"
                            className="flex-1 min-w-0 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        />

                        <div className="flex gap-2">
                            <Button
                                text="Save"
                                variant="primary"
                                icon={<FontAwesomeIcon icon={faFloppyDisk} />}
                            />

                            <Button
                                text="Delete"
                                variant="danger"
                                icon={<FontAwesomeIcon icon={faTrash} />}
                            />
                        </div>
                    </div>

                    <textarea
                        placeholder="Write your note..."
                        className="flex-1 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 p-3 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    />
                </div>
            </div>
        </div>
    );
}