import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Image from 'next/image';

function PostDetails() {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetchPost();
    }, [id]);

    const fetchPost = async () => {
        try {
            const response = await fetch(`/api/blogs/${id}/route`);
            if (response.ok) {
                const data = await response.json();
                setPost(data);
                setLoading(false);
            } else {
                console.error('Failed to fetch post:', response.statusText);
            }
        } catch (error) {
            console.error('Failed to fetch post:', error);
        }
    };

    const deletePost = async () => {
        const confirmDelete = window.confirm('Are you sure you want to delete this post?');
        if (!confirmDelete) return;

        try {
            const response = await fetch(`/api/blogs/${id}/route`, { method: 'DELETE' });
            if (response.ok) {
                // setPosts(posts.filter(post => post.id !== id));
                // if (photo) {
                //     await fetch(`/api/blogs/deletePhoto/${id}/route`, { method: 'DELETE' });
                // }
                navigate('/pages/blogPage');
            } else {
                console.error('Failed to delete post:', response.statusText);
            }
        } catch (error) {
            console.error('Failed to delete post:', error);
        }
    };

    return (
        <>
            {loading ? (
                <div className="flex items-center justify-center h-[60vh]">
                    <div className="loading"></div>
                </div>
            ) : (
                <div className="container mx-auto px-4 py-8 bg-main-day shadow-xl">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold mb-8">{post.title}</h1>
                        <div className="flex gap-4">
                            <Link to={`/pages/blogPage/edit/${post.id}`} className="general-button smooth-component px-4 py-2 rounded-md">Edit</Link>
                            <button onClick={deletePost} className="px-4 py-2 rounded-md general-button-red smooth-component">Delete</button>
                        </div>
                    </div>
                    <div className="flex justify-center items-center">
                        <Image src={post.photo} alt={post.title} width={600} height={400} className="w-1/3" />
                    </div>
                    <p className="text-gray-700 my-4 text-2xl">{post.content}</p>
                    
                </div>
            )}
        </>
    );
}

export default PostDetails;