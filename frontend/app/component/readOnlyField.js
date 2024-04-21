"use client";

import React from "react";
import { useState, useEffect, useRef } from "react";

export default function ReadOnlyField({ label, value }) {
    return (
        <div className="field-input h-screen">
            <label className="font-bold">{label}</label>
            <input
                type="text" 
                placeholder={label} 
                // className={`border pl-2 border-gray-400 min-w-[300px] min-h-[35px]`}
                className={`border pl-2 border-gray-400 min-w-[300px] min-h-[35px] ${value ? 'text-gray-600 bg-gray-100 cursor-not-allowed' : ''}`}  
                value={value} 
                readOnly
            />
        </div>
    )
}