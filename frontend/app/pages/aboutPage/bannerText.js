"use client";

import Link from "next/link";


export default function BannerText() {
    // Text and button for the about us Banner page
    return (
        <div className="text-center text-three-day absolute inset-0 flex flex-col justify-center items-center p-12">
            <h1 className="text-4xl font-bold mb-6">About us</h1>
            <p className="">Our mission is to help you achieve your health and wellness goals by providing you with the tools and support you need to make lasting changes to your lifestyle.</p>
            <div className="mt-6">
                <p>Contact us for more information!</p>
                <Link href="/pages/contactPage">
                    <button className="mt-4 text-2xl text-three-day px-6 py-2 bg-item-day smooth-component-300 learn-more-button">
                        Contact Us
                    </button>
                </Link>
            </div>
        </div>
    );
}