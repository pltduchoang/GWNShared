// root/frontend/app/pages/manageUser/createUserModal.js
'use client';
import React, { useEffect, useState } from 'react';
import UserService from '@/app/services/userService';
import PlanService from '@/app/services/planService';
import { useContextProvider } from '@/app/utils/globalContext';
import Spinner from '@/app/component/spinner';

function CreateUserModal({ initialUser, isEditing, closeModal }) {
    const [activePlans, setActivePlans] = useState([]);
    const [isActiveChange, setIsActiveChange] = useState(false);
    const [loading, setLoading] = useState(false);

    const { refreshCount, setRefreshCount } = useContextProvider();
    
    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        role: 'user',
        streetAddress: '',
        city: '',
        province: 'AB',
        phoneNumber: '',
        postalCode: '',
        isActive: true,
        planID: null,
        subscribeNewsletter: false,
    });

    const [validationMessages, setValidationMessages] = useState({
        phoneNumber: '',
        postalCode: '',
    });

    // Populate form fields when editing; clear them when creating a new user----
    useEffect(() => {
        setUser(isEditing ? initialUser : {
        firstName: '',
        lastName: '',
        email: '',
        role: 'user',
        streetAddress: '',
        city: '',
        province: 'AB',
        phoneNumber: '',
        postalCode: '',
        isActive: true,
        planID: '',
        subscribeNewsletter: false,
        });
    }, [isEditing, initialUser]);

    //fetch active plans---------------------------------------------------------
    useEffect(() => {
        async function fetchPlans() {
            try {
                const plans = await PlanService.getActivePlans();
                setActivePlans(plans);
            } catch (error) {
                console.error("Failed to fetch active plans:", error);
            }
        }
        fetchPlans();

    }, []);
  
   

      //validation-----------------------------------------------------------------
      const validateInput = (name, value) => {
        let message = '';
      
        if (name === 'phoneNumber' && value) {
          message = value.length === 10 ? 'Valid phone number' : 'Phone number must be 10 digits';
        } else if (name === 'postalCode' && value) {
          const postalCodeRegex = /^[A-Za-z]\d[A-Za-z]\d[A-Za-z]\d$/;
          message = postalCodeRegex.test(value) ? 'Valid postal code' : 'Invalid postal code format (e.g., T3K4H4)';
        }
      
        setValidationMessages(prev => ({
          ...prev,
          [name]: message,
        }));
      };

       // Handle form input changes-------------------------------------------------
       const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setUser(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    
        // Validate inputs for phoneNumber and postalCode
        if (['phoneNumber', 'postalCode'].includes(name)) {
            validateInput(name, value);
        }
    };
    


      const handleSubmit = async (e) => {
            e.preventDefault();
            setLoading(true);
            console.log(user);
            let tempUserProfile = {
                ...user,
                planID: user.planID !== '' && user.planID !== null ? parseInt(user.planID) : null,
            };
            console.log(tempUserProfile);
            try {
                let response;
                if (isEditing) {
                    // Assuming your API expects the user ID as a parameter for updateUser
                    response = await UserService.updateUser(user.id, tempUserProfile);
                    alert('User updated successfully');
                } else {
                    response = await UserService.addUser(tempUserProfile);
                    alert('User created successfully');
                }
                setRefreshCount(refreshCount + 1);
                // Close the modal and refresh user list or handle as needed
                closeModal();
                // Optional: If your parent component needs to be notified about the update
                // You might want to include a prop function like onUserUpdate() and call it here
                } catch (error) {
                console.error('Operation failed:', error);
                alert('Failed to process user data');
                } finally {
                setLoading(false);
            }
        };

    const handleInsideClick = (e) => {
        e.stopPropagation();
    };

  return (
    <div className="modal bg-two-day"
    onClick={closeModal}>
      <div className="modal-container"
      onClick={handleInsideClick}>
        <form onSubmit={handleSubmit} className='modal-content'>
          <div className='flex flex-col space-y-4'>
            <div className='flex items-end'>
                <label htmlFor="firstName"
                className='flex justify-start w-44'>First Name</label>
                <input
                name="firstName"
                value={user.firstName || ''}
                onChange={handleChange}
                placeholder="First Name"
                required= {!isEditing}
                className='flex justify-end w-full border-b-2 border-slate-500 bg-transparent h-10'
                />
            </div>
            <div className='flex items-end'>
                <label htmlFor="lastName"
                className='flex justify-start w-44'>Last Name</label>
                <input
                name="lastName"
                value={user.lastName || ''}
                onChange={handleChange}
                placeholder="Last Name"
                required= {!isEditing}
                className='flex justify-end w-full border-b-2 border-slate-500 bg-transparent h-10'
                />
            </div>
            <div className='flex items-end'>
                <label htmlFor="email"
                className='flex justify-start w-44'>Email</label>
                <input
                name="email"
                type="email"
                value={user.email || ''}
                onChange={handleChange}
                placeholder="Email"
                required= {!isEditing}
                className='flex justify-end w-full border-b-2 border-slate-500 bg-transparent h-10'

                />
            </div>
            <div className='flex items-end'>
                <label htmlFor="role"
                className='flex justify-start w-44'>Role</label>
                <select name="role" value={user.role || 'user'} onChange={handleChange}
                className='flex justify-end w-full border-b-2 border-slate-500 bg-transparent h-10'>
                    <option value="user">User</option>
                    <option value="staff">Staff</option>
                    <option value="subscriber">Subscriber</option>
                </select>
            </div>
            <div className='flex items-end'>
                <label htmlFor="streetAddress"
                className='flex justify-start w-44'>Street Address</label>
                <input
                    name="streetAddress"
                    value={user.streetAddress || ''}
                    onChange={handleChange}
                    placeholder="Street Address"
                    className='flex justify-end w-full border-b-2 border-slate-500 bg-transparent h-10'
                />
            </div>
            <div className='flex items-end'>
                <label htmlFor="city"
                className='flex justify-start w-44'>City</label>
                <input
                    name="city"
                    value={user.city || ''}
                    onChange={handleChange}
                    placeholder="City"
                    className='flex justify-end w-full border-b-2 border-slate-500 bg-transparent h-10'
                />
            </div>
            <div className='flex items-end'>
                <label htmlFor="province"
                className='flex justify-start w-44'>Province</label>
                <select name="province" value={user.province || 'AB'} onChange={handleChange}
                className='flex justify-end w-full border-b-2 border-slate-500 bg-transparent h-10'>
                    <option value="AB">Alberta</option>
                    <option value="BC">British Columbia</option>
                    <option value="MB">Manitoba</option>
                    <option value="NB">New Brunswick</option>
                    <option value="NL">Newfoundland and Labrador</option>
                    <option value="NS">Nova Scotia</option>
                    <option value="ON">Ontario</option>
                    <option value="PE">Prince Edward Island</option>
                    <option value="QC">Quebec</option>
                    <option value="SK">Saskatchewan</option>
                    <option value="NT">Northwest Territories</option>
                    <option value="NU">Nunavut</option>
                    <option value="YT">Yukon</option>
                </select>   
            </div>
            {/* Phone Number Input */}
            <div className='flex items-end'>
                <label htmlFor="phoneNumber"
                className='flex justify-start w-44'>Phone</label>
                <input
                    name="phoneNumber"
                    type="tel"
                    value={user.phoneNumber || ''}
                    onChange={handleChange}
                    placeholder="Phone"
                    className='flex justify-end w-full border-b-2 border-slate-500 bg-transparent h-10'
                />
                
            </div>
            <p className='text-center' style={{ color: validationMessages.phoneNumber === 'Valid phone number' ? 'green' : 'red' }}>
                    {validationMessages.phoneNumber}
            </p>
            {/* Postal Code Input */}
            <div className='flex items-end'>
                <label htmlFor="postalCode"
                className='flex justify-start w-44'>Postal Code</label>
                <input
                    name="postalCode"
                    value={user.postalCode || ''}
                    onChange={handleChange}
                    placeholder="Postal Code"
                    className='flex justify-end w-full border-b-2 border-slate-500 bg-transparent h-10'
                />   
            </div>
            <p className='text-center' style={{ color: validationMessages.postalCode === 'Valid postal code' ? 'green' : 'red' }}>
                    {validationMessages.postalCode}
                </p>
            <div className='toggle-switch flex items-end'>
                <label htmlFor="isActive"
                className='flex justify-start w-44'>Is Active?</label>
                <div>
                    <input
                        id="isActive"
                        name="isActive"
                        type="checkbox"
                        checked={user.isActive || false}
                        onChange={(e)=> {handleChange(e), setIsActiveChange(!isActiveChange)}}
                    />
                </div>
            </div>
            <div className='toggle-switch flex items-end'>
                <label htmlFor="subscribeNewsletter"
                className='flex justify-start w-44'>Subscribe To Newsletter</label>
                <div>
                    <input
                        id="subscribeNewsletter"
                        name="subscribeNewsletter"
                        type="checkbox"
                        checked={user.subscribeNewsletter || false}
                        onChange={(e)=> {handleChange(e)}}
                    />
                </div>
            </div>
            {isActiveChange &&
                <div>
                    <p className='text-center text-red-400'>Caution: You are changing the ACTIVE state of the user, this change affects other functionalities of the system. Be sure it's intentional!</p>
                </div>}
            <div className='flex items-end'>
                <label htmlFor="planID"
                className='flex justify-start w-44'>Plan</label>
                <select
                    name="planID"
                    value={user.planID || ''}
                    onChange={handleChange}
                    disabled={!['subscriber', 'staff', 'admin'].includes(user.role)}
                    className='flex justify-end w-full border-b-2 border-slate-500 bg-transparent h-10'            
                >
                    <option value="">Select a Plan</option>
                    {activePlans.map(plan => (
                    <option key={plan.id} value={plan.id}>
                        {plan.title}
                    </option>
                    ))}
                </select>
            </div>
          </div>
          <div className='flex flex-row justify-evenly mt-10'>
            <button type="submit" className='sign-button smooth-component'
            disabled={loading}>{loading && <Spinner className='w-full'/>}<p className={`${loading ? 'hidden' :''}`}>{isEditing ? 'Update' : 'Create'}</p></button>
            <button type="button" onClick={closeModal} className='sign-button smooth-component'>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateUserModal;
