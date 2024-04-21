// In SearchUser.js
import React, { useState, useEffect } from 'react';
import UserService from '../services/userService';

export default function SearchUser({ onUserSelected, resetTrigger }) {
    const [email, setEmail] = useState('');
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        // Resets the internal state if resetTrigger changes
        setEmail('');
        setUser(null);
        setError('');
    }, [resetTrigger]);

    const handleSearch = async () => {
        try {
            setError('');
            const result = await UserService.getUserByEmail(email); // Implement this method in UserService
            setUser(result);
            onUserSelected(result);
        } catch (err) {
            setError('User not found');
            setUser(null);
        }
    };

    return (
        <div>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter user's email"
            />
            <button className='bg-item-day px-3 py-1 text-three-day ml-16 hover:bg-white hover:text-black border-2 border-blue-900 smooth-component-300' type='button' onClick={handleSearch}>Search</button>
            {error && <div>{error}</div>}
            {user && <div>Selected User: {user.email}</div>}
        </div>
    );
}
