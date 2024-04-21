"use client";
import NavBar from "../../component/navBar";
import React from "react";
import { useContextProvider } from "../../utils/globalContext";
import { useEffect, useState, useRef } from "react";
import BgImage from "./bg";
import SignUpForm from "./signUpForm";

export default function SignUpPage() {
    const title = "Sign up";

    const { menuHeight, setMenuHeight } = useContextProvider();
    const menuDiv = useRef(null);

    useEffect(() => {
        updateDivHeights();
        window.addEventListener('resize', updateDivHeights);

        return () => {
            window.removeEventListener('resize', updateDivHeights);
        };
    }, []);

    const updateDivHeights = () => {
        if (menuDiv.current) {
            setMenuHeight(menuDiv.current.clientHeight);
        }
    };

    const avoidMenu = {
        marginTop: menuHeight,
    };

    return (
        <div className="min-h-screen">
            <div className="top-0 left-0 w-full" ref={menuDiv}>
                <NavBar currentPage={title}/>
            </div>
            <div className="fixed top-0 left-0" style={{zIndex:-1}}>
                <BgImage />
            </div>
            <div className="flex-grow">
                <SignUpForm />
            </div>
        </div>
    );
}