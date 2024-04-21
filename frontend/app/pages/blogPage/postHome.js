import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Image from 'next/image';

function PostHome() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await fetch('/api/blogs/route');
            if (response.ok) {
                const data = await response.json();
                setPosts(data);
                setLoading(false);
            } else {
                console.error('Failed to fetch posts:', response.statusText);
            }
        } catch (error) {
            console.error('Failed to fetch posts:', error);
        }
    };

    return (
        <>
            {loading ?
                (
                    <div className="flex items-center justify-center h-[60vh]">
                        <div className="loading"></div>
                    </div>
                ) : (
                    <div className="container mx-auto px-4 py-8">
                        <h1 className="text-3xl font-bold mb-8">Posts</h1>
                        <div className="grid grid-cols-3 gap-2">
                            {posts.map(post => (
                                <div key={post.id} className="bg-main-day shadow-xl rounded-md p-4 mb-4">
                                    <Link to={`/pages/blogPage/${post.id}`}>
                                        <h2 className="text-xl font-bold mb-2">{post.title}</h2>
                                        <div className="flex justify-center items-center mb-4">
                                            <Image src={post.photo} alt={post.title} width={300} height={200} className="h-[250px]" />
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            }
        </>
    );
}

export default PostHome;
