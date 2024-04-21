// root/frontend/app/component/ImageUpload.js
import React, { useState, useEffect } from 'react';
import { storage } from '@/app/utils/firebase'; // Adjust the path to your Firebase config
import { ref, uploadBytesResumable, getDownloadURL, listAll, getMetadata } from 'firebase/storage';
import { useContextProvider } from '../utils/globalContext';

const ImageUpload = ({ folder, setImageURL }) => {
    const [image, setImage] = useState(null);
    const [url, setUrl] = useState('');
    const [images, setImages] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(0);
    const { refreshCount, setRefreshCount } = useContextProvider();

    useEffect(() => {
        fetchImages();
    }, [folder, refreshCount]);

    const fetchImages = async () => {
        const imagesRef = ref(storage, folder);
        const imageList = await listAll(imagesRef);
    
        const imagesWithMetadata = await Promise.all(
            imageList.items.map(async (item) => {
                const metadata = await getMetadata(item);
                const url = await getDownloadURL(item);
                return { url, timeCreated: metadata.timeCreated };
            })
        );
    
        // Sort images by timeCreated in descending order to get the latest images first
        const sortedImages = imagesWithMetadata.sort((a, b) => new Date(b.timeCreated) - new Date(a.timeCreated));
    
        // Get the URLs of the last 5 images
        const imageUrls = sortedImages.map((image) => image.url).slice(0, 6);
        setImages(imageUrls);
    };

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        if (!image) {
            alert("Please choose an image to upload first.");
            return;
        }

        const imageRef = ref(storage, `${folder}/${image.name}`);
        const uploadTask = uploadBytesResumable(imageRef, image);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress(progress);
            },
            (error) => {
                console.error("Upload error:", error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setUrl(downloadURL);
                    setRefreshCount(refreshCount + 1) // Refresh the image list
                });
            }
        );
    };

    return (
        <div className='border-2 border-slate-600 p-6 rounded-md'>
            <input type="file" onChange={handleChange} />
            <button type='button' className='sign-button' onClick={handleUpload}>Upload</button>
            {uploadProgress > 0 && <p>Upload Progress: {uploadProgress}%</p>}
            <input 
            type="text" 
            value={url} 
            placeholder="You can manually enter Image URL" 
            className='block w-1/2 mt-10'
            onChange={(e) => {setUrl(e.target.value); setImageURL(e.target.value)}}/>
            {url && (
                <div>
                    <p>Image Preview</p>
                    <img src={url} alt="Uploaded" style={{ width: "200px"}} />
                </div>
            )}
            <div className='mt-10 border-2 flex flex-wrap border-slate-500 rounded-md p-4'>
                <p className='w-full'>Choose A Recent Image From Database</p>
                <p className='w-full'>Note: Keep your database light, too many images will slow down the system. Frequently go to Firebase to delete too old images</p>
                {images.length !== 0 ? (
                    images.map((imageUrl, index) => (
                        <img key={index} src={imageUrl} alt="Fetched" onClick={() => {setUrl(imageUrl);setImageURL(imageUrl)}} style={{ width: "auto", height: "200px", cursor: 'pointer' }} />
                    ))
                ) : (
                    <p className='h-32'>No images found</p>
                )}
            </div>
        </div>
    );
};

export default ImageUpload;
