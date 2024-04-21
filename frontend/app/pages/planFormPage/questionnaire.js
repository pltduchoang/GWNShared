"use client";
import React, { useState, useEffect } from 'react';
import FieldInput from '@/app/component/fieldInput';
import ReadOnlyField from '@/app/component/readOnlyField';
import { useUserAuth } from "../../utils/authContext";
import { useContextProvider } from "../../utils/globalContext";
import UserService from '@/app/services/userService';
import Link from 'next/link';
import UserFormService from '@/app/services/userFormService';

export default function Questionnaire({ userData, newFormInfo}) {

    const { user } = useUserAuth();
    
    const [activityLevel, setActivityLevel] = useState("");
    const [ultimateGoal, setUltimateGoal] = useState("");
    const [stressLevel, setStressLevel] = useState("");
    const [birthday, setBirthday] = useState("");
    const [month, setMonth] = useState("");
    const [day, setDay] = useState("");
    const [pregnant, setPregnant] = useState(false);
    const [mealsPerDay, setMealsPerDay] = useState();

    const currentYear = new Date().getFullYear();

    const [year, setYear] = useState("");
    const [userUID, setUserUID] = useState();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');

    useEffect (() => {
        if (user) {
            //     setFormData({
            //         user: user?.uid || '',
            //         firstName: user?.profile.firstName || '',
            //         lastName: user?.profile.lastName || '',
            //         email: user?.email || '',
            // });
            console.log('user: ', user);
            setUserUID(user?.uid);
            setFirstName(user?.profile.firstName);
            setLastName(user?.profile.lastName);
            setEmail(user?.email);

            // const updatedFormData = {
            //     ...formData,
            //     userID: userUID,
            //     firstName: firstName,
            //     lastName: lastName,
            //     email: email
            // };
    
            // setFormData(updatedFormData);

        }
    }, [user]);

    useEffect(() => {
        if (userUID && firstName && lastName && email) {
            setFormData(prevState => ({
                ...prevState,
                userID: userUID,
                // firstName: firstName,
                // lastName: lastName,
                // email: email
            }));
            setUserInfo(prevState => ({
                ...prevState,
                firstName: firstName,
                lastName: lastName,
                email: email
            }));
        }
    }, [userUID, firstName, lastName, email]);


    function generateRandomId() {
        const randomId = Math.floor(Math.random() * 1000000000); // Generate a random 9-digit number
        return randomId; // Return the random number as an integer
    };
    
    const [userInfo, setUserInfo] = useState({
        firstName: firstName,
        lastName: lastName,
        email: email,
    });

    const [formData, setFormData] = useState({
        userID: userUID || '',
        // firstName: firstName || '',
        // lastName: lastName || '',
        // email: email || '',
        phone: '',
        country: '',
        birthday: birthday,
        day: day,
        year: year,
        month: month,
        height: '',
        currentWeight: '',
        pregnant: pregnant,
        whyToday: '',
        wellnessGoals: '',
        weightLossGoal: '',
        weightLossDuration: '',
        familyConditions: '',
        weightLossPrograms: '',
        weightLossExperience: '',
        supportSystem: '',
        activityLevel: activityLevel,
        ultimateGoal: ultimateGoal,
        weightResistanceTraining: '',
        sleep: '',
        stressLevel: stressLevel,
        eatingHabits: '',
        mealsPerDay: mealsPerDay,
        threeMotivators: '',
        expectations: '',
        extra: '',
        hearAboutUs: ''
    });

    // useEffect(() => {
    //     console.log('test: ', formData);
    // }, [formData]);

    // const retrievedFormData = () => {
    //     setFirstName(userData.firstName);
    //     setLastName(userData.lastName);
    //     setEmail(userData.email);
    // }

    // useEffect(() => {
    //     if (userData) {
    //         retrievedFormData();
    //     }
    // }, [userData]);
    function getMonthValue(monthName) {
        const months = {
            January: 1,
            February: 2,
            March: 3,
            April: 4,
            May: 5,
            June: 6,
            July: 7,
            August: 8,
            September: 9,
            October: 10,
            November: 11,
            December: 12
        };
    
        // Convert month name to title case
        const formattedMonthName = monthName.charAt(0).toUpperCase() + monthName.slice(1).toLowerCase();
    
        return months[formattedMonthName];
    };

    const handleBirthday = () => {
        const birthdayDateTime = new Date(year, month, day);
        // setBirthday(`${month} ${day}, ${year}`);
        setBirthday(birthdayDateTime);
    };
    const handleMonthChange = (e) => {
        const selectedMonthName = e.target.value;
        const selectedMonthValue = getMonthValue(selectedMonthName);
        setMonth(selectedMonthValue);
        console.log('month: ', selectedMonthValue);
        handleBirthday();
    };
    const handleDayChange = (e) => {
        setDay(e.target.value);
        console.log('day: ', day)
        handleBirthday();
        
    };
    const handleYearChange = (e) => {
        const selectedYear = parseInt(e.target.value); // Parse the selected year to an integer
        setYear(selectedYear); // Update year state
        // handleBirthday(); // Update birthday based on new year
        
    };
    useEffect(() => {
        handleBirthday();
    }, [year]);
    const handleActivityLevelChange = (value) => {
        setActivityLevel(value);
    };
    const handleUltimateGoalChange = (value) => {
        setUltimateGoal(value);
    };
    const handleStressLevelChange = (e) => {
        setStressLevel(e.target.value);
    };
    const handleSubmit = () => {
        // const generatedID = generateRandomId();
        // console.log('Generated ID:', generatedID);
        const updatedFormData = {
            ...formData,
            day: parseInt(day),
            month: month,
            year: year,
            activityLevel: activityLevel,
            ultimateGoal: ultimateGoal,
            stressLevel: stressLevel,
            birthday: birthday,
        };
    
        console.log('Form data', updatedFormData); // Log the updated form data
        setFormData(updatedFormData); // Update the form data state
        sendForm(updatedFormData); // Send the form data to the server
    };

    const sendForm = async (formData) => {
        try {
            const response = await UserFormService.addUserForm(formData);
            console.log('Form submitted successfully:', response);
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    const generateRange = (start, end) => {
        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    };
    
    
    // Array of months
    const months = [
        'January', 'February', 'March', 'April',
        'May', 'June', 'July', 'August',
        'September', 'October', 'November', 'December'
    ];

    const handlePregnantChange = (e) => {
        if (e.target.value === 'true') {
            setPregnant(true);
            setFormData({
                ...formData,
                pregnant: true
            });
        } else {
            setPregnant(false);
            setFormData({
                ...formData,
                pregnant: false
            });
        }
    };

    const handleMealsPerDayChange = (e) => {
        setMealsPerDay(parseInt(e.target.value));
        // console.log('meals per day: ', mealsPerDay);
        setFormData({
            ...formData,
            mealsPerDay: parseInt(e.target.value)
        });
    };
    
    const getFieldLabel = (field) => {
        switch (field) {
            case 'firstName':
                return 'First Name';
            case 'lastName':
                return 'Last Name';
            case 'email':
                return 'Email';
            case 'country':
                return 'Country';
            case 'phone':
                return 'Phone number (you will not be contacted via phone without your permission).';
            case 'birthday':
                return 'Birthday';
            case 'height':
                return 'How tall are you? ';
            case 'currentWeight':
                return 'What is your current weight?';
            case 'pregnant':
                return 'Are you currently pregnant, or trying to get pregnant?';
            case 'whyToday':
                return 'What specifically made you do something about your weight today?';
            case 'wellnessGoals':
                return 'What are some of your specific wellness goals? Please specify. I.e.; Sleep better, lose weight, create healthier habits etc. ';
            case 'weightLossGoal':
                return 'How much weight do you want to lose?';
            case 'weightLossDuration':
                return 'How long have you been wanting to lose weight?';
            case 'familyConditions':
                return 'Do you have any conditions that run in your family? I.e.; father has diabetes, heart diesease etc.';
            case 'weightLossPrograms':
                return 'Have you ever lost weight on your own? If so, which programs have you tried?';
            case 'weightLossExperience':
                return 'If you have lost weight before on your own, please describe how and what you liked and did not like about the program you followed.';
            case 'supportSystem':
                return 'What does your support system look like in your life when it comes to your wellness goals?';
            case 'activityLevel':
                return 'What is your activity level currently?';
            case 'ultimateGoal':
                return 'What is your ultimate goal?';
            case 'weightResistanceTraining':
                return 'Do you currently do weight resistance training? If so, how often and for how long?';
            case 'sleep':
                return 'How much sleep do you get on average per night?';
            case 'eatingHabits':
                return 'What are your current eating habits like? I.e.; eat balanced, currently dieting, snacking, not enough calories etc.';
            case 'mealsPerDay':
                return 'How many meals do you eat in a day?';
            case 'threeMotivators':
                return 'What are your top 3 motivators to lose weight?';
            case 'expectations':
                return 'What are you looking to get out of Grow Within Nutrition\'s coaching and nutrition/lifestyle plans? i.e. accountability, support, education etc.';
            case 'extra':
                return 'Is there anything else you would like us to know about you?';
            case 'hearAboutUs':
                return 'How did you hear about us?';
            default:
                return '';
        }
    };
    // Generate arrays for days and years
    const days = generateRange(1, 31);
    const years = generateRange(1900, new Date().getFullYear());

    return (
        <div className='flex flex-col justify-center min-h-screen'>
            <div className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 container mx-auto mt-10'>
                <div>
                    <h1 className='text-4xl font-bold mb-6 justify-center text-center'>
                        Contact Information & Intake Form 
                    </h1>
                    <p className='mb-8'>
                        At GWI Nutrition your health and wellness is a priority. Please fill out the following questionnaire so that we can create a customized nutrition and lifestyle plan that best suits you. ****IMPORTANT: Please check your JUNK MAIL folder and whitelist gwinutrition@gmail.com to receive this form or other important emails.
                    </p>
                </div>
                
                <div className='mb-4'>
                    <div className='mb-4'>
                        <label className='block font-bold mb-2' htmlFor='firstName'>
                            First Name
                        </label>
                        <input
                            id='firstName'
                            className='border rounded py-2 px-3 w-full'
                            type='text'
                            value={userInfo.firstName}
                            onChange={handleChange}
                        />
                    </div>
                    <div className='mb-4'>
                        <label className='block font-bold mb-2' htmlFor='lastName'>
                            Last Name
                        </label>
                        <input
                            id='lastName'
                            className='border rounded py-2 px-3 w-full'
                            type='text'
                            value={userInfo.lastName}
                            onChange={handleChange}
                        />
                    </div>
                    <div className='mb-4'>
                        <label className='block font-bold mb-2' htmlFor='email'>
                            Email
                        </label>
                        <input
                            id='email'
                            className='border rounded py-2 px-3 w-full'
                            type='email'
                            value={userInfo.email}
                            onChange={handleChange}
                        />
                    </div>
                </div>


                <div className='mb-4'>
                    {['country', 'phone'].map((field, index) => (
                        <div key={index} className='mb-4'>
                            <label className='block font-bold mb-2' htmlFor={field}>
                                {getFieldLabel(field)}
                            </label>
                            <input
                                id={field}
                                className='border rounded py-2 px-3 w-full'
                                type={field === 'currentWeight' ? 'number' : 'text'}
                                value={formData[field]}
                                onChange={handleChange}
                            />
                        </div>
                    ))}
                </div>
                <div className='mb-4'>
                    <div className='mb-4'>
                        <label className='block font-bold mb-2' htmlFor='birthday'>
                            Birthday
                        </label>
                        <div className='flex items-center'>
                            <select 
                                className="mr-2 border rounded py-2 px-3"
                                id="month"
                                onChange={handleMonthChange}
                            >
                                <option value="">Month</option>
                                {months.map((month, index) => (
                                    <option key={index} value={month}>{month}</option>
                                ))}
                            </select>
                            <select 
                                className="mr-2 border rounded py-2 px-3"
                                id="day"
                                onChange={handleDayChange}
                            >
                                <option value="">Day</option>
                                {days.map((day, index) => (
                                    <option key={index} value={day}>{day}</option>
                                ))}
                            </select>
                            <select 
                                className="mr-2 border rounded py-2 px-3"
                                id="year"
                                onChange={handleYearChange}
                            >
                                <option value="">Year</option>
                                {years.map((year, index) => (
                                    <option key={index} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                <div className='mb-4'>
                    <label className='block font-bold mb-2' html="pregnant">
                        {getFieldLabel('pregnant')}
                    </label>
                    <select
                        value={pregnant}
                        onChange={handlePregnantChange}
                        className="block w-full border rounded py-2 px-3"
                    >
                        <option value="true">True</option>
                        <option value="false">False</option>
                    </select>
                </div>
                <div className='mb-4'>
                    {['height', 'currentWeight', 'whyToday', 'wellnessGoals', 'weightLossGoal', 'weightLossDuration', 'familyConditions', 'weightLossPrograms', 'weightLossExperience', 'supportSystem'].map((field, index) => (
                        <div key={index} className='mb-4'>
                            <label className='block font-bold mb-2' htmlFor={field}>
                                {getFieldLabel(field)}
                            </label>
                            {field === 'whyToday' || field === 'wellnessGoals' || field === 'weightLossGoal' || field === 'weightLossDuration' || field === 'familyConditions' || field === 'weightLossPrograms' || field === 'weightLossExperience' || field === 'supportSystem' ?
                                <textarea
                                    id={field}
                                    className='border rounded py-3 px-3 w-full resize-y'
                                    value={formData[field]}
                                    onChange={handleChange}
                                />
                                :
                                <input
                                    id={field}
                                    className='border rounded py-2 px-3 w-full'
                                    value={formData[field]}
                                    onChange={handleChange}
                                />
                            }
                        </div>
                    ))}
                </div>
                <div className='mb-4'>
                    <div className='mb-4'>
                        <label className='block font-bold mb-2'>
                            What is your activity level currently?
                        </label>
                        <div>
                            <label className='inline-flex items-center'>
                                <input 
                                    type="radio"
                                    className="form-radio"
                                    name="activityLevel"
                                    value="None"
                                    checked={activityLevel === "None"}
                                    onChange={() => handleActivityLevelChange("None")}
                                />
                                <span className='ml-2'>None (little to no activity)</span>
                            </label>
                        </div>
                        <div>
                            <label className='inline-flex items-center'>
                                <input 
                                    type="radio"
                                    className="form-radio"
                                    name="activityLevel"
                                    value="1-3 hours"
                                    checked={activityLevel === "1-3 hours"}
                                    onChange={() => handleActivityLevelChange("1-3 hours")}
                                />
                                <span className='ml-2'>1-3 hours per week</span>
                            </label>
                        </div>
                        <div>
                            <label className='inline-flex items-center'>
                                <input 
                                    type="radio"
                                    className="form-radio"
                                    name="activityLevel"
                                    value="4-6 hours"
                                    checked={activityLevel === "4-6 hours"}
                                    onChange={() => handleActivityLevelChange("4-6 hours")}
                                />
                                <span className='ml-2'>4-6 hours per week</span>
                            </label>
                        </div>
                        <div>
                            <label className='inline-flex items-center'>
                                <input 
                                    type="radio"
                                    className="form-radio"
                                    name="activityLevel"
                                    value="7-9+ hours"
                                    checked={activityLevel === "7-9+ hours"}
                                    onChange={() => handleActivityLevelChange("7-9+ hours")}
                                />
                                <span className='ml-2'>7-9+ hours per week</span>
                            </label>    
                        </div>
                    </div>
                </div>
                <div className='mb-4'>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            What is your ultimate goal?
                        </label>
                        <div>
                            <label className="inline-flex items-center">
                            <input
                                type="radio"
                                className="form-radio"
                                name="ultimateGoal"
                                value="Lose weight"
                                checked={ultimateGoal === "Lose weight"}
                                onChange={() => handleUltimateGoalChange("Lose weight")}
                            />
                            <span className="ml-2">Lose weight</span>
                            </label>
                        </div>
                        <div>
                            <label className="inline-flex items-center">
                            <input
                                type="radio"
                                className="form-radio"
                                name="ultimateGoal"
                                value="Build muscle"
                                checked={ultimateGoal === "Build muscle"}
                                onChange={() => handleUltimateGoalChange("Build muscle")}
                            />
                            <span className="ml-2">Build muscle</span>
                            </label>
                        </div>
                        <div>
                            <label className="inline-flex items-center">
                            <input
                                type="radio"
                                className="form-radio"
                                name="ultimateGoal"
                                value="Athletic performance"
                                checked={ultimateGoal === "Athletic performance"}
                                onChange={() => handleUltimateGoalChange("Athletic performance")}
                            />
                            <span className="ml-2">Athletic performance</span>
                            </label>
                        </div>
                        <div>
                            <label className="inline-flex items-center">
                            <input
                                type="radio"
                                className="form-radio"
                                name="ultimateGoal"
                                value="Improve health"
                                checked={ultimateGoal === "Improve health"}
                                onChange={() => handleUltimateGoalChange("Improve health")}
                            />
                            <span className="ml-2">Improve health</span>
                            </label>
                        </div>
                    </div>
                </div>
                <div className='mb-4'>
                    {['weightResistanceTraining', 'sleep'].map((field, index) => (
                        <div key={index} className='mb-4'>
                            <label className='block font-bold mb-2' htmlFor={field}>
                                {getFieldLabel(field)}
                            </label>
                            <textarea
                                id={field}
                                className='border rounded py-3 px-3 w-full resize-y'
                                value={formData[field]}
                                onChange={handleChange}
                            />
                        </div>
                    ))}
                </div>

                <div className='mb-4'>
                    <div className="mb-4">
                        <label className="block font-bold mb-2">
                            How would you rate your stress levels on a daily basis?
                        </label>
                        <div className="flex items-center">
                            <span className="mr-4">1 - Cool as a cucumber</span>
                            <select
                                className="block border px-4 py-2 rounded shadow"
                                onChange={handleStressLevelChange}
                                value={stressLevel}
                            >
                            <option value="">Select</option>
                            {[...Array(10).keys()].map((index) => (
                                <option key={index} value={index + 1}>{index + 1}</option>
                            ))}
                            </select>
                            <span className="ml-4">10 - I am having difficulties managing stress</span>
                        </div>
                    </div>
                </div>
                <div className='mb-4'>
                    <label className='block font-bold mb-2' htmlFor='mealsPerDay'>
                        {getFieldLabel('mealsPerDay')}
                    </label>
                    <input
                        type="number"
                        value={mealsPerDay}
                        onChange={handleMealsPerDayChange}
                        className="block w-full border rounded py-2 px-3"
                    />
                </div>
                <div className='mb-4'>
                    {['eatingHabits', 'threeMotivators', 'expectations', 'extra', 'hearAboutUs'].map((field, index) => (
                        <div key={index} className='mb-4'>
                            <label className='block font-bold mb-2' htmlFor={field}>
                                {getFieldLabel(field)}
                            </label>
                            <textarea
                                id={field}
                                className='border rounded py-3 px-3 w-full resize-y'
                                value={formData[field]}
                                onChange={handleChange}
                            />
                        </div>
                    ))}
                </div>
                <div>
                    <Link href='../pages/accountPage' className='sign-button mt-2' onClick={handleSubmit}>
                        Submit
                    </Link>
                </div>
            </div>
        </div>
    )
}