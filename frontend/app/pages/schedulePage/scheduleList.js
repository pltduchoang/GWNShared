import React from "react";

export default function ScheduleList({ scheduleData }) {


    return(
        <div className="grid grid-cols-4 gap-2 max-w-[800px] mx-auto mb-24">
            {scheduleData.map((slot, index) => (
                <div key={index} className="p-4 border border-gray-300 rounded-lg">
                <div className="font-semibold">{slot.event}</div>
                <div>{slot.date}</div>
                <div>{slot.time}</div>
                </div>
            ))}
        </div>
    );
}