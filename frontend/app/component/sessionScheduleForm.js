//root/frontend/app/component/sessionScheduleForm.js

'use client';
import React, {useEffect, useState} from 'react';
import UserService from '../services/userService';
import { useContextProvider } from '../utils/globalContext';
import { useUserAuth } from '../utils/authContext';
import scheduleService from '../services/scheduleService';
import mailService from '../services/mailService';
import Spinner from './spinner';

export default function SessionScheduleForm( {selectedSessionDate, onClose, handlePrevDay, handleNextDay, isBooking}) {
    const [selectedSession, setSelectedSession] = useState(null);//[selectedSession, setSelectedSession] = useState({});

    // Context
    const { refreshCount , setRefreshCount } = useContextProvider();
    const { user } = useUserAuth();
    const [loading, setLoading] = useState(false);
    const [loadingSearch, setLoadingSearch] = useState(false);

    
    // State for form fields
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [selectedStaff,setSelectedStaff] = useState(''); //selected staff for the session
    const [attendee, setAttendee] = useState(null); //attendees for the session

    // State for time selection
    const [selectedStartHour, setSelectedStartHour] = useState('09:00');
    const [selectedStartMinute, setSelectedStartMinute] = useState('00');
    const [selectedEndHour, setSelectedEndHour] = useState('10:00');
    const [selectedEndMinute, setSelectedEndMinute] = useState('00');

    //duration
    const [duration, setDuration] = useState(0);

    //Highlight the selected hour frame
    const [highlightedHourFrame, setHighlightedHourFrame] = useState([]); 

    //List of staff
    const [staffList, setStaffList] = useState([]);
    const [staffInSchedule, setStaffInSchedule] = useState([]);

    // State to store sessions by staff ID
    const [staffSessions, setStaffSessions] = useState({});
    const [filteredSessionsDetails, setFilteredSessionsDetails] = useState({});

    //search value
    const [searchValue, setSearchValue] = useState('');
    const [searchedUsers, setSearchedUsers] = useState([]);

    // reset search user
    const [resetSearchUser, setResetSearchUser] = useState(false);


    // Fixed timezone for displaying purpose
    const timezone = "Mountain Time / Edmonton"; // Replace "Your Timezone" with the actual timezone or logic to get it


    // Format the sessionDate to a readable string
    const formattedSessionDate = selectedSessionDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });



    // Fetch staff list and set default start and end time
    useEffect(() => {
        const baseDate = selectedSessionDate ? new Date(selectedSessionDate) : new Date();
        const formattedDate = baseDate.toISOString().split('T')[0]; // Get YYYY-MM-DD format
    
        setStartTime(`${formattedDate}T09:00`); // Default start time at 9 AM
        setEndTime(`${formattedDate}T10:00`); // Default end time at 10 AM
    
        // Define the async function within useEffect
        const fetchStaffData = async () => {
            try {
                const fetchStaffList = await UserService.getStaffList();
                setStaffList(fetchStaffList);
            } catch (error) {
                console.error('Failed to fetch staff list:', error);
                // Handle the error appropriately
            }
        };
    
        // Call the async function
        fetchStaffData();
    }, [selectedSessionDate]); // Depend on selectedSessionDate


    // Rendering date view
    const hoursInDay = ['07:00', '07:15', '07:30', '07:45', '08:00', '08:15', '08:30', '08:45', '09:00', '09:15', '09:30', '09:45', '10:00', '10:15', '10:30', '10:45', '11:00', '11:15', '11:30', '11:45', '12:00', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30', '13:45', '14:00', '14:15', '14:30', '14:45', '15:00', '15:15', '15:30', '15:45', '16:00', '16:15', '16:30', '16:45', '17:00', '17:15', '17:30', '17:45', '18:00', '18:15', '18:30', '18:45', '19:00', '19:15', '19:30', '19:45', '20:00', '20:15', '20:30', '20:45', '21:00'];

    const hoursOption = ['07','08','09','10','11','12','13','14','15','16','17','18','19','20','21'];
    const minutesOption = ['00','15','30','45'];

    // Handling the hour selection
    const handleHourSelection = (hourString, staff) => {
        handleClear();
        setSelectedSession(null);
        const [selectedHour, selectedMinute] = hourString.split(':');
        setSelectedStartHour(selectedHour);
        setSelectedStartMinute(selectedMinute);
        const endHour = parseInt(selectedHour) + 1 <= 21 ? parseInt(selectedHour) + 1 : 21; // Ensure end hour is within the day
        if (endHour < 10) {
            setSelectedEndHour('0' + endHour.toString());
        } else {
            setSelectedEndHour(endHour.toString());
        }
        setSelectedEndMinute(endHour === 21 ? '00' : selectedMinute);
        setSelectedStaff(staff);
        setTitle ( 'Available slot for coach ' + staff.firstName + ' ' + staff.lastName);
        console.log('Staff Session',staffSessions);
    };


    //Highlighting the selected hour frame
    useEffect(() => {
        // Assuming both start and end times are within the same day
        const durationInMinutes = ((parseInt(selectedEndHour) * 60) + parseInt(selectedEndMinute)) -
        ((parseInt(selectedStartHour) * 60) + parseInt(selectedStartMinute));
        setDuration(durationInMinutes);

        const startHourIndex = hoursInDay.indexOf(`${selectedStartHour}:${selectedStartMinute}`);
        const endHourIndex = hoursInDay.indexOf(`${selectedEndHour}:${selectedEndMinute}`);
        setHighlightedHourFrame([startHourIndex, endHourIndex]);
    }, [selectedStartHour, selectedStartMinute, selectedEndHour, selectedEndMinute]);
        
    // Function to format duration from minutes to hours and minutes
    const formatDuration = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours} hour(s) ${mins} minute(s)`;
    };



    // Fetch sessions for each staff member and include session ID
    useEffect(() => {
        const fetchSessionsForSelectedDateAndNext = async () => {
            const startDate = selectedSessionDate;
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 1); // Adjust to get the next day
    
            const formattedStartDate = startDate.toISOString().split('T')[0];
            const formattedEndDate = endDate.toISOString().split('T')[0];
    
            try {
                const sessionsToday = await scheduleService.fetchSessionsByDate(formattedStartDate);
                const sessionsNextDay = await scheduleService.fetchSessionsByDate(formattedEndDate);
    
                // Combine sessions from both days
                return [...sessionsToday, ...sessionsNextDay];
            } catch (error) {
                console.error(`Failed to fetch sessions for selected and next date:`, error);
                throw error;
            }
        };
    
        const processSessions = async () => {
            const combinedSessions = await fetchSessionsForSelectedDateAndNext();
            const localStartDate = new Date(selectedSessionDate);
            localStartDate.setHours(0, 0, 0, 0);
            const localEndDate = new Date(localStartDate);
            localEndDate.setDate(localStartDate.getDate() + 1);
    
            // Filter sessions to include only those that fall within the selected date in local time
            const filteredSessions = combinedSessions.filter(session => {
                const sessionStartTime = new Date(session.startTime);
                return sessionStartTime >= localStartDate && sessionStartTime < localEndDate;
            });
    
            let sessionsByStaff = {};
            let sessionsDetails = {};
            filteredSessions.forEach(session => {
                // Organize sessions by staff
                if (!sessionsByStaff[session.hostingBy]) {
                    sessionsByStaff[session.hostingBy] = [];
                }
                sessionsByStaff[session.hostingBy].push({
                    id: session.id,
                    timeFrames: generateTimeFrames(new Date(session.startTime), new Date(session.endTime))
                });
    
                // Prepare session details
                sessionsDetails[session.id] = session;
            });
    
            // Update state with filtered and organized session data
            setFilteredSessionsDetails(sessionsDetails);
            setStaffSessions(sessionsByStaff);
        };
    
        if (selectedSessionDate) {
            processSessions();
        }
    }, [selectedSessionDate, refreshCount]);


    // Function to generate time frames between start and end times before pushing to staffSession and render
    // supporting function to convert time to 24 hour format
    const convertTo24HourFormat = (timeStr) => {
        // Parse the time and AM/PM part from the string
        const [time, modifier] = timeStr.split(' ');
        let [hours, minutes] = time.split(':');
    
        // Convert hours to 24-hour format
        if (hours === '12') {
            hours = modifier === 'AM' ? '00' : '12';
        } else if (modifier === 'PM') {
            hours = String(parseInt(hours, 10) + 12);
        }
    
        // Ensure hours and minutes are two digits
        if (hours.length < 2) hours = '0' + hours;
        if (minutes.length < 2) minutes = '0' + minutes;
    
        return `${hours}:${minutes}`;
    };

    // Function to generate time frames between start and end times
    const generateTimeFrames = (startTime, endTime) => {
        let frames = [];
        let currentTime = new Date(startTime.getTime());
        while (currentTime < endTime) {
            let timeStr = currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
            // Convert each frame to 24-hour format before adding it to the frames array
            frames.push(convertTo24HourFormat(timeStr));
            currentTime = new Date(currentTime.getTime() + 15 * 60 * 1000); // Add 15 minutes
        }
        return frames;
    };

    //handle booking appointment
    const handleBookingAppointment = async (hasAttendees , id) => {
        if (hasAttendees) {
            alert('This session has already been booked');
            return;
        } else {
            if (!confirm('Are you sure you want to book this session?')) {
                return;
            }
            const sessionDetails = {
                ...filteredSessionsDetails[id],
                title: 'Booked Session for ' + user.name,
                content: 'Booked Session for ' + user.name, 
                attendeeId: user.uid,};
                try {
                    await scheduleService.updateSession(id, sessionDetails);
                    // Assuming `user.email` contains the user's email address
                    await mailService.sendEmailWithSendgrid({
                        to: user.email, // The user's email
                        from: 'duchoang@duchoang.dev', // Your SendGrid verified sender email
                        subject: 'Session Booking Confirmation',
                        text: `Hi ${user.name}, you have successfully booked the session titled "${sessionDetails.title}" for ${new Date(sessionDetails.startTime).toLocaleString()}.`,
                        html: `<strong>Hi ${user.name},</strong><p>You have successfully booked the session titled "${sessionDetails.title}" for ${new Date(sessionDetails.startTime).toLocaleString()}.</p>`,
                    });
                    setRefreshCount(refreshCount + 1);
                    alert('Session booked successfully');
                } catch (error) {
                    console.error('Failed to book session or send confirmation email:', error);
                    alert('Failed to book the session or send confirmation email. Please try again.');
                }
        }
    };


    // Function to render staff columns
    const displayStaffColumns = () => {
        return staffList.map((staff) => {
            const staffSessionsFrames = staffSessions[staff.id] || [];

            return (
                <div key={staff.id} className='w-full flex flex-col pr-2 staff-column relative'>
                    <h2 className='text-center text-sm bg-three-day bg-opacity-65 text-three-day mb-10'>{staff.firstName} {staff.lastName}</h2>
                    {hoursInDay.map((hour, index) => {
                        const isSessionStart = staffSessionsFrames.some(session => session.timeFrames[0] === hour);
                        const isInASession = staffSessionsFrames.some(session => session.timeFrames.includes(hour));
                        const sessionFrames = staffSessionsFrames.find(session => session.timeFrames[0] === hour);
                        const sessionHeight = sessionFrames ? sessionFrames.timeFrames.length * 10 : 0;

                        // Use the session ID to look up the detailed session info, including attendees
                        const sessionDetails = sessionFrames ? filteredSessionsDetails[sessionFrames.id] : null;
                        const hasAttendees = sessionDetails && sessionDetails.attendeeId;
                        const isUserSession = sessionDetails && sessionDetails.attendeeId === user.uid;


                        return (
                            <div key={hour} className={`no-grid-line-frame relative ${hour.endsWith("00") ? 'grid-line-frame' : ''} ${index >= highlightedHourFrame[0] && index < highlightedHourFrame[1] && staff === selectedStaff && !isInASession ? 'highlight-frame' : ''}`}>
                                {!isInASession && !isSessionStart && (
                                    <div className={`add-session ${index >= highlightedHourFrame[0] && index < highlightedHourFrame[1] && staff === selectedStaff ? 'hidden' : ''} ${isBooking ? 'hidden' : ''}`}
                                        style={{ zIndex: 0 }}
                                        onClick={() => handleHourSelection(hour, staff)}> 
                                        Add +
                                    </div>
                                )}
                                {isSessionStart && (
                                    <div style={{
                                            position: 'absolute',
                                            top: '0px',
                                            height: `${sessionHeight}px`,
                                            width: '100%',
                                            zIndex: 2,
                                            backgroundColor: hasAttendees ? 'rgba(100, 0, 0, 0.6)' : 'rgba(0, 0, 200, 0.6)', // Red for sessions with attendees, Blue for sessions without
                                            borderRadius: '5px',
                                            border: '1px solid #007bff',
                                            cursor: 'pointer',
                                        }} onClick={() => isBooking ? handleBookingAppointment(hasAttendees, sessionFrames.id) : populateFormWithSession(sessionFrames.id)}>
                                        {hasAttendees ? (
                                            <div className={`flex items-center justify-center text-xs text-white h-full ${isBooking && isUserSession ? ' bg-lime-800' : ''}`}>
                                                {isBooking && isUserSession ? (<p>Your Session</p>) : <p>Not Available</p> }
                                            </div>
                                        ) : (
                                            <div className='flex items-center justify-center text-xs text-white h-full'>
                                                Available
                                            </div>
                               
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            );
        });
    };

    const populateFormWithSession = async (sessionId) => {
        // Find the session in the already fetched sessions data
        const sessionDetails = filteredSessionsDetails[sessionId];

        if (!sessionDetails) {
            console.error('Session details not found for ID:', sessionId);
            return;
        }
    
        setSelectedSession(sessionDetails); // Keep the entire session object if needed
    
        // Populate form fields
        setTitle(sessionDetails.title);
        setContent(sessionDetails.content);
    
        // Convert ISO start and end times to HH:MM format
        const start = new Date(sessionDetails.startTime);
        const end = new Date(sessionDetails.endTime);
    
        setSelectedStartHour(start.getHours().toString().padStart(2, '0'));
        setSelectedStartMinute(start.getMinutes().toString().padStart(2, '0'));
        setSelectedEndHour(end.getHours().toString().padStart(2, '0'));
        setSelectedEndMinute(end.getMinutes().toString().padStart(2, '0'));
    
        // Also populate the staff selection if needed
        const staff = staffList.find(staff => staff.id === sessionDetails.hostingBy);
        setSelectedStaff(staff ? staff : '');
        const attendee = sessionDetails.attendeeId ? await UserService.getUser(sessionDetails.attendeeId) : null;
        setAttendee(attendee);
    };

    //Handle Search
    const handleSearch = async () => {
        if (!searchValue.trim()) {
          setSearchedUsers([]); // Clear search results if the search term is empty
          return;
        }
      
        setLoadingSearch(true); // Optional: Show a loading state while searching
        try {
          const searchResults = await UserService.searchUser(searchValue);
          setSearchedUsers(searchResults); // Assuming the API returns an array of users
        } catch (error) {
          console.error("Searching users failed: ", error);
          setError(error); // Optional: Set an error state
        } finally {
          setLoadingSearch(false); // Hide loading state after searching
        }
      };




    // Handling the save action
    const handleSave = async (e) => {
        e.preventDefault();
    
        if (!selectedStaff || !selectedStaff.id) {
            console.error('No staff selected');
            // Optionally, add error handling here
            return;
        }
    
        const startDate = new Date(`${startTime.split('T')[0]}T${selectedStartHour}:${selectedStartMinute}:00`);
        const endDate = new Date(`${endTime.split('T')[0]}T${selectedEndHour}:${selectedEndMinute}:00`);
    
        const sessionData = {
            title: title || 'No title provided',
            content,
            startTime: startDate.toISOString(),
            endTime: endDate.toISOString(),
            hostingBy: selectedStaff.id,
            createdBy: user?.uid,
            updatedBy: user?.uid,
            attendeeId: attendee?.id || null,
        };
    
        try {
            setLoading(true);
            let response;
            if (selectedSession && selectedSession.id) {
                // Updating an existing session
                response = await scheduleService.updateSession(selectedSession.id, sessionData);
                console.log('Session updated successfully:', response);
                alert('Session updated successfully');
            } else {
                // Creating a new session
                response = await scheduleService.createSession(sessionData);
                console.log('Session created successfully:', response);
                alert('Session created successfully');
            }
            setRefreshCount(refreshCount + 1);
            handleClear();
        } catch (error) {
            console.error('Failed to save session:', error);
        } finally {
            setLoading(false);
        }
    };
    


    // Handling the clear action
    const handleClear = () => {
        setTitle('');
        setContent('');
        setSelectedStartHour('09:00');
        setSelectedStartMinute('00');
        setSelectedEndHour('10:00');
        setSelectedEndMinute('00');
        setSelectedStaff('');
        setSelectedSession(null);
        setAttendee(null);
        setResetSearchUser(prev => !prev);
    };




    // Handling the delete action
    const handleDelete = async (sessionId) => {
        if (!sessionId) {
            console.error('No session ID provided for deletion');
            return;
        }
        if (!window.confirm('Are you sure you want to delete this session?')) {
            return;
        }
    
        try {
            setLoading(true);
            await scheduleService.deleteSession(sessionId);
            console.log('Session deleted successfully');
            alert('Session deleted successfully');
            setRefreshCount(refreshCount + 1); // Trigger a refresh or update of session data
            handleClear(); // Clear form or manage UI state as needed
        } catch (error) {
            console.error('Failed to delete session:', error);
            // Handle error (e.g., showing an error message)
        } finally {
            setLoading(false);
        }
    };

    const duplicateSessionsFor14Days = async (includeWeekends = false) => {
        if (!confirm('Are you sure you want to duplicate sessions for the next 14 days?')) {
            return;
        }
        setLoading(true);
        const sessionsToDuplicate = Object.values(filteredSessionsDetails);
    
        for (let dayOffset = 1; dayOffset <= 14; dayOffset++) {
            // Correctly calculate the new date by adding the day offset to the selected session date
            let newDate = new Date(selectedSessionDate);
            newDate.setDate(newDate.getDate() + dayOffset);
    
            // Check if the new date falls on a weekend
            if (!includeWeekends && (newDate.getDay() === 0 || newDate.getDay() === 6)) {
                continue; // Skip this iteration if excluding weekends
            }
    
            sessionsToDuplicate.forEach(async (session) => {
                // Prepare the new session start and end times
                let newStartTime = new Date(session.startTime);
                let newEndTime = new Date(session.endTime);
    
                // Adjust the new times to the new date, preserving the original time of day
                newStartTime = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(), newStartTime.getHours(), newStartTime.getMinutes());
                newEndTime = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(), newEndTime.getHours(), newEndTime.getMinutes());
    
                const newSessionData = {
                    ...session,
                    startTime: newStartTime.toISOString(),
                    endTime: newEndTime.toISOString(),
                    attendeeId: undefined, // Exclude attendee information for the duplication
                };
    
                delete newSessionData.id; // Ensure a new ID will be generated for each duplicated session
    
                try {
                    await scheduleService.createSession(newSessionData);
                } catch (error) {
                    console.error('Error duplicating session:', error);
                }
            });
        }
        setLoading(false);
        setRefreshCount(refreshCount + 1); // Trigger a refresh or update of session data
    
        console.log('Sessions duplicated successfully for 14 days.');
    };

    const handleClickBackground = () => {
        if (isBooking) onClose();
    }
    
    const isNotBooking = isBooking === null || isBooking === false;
    
    return (
        <div className='modal'
        onClick={handleClickBackground}>
            <div className={` w-1/2 min-h-screen ${isBooking ? 'w-full md:w-11/12 lg:w-2/3 xl:w-1/2':''}`}
            onClick={(e) => e.stopPropagation()}>
                {loading && <div className='h-screen w-full bg-three-day opacity-75 text-main-day flex justify-center items-center'>
                    <Spinner />
                </div>}
                {!loading && (
                    <div className={`${isBooking ? 'modal-container-date-view-single-panel' : 'modal-container-date-view'}`}>
                    <h2 className='text-3xl font-semibold text-center'>{formattedSessionDate}</h2>
                    <div className='py-6 flex justify-center space-x-6 items-center'>
                        <button className='mr-2 p-1 rounded-full w-10 h-10 bg-gray-200 hover:bg-gray-300 smooth-component-300 flex justify-center items-center' type='button' onClick={handlePrevDay}>&#9664;</button>
                        <div>Change Date</div>
                        <button className='mr-2 p-1 rounded-full w-10 h-10 bg-gray-200 hover:bg-gray-300 smooth-component-300 flex justify-center items-center' type='button' onClick={handleNextDay}>&#9654;</button>
                    </div>
                    
                    <div className='date-view relative'>
                        <div className='w-16 flex flex-col absolute top-14 -left-2'>
                            {hoursInDay.map((hour , index) => (
                                <div key={hour} className='no-grid-line-frame text-center text-sm relative'><p className={`translate-y-4 ${hour.endsWith('15') || hour.endsWith('45') ? 'hidden' :''} ${hour.endsWith('30') ? 'text-xs opacity-50' : ''}`}>{hour}</p></div>
                            ))}
                        </div>
                        {displayStaffColumns()}
                    </div>
                    {isBooking && (
                        <div className='button-container'>
                            <button type='button' className='sign-button smooth-component-300' onClick={onClose}>Close</button>
                        </div>
                    )}
                </div>
                )}
            </div>
            {isNotBooking && !loading && (
                <div className='w-1/2'>
                    <div className='modal-container-text-editor'>
                        <h1 className='text-3xl font-semibold text-center pb-10'>
                            {selectedSession ? 'Edit Session' : 'Create Session'}
                        </h1>
                        <form onSubmit={handleSave}
                        className=' flex flex-col space-y-4'>
                            <div className='form-group flex'>
                                <label htmlFor='title'
                                className='w-32'>Title</label>
                                <input
                                    type='text'
                                    id='title'
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className='w-full'
                                />
                            </div>
                            <div className='form-group flex'>
                                <label htmlFor='content'
                                className='w-32'>Content</label>
                                <textarea
                                    id='content'
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    className='w-full'
                                />
                            </div>
                            <div className='form-group flex'>
                                <label htmlFor='timezone' className='w-32'>Timezone</label>
                                <input
                                    type='text'
                                    id='timezone'
                                    value={timezone}
                                    className='w-full'
                                    disabled
                                />
                            </div>
                            <div className='form-group flex'>
                                <label htmlFor='startTime' className='w-1/4'>Start Time</label>
                                <div className='w-2/12 text-center'>Hour:</div>
                                <select
                                    id='startTime'
                                    value={selectedStartHour}
                                    onChange={(e) => setSelectedStartHour(e.target.value)}
                                    required
                                    className='w-1/4'
                                >
                                    {hoursOption.map((hour) => (
                                        <option key={hour} value={hour}>{hour}</option>
                                    ))}
                                </select>
                                <div className='w-2/12 text-center'>Min:</div>
                                <select
                                    id='startTime'
                                    value={selectedStartMinute}
                                    onChange={(e) => setSelectedStartMinute(e.target.value)}
                                    required
                                    className='w-1/4'
                                >
                                    {minutesOption.map((minute) => (
                                        <option key={minute} value={minute}>{minute}</option>
                                    ))}
                                </select>
                            </div>
                            <div className='form-group flex'>
                                <label htmlFor='endTime' className='w-1/4'>End Time</label>
                                <div className='w-2/12 text-center'>Hour:</div>
                                <select
                                    id='endTime'
                                    value={selectedEndHour}
                                    onChange={(e) => setSelectedEndHour(e.target.value)}
                                    required
                                    className='w-1/4'
                                >
                                    {hoursOption.map((hour) => (
                                        <option key={hour} value={hour}>{hour}</option>
                                    ))}
                                </select>
                                <div className='w-2/12 text-center'>Min:</div>
                                <select
                                    id='endTime'
                                    value={selectedEndMinute}
                                    onChange={(e) => setSelectedEndMinute(e.target.value)}
                                    required
                                    className='w-1/4'
                                >
                                    {minutesOption.map((minute) => (
                                        <option key={minute} value={minute}>{minute}</option>
                                    ))}
                                </select>
                            </div>
                            <div className='flex'>
                                <div className='w-28'>Duration</div>
                                <div>{formatDuration(duration)} minutes</div>
                            </div>
    
                            <div className='flex'>
                                <div className='w-28'>Hosted By</div>
                                <div>{selectedStaff.firstName} {selectedStaff.lastName}</div>
                            </div>
                            
                            

                            <div className='border-2 border-slate-400 p-6 rounded-md'>
                                <div className='flex'>
                                    <div className='w-28 mb-10'>Attended By</div>
                                    {attendee ? <div>{attendee.firstName} {attendee.lastName}</div> : 'No attendee selected'}
                                    {attendee && <button type='button' className='bg-item-day px-3 h-8 text-three-day ml-16 hover:bg-white hover:text-black border-2 border-blue-900 smooth-component-300' onClick={() => setAttendee(null)}>Clear Attendee</button>}
                                </div>
                                <div>
                                    <input
                                        type='text'
                                        id='searchUser'
                                        value={searchValue}
                                        onChange={(e) => setSearchValue(e.target.value)}
                                        placeholder='Search for attendee'
                                        className='inline-block w-3/4 h-10 p-4'
                                        
                                    />
                                    <button type='button' className='ml-4 px-3 py-2 bg-gray-300 hover:bg-gray-700 hover:text-white rounded-md' onClick={handleSearch}>Search</button>
                                </div>
                                {/* Conditionally render the table based on whether the searched users list is populated */}
                                {loadingSearch && <div className='h-48 w-full bg-three-day opacity-75 text-main-day flex justify-center items-center'>
                                    <Spinner />
                                </div>}
                                {!loadingSearch && searchedUsers.length > 0 ? (
                                <table className='table-auto w-full'>
                                    <thead>
                                    <tr className='text-left'>
                                        <th>First Name</th>
                                        <th>Last Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Phone</th>
                                        <th>Status</th>
                                        <th>Plan</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {searchedUsers.map((user) => (
                                    <tr key={user.id} className='hover:bg-neutral-400 smooth-component-300 h-10 shadow-sm hover:cursor-pointer'
                                    onClick={() => setAttendee(user)}>
                                        <td>{user.firstName}</td>
                                        <td>{user.lastName}</td>
                                        <td>{user.email}</td>
                                        <td>{user.role}</td>
                                        <td>{user.phone}</td>
                                        <td>{user.isActive ? 'Active' : 'Inactive'}</td>
                                        <td>{user.plan}</td>
                                    </tr>
                                    ))}
                                    </tbody>
                                </table>
                                ) : null}
                            </div>
    
                            {/* Implement additional fields as needed */}
                            <div className='button-container'>
                                <button type='submit' className='sign-button smooth-component-300' disabled={loading}>
                                    {selectedSession ? 'Save' : 'Create'}
                                </button>
                                <button type='button' className='sign-button smooth-component-300' onClick={handleClear}>Clear</button>
                                <button type='button' className='sign-button smooth-component-300' onClick={onClose}>Close</button>
                            </div>
                            {selectedSession && selectedSession.id && ( // Ensure selectedSession has an id
                                <div className='button-container'>
                                    <button type='button' onClick={() => handleDelete(selectedSession.id)} className='sign-button smooth-component-300'>Delete</button>
                                </div>
                            )}
                        </form>
    
                        <div className='border-2 border-blue-950 rounded-md p-4 mt-10'>
                            <p>Use this sections to duplicate this day's session to the next 14 days. You can choose to include or exclude Weekdays</p>
                            <br/>
                            <p>NOTE: It is recommended to only use this feature if the following 14 days is clean of session. If there is existing data, the integrity of your schedule won't be guaranteed, The best way is to use the last day that has data to duplicate to the following days</p>
                            <br/>
                            <p>NOTE: To keep the database clean, do your schedule planning carefully before deciding to duplicate, and do not duplicate to far into the future.</p>
                            <div className='button-container'>
                                <button className='general-button' type='button' onClick={() => duplicateSessionsFor14Days(false)}>Duplicate Sessions (Weekdays Only)</button>
                                <button className='general-button' type='button' onClick={() => duplicateSessionsFor14Days(true)}>Duplicate Sessions (Including Weekends)</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {loading && <div className='fixed top-0 left-0 h-screen w-full bg-three-day opacity-75 text-main-day flex justify-center items-center'>
                <Spinner />
            </div>}   
        </div>
    );
}