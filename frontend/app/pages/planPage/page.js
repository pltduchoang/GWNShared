"use client";
import NavBar from "../../component/navBar";
import React from "react";
import { useContextProvider } from "../../utils/globalContext";
import PlanAndPricing from "../mainPage/planAndPricing"
import PlanConfirmationPage from "./planConfirmationPage";
import { useState } from "react";
import Footer from "@/app/component/footer";
// import PaymentForm from "./paymentForm";


export default function PlanPage() {

    const title = "Plans";

    // Get the menuHeight and setMenuHeight from the global context
    const { menuHeight, setMenuHeight } = useContextProvider();

    // Style to avoid the menu
    const avoidMenu = menuHeight ? { marginTop: menuHeight} : {marginTop: 90};

    const [selectedPlan, setSelectedPlan] = useState(null);
    const [showPlanAndPricing, setShowPlanAndPricing] = useState(true);
    const [paymentDetails, setPaymentDetails] = useState({});

    const handlePlanSelection = (plan) => {
        setSelectedPlan(plan);
        setShowPlanAndPricing(false);
    };

    const handleGoBack = () => {
        setSelectedPlan(null);
        setShowPlanAndPricing(true);
    };

    const handleOnSubmit = (formData) => {
        setPaymentDetails(formData)
    };

    return (
        <div className="min-h-screen">
            <div className="fixed top-0 left-0 w-full">
                <NavBar currentPage="Plans" />
            </div>
            {showPlanAndPricing ? (
                <div className="">
                    <PlanAndPricing onPlanSelect={handlePlanSelection} />
                    <Footer />
                </div>
            ) : (
                <div className="mt-32">
                    {/* <PaymentForm onSubmit={handleOnSubmit}/> */}
                    <PlanConfirmationPage 
                        selectedPlan={selectedPlan} 
                        onGoBack={handleGoBack} 
                        paymentDetails={paymentDetails}
                        currentPage={title}
                    />
                    <div className="mt-64">
                        <Footer />
                    </div>
                </div>
            )}
        </div>
    );
}