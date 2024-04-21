'use client';

import React from "react";
import Link from "next/link";

export default function Footer() {
    return (
        <div className="flex flex-col w-full bg-item-day text-three-day pb-10 xl:px-16">
            <div className="flex flex-col md:flex-row p-6 md:p-10">
                <div className="w-full md:w-5/12 lg:w-1/3 mb-6 md:mb-0 md:border-r-2 md:border-slate-200 md:pl-6 lg:pl-16">
                    <h2>Contact Us</h2>
                    <p>Phone: 123-456-7890</p>
                    <p className="">Email: tobeupdated@gwinutrition.com</p>
                </div>
                <div className="w-full md:w-3/12 lg:w-1/3 mb-6 md:mb-0 md:border-r-2 md:border-slate-200 md:pl-6 lg:pl-16">
                    <h2>Address</h2>
                    <p>1300 16 Ave SW,</p>
                    <p>Calgary, Alberta</p>
                    <p className="">T3C 3P6</p>
                </div>
                <div className="w-full md:w-4/12 lg:w-1/3 mb-6 md:pl-6 md:mb-0 lg:pl-16">
                    <h2>Hours of Operation</h2>
                    <p>Monday to Friday: 07:00am - 07:00pm</p>
                    <p>Saturday" 07:30am to -02:30pm</p>
                    <p className="">Closed on Sunday and Holidays</p>
                </div>
            </div>
            <div className="flex flex-col md:flex-row px-6 md:px-10">
                <div className="w-full md:w-5/12 lg:w-1/3 md:pl-6 lg:pl-16">
                    <Link className="text-sm underline" href="#">CONTACT US</Link>
                </div>
                <div className="w-full md:w-3/12 lg:w-1/3 md:pl-6 lg:pl-16">
                    <a className="text-sm underline">GET DIRECTION </a>
                </div>
                <div className="w-full md:w-4/12 md:pl-6 lg:w-1/3 lg:pl-16">
                    <Link className="text-sm underline" href="#">BOOK APPOINTMENT</Link>
                </div>
            </div>
        </div>
    )
}