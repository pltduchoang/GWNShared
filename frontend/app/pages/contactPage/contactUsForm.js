//import axios from 'axios';
//import React from 'react';

import React, { useEffect, useState } from 'react';

import { useUserAuth } from '@/app/utils/authContext';
import mailService from '@/app/services/mailService';

export default function ContactUsForm() {


    const { user } = useUserAuth();


    const [formData, setFormData] = useState({});

    const handleChange = (event) => {
        setFormData({
          ...formData,
          [event.target.name]: event.target.value
        });
      };


    useEffect(() => {
        setFormData({
            firstName: user ? user.profile.firstName : "",
            lastName: user ? user.profile.lastName : "",
            email: user ? user.email : "",
            message: "",
        });
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const emailContent = {
            from: 'gwnsupport@duchoang.dev', // Your verified sender email
            to: 'plt.duchoang@gmail.com', // Recipient's email address
            subject: `Contact from ${formData.firstName} ${formData.lastName} <${formData.email}>`, // Include user's email in subject
            html: `
                <p>Message from ${formData.firstName} ${formData.lastName} (${formData.email}):</p>
                <p>${formData.message}</p>
            `,
            // Optionally, include a plain text version of the email content
            text: `Message from ${formData.firstName} ${formData.lastName} (${formData.email}):\n\n${formData.message}`,
        };

        try {
            await mailService.sendEmailWithSendgrid(emailContent);
            alert("Message sent successfully!");
            setFormData({
                firstName: user ? user.profile.firstName : "",
                lastName: user ? user.profile.lastName : "",
                email: user ? user.email : "",
                message: "",
            });
            
        }
        catch (error) {
            alert("Error sending message: " + error.message);
        }
            
    }




    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-xl mx-auto text-black">
                <h2>Contact us:</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="firstName" className="block text-gray-700 text-sm font-bold mb-2">
                            First Name:
                        </label>
                        <input type="text" id="firstName" name="firstName" required
                               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                               value={formData.firstName}
                               onChange={handleChange}
                        />

                    </div>
                    <div className="mb-4">
                        <label htmlFor="lastName" className="block text-gray-700 text-sm font-bold mb-2">
                            Last Name:
                        </label>
                        <input type="text" id="lastName" name="lastName" required
                               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                               value={formData.lastName}
                               onChange={handleChange}
                        />

                    </div>
                    <div className="mb-4">
                        <label htmlFor="emailAddress" className="block text-gray-700 text-sm font-bold mb-2">
                            Email Address:
                        </label>
                        <input type="email" id="email" name="email" required
                               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                               value={formData.email}
                               onChange={handleChange}
                        />

                    </div>
                    <div className="mb-6">
                        <label htmlFor="message" className="block text-gray-700 text-sm font-bold mb-2">
                            Message:
                        </label>
                        <textarea id="message" name="message" required
                                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" rows="3"
                                  value={formData.message}
                                  onChange={handleChange}
                                  placeholder='Type your message here...'
                        >
                        </textarea>
                                  
                    </div>
                    <div className="button-container">
                        <button type="submit" 
                                className="sign-button">
                            Send
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
}