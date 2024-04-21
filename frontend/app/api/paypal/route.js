
// // const clientId = process.env.PAYPAL_CLIENT_ID;
// // const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

// console.log('util client id: ',clientId);
// console.log('util client secret: ',clientSecret);

// const paypalBaseUrl='https://api.sandbox.paypal.com';

// const getToken = async () => {
//     try {
//         const response = await fetch(`${paypalBaseUrl}/v1/oauth2/token`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/x-www-form-urlencoded',
//                 Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
//             },
//             body: 'grant_type=client_credentials'
//         });
//         const data = await response.json();
//         return data.access_token;
//     } catch (error) {
//         console.error('Error fetching PayPal access token:', error);
//         throw error;
//     }
// };

// const createPayment = async (accessToken, planData) => {
//     try {
//         console.log('creating payment');
//         const response = await fetch(`${paypalBaseUrl}/v1/payments/payment`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 Authorization: `Bearer ${accessToken}`
//             },
//             body: JSON.stringify({
//                 intent: 'sale',
//                 payer: {
//                     payment_method: 'paypal'
//                 },
//                 transactions: [
//                     {   // test data
//                         amount: {
//                             total: planData.price, 
//                             currency: 'CAD'
//                         },
//                         description: `Payment for ${planData.title}.`
//                     }
//                 ]
//             })
//         });
//         const data = await response.json();
//         console.log('PayPal Response:', data); // Log the entire response
//         const approvalUrl = data.links.find(link => link.rel === 'approval_url').href;
        
//         if (approvalUrl) {
//             // Payment created successfully, return the approval URL to the client
//             return { approvalUrl };
//         } else {
//             // Payment creation failed
//             throw new Error('Approval URL not found in PayPal response');
//         }
//     } catch (error) {
//         console.error('Error creating PayPal payment:', error);
//         throw error;
//     }
// };

// const getPaymentDetails = async (planData) => {
//     try {
//         const accessToken = await getToken();
//         const paymentData = await createPayment(accessToken, planData);
//         return paymentData.paymentData;
//     } catch (error) {
//         console.error('Error getting payment details:', error);
//         throw error;
//     }
// };

// module.exports = { getToken, createPayment, getPaymentDetails };

// // export default async function handler(req, res) {
// //     if (req.method === 'POST') {
// //         try {
// //             const accessToken = await getToken();
// //             const planData = req.body.planData;
            
// //             // Create payment
// //             const paymentData = await createPayment(accessToken, planData);

// //             // Redirect the user to PayPal for payment approval
// //             // res.redirect(paymentData.newApprovalUrl);
// //             res.status(200).json({ redirectUrl: paymentData.newApprovalUrl });
// //         } catch (error) {
// //             console.error('Error processing PayPal payment:', error);
// //             res.status(500).json({ error: 'Error processing PayPal payment' });
// //         }
// //     } else if (req.method === 'GET') {
// //         try {
// //             const accessToken = await getToken();
// //             const { paymentId, payerId } = req.query;

// //             // Execute payment
// //             const response = await executePayment(accessToken, paymentId, payerId);

// //             // Handle successful payment
// //             console.log('Payment executed successfully:', response);
// //             res.status(200).json({ message: 'Payment successful' });
// //         } catch (error) {
// //             console.error('Error executing PayPal payment:', error);
// //             res.status(500).json({ error: 'Error executing PayPal payment' });
// //         }
// //     } else {
// //         res.setHeader('Allow', ['POST', 'GET']);
// //         res.status(405).end('Method Not Allowed');
// //     }
// // }

// // module.exports = { getToken, createPayment };


    