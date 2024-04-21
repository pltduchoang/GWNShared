//root/frontend/app/pages/signUpPage/signUpForm.js

"use client";

import React from "react";
import { useContextProvider } from "@/app/utils/globalContext";
import { useEffect, useState, useRef } from "react";
import FieldInput from "../../component/fieldInput";
import Link from "next/link";
import { useUserAuth } from "@/app/utils/authContext";
import userService from "@/app/services/userService";

export default function signUpForm() {
    // States for Field Inputs
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState(false);


    // Use the useUserAuth hook to access the user authentication functions
    const {signUpWithEmailAndPassword, errorMessages, successfulMessages } = useUserAuth();

    //password validation process
    const [isPasswordFocus, setIsPasswordFocus] = useState(false);
    const [passwordLengthCheck, setPasswordLengthCheck] = useState(false);
    const [passwordUpperCase, setPasswordUpperCase] = useState(false);
    const [passwordLowerCase, setPasswordLowerCase] = useState(false);  
    const [passwordNumber, setPasswordNumber] = useState(false);
    const [passwordSpecialChar, setPasswordSpecialChar] = useState(false);
    const [errorSignUp, setErrorSignUp] = useState(null); // You may use this state to display error messages to the user
    const [isPasswordValid, setIsPasswordValid] = useState(false); // You may use this state to enable/disable the sign-up button based on password validation

    //display password validation process
    const handlePasswordFocus = (focused) => {
        setIsPasswordFocus(focused);
    };

    // Password validation on the go
    const handlePasswordChange = (password) => {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password);
    
        setPassword(password);
        setPasswordLengthCheck(password.length >= minLength);
        setPasswordUpperCase(hasUpperCase);
        setPasswordLowerCase(hasLowerCase);
        setPasswordNumber(hasNumber);
        setPasswordSpecialChar(hasSpecialChar);

        setIsPasswordValid(password.length >= minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar);
    };

    //valid password



    // Handlers for Field Inputs
    const handleFirstNameChange = (e) => {
        setFirstName(e.target.value);
    };
    const handleLastNameChange = (e) => {
        setLastName(e.target.value);
    };
    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleConfirmPasswordChange = (e) => {
        const confirmPasswordValue = e.target.value;
        setConfirmPassword(confirmPasswordValue);

        if (confirmPasswordValue !== password) {
            setPasswordError(true);
        } else {
            setPasswordError(false);
        }
    };

    // Sign Up Button Click Handler
    const handleSignUpClick = async () => {

        if (password !== confirmPassword) {
            setPasswordError(true);
            return; // Prevents the sign-up process if passwords don't match
        }

        if(!isPasswordValid) {
            alert("Password does not meet the requirements");
            return;
        }
        try {
            
            const userCredential = await signUpWithEmailAndPassword(email, password);
            const user = userCredential.user;
            console.log("Sign-Up Successful:", user);
            // Assuming `user.uid` is available and can be used as the id for your user in the database
            const userData = {
                id: user.uid, // Use Firebase UID for the user's ID
                email,
                firstName,
                lastName,
                role: "user", // Default role, adjust as necessary
                isActive: true,
                // Include other fields as necessary, set to defaults or nulls where appropriate
                streetAddress: null,
                city: null,
                province: null,
                postalCode: null,
                phoneNumber: null,
                subscribeNewsletter: false,
            };
            await userService.addUser(userData); // Call to userService to add the user to the database
            setTimeout(() => {
                alert("Sign-up successful, check your email for verification, then log in again. Redirecting to the home page.");
                window.location.href = "/pages/loginPage";
            }, 3000);
        } catch (error) {
            console.error("Sign-Up Error:", error);

            setErrorSignUp(error.message);
        }
    };

    return (
        <div className="h-screen flex flex-col justify-center items-center w-full">
            <div className={`field-container bg-main-day`}>
                <h1 className="text-4xl font-bold mt-12">Sign Up</h1>
                <div className="">
                    <FieldInput 
                        label="First Name"
                        value={firstName}
                        type="text"
                        onChange={handleFirstNameChange}
                    />
                </div>
                <div>
                    <FieldInput 
                        label="Last Name"
                        value={lastName}
                        type="text"
                        onChange={handleLastNameChange}
                    />
                </div>
                <div>
                    <FieldInput 
                        label="Email"
                        value={email}
                        type="email"
                        onChange={handleEmailChange}
                    />
                </div>
                <div>
                    <FieldInput 
                        label="Password"
                        value={password}
                        type="password"
                        onChange={(e) => handlePasswordChange(e.target.value)}
                        sendFocusStatus={handlePasswordFocus}
                    />
                </div>
                {isPasswordFocus && (
                    <div className='w-48 pl-4'>
                        {passwordLengthCheck ? (
                        <p className="text-main-day">8 characters long</p>
                    ):(
                        <p className="text-main-day opacity-40">8 characters long</p>
                    )}
                    {passwordUpperCase ? (
                        <p className="text-main-day">Uppercase letter</p>
                    ):(
                        <p className="text-main-day opacity-40">Uppercase letter</p>
                    )}
                    {passwordLowerCase ? (
                        <p className="text-main-day">Lowercase letter</p>
                    ):(
                        <p className="text-main-day opacity-40">Lowercase letter</p>
                    )}
                    {passwordNumber ? (
                        <p className="text-main-day">Number</p>
                    ):(
                        <p className="text-main-day opacity-40">Number</p>
                    )}
                    {passwordSpecialChar ? (
                        <p className="text-main-day">Special !@#$%^&*..</p>
                    ):(
                        <p className="text-main-day opacity-40">Special !@#$%^&*..</p>
                    )}
                    </div> 
                )}
                <div>
                    <FieldInput 
                        label="Confirm Password"
                        value={confirmPassword}
                        type="password"
                        onChange={handleConfirmPasswordChange}
                        errorMessage="Password does not match"
                        error={passwordError}
                    />
                </div>
                {errorMessages && <p className="text-red-500">{errorMessages}</p>}
                {successfulMessages && <p className="text-green-500">{successfulMessages}</p>}
                
                
                <div className="mt-8">
                    <div className="sign-button" onClick={handleSignUpClick}>
                        Sign Up
                    </div>
                </div>
                <div>
                    <p className="md:font-bold p-6">OR</p>
                </div>
                <div>
                    <Link href="../pages/loginPage" className="sign-button smooth-component">
                        <button onClick={handleSignUpClick}>
                            Log In
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}