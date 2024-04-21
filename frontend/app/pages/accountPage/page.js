"use client";
import React from "react";
import NavBar from "../../component/navBar";
import { useContextProvider } from "../../utils/globalContext";
import { useEffect, useRef, useState } from "react";
import AccountInfo from "./accountInfo";
import UserTransactionHistory from "./userTransactionHistory";
import UserFormData from "./userFormData";
import UserDetails from "./userDetails";
import Footer from "../../component/footer";

import { useUserAuth } from "../../utils/authContext";


export default function AccountPage() {
    const title = "Account Information";
    const [showTransactionHistory, setShowTransactionHistory] = useState(false);
    const [showFormData, setShowFormData] = useState(false);

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

    const toggleTransactionHistory = () => {
        setShowTransactionHistory(!showTransactionHistory);
    };

    const toggleFormData = () => {
        setShowFormData(!showFormData);
    };

    return (
        <div className="h-full bg-main-day">
            <div className="top-0 left-0 w-full" ref={menuDiv}>
                <NavBar currentPage={title} />
            </div>
            <div className="flex flex-row">
                <div className="flex flex-col px-24 bg-main-day w-full">
                    <div className="">
                        <AccountInfo />
                    </div>
                    <div>
                        {/* <UserDetails /> */}
                    </div>
                    <div className="flex flex-col mt-12 space-y-2">
                        <div className="flex justify-center">
                            {/* Button to toggle the visibility of UserTransactionHistory */}
                            <button
                                className="general-button bg-main-day text-white py-2 px-4 min-w-[400px]"
                                onClick={toggleTransactionHistory}
                            >
                                {showTransactionHistory ? "Hide History" : "Transaction History"}
                            </button>
                        </div>
                        <div>
                            {/* Render UserTransactionHistory only if showTransactionHistory is true */}
                            {showTransactionHistory && <UserTransactionHistory />}
                        </div>
                        <div className="flex justify-center">
                            {/* Button to toggle the visibility of UserFormData */}
                            <button
                                className="general-button bg-main-day text-white py-2 px-4 min-w-[400px]"
                                onClick={toggleFormData}
                            >
                                {showFormData ? "Hide Information" : "User Information"}
                            </button>
                        </div>
                        <div>
                            {/* Render UserFormData only if showFormData is true */}
                            {showFormData && <UserFormData />}
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-24">
                <Footer />
            </div>
        </div>
    );
}

