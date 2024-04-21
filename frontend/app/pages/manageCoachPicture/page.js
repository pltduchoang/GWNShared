// frontend/src/pages/manageCoachPicture/page.js
'use client';
import React, { useState, useEffect } from 'react';
import NavBar from '@/app/component/navBar';
import { useContextProvider } from '@/app/utils/globalContext';
import { useUserAuth } from '@/app/utils/authContext';
import CoachImageService from '@/app/services/coachImageService';
import ImageUpload from '@/app/component/imageUpload';
import Spinner from '@/app/component/spinner';

export default function ManageCoachPicture() {
    const [loading, setLoading] = useState(false);
    const [coachImages, setCoachImages] = useState([]);
    const [error, setError] = useState(null); // Define the error state
    const { user } = useUserAuth();
    const { refreshCount, setRefreshCount, menuHeight } = useContextProvider();
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        async function fetchCoachImages() {
            setLoading(true);
            try {
                const images = await CoachImageService.getAllCoachImages();
                setCoachImages(images.map(image => ({ ...image, tempURL: image.imageURL }))); // Add a tempURL for editable purposes
            } catch (error) {
                console.error('Failed to fetch coach images:', error);
                setError(error.toString());
            } finally {
                setLoading(false);
            }
        }
        fetchCoachImages();
    }, [refreshCount]);

    const handleURLReceive = async (url, id) => {
        // Update the local state
        const updatedImages = coachImages.map(image => {
            if (image.id === id) {
                return { ...image, tempURL: url };
            }
            return image;
        });
        setCoachImages(updatedImages);

        // Update in the database - This assumes you have such an endpoint and method available
        try {
            await CoachImageService.updateCoachImage(id, { imageURL: url });
            setRefreshCount(count => count + 1); // Trigger a refresh if needed
        } catch (error) {
            console.error('Failed to update coach image:', error);
        }
    };

    const handleImageAltChange = (e, id) => {
        const updatedImages = coachImages.map(image => {
            if (image.id === id) {
                return { ...image, imageALT: e.target.value };
            }
            return image;
        });
        setCoachImages(updatedImages);
    };

    useEffect(() =>{
        setAuthenticated(user !== null);
    }, [user]);

    const avoidMenu = menuHeight ? { marginTop: menuHeight } : { marginTop: 90 };

    const saveImages = async () => {
        setLoading(true);
      
        // A helper function to update each image and handle errors
        const updateImage = async (image) => {
          try {
            await CoachImageService.updateCoachImage(image.id, { imageURL: image.tempURL, imageALT: image.imageALT });
            console.log(`Image ${image.id} updated successfully.`);
          } catch (error) {
            console.error(`Failed to update image ${image.id}:`, error);
            throw error; // Rethrow to handle it in the caller
          }
        };
      
        // Iterate over all images and update them
        try {
          await Promise.all(coachImages.map(image => updateImage(image)));
          alert('All images have been updated successfully.');
        } catch (error) {
          alert('Failed to update one or more images. Check the console for more information.');
        } finally {
          setLoading(false);
          setRefreshCount(refreshCount + 1); // Optionally refresh data if needed
        }
      };
      

    return (
        <div className='min-h-screen bg-main-day text-main-day px-10' >
            <div className="fixed top-0 left-0 w-full" style={{ zIndex: 2 }}>
                <NavBar currentPage="Manage Coach Picture" />
            </div>
            {loading && <div className='fixed top-0 left-0 h-screen w-full bg-three-day opacity-85 text-main-day flex justify-center items-center'>
                <Spinner />
            </div>}
            {!authenticated && <div className='fixed top-0 left-0 h-screen w-full bg-three-day opacity-85 text-main-day flex flex-col justify-center items-center'>You are not yet authenticated, please wait or &nbsp; <a href='/' className=' underline hover:text-blue-500'>return to home</a><Spinner/></div>}
            {error && <div className='h-screen w-full bg-two-day text-main-day flex justify-center items-center'>Error: {error}, &nbsp; <a href='/' className=' underline hover:text-blue-500'>return to home</a></div>}
            {authenticated && (
                <div className='flex flex-col items-center my-20 pt-16 bg-main-day' style={avoidMenu}>
                    {coachImages.map((image) => (
                        <div key={image.id} className='flex flex-col lg:flex-row mb-16 border-2 border-slate-500 rounded-md p-6 bg-two-day shadow'>
                            <div  className='flex flex-col items-center w-full lg:w-1/3 justify-end lg:items-end lg:mr-24'>
                                <img src={image.tempURL} className="w-40 h-40 md:w-52 md:h-52 lg:w-58 lg:h-58 object-cover rounded-full" alt={image.imageALT || 'Coach'} />
                                <input
                                    type="text"
                                    value={image.imageALT || ''}
                                    placeholder="Coach's name"
                                    onChange={(e) => { handleImageAltChange(e, image.id)}}
                                    className="my-2"
                                />
                                
                            </div>
                            <div className='w-full px-10 lg:w-2/3 lg:pr-16'>
                                <ImageUpload folder='coach-images' setImageURL={(url) => handleURLReceive(url, image.id)}/>
                            </div>
                        </div>
                    ))}
                    <button onClick={saveImages} className='sign-button my-20'>Save</button>
                </div>
            )}
        </div>
    );
}
