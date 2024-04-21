// // utils/paypal.js
// import { PayPalHttpClient } from '@paypal/checkout-server-sdk';

// // Initialize PayPal client
// const client = new PayPalHttpClient({
// //   clientId: process.env.PAYPAL_CLIENT_ID,
// //   clientSecret: process.env.PAYPAL_CLIENT_SECRET,
//     environment: process.env.PAYPAL_ENVIRONMENT || 'sandbox',  
// });

// export async function createOrder(planData) {
//     try {
//         const response = await fetch('/api/createOrder', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//                 planData: {
//                     price: planData.price.toFixed(2), // Total amount for the payment
//                     title: planData.title // Plan title
//                 }
//             })
//         });
        
//         if (!response.ok) {
//             throw new Error('Failed to create order');
//         }

//         const data = await response.json();
//         return data.orderID; // Return the order ID to PayPal SDK
//     } catch (error) {
//         console.error('Error creating order:', error);
//         throw error;
//     }
// }

// // Function to capture the payment with PayPal
// export async function capturePayment(orderID) {
//     try {
//         const response = await fetch('/api/capturePayment', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//                 orderID // Order ID returned by PayPal SDK
//             })
//         });

//         if (!response.ok) {
//             throw new Error('Failed to capture payment');
//         }

//         const data = await response.json();
//         console.log('Payment successful:', data);
//         // Handle successful payment (e.g., display success message, update UI)
//     } catch (error) {
//         console.error('Error capturing payment:', error);
//         // Handle payment capture error (e.g., display error message, update UI)
//         throw error;
//     }
// }

// export const PayPalClient = {
//   createOrder,
//   capturePayment,
// };

