"use client";
import React from "react";
import NavBar from "../../component/navBar";
import { useContextProvider } from "../../utils/globalContext";
import { useEffect, useRef, useState } from "react";

import DatePicker from "../../component/DatePicker";
import BookingFields from "./bookingFields";

export default function BookPage() {
    const title = "Book Appointment";

    const { menuHeight, setMenuHeight } = useContextProvider();
    const menuDiv = useRef(null);
    
    const [selectedDate, setSelectedDate] = useState(new Date());

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
        <div className="min-h-screen bg-main-day">
            <div className="top-0 left-0 w-full" ref={menuDiv}>
                <NavBar />
            </div>
            <div className="flex flex-row">

                <div className="flex flex-col px-24 bg-main-day w-full">
                    <div className="p-4 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold mb-4 text-center">Book Appointment</h2>
                        <DatePicker setSelectedDate={setSelectedDate}/>
                    </div>
                    <div>
                        <BookingFields selectedDate={selectedDate}/>
                    </div>
                </div>
            </div>
        </div>
    )
}