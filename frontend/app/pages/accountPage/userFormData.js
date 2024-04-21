"use client";
import React from "react";
import NavBar from "../../component/navBar";
import { useContextProvider } from "../../utils/globalContext";
import { useEffect, useRef, useState } from "react";
import { useUserAuth } from "../../utils/authContext";
import UserFormService from "../../services/userFormService";


export default function UserFormData() {

    const [userFormData, setUserFormData] = useState([]);
    const { user } = useUserAuth();

    useEffect(() => {
        getUserFormData();
    }, []);

    const getUserFormData = async () => {
        try {
            console.log("User ID:", user.uid);
            const response = await UserFormService.findUserFormsByUserId(user.uid);
            console.log("User Form Data:", response);
        
            // Format the date within each user form data
            const formattedUserFormData = response.map(formData => ({
                ...formData,
                birthday: formData.birthday.substring(0, 10) // Extracts YYYY-MM-DD part
            }));
        
            setUserFormData(formattedUserFormData);
        } catch (error) {
            console.log(error);
        }
    };
    

    return (
        <div className="flex flex-col items-center justify-center mt-4">
          <ul className="mt-4 flex flex-col items-center justify-center">
            {userFormData.map((data, index) => (
              <li key={index} className="border border-gray-300 rounded p-4 mb-4 max-w-[500px]">
                <p className="text-lg">
                  <span className="font-semibold">Form ID:</span> {data.id}
                </p>
                <p className="text-lg">
                  <span className="font-semibold">Phone Number:</span> {data.phone}
                </p>
                <p className="text-lg">
                  <span className="font-semibold">Country:</span> {data.country}
                </p>
                <p className="text-lg">
                  <span className="font-semibold">Birthday:</span> {data.birthday}
                </p>
                <p className="text-lg">
                  <span className="font-semibold">Activity Level:</span> {data.activityLevel}
                </p>
                <p className="text-lg">
                  <span className="font-semibold">Current Weight:</span> {data.currentWeight}
                </p>
                <p className="text-lg">
                  <span className="font-semibold">Eating Habits:</span> {data.eatingHabits}
                </p>
                <p className="text-lg">
                  <span className="font-semibold">Expectations:</span> {data.expectations}
                </p>
                <p className="text-lg">
                  <span className="font-semibold">Family Conditions:</span> {data.familyConditions}
                </p>
                <p className="text-lg">
                  <span className="font-semibold">Hear About Us:</span> {data.hearAboutUs}
                </p>
                <p className="text-lg">
                  <span className="font-semibold">Height:</span> {data.height}
                </p>
                <p className="text-lg">
                  <span className="font-semibold">Meals Per Day:</span> {data.mealsPerDay}
                </p>
                <p className="text-lg">
                  <span className="font-semibold">Pregnant:</span> {data.pregnant ? "Yes" : "No"}
                </p>
                <p className="text-lg">
                  <span className="font-semibold">Sleep:</span> {data.sleep}
                </p>
                <p className="text-lg">
                  <span className="font-semibold">Stress Level:</span> {data.stressLevel}
                </p>
                <p className="text-lg">
                  <span className="font-semibold">Support System:</span> {data.supportSystem}
                </p>
                <p className="text-lg">
                  <span className="font-semibold">Three Motivators:</span> {data.threeMotivators}
                </p>
                <p className="text-lg">
                  <span className="font-semibold">Ultimate Goal:</span> {data.ultimateGoal}
                </p>
                <p className="text-lg">
                  <span className="font-semibold">Weight Loss Duration:</span> {data.weightLossDuration}
                </p>
                <p className="text-lg">
                  <span className="font-semibold">Weight Loss Experience:</span> {data.weightLossExperience}
                </p>
                <p className="text-lg">
                  <span className="font-semibold">Weight Loss Goal:</span> {data.weightLossGoal}
                </p>
                <p className="text-lg">
                  <span className="font-semibold">Weight Loss Programs:</span> {data.weightLossPrograms}
                </p>
                <p className="text-lg">
                  <span className="font-semibold">Weight Resistance Training:</span> {data.weightResistanceTraining}
                </p>
                <p className="text-lg">
                  <span className="font-semibold">Wellness Goals:</span> {data.wellnessGoals}
                </p>
                <p className="text-lg">
                  <span className="font-semibold">Why Today:</span> {data.whyToday}
                </p>
                <p className="text-lg">
                  <span className="font-semibold">Extra Information:</span> {data.extra}
                </p>
              </li>
            ))}
          </ul>
        </div>
    );
}