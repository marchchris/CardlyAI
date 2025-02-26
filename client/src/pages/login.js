import { useContext, useState } from "react";
import { AuthContext } from "../config/AuthProvider";
import { useNavigate } from "react-router-dom";

import Loading from "../components/loadingScreen";

export default function Login() {
    const [error, setError] = useState("");
    const { loginUser, loading, user, cancelLoading } = useContext(AuthContext);
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    if (loading) {
        return (
            <Loading />
        );
    }

    if (user) {
        navigate("/dashboard");
    }

    const firebaseErrorMessages = {
        "auth/user-not-found": "No user exists with this email.",
        "auth/wrong-password": "Invalid email address or password.",
        "auth/invalid-email": "Invalid email address or password.",
        "auth/user-disabled": "This user account has been disabled.",
        "auth/invalid-credential": "Invalid email address or password.",
        // Add more error codes and messages as needed
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;

        if (!email || !password) {
            setError("All fields are required.");
            return;
        }

        loginUser(email, password)
            .then((result) => {
                navigate("/");
            })
            .catch((error) => { 
                const friendlyMessage = firebaseErrorMessages[error.code] || "An unexpected error occurred. Please try again.";
                setError(friendlyMessage); 
                cancelLoading();
            });
    };

    const handlePasswordToggle = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div>
            <div class="bg-[#2a2a2a]">
                <div class="min-h-screen flex flex-col items-center justify-center py-6 px-4 mt-5">
                    <div class="max-w-md w-full">
                        <div class="p-8 rounded-2xl bg-white bg-opacity-5">
                            <h2 class="text-white text-center 2xl:text-2xl xl:text-lg font-bold">Sign in</h2>
                            <form class="mt-8 space-y-4" onSubmit={handleSubmit}>
                                {error && <p class="text-red-500 2xl:text-sm xl:text-xs text-center">{error}</p>}
                                <div>
                                    <label class="text-white 2xl:text-sm xl:text-xs mb-2 block">Email</label>
                                    <div class="relative flex items-center">
                                        <input maxLength="200" name="email" type="text" required class="w-full bg-white bg-opacity-5 text-neutral-300 2xl:text-sm xl:text-xs border border-white border-opacity-15 px-4 py-3 rounded-md focus:outline-none" placeholder="Enter email" />
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" class="w-4 h-4 absolute right-4" viewBox="0 0 24 24">
                                            <circle cx="10" cy="7" r="6" data-original="#000000"></circle>
                                            <path d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z" data-original="#000000"></path>
                                        </svg>
                                    </div>
                                </div>

                                <div>
                                    <label class="text-white 2xl:text-sm xl:text-xs mb-2 block">Password</label>
                                    <div class="relative flex items-center">
                                        <input maxLength="200" name="password" type={showPassword ? "text" : "password"} required class="w-full bg-white bg-opacity-5 text-neutral-300 2xl:text-sm xl:text-xs border border-white border-opacity-15 px-4 py-3 rounded-md focus:outline-none" placeholder="Enter password" />
                                        <svg onClick={handlePasswordToggle} xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" class="w-4 h-4 absolute right-4 cursor-pointer" viewBox="0 0 128 128">
                                            <path d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z" data-original="#000000"></path>
                                        </svg>
                                    </div>
                                </div>

                                <div class="flex flex-wrap items-center justify-between gap-4">
                                    <div class="2xl:text-sm xl:text-xs">
                                        <a href="/reset-password" class="text-purple-300 hover:underline font-semibold">
                                            Forgot your password?
                                        </a>
                                    </div>
                                </div>

                                <div class="!mt-8">
                                    <button type="submit" class="w-full py-3 px-4 2xl:text-sm xl:text-xs tracking-wide rounded-lg text-white bg-purple-400 hover:bg-purple-500 focus:outline-none transition duration-300">
                                        Sign in
                                    </button>
                                </div>
                                <p class="text-white 2xl:text-sm xl:text-xs !mt-8 text-center">Don't have an account? <a href="/register" class="text-purple-300 hover:underline ml-1 whitespace-nowrap font-semibold ">Register here</a></p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}