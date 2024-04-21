import React, { useState } from 'react';

export default function scheduleCalander({ scheduleData }) {
    // Initialize selected date state
    const [selectedDate, setSelectedDate] = useState(new Date());


  

    // Function to get the number of days in a month
    const getDaysInMonth = (month, year) => {
        return new Date(year, month + 1, 0).getDate();
    };

    // Function to generate an array of days in a month with schedule data
    const generateDaysArray = () => {
        const daysInMonth = getDaysInMonth(selectedDate.getMonth(), selectedDate.getFullYear());
    
        return Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const currentDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
            // nextDay implemented due to eventDate being one day behind
            const nextDay = new Date(currentDate);
            nextDay.setDate(nextDay.getDate() - 1);
            // Instead of currentDate, nextDay is used to sync with eventDate
            const hasEvent = scheduleData.some(data => {
                const eventDate = new Date(data.date);
                return eventDate.getFullYear() === nextDay.getFullYear() &&
                       eventDate.getMonth() === nextDay.getMonth() &&
                       eventDate.getDate() === nextDay.getDate();
            });
            return { day, hasEvent };
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

    return (
        <div className="flex flex-col items-center">
            <div className="flex items-center mb-4">
                <button onClick={goToPreviousMonth} className="mr-2 p-1 rounded-full bg-gray-200 hover:bg-gray-300">
                    &lt; {/*&lt; used due to "<" not working on its own in*/}
                </button>
                <h3 className="text-lg font-semibold">
                    {selectedDate.toLocaleDateString('default', { month: 'long', year: 'numeric' })}
                </h3>
                <button onClick={goToNextMonth} className="ml-2 p-1 rounded-full bg-gray-200 hover:bg-gray-300">
                    &gt;
                </button>
            </div>
            <div className="grid grid-cols-7 gap-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="text-center text-gray-500">{day}</div>
                ))}
                {Array.from({ length: new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).getDay() }, (_, i) => (
                    <div key={`empty-${i}`} className="text-center"></div>
                ))}
                {generateDaysArray().map(({ day, hasEvent }) => (
                    <button
                        key={day}
                        className={`p-2 rounded-full hover:bg-gray-200 ${hasEvent ? 'bg-yellow-300' : ''}`}
                    >
                    {day}
                    </button>
                ))}
            </div>
        </div>
    );
};
