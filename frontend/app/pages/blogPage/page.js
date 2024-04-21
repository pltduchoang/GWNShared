"use client";
import React from 'react';
import NavBar from "../../component/navBar";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PostHome from './postHome';
import PostDetails from './postDetails';
import CreatePost from './createPost';
import EditPost from './editPost';

export default function BlogPage() {
    const title = "Blogs";

    // PROJECT WILL NOT BUILD WITHOUT THIS CHECK HERE
    if (typeof document === 'undefined') {
        return null; // Return null or a placeholder if running on the server
    } 

    return (
        <Router>
            <div className="bg-gray-100 min-h-screen">
                <NavBar currentPage={title} />
                <div className="container mx-auto px-4 pt-4">
                    <nav className="mb-8">
                        <ul className="flex justify-between mt-4 space-x-4 ">
                            <li className="flex items-center">
                                <Link to="/pages/blogPage" className="px-4 py-2 text-green-600 hover:text-green-400 font-bold text-2xl">My Blog</Link>
                            </li>
                            <li>
                                <Link to="/pages/blogPage/create" className="w-auto flex items-center px-4 py-2">
                                    <span className="mb-1 font-bold text-3xl general-button smooth-component rounded-lg">+</span>
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>

                <Routes>
                    <Route path="/pages/blogPage" element={<PostHome />} />
                    <Route path="/pages/blogPage/:id" element={<PostDetails />} />
                    <Route path="/pages/blogPage/create" element={<CreatePost />} />
                    <Route path="/pages/blogPage/edit/:id" element={<EditPost />} />
                </Routes>
            </div>
        </Router>
    );
}