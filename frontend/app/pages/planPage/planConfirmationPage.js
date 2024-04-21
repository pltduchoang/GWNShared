"use client";
import React, { useState, useEffect } from "react";
import NavBar from "../../component/navBar";
import Checkout from "@/app/component/checkout";
import PayPalCheckout from "@/app/component/PayPalCheckout";
import PaymentSuccess from "../paymentSucess/page";
import PlanFormPage from "../planFormPage/page";
import { useUserAuth } from "../../utils/authContext";
import Link from 'next/link';
import Login from '../loginPage/page';



export default function PlanConfirmationPage({ selectedPlan, onGoBack, paymentDetails }) {
    const [paymentClicked, setPaymentClicked] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const { user } = useUserAuth();

    useEffect(() => {
        const checkLoggedIn = async () => {
            try {
                if (user.uid) {
                    setIsLoggedIn(true);
                } else {
                    setIsLoggedIn(false);
                }
            } catch (error) {
                console.log("Error checking user login status: ", error);
            }
        };
        checkLoggedIn();
    }, []);

    const handlePayment = () => {
        setPaymentClicked(true);
        // onPayment();
    };

    const paymentSuccessHandler = () => {
        console.log("Payment Success in planCOnfirmationPAge");
        setPaymentSuccess(true);
    };

    // remove the dollar sign from the price and convert to int
    const priceWithoutDollar = selectedPlan.price.replace('$', '');
    const priceInt = parseInt(priceWithoutDollar);

    /* 
        Object Items for selectedPlan
         .title = plan title
         .id = plan id
         .price = plan price
         .description = plan description
         .validPeriod = plan valid period
         .features = plan features
    */
    const planData = {
        title: selectedPlan.title,
        id: selectedPlan.id,
        price: priceInt,
        description: selectedPlan.description,
        validPeriod: selectedPlan.validPeriod,
        features: selectedPlan.features
    };

    console.log(selectedPlan.price)
    return (
        <div className="container mx-auto mt-10">
            {paymentSuccess ? (
                <PlanFormPage /> // Render PaymentSuccess component when payment is successful
            ) : (
                selectedPlan && (
                    <div> 
                        <h1 className="text-3xl font-bold mb-4">Plan Confirmation</h1>
                        <div className="bg-white p-4 rounded shadow">
                            <h2 className="text-xl font-semibold mb-2">{selectedPlan.title}</h2>
                            <p className="text-lg text-gray-600 mb-2">Price: ${priceInt}</p>
                            <p className="text-lg text-gray-600 mb-2">Description: {selectedPlan.description}</p>
                            <p className="text-lg text-gray-600 mb-2">Valid for: {selectedPlan.validPeriod}</p>
                            <div className="mb-2">
                                <p className="text-lg font-semibold mb-1">Features:</p>
                                <ul className="list-disc list-inside">
                                    {selectedPlan.features.map((feature, index) => (
                                        <li key={index} className="text-lg text-gray-600">{feature}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex flex-row mt-12">
                                <div className="mr-8">
                                    <button
                                        className="sign-button smooth-component-300"
                                        onClick={onGoBack}
                                    >
                                        Go Back
                                    </button>
                                </div>
                                <div>
                                    {isLoggedIn ? (
                                        <button className="sign-button smooth-component-300" onClick={handlePayment} disabled={paymentClicked}>
                                            {paymentClicked ? "Processing Payment..." : "Payment"}
                                        </button>
                                    ) : (
                                        <div className="flex">
                                            <Link className="sign-button  smooth-component-300" href="../pages/loginPage">
                                                Login
                                            </Link>
                                            <div>
                                                <p className="mt-2 ml-4 text-red-600">
                                                    To procceed with the payment you must be logged in
                                                </p>
                                            </div>
                                        </div>
                                       
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )
            )}
            {paymentClicked && !paymentSuccess && <PayPalCheckout planData={planData} paymentDetails={paymentDetails} successHandler={paymentSuccessHandler}/>}
        </div>
    );
}