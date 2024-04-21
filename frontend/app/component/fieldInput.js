"use client";

import React from "react";
import { useState, useEffect, useRef } from "react";

export default function FieldInput({ label, value, type, onChange, errorMessage, error, sendFocusStatus, required }) {
    
    const [displayError, setDisplayError] = useState(error);

    // Display error if 'Confirm Password' does not match 'Password'
    useEffect(() => {
        setDisplayError(error);
    }, [error]);

    // Checks if 'Confirm Password' matches 'Password'
    const handleInputChange = (e) => {
        onChange(e);
        if (type == 'password' && label == 'Confirm Password') {
            setDisplayError(value !== e.target.value);
        }
    };
    
    return (
        <div className="field-input h-screen">
            <label className="font-bold">{label}</label>
            <input
                type={type} 
                placeholder={label} 
                className={`border pl-2 border-gray-400 min-w-[300px] min-h-[35px] ${displayError ? 'border-red-500' : ''}`} 
                value={value} 
                onChange={handleInputChange} 
                onFocus={() => sendFocusStatus && sendFocusStatus(true)}
                onBlur={() => sendFocusStatus && sendFocusStatus(false)}
                required={required}
                autoComplete="off"
            />
            {displayError && <p className="text-red-500">{errorMessage}</p>}
        </div>
    )
}