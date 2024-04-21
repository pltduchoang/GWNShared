//import axios from 'axios';
//import React from 'react';

import React, { useState } from 'react';

import { useUserAuth } from '@/app/utils/authContext';
import mailService from '@/app/services/mailService';

export default function People() {
/*    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = {
            firstName: event.target.firstName.value,
            email: event.target.emailAddress.value,
            message: event.target.message.value
        };

        try {
            // Replace 'http://your-backend-endpoint/send' with your actual backend endpoint
            const response = await axios.post('http://your-backend-endpoint/send', formData);
            alert("Message sent successfully: " + response.data);
            // You can clear the form or redirect the user to another page if needed
        } catch (error) {
            alert("Error sending message: " + error.message);
            // Handle errors here
        }
    };
*/

    const { user } = useUserAuth();

    const initialFormData = {
        firstName: "",
        lastName: "",
        email: "",
        message: "",
    };

    const [formData, setFormData] = useState(initialFormData);
    const [isFetching, setIsFetching] =useState(false)

    const handleChange = (event) => {
        setFormData({
          ...formData,
          [event.target.name]: event.target.value
        });
      };
      
    // const handleSubmit = async (event) => {
    //     event.preventDefault();
    //     if (!formData.firstName || !formData.email) return;
    //     setIsFetching(true);
    //     try {
    //         // Make a POST request to send the formData
    //         const response = await fetch("/api/send", {
    //           method: "POST",
    //           body: JSON.stringify({ ...formData }),
    //         });
    //         setFormData(initialFormData);
    //         const {data} = await response.json();
    //         if (data) toast.success('Email ${data.id} was successfully sent!')
    //     } catch (error) {
    //         toast.error('Something went wrong', error)
    //     }
    //     setIsFetching(false);
    // };

    const handleSubmit = async (event) => {
        e.preventDefault();
        const emailContent = {
            from: formData.email,
            to: 'support@sandboxe0ccd640eb2a42a3be15eaf01ed87add.mailgun.org',
            subject: 'Contact from ' + formData.firstName + ' ' + formData.lastName ,
            html: `
                <p>${formData.message}</p>
            `,
        }

        try {
            const result = await mailService.sendEmail(emailContent);
            console.log('Email sent:', result);
            alert('Email sent:', result);
        } catch (error) {
            console.error('Error sending email:', error);
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
                        <input type="email" id="emailAddress" name="emailAddress" required
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
                        >
                        </textarea>
                                  
                    </div>
                    <div className="flex items-center justify-between">
                        <button type="submit" 
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled={isFetching}">
                            Send
                        </button>
                    </div>
                </form>
                <div>
                    <ToastContainer></ToastContainer>
                </div>
            </div>
        </div>
    );
}