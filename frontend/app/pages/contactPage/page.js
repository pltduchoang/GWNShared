"use client";
import NavBar from "../../component/navBar";
import React from "react";
import { useContextProvider } from "../../utils/globalContext";
import { useEffect, useRef } from "react";
import BackgroundImage from "./backgroundImage";
import BannerText from "./bannerText";
import ContactUsForm from "./contactUsForm";
import Footer from "@/app/component/footer";

export default function ContactPage() {

    const title = "Contact us";

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
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-1xl text-center text-black text-blackfont-bold mb-4">Reach out to us with your questions, feedback, or ideas. Fill out our contact form, and we'll ensure your message is directed to the right place. Your thoughts matter to us.</h1>
                </div>
            </div>
            <div>
                <ContactUsForm />
            </div>
            <div className="mt-20">
                <Footer />
            </div>
        </div>
    );
}