import Navbar from "../components/navbar"
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../config/AuthProvider";
import { useNavigate } from "react-router-dom";

export default function VerifyEmail() {
    const { user, sendVerificationEmail, checkEmailVerification } = useContext(AuthContext);
    const [verifying, setVerifying] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // If no user is logged in, redirect to login
    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
        // If user is already verified, redirect to dashboard
        else if (user.emailVerified) {
            navigate("/dashboard");
        }
        // Send verification email automatically if not sent already
        else {
            sendVerificationEmail().catch(err => {
                // Ignore errors about verification email already sent
                if (!err.message?.includes("auth/too-many-requests")) {
                    setError("Could not send verification email. Please try again later.");
                }
            });
        }
    }, [user, navigate, sendVerificationEmail]);

    // Set up verification check interval
    useEffect(() => {
        if (!user || user.emailVerified) return;
        
        const intervalId = setInterval(() => {
            checkEmailVerification()
                .then(verified => {
                    if (verified) {
                        clearInterval(intervalId);
                        window.location.reload();
                    }
                })
                .catch(err => {
                    console.error("Error checking verification status:", err);
                });
        }, 3000);
        
        return () => clearInterval(intervalId);
    }, [user, checkEmailVerification]);

    const handleManualVerify = async () => {
        setVerifying(true);
        setMessage("Checking verification status...");
        setError("");
        
        try {
            const verified = await checkEmailVerification();
            if (verified) {
                setMessage("Email verified! Redirecting...");
                setTimeout(() => window.location.reload(), 1500);
            } else {
                setMessage("");
                setError("Email not verified yet. Please check your inbox and click the verification link.");
            }
        } catch (err) {
            setError("Could not verify email status. Please try again.");
            console.error(err);
        } finally {
            setVerifying(false);
        }
    };

    const handleResendEmail = async () => {
        setMessage("Sending verification email...");
        setError("");
        
        try {
            await sendVerificationEmail();
            setMessage("Verification email sent! Please check your inbox.");
        } catch (err) {
            if (err.message?.includes("auth/too-many-requests")) {
                setError("Too many requests. Please wait before requesting another verification email.");
            } else {
                setError("Could not send verification email. Please try again later.");
            }
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center">
            <Navbar currentPage="dashboard" />
            <div className="flex flex-col items-center justify-center px-4">
                <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold text-center mb-6">Verify Your Email</h1>
                    
                    <p className="text-gray-600 mb-6 text-center">
                        We've sent a verification email to <span className="font-medium">{user?.email}</span>.
                        Please check your inbox and click the verification link.
                    </p>
                    
                    {message && (
                        <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md text-center">
                            {message}
                        </div>
                    )}
                    
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-center">
                            {error}
                        </div>
                    )}
                    
                    <div className="flex flex-col space-y-3">                        
                        <button 
                            onClick={handleResendEmail}
                            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
                        >
                            Resend Verification Email
                        </button>
                    </div>
                    
                    <p className="text-sm text-gray-500 mt-6 text-center">
                        Once verified, you'll be redirected automatically.
                    </p>
                </div>
            </div>
        </div>
    );
}