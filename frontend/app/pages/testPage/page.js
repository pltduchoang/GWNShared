"use client";
import NavBar from "../../component/navBar";
import React, { useState, useEffect } from "react";

// This is a testing page, currently used for integration testing/development

export default function TestPage() {

    // title for nav bar
    const title = "Test Page";
    
    const [user_test_data, setTestUser] = useState([{}]);
    const [users, setUsers] = useState([{}]);

    // Save a user to the backend
    const saveUser = async () => {
        // Define the user data to be saved
        const userData = {
            userID: 1,
            firstName: "testUserFirstName1",
        }

        // Send the user data to the backend
        const response = await fetch('http://127.0.0.1:5001/saveusers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
    }

    const fetchUserData = async () => {
        const response = await fetch('http://127.0.0.1:5001/getusers')
        const user_test_data = await response.json(); 
        setTestUser(user_test_data);


        console.log(user_test_data);
    }

    return (
        <div>
            <NavBar currentPage={title}/>
            {/* <h1>Test Page</h1> */}
            <h1>test page</h1>
            <p>User:</p>
            <p>ID: {user_test_data[0]?.id}</p>
            <p>Username: {user_test_data[0]?.firstName}</p>
            <br></br>
            <button onClick={fetchUserData}>Fetch User</button>
            <br></br>
            <button onClick={saveUser}>Save User</button>
        </div>
        
    );
}

