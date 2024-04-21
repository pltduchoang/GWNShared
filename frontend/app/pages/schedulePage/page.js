"use client";
import React from "react";
import NavBar from "../../component/navBar";
import { useContextProvider } from "../../utils/globalContext";
import { useEffect, useRef } from "react";

import ScheduleCalendar from "../../component/scheduleCalendar";
import ScheduleList from "./scheduleList";

export default function SchedulePage() {
    const title = "Schedule";

    // Test data for schedule
    const scheduleData = [
        { date: '2023-12-25', time: '08:00 AM', event: 'Test 1'},
        { date: '2024-03-26', time: '09:00 AM', event: 'Meeting' },
        { date: '2024-02-27', time: '10:00 AM', event: 'Workshop' },
        { date: '2024-02-28', time: '11:00 AM', event: 'TEST VALUE 2' },
        { date: '2024-02-29', time: '12:00 PM', event: 'Cool thing' },
        { date: '2024-03-01', time: '01:00 PM', event: 'Break' },
        { date: '2024-03-02', time: '02:00 PM', event: '' },
        { date: '2024-03-03', time: '03:00 PM', event: 'Training' },
        { date: '2024-03-04', time: '04:00 PM', event: 'Procrastinate' },
    ];

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
        <div className="min-h-screen bg-main-day">
            <div className="top-0 left-0 w-full" ref={menuDiv}>
                <NavBar />
            </div>
            <div className="flex flex-row">

                <div className="flex flex-col px-24 bg-main-day w-full space-y-24 mt-8">
                    <div>
                        <h2 className="text-2xl font-semibold mb-4 text-center">Schedule Calander</h2>
                        <ScheduleCalendar scheduleData={scheduleData}/>
                    </div>
                    <div>
                        <h2 className="text-2xl font-semibold mb-4 text-center">Your Upcoming Schedule</h2>
                        <ScheduleList scheduleData={scheduleData}/>
                    </div>
                </div>
            </div>
        </div>
    )
}