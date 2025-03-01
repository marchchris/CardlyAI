import { useContext } from "react";
import { AuthContext } from "../config/AuthProvider";
import { useNavigate } from "react-router-dom";

export default function Navbar(props) {
    const { user, logOut } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logOut().then(() => {
            navigate("/login");
        });
    };

    return (
        <nav class="fixed top-0 left-0 w-full z-10">
            <div class="w-full mx-auto px-8 bg-gray-50 shadow-md">
                <div class="flex justify-between items-center py-4 max-w-3xl mx-auto">
                    <div class="flex items-center">
                        <a href="/" className="text-2xl font-bold">CardlyAI 📚</a>
                    </div>
                    <div class="flex items-center gap-8">
                        {props.currentPage === "dashboard" ? (
                            <a href="/" class="hover:text-blue-500 transition duration-200">Home</a>
                        ) : (
                            <a href="/dashboard" class="hover:text-blue-500 transition duration-200">Dashboard</a>
                        )}
                        
                        
                        
                        {user ? (
                            <button onClick={handleLogout} class="hover:text-blue-500 transition duration-200">Logout</button>
                        ) : (
                            <a href="/login" class="hover:text-blue-500 transition duration-200">Login</a>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}