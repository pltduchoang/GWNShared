"use client";
import React from "react";
import { useContextProvider } from "../../utils/globalContext";
import { useEffect, useRef, useState } from "react";
import ReadOnlyField from "../../component/readOnlyField";
import ProfilePhoto from "../../component/profilePhoto";
import { useUserAuth } from "../../utils/authContext";
import UserService from '@/app/services/userService';
import { getUser, getCurrentUserId } from '@/app/services/userService';
import TransactionService from '@/app/services/transactionService';


//TODO: If current fetchUsers stolen from Ducs code not work, try to create the subdata for "users" for it
export default function AccountInfo() {
    // const { user } = useUserAuth();
    const {refreshCount, setRefreshCount,  menuHeight, setMenuHeight } = useContextProvider();

    const { user } = useUserAuth();
    const [editing, setEditing] = useState(false);
    const [userUID, setUserUID] = useState(null);
    const [userData, setUserData] = useState({});

    // States for Field Inputs
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [mailingAddress, setMailingAddress] = useState('');
    const [billingAddress, setBillingAddress] = useState('');
    const [email, setEmail] = useState('');
    const [currentPlan, setCurrentPlan] = useState("No Plan");
    const [inPlan, setInPlan] = useState(false);
    const [recentTransactionPlan, setRecentTransactionPlan] = useState(null);

   
    
    useEffect(() => {
        async function fetchData() {
            try {
                console.log("fetching users");
                // console.log(userUID);
                const response = await UserService.getUser(user.uid);
                // console.log("userData:", response);
                setUserData(response);
                setFirstName(response.firstName);
                setLastName(response.lastName);
                setEmail(response.email);
                setRefreshCount(refreshCount + 1);
            } catch (error) {
                console.log(error);
            }
        }

        if (user) {
            fetchData();
        }
    }, [user]);
    
    useEffect(() => {
        async function fetchRecentTransaction() {
            try {
                const response = await TransactionService.getTransactionByUser(user.uid);
                console.log("Transaction History:", response);
                if (response.length > 0) {
                    // Find the most recent transaction based on transaction date
                    const mostRecentTransaction = response.reduce((prev, current) =>
                        (new Date(current.date) > new Date(prev.date)) ? current : prev
                    );
                    // setRecentTransactionPlan(mostRecentTransaction.plan);
                    setCurrentPlan(mostRecentTransaction.plan);
                    console.log("Current Plan:", mostRecentTransaction.plan);
                }
            } catch (error) {
                console.log(error);
            }
        }

        fetchRecentTransaction();

    }, [user]);
    

    // useEffect(() => {
    //     console.log("firstName:", firstName);
    //     console.log("lastName:", lastName);
    //     console.log("email:", email);
    // }, [userData]);

    const handleChange = (fieldName, value) => {
        if (fieldName === "firstName") {
            setFirstName(value);
        } else if (fieldName === "lastName") {
            setLastName(value);
        }
    };

    const handleEdit = () => {
        setEditing(true);
    };

    const handleApply = async () => {
        try{
            console.log("userUID:", user.uid);
            console.log("firstName:", firstName);
            console.log("lastName:", lastName);
            console.log("Sending to API")
            await UserService.updateUser(user.uid, {firstName, lastName})
        } catch (error) {
            console.log(error);
        }
        setEditing(false);
    };


    
    return (
        <div className="flex justify-center">
            <div className="w-full max-w-screen-lg">
                <h1 className="text-4xl font-bold mt-12 text-center">Account Information</h1>
                <div className="account-info-container flex justify-center mt-20">
                <div className="flex flex-col">
                </div>
                <div className="ml-16">
                    <div>
                        {editing ? (
                            <div className="field-input">
                                <label className="font-bold">First Name</label>
                                <input
                                    type="text"
                                    placeholder="First Name"
                                    className={`border pl-2 border-gray-400 min-w-[300px] min-h-[35px]`}
                                    value={firstName}
                                    onChange={(e) => handleChange("firstName", e.target.value)}
                                />
                            </div>
                        ) : (
                            <ReadOnlyField label="First Name" value={firstName} />
                        )}
                    </div>
                    <div>
                        {editing ? (
                            <div className="field-input">
                                <label className="font-bold">Last Name</label>
                                <input
                                    type="text"
                                    placeholder="Last Name"
                                    className={`border pl-2 border-gray-400 min-w-[300px] min-h-[35px]`}
                                    value={lastName}
                                    onChange={(e) => handleChange("lastName", e.target.value)}
                                />
                            </div>
                        ) : (
                            <ReadOnlyField label="Last Name" value={lastName} />
                        )}
                    </div>
                    {/* <div>
                        {editing ? (
                            <div className="field-input">
                                <label className="font-bold">Mailing Address</label>
                                <input 
                                    type="text"
                                    placeholder="Mailing Address"
                                    className={`border pl-2 border-gray-400 min-w-[300px] min-h-[35px]`}
                                    value={mailingAddress}
                                    onChange={(e) => setMailingAddress(e.target.value)}
                                />
                            </div>
                        ) : (
                            <ReadOnlyField label="Mailing Address" value={mailingAddress} />
                        )}
                    </div>
                    <div>
                        {editing ? (
                            <div className="field-input">
                                <label className="font-bold">Billing Address</label>
                                <input 
                                    type="text"
                                    placeholder="Billing Address"
                                    className={`border pl-2 border-gray-400 min-w-[300px] min-h-[35px]`}
                                    value={billingAddress}
                                    onChange={(e) => setBillingAddress(e.target.value)}
                                />
                            </div>
                        ) : (
                            <ReadOnlyField label="Billing Address" value={billingAddress} />
                        )}
                    </div> */}
                    {/* <ReadOnlyField label="First Name" value={firstName} /> */}
                    {/* <ReadOnlyField label="Last Name" value={lastName} /> */}
                    <ReadOnlyField label="Email" value={email} />
                    <ReadOnlyField label="Plan" value={currentPlan} />
                    <div className="mt-2 small-button bg-gray-800 text-white border border-gray-800 px-4 py-2 font-bold inline-flex items-center justify-center text-center transition duration-300 ease-in-out cursor-pointer hover:bg-gray-700 hover:text-gray-100">
                            {editing ? (
                                <button onClick={handleApply}>Apply</button>
                            ) : (
                                <button onClick={handleEdit}>Edit</button>
                            )}
                    </div>       
                </div>
                </div>
            </div>
        </div>

    );
}