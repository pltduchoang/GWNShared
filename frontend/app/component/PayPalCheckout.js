// components/PayPalCheckout.js

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useUserAuth } from '../utils/authContext';
import TransactionService from '@/app/services/transactionService';
import { setupPayPalSDK } from '../utils/paypal';
import MailService from '@/app/services/mailService';


export default function PayPalCheckout({ planData, paymentDetails, successHandler }) {
    const clientID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const clientSecret = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_SECRET;

    const paypalBaseUrl='https://api.sandbox.paypal.com';
    
    const { user } = useUserAuth();
    
    // const router = useRouter();
    const [orderID, setOrderID] = useState(null);
    const [paypalLoaded, setPaypalLoaded] = useState(false);
    const [accessToken, setAccessToken] = useState(null);
    const [effectExecuted, setEffectExecuted] = useState(false);



    const getToken = async () => {
        try {
            const response = await fetch(`${paypalBaseUrl}/v1/oauth2/token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: `Basic ${Buffer.from(`${clientID}:${clientSecret}`).toString('base64')}`
                },
                body: 'grant_type=client_credentials'
            });
            const data = await response.json();
            return data.access_token;
        } catch (error) {
            console.error('Error fetching PayPal access token:', error);
            throw error;
        }
    };
    
    const createOrder = async () => {
        const requestBody = {
            intent: 'CAPTURE',
            application_context: {
                return_url: 'http://localhost:3000/pages/paymentSuccess',
                cancel_url: 'http://localhost:3000/pages/mainPage'
            },
            purchase_units: [
                {
                    amount: {
                        currency_code: 'USD',
                        value: planData.price,
                    },
                    description: `Payment for ${planData.title}.`,
                },
            ],
        };
    
        try {
            const accessToken = await getToken();
            console.log('Access token:', accessToken);
            console.log('Creating order...');
            const response = await fetch(`${paypalBaseUrl}/v2/checkout/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}` // Replace with your PayPal access token
                },
                body: JSON.stringify(requestBody),
            });
            if (!response.ok) {
                throw new Error('Failed to create order');
            }
            const data = await response.json();
            console.log('Order created:', data);
            setOrderID(data.id);
        } catch (error) {
            console.error('Error creating order:', error);
            // Handle error (e.g., show error message to user)
        }
    };
    
   
    const captureOrder = async (orderID, accessToken) => {
        try {
            const response = await fetch(`${paypalBaseUrl}/v2/checkout/orders/${orderID}/capture`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to capture order');
            }

            const data = await response.json();
            
            const dataString = data.purchase_units[0].payments.captures[0].create_time;
            const isoString = new Date(dataString).toISOString();
            const amountString = data.purchase_units[0].payments.captures[0].amount.value;
            const amountFloat = parseFloat(amountString);

            if (data.status === 'COMPLETED') {
                console.log('Payment successful:', data);
                const gatheredPaymentDetails = {
                    paymentID: data.id,
                    userID: user.uid,
                    plan: planData.title,
                    name: data.payer.name.given_name + " " + data.payer.name.surname,
                    email: data.payer.email_address,
                    address: data.purchase_units[0].shipping.address.address_line_1 + " " + data.purchase_units[0].shipping.address.address_line_2 + " " + data.purchase_units[0].shipping.address.admin_area_2,
                    amount: amountFloat,
                    date: isoString,
                    status: data.status
                };

                console.log("Gathered Payment Details: ", gatheredPaymentDetails);
                try {
                    await TransactionService.addTransaction(gatheredPaymentDetails);
                    console.log("Transaction added successfully");
                    successHandler();
                } catch (error) {
                    console.log("Error adding transaction", error);
                };
                // successHandler();
            }   
            // Handle successful capture
        } catch (error) {
            console.error('Error capturing order uwu:', error);
        }
    };
    
    useEffect(() => {
        createOrder();
    }, [planData]);

    useEffect(() => {
        let script;
    
        const loadPayPalSDK = () => {
            script = document.createElement('script');
            script.src = `https://www.paypal.com/sdk/js?client-id=${clientID}`;
            script.async = true;
            script.onload = () => setPaypalLoaded(true);
            document.body.appendChild(script);
        };
    
        if (!paypalLoaded) {
            loadPayPalSDK();
        }
    
        return () => {
            if (script && script.parentNode) {
                script.parentNode.removeChild(script);
            }
        };
    }, [clientID, paypalLoaded]);
    
    useEffect(() => {
        if (!effectExecuted && orderID && paypalLoaded) {
            let buttonsInstance;
    
            const initializePayPalCheckout = () => {
                buttonsInstance = paypal.Buttons({
                    createOrder: () => orderID,
                    onApprove: async (data, actions) => {
                        try {
                            const accessToken = await getToken();
                            await captureOrder(data.orderID, accessToken);
                        } catch (error) {
                            console.error('Error capturing order:', error);
                            // Handle error accordingly
                        }
                    },
                    onError: (err) => {
                        console.error('Payment error:', err);
                    },
                });
    
                buttonsInstance.render('#paypal-button-container');
            };
    
            initializePayPalCheckout();
            setEffectExecuted(true);
        }
    }, [orderID, paypalLoaded, effectExecuted]);


    return <div style={{zIndex:-1}} className='mt-12' id="paypal-button-container"></div>;
};