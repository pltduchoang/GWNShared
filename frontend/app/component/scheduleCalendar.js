import React, { useState, useEffect } from 'react';
import SessionScheduleForm from './sessionScheduleForm';
import { useUserAuth } from '../utils/authContext';
import scheduleService from '../services/scheduleService';
import { useContextProvider } from '../utils/globalContext';
import Spinner from './spinner';

export default function ScheduleCalendar({ isBooking , populateUserEvent }) {
    // Initialize selected date state
    const [selectedDate, setSelectedDate] = useState(new Date());

    const [showSessionScheduleForm, setShowSessionScheduleForm] = useState(false);
    const [selectedSessionDate, setSelectedSessionDate] = useState(null);
    

    const [loading, setLoading] = useState(false);

    const {refreshCount, setRefreshCount} = useContextProvider();

    const today = new Date();
    today.setHours(0, 0, 0, 0);


    //Store the month data
    const [monthSessions, setMonthSessions] = useState([]);

     //get data for the calendar
    //fetch month sessions

    useEffect(() => {
        const fetchMonthSessions = async () => {
            const startOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
            const endOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
            setLoading(true);
            try {
                // Directly await the parsed sessions data from the service
                const sessions = await scheduleService.getMonthSessions(startOfMonth, endOfMonth);
                setMonthSessions(sessions); // Assuming this is an array of session objects
                let bookedSessions = sessions.filter(session => session.attendeeId === user.uid);
                if (isBooking) {
                populateUserEvent(bookedSessions);
                }
            } catch (error) {
                console.error('Error fetching sessions for month:', error);
            }
            setLoading(false);
        };
        fetchMonthSessions();
    }, [selectedDate,refreshCount]);



    // Function to get the number of days in a month
    const getDaysInMonth = (month, year) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const { user } = useUserAuth();

    // Function to generate an array of days in a month with schedule data

    const generateDaysArray = () => {
        const daysInMonth = getDaysInMonth(selectedDate.getMonth(), selectedDate.getFullYear());
        return Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const currentDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
            currentDate.setHours(0, 0, 0, 0);

            const isToday = currentDate.toDateString() === today.toDateString();
            const isPast = currentDate < today;
            const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;

            // Filter sessions for this day
            const sessionsForDay = monthSessions.filter(session => {
                const sessionDate = new Date(session.startTime);
                return sessionDate.toDateString() === currentDate.toDateString();
            });

            // Calculate available and total sessions
            const totalSlots = sessionsForDay.length;
            const availableSlots = sessionsForDay.filter(session => !session.attendeeId).length;

            return { 
                day,
                isToday,
                isPast,
                isWeekend,
                currentDate,
                totalSlots,
                availableSlots,
                };
            });
    };

    // Function to get the previous month
    const goToPreviousMonth = () => {
        setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, selectedDate.getDate()));
    };

    // Function to get the next month
    const goToNextMonth = () => {
        setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, selectedDate.getDate()));
    };


    // Function to handle date card click
    const handleDateCardClick = (currentDate) => {
        setSelectedSessionDate(currentDate);
        setShowSessionScheduleForm(true);
    }

    // Function to handle close modal
    const handleCloseModal = () => {
        setShowSessionScheduleForm(false);
        setSelectedSessionDate(null); // Fixed this line
    }


    const handlePrevDay = () => {
        setSelectedSessionDate(prevDate => new Date(prevDate.setDate(prevDate.getDate() - 1)));
    };

    const handleNextDay = () => {
        setSelectedSessionDate(prevDate => new Date(prevDate.setDate(prevDate.getDate() + 1)));
    };


   



    return (
        <div className="flex flex-col items-center">
        {loading && <div className='fixed top-0 left-0 h-screen w-full bg-three-day opacity-75 text-main-day flex justify-center items-center'>
            <Spinner />
        </div>}
        {!loading && (
                 <div className='flex flex-col justify-center items-center'>
                    <div className="flex items-center py-10">
                        <button onClick={goToPreviousMonth} className="mr-2 p-1 rounded-full w-10 h-10 bg-gray-200 hover:bg-gray-300 smooth-component-300 flex justify-center items-center">
                            &lt; {/*&lt; used due to "<" not working on its own in*/}
                        </button>
                        <div className='w-40'>
                            <h3 className="text-lg font-semibold text-center">
                                {selectedDate.toLocaleDateString('default', { month: 'long', year: 'numeric' })}
                            </h3>
                        </div>
                        <button onClick={goToNextMonth} className="ml-2 p-1 rounded-full w-10 h-10 bg-gray-200 hover:bg-gray-300 smooth-component-300 flex justify-center items-center">
                            &gt;
                        </button>
                    </div>
                    <div className="grid grid-cols-7 gap-1 md:gap-2">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                            <div key={day} className="text-center text-gray-700 font-semibold">{day}</div>
                        ))}
                        {Array.from({ length: new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).getDay() }, (_, i) => (
                            <div key={`empty-${i}`} className="text-center"></div>
                        ))}
                        {generateDaysArray().map(({ day, isToday, isPast, isWeekend, currentDate, totalSlots, availableSlots }) => (
                            <div className={`${!isPast ? 'date-card' : 'date-card-no-click' }`} key={day}
                            onClick={() => !isPast? handleDateCardClick(currentDate) : {}}>
                                <h4 className={`text-center h-6 text-white ${
                                isToday ? 'bg-item-day' : isPast ? 'bg-gray-600 ' : isWeekend ? ' bg-red-400' : 'bg-four-day text-three-day'
                                }`}>
                                    {day} {/* Display the day of the month */}
                                </h4>
                                <div className={`w-24 max-w-full h-24 rounded-sm flex flex-col justify-center items-center text-two-day text-sm ${isPast ? 'bg-gray-500 text-three-day' : 'bg-gray-200'}`}>
                                    {/* Display available and total slots */}
                                    {isPast ? (
                                        <span className="text-center">N/A</span>
                                    ) : (
                                        <span className={`text-center ${parseInt(availableSlots) <= 0 ? 'text-red-400' : ''}`}>
                                            {availableSlots}/{totalSlots} available
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    {showSessionScheduleForm && (
                        <SessionScheduleForm
                        selectedSessionDate={selectedSessionDate}
                        handlePrevDay={handlePrevDay} 
                        handleNextDay={handleNextDay} 
                        onClose={handleCloseModal}
                        user={user}
                        isBooking={isBooking}/>
                    )}
                </div>
        )}
    </div>
    );
};
