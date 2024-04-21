//root/frontend/app/pages/loginPage/loginForm.js

"use client";

import React from "react";
import { useContextProvider } from "../../utils/globalContext";
import { useEffect, useState, useRef } from "react";
import FieldInput from "../../component/fieldInput";
import Link from "next/link";
import { useUserAuth } from "../../utils/authContext";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

export default function LoginForm () {



    // Use the useUserAuth hook to access the user authentication functions
    const { user, googleSignIn , emailSignIn , errorMessages, successfulMessages,  } = useUserAuth();

    // States for Login Field Inputs
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    //forgot password
    const [forgotPassword, setForgotPassword] = useState(false);
    const [emailToResetPassword, setEmailToResetPassword] = useState("");


    useEffect(() => {
        if (user) {
            window.location.href = "/";
        }
    }
    , [user]);

    // Handler for Login Button Click
    const handleLoginClick = async () => {
        const formData = {
            email,
            password,
        };
        try {
            await emailSignIn(email, password);
        } catch (error) {
            // Handle error
            console.error("Error signing in with email and password", error);
        }

    };

    
    const handleGoogleSignIn = async () => {
        try {
          await googleSignIn();
          // Handle successful sign-in
          // Redirect or perform other actions as needed
        } catch (error) {
          console.error("Google Sign-In Error:", error);
          // Handle sign-in error
        }
    };




    // Handler for Forgot Password Click ---------------------------------------------------------
    const handleForgotPassword = () => {
        setForgotPassword(true);
    };

    const handleResetPassword = async () => {
        if (!emailToResetPassword) {
            alert('Please enter your email to reset your password');
            return;
          }
          const auth = getAuth();
          try {
            await sendPasswordResetEmail(auth, email);
            console.log('Password reset email sent');
            alert('Password reset email sent, check your email to reset your password.');
          } catch (error) {
            console.error(error);
          };
    };


    

    return (
        <div className={`h-screen flex flex-col items-center bg-main-day field-login-container container mx-auto ${forgotPassword ? 'field-login-container-extend' :''}`}>
            <div>
                <h1 className="text-4xl font-bold mt-12">Login</h1>
                <div>
                    <FieldInput 
                        label="Email"
                        value={email}
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <FieldInput 
                        label="Password"
                        value={password}
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div>
                    <div className="text-main-day hover:text-blue-600 hover:cursor-pointer"
                    onClick={handleForgotPassword}>
                        Forgot your password?
                    </div>
                </div>
                {forgotPassword &&
                    <div className="flex flex-col">
                        <div>
                            <FieldInput
                                label="EmailToResetPassword"
                                value={email}
                                type="email"
                                onChange={(e) => setEmailToResetPassword(e.target.value)}
                            />
                        </div>
                        <div className="flex justify-center">
                            <div className="general-button px-6 py-2 smooth-component hover:cursor-pointer"
                            onClick={handleResetPassword}>
                                Reset Password
                            </div>
                        </div>
                    </div>}
                {errorMessages && <div className="text-red-500">{errorMessages}</div>}
                {successfulMessages && <div className="text-green-500">{successfulMessages}</div>}
                <div className="mt-12 flex justify-center space-x-4">
                    <div onClick={handleLoginClick} className="general-button px-10 py-2 smooth-component hover:cursor-pointer">
                        Login
                    </div>
                    <div onClick={handleGoogleSignIn} className="general-button px-6 py-4 smooth-component hover:cursor-pointer">
                        Sign in with Google
                    </div>
                </div>
                <div className="mt-12 flex justify-center">
                    <Link href="../pages/signUpPage">
                        <div className="text-main-day hover:text-blue-600 hover:cursor-pointer">
                            Don't have an account? Sign up
                        </div>
                    </Link>
                </div>

            </div>
        </div>
    )
}