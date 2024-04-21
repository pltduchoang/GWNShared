"use client";

import React, { useEffect, useState } from 'react';
import NavBar from '@/app/component/navBar';
import Questionnaire from './questionnaire';
import { useContextProvider } from '../../utils/globalContext';
import { useUserAuth } from "../../utils/authContext";
import UserService from '@/app/services/userService';


// TODO: Add the fetch users here to then send the fetched data to the questionnaire
// TODO: have a fetch from questionare 
export default function PlanFormPage() {

    const title ="Plan Form";

    // States for Field Inputs
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [mailingAddress, setMailingAddress] = useState('');
    const [billingAddress, setBillingAddress] = useState('');
    const [email, setEmail] = useState('');
    const [currentPlan, setCurrentPlan] = useState("No Plan");
    const [inPlan, setInPlan] = useState(false);
    const [userData, setUserData] = useState({
        firstName: firstName,
        lastName: lastName,
        email: email,
        mailingAddress: mailingAddress,
        billingAddress: billingAddress,
    });

    const [userUID, setUserUID] = useState();
    const {refreshCount, setRefreshCount,  menuHeight, setMenuHeight } = useContextProvider();


    // // Get the menuHeight and setMenuHeight from the global context
    // const { menuHeight, setMenuHeight } = useContextProvider();

    // Style to avoid the menu
    const avoidMenu = menuHeight ? { marginTop: menuHeight} : {marginTop: 90};

    useEffect(() => {
        async function fetchUserID() {
            try {
                const id = await UserService.getCurrentUserId();
                setUserUID(id);
                // console.log("id", id);
            } catch (error) {
                console.log(error);
                console.log("fetchUserID error");
            }
        }

        if (!userUID) {
            fetchUserID();
        }
    }, [refreshCount]);
    
    useEffect(() => {
        async function fetchData() {
            try {
                console.log("fetching users");
                console.log(userUID);
                const response = await UserService.getUser(userUID);
                console.log("userData:", response);
                setUserData(response);
                setFirstName(response.firstName);
                setLastName(response.lastName);
                setEmail(response.email);
                // TODO: Uncomment these when the API is ready
                // setMailingAddress(response.mailingAddress);
                // setBillingAddress(response.billingAddress);
                setRefreshCount(refreshCount + 1);
            } catch (error) {
                console.log(error);
            }
        }

        if (userUID) {
            fetchData();
        }
    }, [userUID]);

    const handleNewData = (newData) => {
        setUserData(newData);
    }


    return (
        <div className='min-h-screen'>
            <div className="fixed top-0 left-0 w-full"
            style={{zIndex:2}}>
                <NavBar currentPage={title}/>
            </div>
            <div className='' style={avoidMenu}>
                <Questionnaire userData={userData} newFormInfo={handleNewData}/>
            </div>
        </div>
    )
}