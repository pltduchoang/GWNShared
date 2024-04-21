import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [photo, setPhoto] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', content);
            formData.append('photo', photo);

            const response = await fetch('/api/blogs/route', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                alert('Post created successfully!');
                setLoading(false);
                navigate('/pages/blogPage');
            } else {
                console.error('Failed to create post:', response.statusText);
            }
        } catch (error) {
            console.error('Failed to create post:', error);
        }
    };

    const handleCancel = () => {
        navigate('/pages/blogPage');
    };

    return (
        <>
            {loading ?
                (
                    <div className="flex items-center justify-center h-[60vh]">
                        <div className="loading"></div>
                    </div>
                ) : (
                    <div className="container mx-auto px-4 py-8 bg-main-day shadow-xl rounded-md">
                        <h1 className="text-2xl font-bold mb-4">Create Post</h1>
                        <form onSubmit={handleSubmit} encType="multipart/form-data">
                            <div className="mb-4">
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                                <input
                                    id="title"
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    className="w-full mt-1 p-2 border rounded-md"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
                                <textarea
                                    id="content"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    rows={5}
                                    required
                                    className="w-full overflow-auto mt-1 p-2 border rounded-md"
                                ></textarea>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="photo" className="block text-sm font-medium text-gray-700">Photo</label>
                                <input
                                    id="photo"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setPhoto(e.target.files[0])}
                                    required
                                    className="mt-1"
                                />
                            </div>
                            <div className="flex justify-around items-center mx-12 mt-12">
                                <button type="submit" className="general-button smooth-component px-4 py-2 rounded-md">Publish</button>
                                <button type="button" onClick={handleCancel} className="general-button-grey smooth-component px-4 py-2 rounded-md">Cancel</button>
                            </div>
                        </form>
                    </div>
                )
            }
        </>
    );
};

export default CreatePost;