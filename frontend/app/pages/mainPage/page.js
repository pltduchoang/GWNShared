"use client";

import NavBar from "../../component/navBar";
import React from "react";
import Banner from "./banner";
import { useEffect, useState } from "react";
import { useContextProvider } from "../../utils/globalContext";
import BackgroundImage from "./backgroundImage";
import MeetCoach from "./meetCoach";
import PlanAndPricing from "./planAndPricing";
import TestimonySlideshow from "./testimonySlideshow";
import Footer from "@/app/component/footer";
import ContactUsForm from "../contactPage/contactUsForm";

export default function MainPage() {
    const title ="Home";

    // Get the menuHeight and setMenuHeight from the global context
    const { menuHeight, setMenuHeight } = useContextProvider();

  // Style to avoid the menu
  const avoidMenu = menuHeight ? { marginTop: menuHeight} : {marginTop: 90};

  


    return (
        <div className="min-h-screen">
            <div className="fixed top-0 left-0"
            style={{zIndex:-1}}>
                <BackgroundImage/>
            </div>
            <div className="fixed top-0 left-0 w-full"
            style={{zIndex:2}}>
                <NavBar currentPage={title}/>
            </div>
            <div className=""
            style={avoidMenu}>
                <Banner/>
            </div>
            <div className="bg-two-day">
                <div className=""><MeetCoach/></div>
            </div>
            <div>
                <PlanAndPricing currentPage={title}/>
            </div>
            <div className="w-full flex justify-center py-32">
                <div className="md:w-2/3 lg:w-6/12">
                    <TestimonySlideshow/>
                </div>
            </div>
            <div className="w-full bg-main-day pt-16">
                <ContactUsForm/>
                <Footer/>
            </div>

        </div>
    );
}