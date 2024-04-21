"use client";
import React from "react";
import { useContextProvider } from "../../utils/globalContext";
import { useEffect, useRef, useState } from "react";
import ReadOnlyField from "../../component/readOnlyField";
import { useUserAuth } from "../../utils/authContext";
import UserService from '@/app/services/userService';

export default function UserDetails() {
    const { user } = useUserAuth();
    const {refreshCount, setRefreshCount,  menuHeight, setMenuHeight } = useContextProvider();

    // might remove later, to make it consisten with Duc's code (same with accountInfo.js)
    const [country, setCountry] = useState();
    const [phone, setPhone] = useState();
    const [birthday, setBirthday] = useState();
    const [height, setHeight] = useState();
    const [currentWeight, setCurrentWeight] = useState();
    const [goalWeight, setGoalWeight] = useState();
    const [wellnessGoal, setWellnessGoal] = useState();
    const [condition, setCondition] = useState();
    const [ultimateGoal, setUltimateGoal] = useState();

    const [userUID, setUserUID] = useState()
    const [userData, setUserData] = useState({});
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        country: 'wdw',
        phone: '',
        birthday: '',
        height: '',
        currentWeight: '',
        goalWeight: '',
        wellnessGoal: '',
        condition: '',
        ultimateGoal: ''
    });

    useEffect(() => {
        async function fetchUserID() {
            try {
                const id = await UserService.getCurrentUserId();
                setUserUID(id);
                // console.log("id", id);
            } catch (error) {
                console.log(error);
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
                console.log("Country", response.country)

                setFormData({
                    country: response.country,
                    phone: response.phone,
                    birthday: response.birthday,
                    height: response.height,
                    currentWeight: response.currentWeight,
                    goalWeight: response.goalWeight,
                    wellnessGoal: response.wellnessGoal,
                    condition: response.condition,
                    ultimateGoal: response.ultimateGoal
                });
                
                setRefreshCount(refreshCount + 1);
            } catch (error) {
                console.log(error);
            }
        }

        if (userUID) {
            fetchData();
        }
    }, [userUID]);

    // async function fetchUsers() {
    //     try {
    //         console.log("fetching users")
    //         console.log(userUID)
    //         const response = await UserService.getUser(userUID);
    //         console.log("response")
    //         setUserData(response);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

    // async function fetchUserID() {
    //     const id = await UserService.getCurrentUserId();
    //     setUserUID(id);
    // }

    const updateFormData = (name, value) => {
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleEdit = () => {
        setEditing(true);
    };

    const handleApply = async () => {
        try {
            console.log("Sending Data")
            console.log("userUID", userUID);
            console.log("formData", formData);
            await UserService.updateUser(userUID, formData);
        } catch (error) {
            console.log(error);
        }
        setEditing(false);
    };

    // Left wing data structure
    const leftWing = [
        { label: "Country", value: "country" },
        { label: "Phone", value: "phone" },
        { label: "Birthday", value: "birthday" },
        { label: "Height", value: "height" },
        { label: "Current Weight", value: "currentWeight" }
    ];

    // Right wing data structure
    const rightWing = [
        { label: "Goal Weight", value: "goalWeight" },
        { label: "Wellness Goal", value: "wellnessGoal" },
        { label: "Condition", value: "condition" },
        { label: "Ultimate Goal", value: "ultimateGoal" }
    ];

    return (
        <div className="">
            <h1 className="text-4xl font-bold mt-12 text-center">User Details</h1>
            <div className="account-info-container flex justify-center mt-20">
                <div className="flex flex-row space-x-12">
                    <ul>
                        {leftWing.map((item, index) => (
                            <li key={index}>
                                {editing ? (
                                    <div className="field-input h-screen">
                                        <label className="font-bold">{item.label}</label>
                                        <input
                                            type="text"
                                            name={item.value}
                                            value={formData[item.value]}
                                            onChange={(e) => updateFormData(item.value, e.target.value)}
                                            className={`border pl-2 border-gray-400 min-w-[300px] min-h-[35px]`}
                                        />
                                    </div>
                                ) : (
                                    <ReadOnlyField label={item.label} value={formData[item.value]} />
                                )}
                            </li>
                        ))}
                    </ul>
                    <ul>
                        {rightWing.map((item, index) => (
                            <li key={index}>
                                {editing ? (
                                    <div className="field-input h-screen">
                                        <label className="font-bold">{item.label}</label>
                                        <input
                                            type="text"
                                            name={item.value}
                                            value={formData[item.value]}
                                            onChange={(e) => updateFormData(item.value, e.target.value)}
                                            className={`border pl-2 border-gray-400 min-w-[300px] min-h-[35px]`}
                                        />
                                    </div>
                                ) : (
                                    <ReadOnlyField label={item.label} value={formData[item.value]} />
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
    
            <div className="mb-4 flex justify-center mt-8">
                <div className="small-button bg-gray-800 text-white border border-gray-800 px-4 py-2 font-bold inline-flex items-center justify-center text-center transition duration-300 ease-in-out cursor-pointer hover:bg-gray-700 hover:text-gray-100">
                    {editing ? (
                        <button onClick={handleApply}>Apply</button>
                    ) : (
                        <button onClick={handleEdit}>Edit</button>
                    )}
                </div>
            </div>
        </div>
    );
}