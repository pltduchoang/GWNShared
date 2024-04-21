import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function EditPost() {
    const [post, setPost] = useState(null);
    const [photo, setPhoto] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await fetch(`/api/blogs/${id}/route`);
                if (response.ok) {
                    const postData = await response.json();
                    setPost(postData);
                    setLoading(false);
                } else {
                    console.error('Failed to fetch post:', response.statusText);
                }
            } catch (error) {
                console.error('Failed to fetch post:', error);
            }
        };

        fetchPost();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('title', post.title);
            formData.append('content', post.content);
            if (photo != null) {
                formData.append('photo', photo);
            }
            
            const response = await fetch(`/api/blogs/${id}/route`, {
                method: 'PUT',
                body: formData,
            });
            if (response.ok) {
                alert('Post updated successfully!');
                setLoading(false);
                navigate('/pages/blogPage');
            } else {
                console.error('Failed to update post:', response.statusText);
            }
        } catch (error) {
            console.error('Failed to update post:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPost({ ...post, [name]: value });
    };

    const handlePhotoChange = (e) => {
        setPhoto(e.target.files[0]);
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
                        <h1 className="text-2xl font-bold mb-4">Edit Post</h1>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                                <input
                                    id="title"
                                    type="text"
                                    name="title"
                                    value={post.title}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full mt-1 p-2 border rounded-md"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
                                <textarea
                                    id="content"
                                    name="content"
                                    value={post.content}
                                    onChange={handleInputChange}
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
                                    onChange={handlePhotoChange}
                                    required
                                    className="mt-1"
                                />
                            </div>
                            <div className="flex justify-evenly items-center mx-12 mt-12">
                                <button type="submit" className="general-button smooth-component px-4 py-2 rounded-md">Update</button>
                                <button type="button" onClick={handleCancel} className="general-button-grey smooth-component px-4 py-2 rounded-md">Cancel</button>
                            </div>
                        </form>
                    </div>
                )
            }
        </>
    );
}

export default EditPost;