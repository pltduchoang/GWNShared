//root/app/pages/manageNewsLetter/createCustomNewsletterModal.js
'use client';
import React, {useState, useEffect} from 'react';
import { useUserAuth } from '@/app/utils/authContext';
import { useContextProvider } from '@/app/utils/globalContext';
import NewsletterService from '@/app/services/newsletterService';
import DOMPurify from 'dompurify';
import CustomNewsletterReview from './customNewsletterReview';


export default function CreateCustomNewsletterModal({ showCustomModal, setShowCustomModal, isEditing, newsletterToEdit}) {
    const [title, setTitle] = useState(newsletterToEdit?.title || 'Default Title');
    const [content, setContent] = useState('');
    
    const { user } = useUserAuth();
    const { refreshCount, setRefreshCount } = useContextProvider();
    

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Sanitize the HTML content
        let sanitizedContent = DOMPurify.sanitize(content);
        // Footer HTML (ensure correct inline CSS for email compatibility)
           // Construct the full HTML email content with sanitized content and footer
        const fullHtmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email Template</title>
        </head>
        <body style="margin: 0; padding: 0;">
            <div style="display: block; width: 100%; max-width: 600px; margin: auto; background-color: #f6f4dd;">
                ${sanitizedContent}
            </div>
        
            <footer style="background-color: #333941; color: #f6f4dd; padding: 20px 0; text-align: center;">
                <p>Grow Within Nutrition, all rights reserved.</p>
                <a href="%%UNSUBSCRIBE_URL%%" style="display: 'block'; text-decoration: 'none'; padding: '10px 0';">Unsubscribe</a>
            </footer>
        </div>
        </body>
        </html>
        `;

        // Encode the sanitized content
        const encodedContent = Buffer.from(fullHtmlContent).toString('base64');

        // Construct your newsletter object here, including encoded content
        const newsletterData = {
            title,
            content: encodedContent, // Use the base64 encoded content
        };

        if (isEditing && newsletterToEdit?.id) {
            await NewsletterService.updateNewsletter(newsletterToEdit.id, newsletterData);
            alert("Newsletter updated successfully!");
        } else {
            await NewsletterService.createNewsletter(newsletterData);
            alert("Newsletter created successfully!");
        }

        // Reset modal state and close
        setTitle('');
        setContent('');
        setShowCustomModal(false);
        setRefreshCount(refreshCount + 1);
    };


    const handleCloseModal = () => {
        confirm('Are you sure you want to close? Data will be cleared!') && setShowCustomModal(false);
    };


    return (
        <div className={`modal min-h-screen ${showCustomModal ? 'show' : ''}`}>
            <div className='w-full flex flex-row'>
                <div className='w-full'>
                    <div className='modal-container-text-editor'>
                        <CustomNewsletterReview content={content} />
                    </div>
                </div>
                <div className='w-full'>
                    <div className='modal-container-text-editor' onClick={(e) => e.stopPropagation()}>
                        <form onSubmit={handleSubmit}>
                            <h2 className='text-center text-2xl font-bold'>{isEditing ? 'Edit Newsletter' : 'Create Customized Newsletter'}</h2>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Title"
                                className='h-10 bg-main-day border-b-2 border-slate-500 w-1/2'
                            />
                            <div className='mt-10'>
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Paste your HTML content here"
                                    rows={25}
                                    className='w-full bg-main-day border-2 border-slate-500'
                                />
                            </div>
                            <div className='button-container mt-20'>
                                <button className='sign-button' type="submit">{isEditing ? 'Update' : 'Create'}</button>
                                <button className='sign-button' type="button" onClick={handleCloseModal}>Close</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

    