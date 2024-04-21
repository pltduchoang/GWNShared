// root/app/pages/manageNewsletter/ManageNewsletterPage.js
'use client';
import React, { useState, useEffect } from 'react';
import CreateNewsletterModal from './createNewsletterModal'; // Assume a modal component for creating/editing newsletters
import NavBar from '@/app/component/navBar';
import { useUserAuth } from '@/app/utils/authContext';
import NewsletterService from '@/app/services/newsletterService';
import { useContextProvider } from '@/app/utils/globalContext';
import UserService from '@/app/services/userService';
import CreateCustomNewsletterModal from './createCustomNewsletterModal';
import mailService from '@/app/services/mailService';
import Spinner from '@/app/component/spinner';


export default function ManageNewsletter() {
    const [showModal, setShowModal] = useState(false);
    const [showCustomModal, setShowCustomModal] = useState(false);

    const [isEditing, setIsEditing] = useState(false);
    const [newsletters, setNewsletters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);



    // Ensure user is authenticated -----------------------------------------------------------------------
    const [authenticated, setAuthenticated] = useState(false);

    // Get the refreshCount from the global context -------------------------------------------------------
    const { refreshCount, setRefreshCount, menuHeight } = useContextProvider();

    // Get the user from the auth context -------------------------------------------------------------------
    const { user } = useUserAuth(); // Ensure user is authenticated


    const title = "Account";

    useEffect(() => {
      async function fetchNewsletters() {
          try {
              const data = await NewsletterService.getAllNewsletters();
              setNewsletters(data);
              setLoading(false);
          } catch (error) {
              setError(error.message); // Assuming the error object has a message property
              setLoading(false);
          }
      }
      fetchNewsletters();
    }, [refreshCount]);

    const handleCreateButtonClick = () => {
        setShowModal(true);
        setIsEditing(false);
    };


    // Ensure user is authenticated -----------------------------------------------------------------------
    useEffect(() => {
        setAuthenticated(user !== null);
    }, [user]);


    // Ensure the menu is avoid when the page is loaded ---------------------------------------------------
    const avoidMenu = menuHeight ? { marginTop: menuHeight} : {marginTop: 90};

    // Mailgun -----------------------------------------------------------------------
    // Send newsletter with mailgun

    // const handleSendNewsletter = async (newsletter) => {
    //     setLoadingSend(true); // Assuming you have this state setup to show loading feedback
    
    //     const subscribedUsers = await UserService.getSubscribedUsers(); // This needs to be properly implemented
    
    //     for (const user of subscribedUsers) {
    //         let decodedContent = decodeBase64(newsletter.content);
    //         decodedContent = decodedContent.replace("%%UNSUBSCRIBE_URL%%", `http://localhost:3000/api/newsletters/unsubscribeNewsletter/${user.id}/route`);
    
    //         const emailData = {
    //             from: 'Exciting News <newsletter@sandboxe0ccd640eb2a42a3be15eaf01ed87add.mailgun.org>',
    //             to: user.email,
    //             subject: newsletter.title,
    //             html: decodedContent,
    //         };
    
    //         try {
    //             // Directly await the result since mailService.sendEmail already returns the response json
    //             const result = await mailService.sendEmail(emailData);
    //             console.log('Newsletter sent to:', user.email, result); // Assuming result contains meaningful data for confirmation
    //         } catch (error) {
    //             console.error('Error sending newsletter:', error);
    //             // Optionally handle the error, e.g., break the loop, log the error, etc.
    //         }
    //     }
    
    //     // Update newsletter status here as needed
    //     // Reset any loading states or provide feedback
    //     setLoadingSend(false);
    // };

    // Send newsletter with sendgrid
    const handleSendNewsletter = async (newsletter) => {
        if(!window.confirm('Are you sure you want to send this newsletter?')) return;

        setLoading(true);
        const subscribedUsers = await UserService.getSubscribedUsers(); // This function needs to be properly implemented
    
        for (const user of subscribedUsers) {
            let decodedContent = decodeBase64(newsletter.content);
            decodedContent = decodedContent.replace("%%UNSUBSCRIBE_URL%%", `http://localhost:3000/api/newsletters/unsubscribeNewsletter/${user.id}/route`);
    
            const emailData = {
                from: 'duchoang@duchoang.dev', // Use your verified SendGrid sender email
                to: user.email,
                subject: newsletter.title,
                html: decodedContent,
            };
        
            try {
                const result = await mailService.sendEmailWithSendgrid(emailData);
                console.log('Newsletter sent to:', user.email, result);
            } catch (error) {
                console.error('Error sending newsletter:', error);
            }
        }

        // Update newsletter status here as needed
        const updatedNewsletter = { ...newsletter, sentStatus: true };
        try {
            await NewsletterService.updateNewsletter(updatedNewsletter.id, updatedNewsletter);
            alert('Newsletter sent successfully!');
            setRefreshCount(refreshCount + 1);
        }
        catch (error) {
            console.error('Error updating newsletter status:', error);
        }
        
        setLoading(false);
    };


    // Delete newsletter
    const handleDeleteButtonClick = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this newsletter?');
        if (confirmDelete) {
            try {
                const response = await NewsletterService.deleteNewsletter(id);
                alert('Newsletter deleted successfully!', response);
                setRefreshCount(refreshCount + 1);
            } catch (error) {
                setError(error.message); // Assuming the error object has a message property
            }
        }
    };


    // Render newsletter ---------------------------------------------------
    function decodeBase64(encodedStr) {
        try {
            return decodeURIComponent(atob(encodedStr).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
        } catch (e) {
            console.error('Error decoding base64 string', e);
            return '';
        }
    }
    // Render newsletter cards
    const renderNewsletters = () => {
        return newsletters.map((newsletter, index) => (
            <div key={index} style={{maxWidth:'500px'}}>
                <div className="bg-white shadow-lg rounded-lg p-5 overflow-hidden">
                    <h3 className="font-bold text-xl mb-3 text-center">{newsletter.title}</h3>
                    <div dangerouslySetInnerHTML={{ __html: decodeBase64(newsletter.content) }}></div>
                </div>
                <div className='button-container'>
                {newsletter.sentStatus ? (
                    <button onClick={() => handleSendAgain(newsletter)} className="sign-button">Already Sent</button>
                ) : (
                    <button onClick={() => handleSendNewsletter(newsletter)} className="sign-button">Send</button>
                )}
                <button onClick={() => handleDeleteButtonClick(newsletter.id)} className="sign-button">Delete</button>
            </div>
            </div>
        ));
    };


    // Send newsletter again
    const handleSendAgain = async (newsletter) => {
        const confirmSend = window.confirm('Are you sure you want to send this newsletter again, too many emails sent may be marked as spammed by the community?');
        if (confirmSend) {
            // Indicate loading state, if applicable
            await handleSendNewsletter(newsletter);
        }
    }

    


    return (
        <div className='min-h-screen bg-two-day text-main-day'>
            <div className="fixed top-0 left-0 w-full"
            style={{zIndex:2}}>
                <NavBar currentPage={title}/>
            </div>
            {loading && <div className='fixed top-0 left-0 h-screen w-full bg-three-day opacity-85 text-main-day flex justify-center items-center'>
                <Spinner />
            </div>}            
            {!authenticated && <div className='fixed top-0 left-0 h-screen w-full bg-three-day opacity-85 text-main-day flex flex-col justify-center items-center'>You are not yet authenticated, please wait or &nbsp; <a href='/' className=' underline hover:text-blue-500'>return to home</a><Spinner/></div>}
            {error && <div className='h-screen w-full bg-two-day text-main-day flex justify-center items-center'>Error: {error.message}, &nbsp; <a href='/' className=' underline hover:text-blue-500'>return to home</a></div>}
            {authenticated && (
              <div style={avoidMenu}>
                <h2 className='text-center text-3xl font-bold py-10'>Manage Newsletters</h2>
                <div className='button-container'>
                  <button onClick={handleCreateButtonClick} className='sign-button'>Create</button>
                  <button onClick={() => setShowCustomModal(true)} className='sign-button'>Customize</button>
                </div>
                <div className="w-full p-6 my-20 flex flex-wrap justify-center space-x-14">
                    {renderNewsletters()}
                </div>
                {showModal && (
                    <CreateNewsletterModal
                        showModal={showModal}
                        setShowModal={setShowModal}
                        isEditing={isEditing}
                        setIsEditing={setIsEditing}
                        // Pass any additional props needed for creating or editing newsletters
                    />
                )}
                {showCustomModal && (
                    <CreateCustomNewsletterModal
                        showCustomModal={showCustomModal}
                        setShowCustomModal={setShowCustomModal}/>
                )}
              </div>
            )}
        </div>
    );
}
