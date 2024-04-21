"use client";

import React from "react";
import NavBar from "../../component/navBar";
import { useContextProvider } from "../../utils/globalContext";
import { useEffect, useState, useRef } from "react";
import LoginForm from "./loginForm";

export default function Login() {

    const title = "Login";

    const { menuHeight, setMenuHeight } = useContextProvider();
    const menuDiv = useRef(null);

   

    const avoidMenu = { menuHeight } ? { marginTop: menuHeight } : { marginTop: 90 };

    return (
        <div className="min-h-screen">
            <div className="top-0 left-0 w-full" ref={menuDiv}
            style={{zIndex: 2}}>
                <NavBar currentPage={title}/>
            </div>
            <div className="flex-grow"
            style={avoidMenu}>
                <LoginForm />
            </div> 
        </div>
    );
}