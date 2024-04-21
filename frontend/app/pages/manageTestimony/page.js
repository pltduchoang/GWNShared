// root/app/pages/manageTestimony/page.js
'use client';
import React, { useState, useEffect } from 'react';
import CreateTestimonyModal from './createTestimonyModal';
import NavBar from '@/app/component/navBar';
import { useUserAuth } from '@/app/utils/authContext';
import { useContextProvider } from '@/app/utils/globalContext';
import Spinner from '@/app/component/spinner';

export default function ManageTestimony() {
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const { user } = useUserAuth(); // Ensure user is authenticated
    const [authenticated, setAuthenticated] = useState(false);
    const [testimonies, setTestimonies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get the menuHeight and setMenuHeight from the global context-----------------------
    const title ="Account";
    const { menuHeight, setMenuHeight } = useContextProvider();


    const {refreshCount, setRefreshCount} = useContextProvider();

    // Style to avoid the menu
    const avoidMenu = menuHeight ? { marginTop: menuHeight } : {marginTop: 90};


    const [testimony, setTestimony] = useState({
        author: '', // Assuming you want to capture the author's name as a string
        content: '',
        profilePicURL: '', // Optional URL for author's profile picture
    });

    useEffect(() => {
        const fetchTestimonies = async () => {
            setLoading(true);
            try {
                const response = await fetch('/api/testimony/route');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setTestimonies(data);
            } catch (e) {
                setError(e);
                console.log(e);
            } finally {
                setLoading(false);
            }
        };

        fetchTestimonies();
    }, [refreshCount]);

    const toggleModal = () => {
        setShowModal(!showModal);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTestimony(prev => ({ ...prev, [name]: value }));
    };

    const handleEditTestimony = (testimonyToEdit) => {
        setIsEditing(true);
        setTestimony(testimonyToEdit);
        toggleModal();
    };

    const handleDeleteTestimony = async (id) => {
        if (confirm('Are you sure you want to delete this testimony?')) {
            try {
                const response = await fetch(`/api/testimony/${id}/route`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    setTestimonies(testimonies.filter((testimony) => testimony.id !== id));
                    alert('Testimony deleted successfully.');
                    setRefreshCount(refreshCount + 1);
                } else {
                    throw new Error('Failed to delete the testimony.');
                }
            } catch (error) {
                console.error('Deletion error:', error);
                alert(error.message);
            }
        }
        
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = isEditing ? 'PUT' : 'POST';
        const endpoint = isEditing ? `/api/testimony/${testimony.id}/route` : '/api/testimony/route';
        
        try {
            const response = await fetch(endpoint, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(testimony),
            });

            if (response.ok) {
                const message = isEditing ? 'Testimony updated successfully' : 'Testimony created successfully';
                setRefreshCount(refreshCount + 1);
                alert(message);
                toggleModal();
                // Optionally, re-fetch testimonies to update the list
            } else {
                throw new Error('Failed to perform the operation.');
            }
        } catch (error) {
            alert(error.message);
            console.error('Operation failed:', error);
        }
    };

    useEffect(() => {
        setAuthenticated(user !== null);
    }, [user]);



    return (
        <div className='min-h-screen bg-main-day'>
            <div className="fixed top-0 left-0 w-full"
            style={{zIndex:2}}>
                <NavBar currentPage={title}/>
            </div>
            {loading && <div className='fixed top-0 left-0 h-screen w-full bg-three-day opacity-75 text-main-day flex justify-center items-center'>
                <Spinner />
            </div>}            
            {error && <div className='h-screen w-full bg-three-day opacity-85 text-main-day flex justify-center items-center'>Error: {error.message}, &nbsp; <a href='/' className=' underline hover:text-blue-500'>return to home</a></div>}
            {!authenticated && <div className='fixed top-0 left-0 h-screen w-full bg-three-day opacity-85 text-main-day flex flex-col justify-center items-center'>You are not yet authenticated, please wait or &nbsp; <a href='/' className=' underline hover:text-blue-500'>return to home</a><Spinner/></div>}
            {authenticated && !loading && !error && (
                <div>
                    <div style={avoidMenu} className='bg-two-day'>
                        <h1 className='text-center text-3xl font-bold py-10'>Manage Testimonies</h1>
                        <div className='button-container'>
                            <button type='button' className='general-button smooth-component-300' onClick={() => { setTestimony({ author: '', content: '' }); setIsEditing(false); toggleModal(); }}>Add Testimony</button>
                        </div>
                        {showModal && <CreateTestimonyModal testimony={testimony} handleSubmit={handleSubmit} closeModal={toggleModal} onChange={handleChange} />}

                        <div className='bg-two-day p-20 space-y-6'>
                            <h2 className='text-center text-2xl font-bold py-10'>Testimonies</h2>
                            {testimonies.map((testimony) => (
                                <div key={testimony.id} className="testimony-item bg-three-day text-three-day p-10">
                                    <h3>Author: {testimony.author}</h3>
                                    {testimony.profilePicURL && <img src={testimony.profilePicURL} alt="Profile" />}
                                    <p className='mt-6'>"{testimony.content}"</p>
                                    <div className='flex justify-evenly mt-6'>
                                        <div className='sign-button smooth-component-300' onClick={() => handleEditTestimony(testimony)}>Edit</div>
                                        <div className='sign-button smooth-component-300' onClick={() => handleDeleteTestimony(testimony.id)}>Delete</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
