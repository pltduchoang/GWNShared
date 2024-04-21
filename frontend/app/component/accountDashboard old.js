"use client";
import React from "react";
import { useContextProvider } from "../utils/globalContext";
import { useEffect, useRef } from "react";
import { useState } from "react";
import Link from "next/link";

export default function AccountDashboard({ currentPage }) {

    const tabs =[
        {name: "Account Information", link: "../pages/accountPage"},
        {name: "Book Appointment", link: "../pages/bookPage"},
        {name: "Schedule", link: "../pages/schedulePage"}
    ];

    const [isDashboardOpen, setIsDashboardOpen] = useState(false);

    const toggleDashboard = () => {
        setIsDashboardOpen(prevState => !prevState);
    }

    const [highLightPage, setHighLightPage] = useState();

    useEffect(() => {
        setHighLightPage(currentPage);
    }, [currentPage]);


    return (
        <div className="relative h-full text-three-day">
            <div
                className={`dashboard-container bg-three-day transition-transform smooth-component ${
                    isDashboardOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                {/*Slider Button*/}
                <button
                    className="relative bg-three-day text-white p-4 rounded-r-md left-full dashboard-slider "
                    onClick={toggleDashboard}
                >
                    {isDashboardOpen ? ">" : "<"}
                </button>
                {/*Dashboard Content*/}
                <h1 className="p-2 text-lg font-bold">Dashboard</h1>
                <ul>
                    {tabs.map((item, index) => (
                        <li key={index} className="p-2 text-center w-full">
                            <Link href={item.link} className={`hover:text-green-500 smooth-component ${item.name === currentPage ? 'animate-pulse' :''}`}>{item.name}</Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}