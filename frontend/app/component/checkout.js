// 'use client';
// import { useEffect, useState } from 'react';
// import { getToken, createPayment } from '../api/paypal/route';
// import { useRouter } from 'next/navigation';

// export default function Checkout({ planData }) {
//     const router = useRouter();

//     const [payDetails, setPayDetails] = useState([]);

//     // Function to load PayPal SDK dynamically
//     function loadPayPalSDK() {
//         const script = document.createElement('script');
//         script.src = 'https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID';
//         script.async = true;
//         script.onload = initializePayPalCheckout;
//         document.body.appendChild(script);
//     }

//     // Function to initialize PayPal Checkout
//     function initializePayPalCheckout() {
//         // Render the PayPal button using the PayPal SDK
//         paypal.Buttons({
//             createOrder: function(data, actions) {
//                 // Create an order with PayPal
//                 return fetch('/api/createOrder', {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json'
//                     },
//                     body: JSON.stringify({
//                         planData: {
//                             price: planData.price, // Total amount for the payment
//                             title: planData.title // Plan title
//                         }
//                     })
//                 }).then(function(res) {
//                     return res.json();
//                 }).then(function(data) {
//                     return data.orderID; // Return the order ID to PayPal SDK
//                 }).catch(function(error) {
//                     console.error('Error creating order:', error);
//                 });
//             },
//             onApprove: function(data, actions) {
//                 // Capture the payment when the user approves the payment
//                 return fetch('/api/capturePayment', {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json'
//                     },
//                     body: JSON.stringify({
//                         orderID: data.orderID // Order ID returned by PayPal SDK
//                     })
//                 }).then(function(res) {
//                     return res.json();
//                 }).then(function(data) {
//                     console.log('Payment successful:', data);
//                     // Handle successful payment (e.g., display success message, update UI)
//                 }).catch(function(error) {
//                     console.error('Error capturing payment:', error);
//                     // Handle payment capture error (e.g., display error message, update UI)
//                 });
//             },
//             onError: function(err) {
//                 // Handle errors during the payment process
//                 console.error('Payment error:', err);
//                 // Display error message or update UI accordingly
//             }
//         }).render('#paypal-button-container'); // Render the PayPal button in a container with id "paypal-button-container"
//     }

//     // Load the PayPal SDK dynamically when the component mounts
//     useEffect(() => {
//         loadPayPalSDK();
//     }, []);

//     return (
//         <div>
//             <h1>Processing payment...</h1>
//             <div id="paypal-button-container"></div> {/* Container for rendering PayPal button */}
//         </div>
//     );
// }




// // 'use client';
// // import { useEffect, useState } from 'react';
// // import { getToken, createPayment } from '../api/paypal/route';
// // import { useRouter } from 'next/navigation';
// // // import Paypal from '../api/paypal/route';

// // export default function Checkout({ planData }) {
// //     const router = useRouter();

// //     const [payDetails, setPayDetails] = useState([]);

// //     useEffect(() => {
// //         const initiatePayment = async () => {
// //             try {
// //                 const accessToken = await getToken();
// //                 const {newApprovalUrl, paymentData} = await createPayment(accessToken, planData);
// //                 setPayDetails(paymentData);
// //                 console.log('paymentData: ', paymentData);
// //                 console.log('payment amount: ', paymentData.amount);
// //                 console.log('approval url: ', newApprovalUrl);
// //                 router.push(newApprovalUrl);
                
// //             } catch (error) {
// //                 console.log('Error initiating PayPal payment:', error);
// //             }
// //         };

// //         initiatePayment();
// //     }, [planData]);


// //     return (
// //         <div>
// //             <h1>Processing payment...</h1>
// //         </div>
// //     );
// // }
