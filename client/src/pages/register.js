import { useContext, useState } from "react";
import { AuthContext } from "../config/AuthProvider";
import { useNavigate } from "react-router-dom";
import { sendEmailVerification } from "firebase/auth";

// Components
import Navbar from "../components/navbar";
import Loading from "../components/loadingScreen";

export default function Register() {
    const [error, setError] = useState("");
    const { createUser, user, loading, cancelLoading } = useContext(AuthContext);
    const navigate = useNavigate();

    if (loading) {
        return (
            <Loading />
        );
    }

    if (user) {
        navigate("/dashboard");
    }

    const firebaseErrorMessages = {
        "auth/email-already-in-use": "This email is already in use.",
        "auth/invalid-email": "Invalid email address.",
        "auth/operation-not-allowed": "Operation not allowed. Please contact support.",
        "auth/weak-password": "Password is too weak. Please choose a stronger password.",
        "auth/password-does-not-meet-requirements": "Password must contain at least 6 characters and a non-alphanumeric character.",
        // Add more error codes and messages as needed
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        const confirmPassword = e.target.confirmPassword.value;

        if (!email || !password || !confirmPassword) {
            setError("All fields are required.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        createUser(email, password)
            .then((result) => {
                const userData = {
                    userID: result.user.uid,
                    resolvedAmount: 0,
                    feedbackData: []
                };

                sendEmailVerification(result.user)
                    .then(() => {
                        navigate("/dashboard");
                    })
                    .catch((error) => {
                        setError("Failed to send verification email. Please try again.");
                        console.log(error);
                    });
            })
            .catch((error) => {
                const friendlyMessage = firebaseErrorMessages[error.code] || "An unexpected error occurred. Please try again.";
                setError(friendlyMessage);
                console.log(error);
                cancelLoading();
            });
    };

    return (
        <div>
            <Navbar />

            <div>
                <div class="min-h-screen flex flex-col items-center justify-center py-6 px-4 mt-5">
                    <div class="max-w-md w-full">
                        <div class="p-8 rounded-2xl bg-gray-50 border border-gray-200">
                            <h2 class="text-gray-900 text-center 2xl:text-2xl xl:text-lg font-bold">Create Account</h2>
                            <form class="mt-8 space-y-4" onSubmit={handleSubmit}>
                                {error && <p class="text-red-500 2xl:text-sm xl:text-xs text-center">{error}</p>}
                                <div>
                                    <label class="text-gray-700 2xl:text-sm xl:text-xs mb-2 block">Email</label>
                                    <div class="relative flex items-center">
                                        <input maxLength="200" name="email" type="text" required class="w-full bg-gray-50 text-gray-900 2xl:text-sm xl:text-xs border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter Email" />
                                    </div>
                                </div>

                                <div>
                                    <label class="text-gray-700 2xl:text-sm xl:text-xs mb-2 block">Password</label>
                                    <div class="relative flex items-center">
                                        <input maxLength="200" name="password" type="password" required class="w-full bg-gray-50 text-gray-900 2xl:text-sm xl:text-xs border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter password" />
                                    </div>
                                </div>

                                <div>
                                    <label class="text-gray-700 2xl:text-sm xl:text-xs mb-2 block">Confirm Password</label>
                                    <div class="relative flex items-center">
                                        <input maxLength="200" name="confirmPassword" type="password" required class="w-full bg-gray-50 text-gray-900 2xl:text-sm xl:text-xs border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter password" />
                                    </div>
                                </div>

                                <div class="!mt-8">
                                    <button type="submit" class="w-full py-3 px-4 2xl:text-sm xl:text-xs tracking-wide rounded-lg text-white bg-blue-500 hover:bg-blue-600 focus:outline-none transition duration-300">
                                        Create an account
                                    </button>
                                </div>
                                <p class="text-gray-600 2xl:text-sm xl:text-xs !mt-8 text-center">Already have an account? <a href="/login" class="text-blue-500 hover:underline ml-1 whitespace-nowrap font-semibold">Login here</a></p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}