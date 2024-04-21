"use client";
import NavBar from "../../component/navBar";
import React from "react";
import { useContextProvider } from "../../utils/globalContext";
import { useEffect, useRef } from "react";
import BackgroundImage from "./backgroundImage";
import BannerText from "./bannerText";
import People from "./people";
import Footer from "@/app/component/footer";

export default function InfoPage() {

    // How it works page text
    

    const title = "How it works";

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
                    <h1 className="text-4xl text-center text-black text-blackfont-bold mb-4">Your path to success starts here.</h1>
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