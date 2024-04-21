"use client";
import NavBar from "../../component/navBar";
import React from "react";
import { useContextProvider } from "../../utils/globalContext";
import { useEffect, useRef } from "react";
import BackgroundImage from "./backgroundImage";
import BannerText from "./bannerText";
import People from "./people";
import Footer from "@/app/component/footer";


export default function AboutPage() {

    // About us page text
    const para1 = "Hey there! We're not your average team - we're a group of vibrant folks who've collectively rocked the weight loss and nutrition scene collectively for a whopping 30 years! Picture this: each of us is fueled by an insatiable passion for making your health and wellness dreams a reality.";
    const para2 = "Our journey started in the good old days of shared experiences and helping hundreds of individuals with their health & wellness goals at our previous gig. Fast forward to 2023, and, well, let's just say we found ourselves at the starting line of something new. The company we loved closed its doors, but it wasn't the end - it was the beginning of Grow Within Nutrition.";
    const para3 = "Why? Because we couldn't bear the thought of leaving our awesome clients hanging. Whether you're a familiar face or a new friend, we're here to bring the energy, knowledge, and support needed to crush your health and wellness goals.";
    const para4 = "Meet our dream team - a bunch of certified life & nutrition coaches with backgrounds as diverse as our snack preferences. We're not just experienced; we're dedicated, motivated, and totally get what it takes to shift gears and see long lasting results.";
    const para5 = "Together, we're on a mission: making sure every individual out there achieves their goals, all while embracing a balanced, sustainable, and non-restrictive journey. Ready to grow your skills with us?";
    

    const title = "About us";

    const { menuHeight, setMenuHeight } = useContextProvider();
    const menuDiv = useRef(null);

    useEffect(() => {
        updateDivHeights();
        window.addEventListener('resize', updateDivHeights);

        return () => {
            window.removeEventListener('resize', updateDivHeights);
        };
    }, []);

    const updateDivHeights = () => {
        if (menuDiv.current) {
            setMenuHeight(menuDiv.current.clientHeight);
        }
    };

    const avoidMenu = {
        marginTop: menuHeight,
    };

    return (
        <div className="min-h-screen bg-main-day">
            <div className="fixed top-0 left-0 w-full"
            style={{zIndex:2}}>
                <NavBar currentPage={title}/>
            </div>
            <div className="relative h-[600px] w-full">
                <BackgroundImage />
                <BannerText />
                <div className=""></div>
            </div>
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto text-black">
                    <h1 className="text-4xl text-center font-bold mb-4">Meet the Coaches & Read Our Story</h1>
                    <div className="text-center">
                        <p className="mb-4">{para1}</p>
                        <p className="mb-4">{para2}</p>
                        <p className="mb-4">{para3}</p>
                        <p className="mb-4">{para4}</p>
                        <p className="mb-4">{para5}</p>
                    </div>
                </div>
            </div>
            <div>
                <People />
            </div>
            <div className="mt-20">
                <Footer/>
            </div>
        </div>
    );
}  
                