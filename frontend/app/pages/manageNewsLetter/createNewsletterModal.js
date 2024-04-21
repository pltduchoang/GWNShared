// root/app/pages/manageNewsletter/CreateNewsletterModal.js
'use client';
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useUserAuth } from '@/app/utils/authContext';
import { useContextProvider } from '@/app/utils/globalContext';
import NewsletterService from '@/app/services/newsletterService';
import NewsLetterTemplateOne from './newsLetterTemplateOne';
import ImageUpload from '@/app/component/imageUpload';
import DOMPurify from 'dompurify';

// Import QuillEditor dynamically to avoid SSR issues
const QuillEditor = dynamic(() => import('@/app/component/quillEditor'), {
  ssr: false,
});

const CreateNewsletterModal = ({ showModal, setShowModal, isEditing, newsletterToEdit }) => {
    const [title, setTitle] = useState(newsletterToEdit?.title || 'Default Title');
    const [content, setContent] = useState('');


    //TemplateOne default values -------------------------------------------------------------------------
    const [imageURL, setImageURL] = useState('https://firebasestorage.googleapis.com/v0/b/gwncapstone.appspot.com/o/soilBanner.jpg?alt=media&token=c75dbf69-92fd-4536-bcae-edac374d067b');
    // Initialize mainParagraph and header with Quill-compatible content
    const [mainParagraph, setMainParagraph] = useState(newsletterToEdit?.mainParagraph || '<p>Your Main Paragraph Here...</p>');
    const [header, setHeader] = useState(newsletterToEdit?.header || '<h1>Your Header Here...</h1>');
    const [bannerText, setBannerText] = useState('Your Banner Text Here...');
    const [bannerButtonText, setBannerButtonText] = useState('Click Me');
    const [bannerButtonLink, setBannerButtonLink] = useState('#');
    const [instagramLink, setInstagramLink] = useState('https://instagram.com');
    const [facebookLink, setFacebookLink] = useState('https://facebook.com');
    const [xLink, setXLink] = useState('https://twitter.com');



    const { user } = useUserAuth();
    const { refreshCount, setRefreshCount } = useContextProvider();

    useEffect(() => {
        if (isEditing && newsletterToEdit?.content) {
            setContent(newsletterToEdit.content);
        }
    }, [isEditing, newsletterToEdit]);


    const handleSubmit = async (event) => {
        event.preventDefault();
        const sanitizedHeader = DOMPurify.sanitize(header);
        const sanitizedMainParagraph = DOMPurify.sanitize(mainParagraph);

    
        // Assuming 'title', 'imageURL', 'sanitizedHeader', 'sanitizedMainParagraph', 'bannerText', 'bannerButtonLink', 'bannerButtonText', 'instagramLink', 'facebookLink', 'xLink' are already defined in your component state
    
        const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Template</title>
        </head>
        <body style="margin: 0; padding: 0;">
            <div style="display: block; width: 100%; max-width: 600px; margin: auto; background-color: #f6f4dd;">
                <table style="width: 100%; background-color: #96af4e; padding: 10px 0;">
                    <tr>
                        <td style="width: 45%; text-align: right; padding-right: 20px;">
                            <a href="https://gwinutrition.com">
                                <img src="https://firebasestorage.googleapis.com/v0/b/gwncapstone.appspot.com/o/logo.png?alt=media&token=694cce0f-84a8-4b24-9176-91310a0ecf59" alt="Company logo" style="width: 100%; height: auto; max-width: 250px;"/>
                            </a>
                        </td>
                        <td style="width: 55%; text-align: left; vertical-align: middle; font-size: 1.5em; padding-top: 10px;">
                            ${sanitizedHeader}
                        </td>
                    </tr>
                </table>

                <div style="width: 100%; text-align: center;">
                    <img src="${imageURL}" alt="Main image" style="width: 100%; height: auto; max-width: 600px; object-fit: cover;"/>
                </div>

                <div style="padding: 40px 60px; min-height: 200px;">
                    ${sanitizedMainParagraph}
                </div>

                <table style="width: 100%; background-color: #96af4e; padding: 20px 0; min-height: 100px;">
                    <tr>
                        <td style="width: 50%; padding: 0 60px; text-align: center; font-weight: bold; font-size: 1.2em; color: #f6f4dd;">
                            <p>${bannerText}</p>
                        </td>
                        <td style="width: 50%;">
                            <a href="${bannerButtonLink}" style="background-color: #333941; color: #f6f4dd; padding: 5px 10px; text-decoration: none; text-align: center; cursor: pointer; display: inline-flex; justify-content: center; align-items: center; min-height: 45px; max-width: 200px;">${bannerButtonText}</a>
                        </td>
                    </tr>
                </table>

                <div style="background-color: #333941; text-align: center; padding: 20px 0;">
                    <table style="margin: 0 auto;">
                        <tr>
                            <td>
                                <a href="${instagramLink}">
                                    <img src="https://firebasestorage.googleapis.com/v0/b/gwncapstone.appspot.com/o/instagram-svgrepo-com.png?alt=media&token=03597001-337d-4770-8a1d-fcaed92b1a6a" alt="Instagram link" style="max-width: 65px; margin: 0 10px;"/>
                                </a>
                            </td>
                            <td>
                                <a href="${facebookLink}">
                                    <img src="https://firebasestorage.googleapis.com/v0/b/gwncapstone.appspot.com/o/facebook-color-svgrepo-com.png?alt=media&token=1a3728a5-dace-4870-bfda-4b5095732149" alt="Facebook link" style="max-width: 53px; margin: 0 10px;"/>
                                </a>
                            </td>
                            <td>
                                <a href="${xLink}">
                                    <img src="https://firebasestorage.googleapis.com/v0/b/gwncapstone.appspot.com/o/twitter-svgrepo-com.png?alt=media&token=bb9f5138-7d4e-409b-a4f7-95e0d678e0b7" alt="X link" style="max-width: 63px; margin: 0 10px;"/>
                                </a>
                            </td>
                        </tr>
                    </table>
                </div>

                <footer style="background-color: #333941; color: #f6f4dd; padding: 20px 0; text-align: center;">
                    <p>Grow Within Nutrition, all rights reserved.</p>
                    <a href="%%UNSUBSCRIBE_URL%%" style="display: 'block'; textDecoration: 'none'; padding: '10px 0';">Unsubscribe</a>
                </footer>
            </div>
        </body>
        </html>
        `;

        const encodedContent = Buffer.from(htmlContent).toString('base64');
        
        try {
            const newsletterData = {
                title,
                content: encodedContent, // Use the encodedContent directly
                imageURL,
                sentStatus: false,
                createdById: user?.uid,
                updatedById: user?.uid
            };
    
            console.log(newsletterData);
    
            if (isEditing && newsletterToEdit?.id) {
                await NewsletterService.updateNewsletter(newsletterToEdit.id, newsletterData);
                alert("Newsletter updated successfully!");
            } else {
                await NewsletterService.createNewsletter(newsletterData);
                alert("Newsletter created successfully!");
            }
    
            // Your modal closing and refresh logic remains the same
            setShowModal(false);
            setRefreshCount(refreshCount + 1);
        } catch (error) {
            console.error('Failed to submit newsletter:', error);
            alert("Failed to submit newsletter.");
        }
    };


    const handleCloseModal = () => {
        confirm('Are you sure you want to close? Data will be cleared!') && setShowModal(false);
    };

    const handleURLReceive = (url) => {
        setImageURL(url);
    };

    return (
        <div className={`modal min-h-screen ${showModal ? 'show' : ''}`}>
            <div className='w-full flex flex-row'>
                <div className='w-full'>
                    <div className='modal-container-text-editor '>
                        <NewsLetterTemplateOne
                        header = {header}
                        imageURL = {imageURL}
                        mainParagraph = {mainParagraph}
                        bannerText = {bannerText}
                        bannerButtonText = {bannerButtonText}
                        bannerButtonLink = {bannerButtonLink}
                        instagramLink = {instagramLink}
                        facebookLink = {facebookLink}
                        xLink ={xLink}/>
                    </div>
                </div>
                <div className='w-full'>
                    <div className='modal-container-text-editor' onClick={(e) => e.stopPropagation()}>
                        <form onSubmit={handleSubmit}>
                            <h2 className='text-center text-2xl font-bold'>{isEditing ? 'Edit Newsletter' : 'Create Newsletter'}</h2>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Title"
                                className='h-10 bg-transparent border-b-2 border-slate-500 w-1/2'
                            />
                            <div className='mt-20'>
                                <label>Header</label>
                                <QuillEditor value={header} setContent={setHeader}/>
                            </div>
                            <div className='mt-10'>
                                <ImageUpload folder="newsletter-images" setImageURL={handleURLReceive} />
                            </div>
                            <div className='mt-20'>
                                <label>Main Paragraph</label>
                                <QuillEditor value={mainParagraph} setContent={setMainParagraph}/>
                            </div>
                            <div className='mt-20 flex w-full items-end'>
                                <label className='w-60'>Banner Text</label>
                                <input
                                    type="text"
                                    value={bannerText}
                                    onChange={(e) => setBannerText(e.target.value)}
                                    placeholder="Banner Text"
                                    className='h-10 bg-transparent border-b-2 border-slate-500 w-1/2'
                                />
                            </div>
                            <div className='flex w-full items-end'>
                                <label className='w-60'>Banner Button Text</label>
                                <input
                                    type="text"
                                    value={bannerButtonText}
                                    onChange={(e) => setBannerButtonText(e.target.value)}
                                    placeholder="Banner Button Text"
                                    className='h-10 bg-transparent border-b-2 border-slate-500 w-1/2'
                                />
                            </div>
                            <div className='flex w-full items-end'>
                                <label className='w-60'>Banner Button Link</label>
                                <input
                                    type="text"
                                    value={bannerButtonLink}
                                    onChange={(e) => setBannerButtonLink(e.target.value)}
                                    placeholder="Banner Button Link"
                                    className='h-10 bg-transparent border-b-2 border-slate-500 w-1/2'
                                />
                            </div>
                            <div className='flex w-full items-end'>
                                <label className='w-60'>Instagram Link</label>
                                <input
                                    type="text"
                                    value={instagramLink}
                                    onChange={(e) => setInstagramLink(e.target.value)}
                                    placeholder="Instagram Link"
                                    className='h-10 bg-transparent border-b-2 border-slate-500 w-1/2'
                                />
                            </div>
                            <div className='flex w-full items-end'>
                                <label className='w-60'>Facebook Link</label>
                                <input
                                    type="text"
                                    value={facebookLink}
                                    onChange={(e) => setFacebookLink(e.target.value)}
                                    placeholder="Facebook Link"
                                    className='h-10 bg-transparent border-b-2 border-slate-500 w-1/2'
                                />
                            </div>
                            <div className='flex w-full items-end'>
                                <label className='w-60'>X Link</label>
                                <input
                                    type="text"
                                    value={xLink}
                                    onChange={(e) => setXLink(e.target.value)}
                                    placeholder="X Link"                                    
                                    className='h-10 bg-transparent border-b-2 border-slate-500 w-1/2'
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

export default CreateNewsletterModal;
