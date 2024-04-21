"use client";
import React, { useState, useEffect } from "react";
import { useContextProvider } from "../../utils/globalContext";
import NavBar from "@/app/component/navBar";
import { getPaymentDetails  } from "../../api/paypal/route";
import { useRouter } from "next/navigation";

export default function PaymentSucess() {
  const router = useRouter();
    const [paymentDetails, setPaymentDetails] = useState(null);

    // useEffect(() => {
    //     if (router.query) {
    //         const { name, email, address, amount, date, paymentID, status } = router.query;
    //         if (name && email && address && amount && date && paymentID && status) {
    //             setPaymentDetails({
    //                 name,
    //                 email,
    //                 address,
    //                 amount,
    //                 date,
    //                 paymentID,
    //                 status
    //             });
    //         }
    //     }
    // }, [router.query]);

    // if (!paymentDetails) {
    //     return <p>Loading...</p>;
    // }

    const { menuHeight, setMenuHeight } = useContextProvider();
    const avoidMenu = menuHeight ? { marginTop: menuHeight } : { marginTop: 90 };
    
    const [payDetails, setPayDetails] = useState({});
    const [loading, setLoading] = useState(true);
    const [url, setUrl] = useState();

    // useEffect(() => {
    //     console.log("router: ", router)
    //     console.log("router.query: ", router.query)
    //     console.log("Payment ID: ", paymentId);
    //     if (paymentId) {
    //         fetchPaymentDetails(paymentId);
    //         console.log("Payment ID works: ", paymentId);
    //     }
    // }, [paymentId]);
  //   useEffect(() => {
  //     if (paymentID) { // Corrected from paymentId to paymentID
  //         fetchPaymentDetails(paymentID); // Corrected from paymentId to paymentID
  //     }
  // }, [paymentID]);


    async function fetchPaymentDetails(paymentID) {
        try {
            console.log("Fetching payment details");
            const response = await fetch(`../../api/paypal/webhook/${paymentID}`); // Adjust endpoint URL
            if (response.ok) {
                const data = await response.json();
                console.log("Payment Details: ", data);
                setPayDetails(data);
            } else {
                console.log("Error fetching payment details");
            }
        } catch (error) {
            console.log("Error fetching payment details", error);
        } finally {
            setLoading(false);
        }
    }
    

    return (
        <div className="min-h-screen">
            <NavBar currentPage="Payment Success" />
            <div className="container mx-auto" style={avoidMenu}>
                <h1 className="text-3xl font-bold text-center mt-12">Payment Successful!</h1>
                <p className="text-center mt-4">Thank you for your payment. Your account has been successfully upgraded.</p>
                <div>
                    <h1>Payment Details</h1>
                    <p>Payment ID: {payDetails.paymentId}</p>
                    <p>Plan Payed: {payDetails.planPayed}</p>
                    <p>Amount: {payDetails.amount}</p>
                    <p>Date: {payDetails.date}</p>
                    
                </div>
                <div className="text-center mt-8">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => router.push("/accountPage")}
                    >
                        Go to Account Page
                    </button>
                </div>
            </div>
        </div>
    );
    // return (
    //     <div>
    //       <h1>Welcome to Destination Page!</h1>
    //       {renderData ? (
    //         <div>
    //           <p>Name: {name}</p>
    //           <p>Email: {email}</p>
    //           <p>Address: {address}</p>
    //           <p>Amount: {amount}</p>
    //           <p>Date: {date}</p>
    //           <p>Payment ID: {paymentID}</p>
    //           <p>Status: {status}</p>
    //         </div>
    //       ) : (
    //         <p>One or more data parameters are missing.</p>
    //       )}
    //     </div>
    //   );
}