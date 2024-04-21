'use client';
import React, { useEffect, useState } from "react";
import NavBar from "../../component/navBar";
import { useContextProvider } from "../../utils/globalContext";
import ScheduleCalendar from "../../component/scheduleCalendar";
import { useUserAuth } from "@/app/utils/authContext";
import Spinner from "@/app/component/spinner";

export default function ManageSchedulePage() {
    const { menuHeight } = useContextProvider();
    const { user } = useUserAuth();
    
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        setAuthenticated(user !== null);
    }, [user]);

    const title = "Manage Schedule";

    // Style to avoid the menu
    const avoidMenu = menuHeight ? { marginTop: menuHeight} : { marginTop: 90 };

    return (
        <div className="w-full py-10 flex bg-two-day flex-col min-h-screen">
            <div className="fixed top-0 left-0 w-full" style={{ zIndex: 2 }}>
                <NavBar currentPage={title}/>
            </div>
            {!authenticated && <div className='fixed top-0 left-0 h-screen w-full bg-three-day opacity-85 text-main-day flex flex-col justify-center items-center'>You are not yet authenticated, please wait or &nbsp; <a href='/' className=' underline hover:text-blue-500'>return to home</a><Spinner/></div>}
            {authenticated &&
                <div style={avoidMenu}>
                    <h1 className="text-4xl text-center pb-10 text-main-day">Manage Schedule</h1>
                    <ScheduleCalendar isBooking={false}/>
                </div>
            }
        </div>
    );
}
