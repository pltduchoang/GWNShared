//root/frontend/app/pages/bookAppointment/page.js
'use client';
import React, { useEffect, useState } from "react";
import NavBar from "../../component/navBar";
import { useUserAuth } from "@/app/utils/authContext";
import { useContextProvider } from "@/app/utils/globalContext";
import ScheduleCalendar from "@/app/component/scheduleCalendar";
import Spinner from "@/app/component/spinner";

export default function BookAppointment() {
    const { menuHeight, refreshCount, setRefreshCount } = useContextProvider();
    const { user } = useUserAuth();
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const title = "Account";
    const [userBookedSessions, setUserBookedSessions] = useState([]);



    useEffect(() => {
        setAuthenticated(user !== null);
    }, [user]);

    const avoidMenu = menuHeight ? { marginTop: menuHeight} : { marginTop: 90 };

    const populateUserEvent = (bookedSessions) => {
        setUserBookedSessions(bookedSessions);
    }

    const formatDateTime = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleString('default', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true, // Use 'false' for 24-hour format
        });
    };

    return (
        <div className='min-h-screen bg-two-day text-main-day'>
            <div className="fixed top-0 left-0 w-full"
            style={{zIndex:2}}>
                <NavBar currentPage={title}/>
            </div>
            {loading && <div className='fixed top-0 left-0 h-screen w-full bg-three-day opacity-85 text-main-day flex justify-center items-center'>
                <Spinner />
            </div>}
            {!authenticated && <div className='fixed top-0 left-0 h-screen w-full bg-three-day opacity-85 text-main-day flex flex-col justify-center items-center'>You are not yet authenticated, please wait or &nbsp; <a href='/' className=' underline hover:text-blue-500'>return to home</a><Spinner/></div>}
            {error && <div className='h-screen w-full bg-two-day text-main-day flex justify-center items-center'>Error: {error.message}, &nbsp; <a href='/' className=' underline hover:text-blue-500'>return to home</a></div>}
            {authenticated && (
              <div style={avoidMenu}>
                <h1 className="text-4xl text-center py-10 text-main-day">Booking Appointment</h1>
                <ScheduleCalendar isBooking={true} populateUserEvent={populateUserEvent}/>
                <div className="flex flex-row justify-center">
                    <div className="2/3">
                        <h2 className="text-2xl text-center my-10">Your Booked Event</h2>
                        <ul className="text-sm border-2 border-slate-500 p-6 rounded-md mb-16">
                            {userBookedSessions.length > 0 ? (
                                userBookedSessions.map((session, index) => (
                                <li key={index}>Meeting on {formatDateTime(session.startTime)}</li>
                                ))
                            ) : (
                                <li>No booked sessions</li> // Display when there are no sessions
                            )}
                        </ul>
                    </div>
                </div>
              </div>
            )}
        </div>
    );
}