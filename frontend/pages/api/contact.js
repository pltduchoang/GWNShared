// pages/api/contact.js

import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { firstName, email, message } = req.body;

        // Create a transporter object using the default SMTP transport
        const transporter = nodemailer.createTransport({
            // Your SMTP settings (e.g., using Gmail)
            service: 'gmail', // Example using Gmail; replace with your service
            auth: {
                user: process.env.EMAIL_USER, // Your email
                pass: process.env.EMAIL_PASS, // Your password
            },
        });

        // Set up email data
        const mailOptions = {
            from: email, // Sender address from the form
            to: process.env.RECEIVER_EMAIL, // Your email where you want to receive messages
            subject: `New Contact Message from ${firstName}`, // Subject line
            text: message, // Plain text body
            html: `<p><strong>From:</strong> ${firstName} <${email}></p><p>${message}</p>`, // HTML body
        };

        try {
            await transporter.sendMail(mailOptions);
            res.status(200).json({ status: 'success', message: 'Email sent successfully' });
        } catch (error) {
            console.error('Error sending email:', error);
            res.status(500).json({ status: 'error', message: 'Error sending email', error: error.message });
        }
    } else {
        // Only POST method is accepted
        res.setHeader('Allow', ['POST']);
        res.status(405).json({ status: 'error', message: `Method ${req.method} not allowed` });
    }
}
