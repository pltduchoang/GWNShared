"use client";
import React from "react";
import { useState, useEffect, useRef } from "react";
import FieldInput from "../../component/fieldInput";
import Link from "next/link";

//TODO: Colour consistency
//TODO: Get Data from database to autofill fields

export default function BookingFields({ selectedDate }) {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [service, setService] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [message, setMessage] = useState("");

    const handleBookingClick = () => {
        const formData = {
            name,
            email,
            phone,
            service,
            date,
            time,
            message,
        };
    };

    return (
        <div className="max-w-lg mx-auto p-6">
            <div className="flex flex-col space-y-4">
                {/*Name Field*/}
                <div className="flex flex-col">
                    <label htmlFor="name" className="text-sm font-semibold">Name</label>
                    <input 
                        type="text" 
                        name="name" 
                        placeholder="Name" 
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" 
                    />
                </div>
                {/*Email Field*/}
                <div className="flex flex-col">
                    <label htmlFor="email" className="text-sm font-semibold">Email</label>
                    <input 
                        type="email" 
                        name="email" 
                        placeholder="Email" 
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" 
                    />
                </div>
                {/*Phone and Service Fields*/}
                <div className="flex flex-row space-x-4">
                    {/*Phone Field*/}
                    <div className="flex flex-col flex-1 w-48">
                        <label htmlFor="phone" className="text-sm font-semibold">Phone</label>
                        <input 
                            type="text" 
                            name="phone" 
                            placeholder="Phone" 
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" 
                        />
                    </div>
                    {/*Service Field*/}
                    <div className="flex flex-col flex-1 w-48">
                        <label htmlFor="service" className="text-sm font-semibold">Service</label>
                        <input 
                            type="text" 
                            name="service"  
                            placeholder="Service" 
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" 
                        />
                    </div>
                </div>
                {/*Date and Time Fields*/}
                <div className="flex flex-row space-x-4">
                    {/*Date Field*/}
                    <div className="flex flex-col flex-1 w-48">
                        <label htmlFor="date" className="text-sm font-semibold">Date</label>
                        <input 
                            type="text" 
                            name="date" 
                            placeholder="Select a Date" 
                            onChange={(e) => setDate(e.target.value)} 
                            value={selectedDate.toLocaleDateString()} 
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" 
                        />
                    </div>
                    {/*Time Field*/}
                    <div className="flex flex-col flex-1 w-48">
                        <label htmlFor="time" className="text-sm font-semibold">Time</label>
                        <select 
                            name="time" 
                            id="time" 
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        >
                            {/*Hours of the Day, Military Time*/}
                            {Array.from({ length: 24 }, (_, index) => (
                            <option onChange={(e) => setTime(e.target.value)} key={index + 1} value={index + 1}>{index + 1}:00</option>
                            ))}
                        </select>
                    </div>
                </div>
                {/*Message Field*/}
                <div className="flex flex-col">
                    <label htmlFor="message" className="text-sm font-semibold">Message</label>
                    <textarea 
                        name="message" 
                        placeholder="Message" 
                        rows="4" 
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" 
                    />
                </div>
                {/*Book Appointment Button*/}
                <div className="inline-flex justify-center">
                    <Link href="/pages/schedulePage" className="h-18 w-40 bg-gray-800 text-white p-2 justify-center items-center border border-gray-800 rounded-lg transition duration-100 ease-in-out hover:bg-gray-200 hover:text-gray-900 hover:border-gray-900 font-bold cursor-pointer">
                        <button onClick={handleBookingClick}>
                            Book Appointment
                        </button>
                    </Link>
                </div>
            </div>
        </div>
      );
      
}