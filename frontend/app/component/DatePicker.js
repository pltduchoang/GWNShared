import React, { useState } from 'react';

//TODO: Prevent date selection before current day/month
//TODO: Style Calander to prevent overflow, and make it look better

export default function DatePicker(props) {
    // Initialize selected date state
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Function to handle date selection
    const handleDateClick = (date) => {
      setSelectedDate(date);
      props.setSelectedDate(date);
    };

    // Function to get the number of days in a month
    const getDaysInMonth = (month, year) => {
      return new Date(year, month + 1, 0).getDate();
    };

    // Function to generate an array of days in a month
    const generateDaysArray = () => {
      const daysInMonth = getDaysInMonth(selectedDate.getMonth(), selectedDate.getFullYear());
      return Array.from({ length: daysInMonth }, (_, i) => i + 1);
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
                &lt;
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
            {generateDaysArray().map((day) => (
                <button
                  key={day}
                  onClick={() => handleDateClick(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day))}
                  className={`p-2 rounded-full hover:bg-gray-200 ${
                    selectedDate.getDate() === day ? 'bg-gray-300' : ''
                  }`}
                >
                  {day}
                </button>
            ))}
          </div>
      </div>
    );
};
