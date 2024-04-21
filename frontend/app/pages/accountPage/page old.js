"use client";
import React from "react";
import NavBar from "../../component/navBar";
import { useContextProvider } from "../../utils/globalContext";
import { useEffect, useRef } from "react";
import DashBoard from "../../component/accountDashboard";
import AccountInfo from "./accountInfo";
import UserDetails from "./userDetails";

import { useUserAuth } from "../../utils/authContext";


export default function AccountPage() {
    const title = "Account Information";

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

    return(
        <div className="h-full bg-main-day">
            <div className="top-0 left-0 w-full" ref={menuDiv}>
                <NavBar currentPage={title}/>
            </div>
            <div className="flex flex-row">
                <div>
                    <DashBoard currentPage={title}/>
                </div>
                <div className="flex flex-col px-24 bg-main-day w-full">
                    <div className="">
                        <AccountInfo />
                    </div>
                    <div>
                        <UserDetails />
                    </div>
                </div>
            </div>
        </div>
    )
}

