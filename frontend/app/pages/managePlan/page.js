//root/app/pages/managePlan/page.js
'use client';
import React, {useState,useEffect} from 'react';
import CreatePlanModal from './createPlanModal';
import NavBar from '@/app/component/navBar';
import {useContextProvider} from '@/app/utils/globalContext';
import {useUserAuth} from '@/app/utils/authContext';
import Spinner from '@/app/component/spinner';

export default function ManagePlan() {
    const [showModal, setShowModal] = useState(false);
    
    const [isEditing, setIsEditing] = useState(false);

    const {refreshCount, setRefreshCount,  menuHeight, setMenuHeight } = useContextProvider();

    const avoidMenu = menuHeight ? { marginTop: menuHeight} : {marginTop: 90};

    const { user } = useUserAuth(); // Ensure user is authenticated

    const [authenticated, setAuthenticated] = useState(false);

    const toggleModal = () => {
        setShowModal(!showModal);
    };

    const title = "Account";

    const [plan, setPlan] = useState({
        title: '',
        price: '',
        description: '',
        validPeriod: '',
        bestValue: false,
        features: ['']
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setPlan({
            ...plan,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleFeatureChange = (index, event) => {
        const newFeatures = [...plan.features];
        newFeatures[index] = event.target.value;
        setPlan({ ...plan, features: newFeatures });
    };

    const handleAddFeature = () => {
        setPlan({ ...plan, features: [...plan.features, ''] });
    };

    const handleRemoveFeature = index => {
        const newFeatures = [...plan.features];
        newFeatures.splice(index, 1);
        setPlan({ ...plan, features: newFeatures });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        // Serialize features array
        const planData = {
            ...plan,
            features: JSON.stringify(plan.features)
        };
    
        const endpoint = isEditing ? `/api/plans/${plan.id}/route` : '/api/plans/route';
        const method = isEditing ? 'PUT' : 'POST';

        try {
        const response = await fetch(endpoint, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(planData),
        });

        if (response.ok) {
            const message = isEditing ? 'Plan updated successfully' : 'Plan created successfully';
            alert(message);
            // Reset form and close modal
            setPlan({
                title: '',
                price: '',
                description: '',
                validPeriod: '',
                bestValue: false,
                features: ['']
            });
            setShowModal(false);
            setRefreshCount(refreshCount + 1);
            // Optionally, fetch plans again to update the list
        } else {
            const message = isEditing ? 'Failed to update plan' : 'Failed to create plan';
            alert(message);
            throw new Error(`Error: ${response.status}`);
        }
    } catch (error) {
        console.error('Operation failed:', error);
    }
    };

    //fetch plans
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchPlans() {
            try {
                const response = await fetch('/api/plans/route');
                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }
                const data = await response.json();
                setPlans(data);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        }
        fetchPlans();
    }, [refreshCount]);



    useEffect(() => {
        setAuthenticated(user !== null);
    }, [user]);

    const handleCreateButton = () => {
        toggleModal();
        setIsEditing(false);
        setPlan({
            title: '',
            price: '',
            description: '',
            validPeriod: '',
            bestValue: false,
            features: [''],
            isActive: true
        });
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setIsEditing(false);
        setPlan({
            title: '',
            price: '',
            description: '',
            validPeriod: '',
            bestValue: false,
            features: [''],
            isActive: true
        });
    };

    // Rendering function for plans
    const renderPlans = () => {
        return plans.map((plan, index) => {
            // Parse features from JSON string to array
            let features = [];
            try {
                features = JSON.parse(plan.features);
            } catch (e) {
                console.error('Error parsing features:', e);
            }
    
            return (
                <div key={index} className="flex flex-col items-center justify-center w-full mb-10 md:w-1/3 smooth-component">
                    <div className="flex-col items-center justify-center bg-two-day p-10 pb-10 border-2 border-slate-800 min-height-plan max-w-96">
                        <h2 className="text-2xl text-main-day text-center min-h-20 flex items-center justify-center">{plan.title}</h2>
                        <hr className="border-t-2 w-full border-slate-800 mb-6"></hr>
                        <p className="text-5xl text-three-day text-center bg-three-day mb-6">{plan.price}</p>
                        <p className="text-main-day text-2xl font-base mb-6 min-h-52">{plan.description}</p>
                        <p className="text-main-day text-xl text-center font-light mb-12">Valid for - {plan.validPeriod}</p>
                        <p className="text-main-day text-xl text-center font-light">{plan.bestValue ? 'Best Value' : ''}</p>
                        <p className="text-main-day text-xl text-center font-light">{plan.isActive ? 'Active' : 'Inactive'}</p>
                    </div>
                    <div className={`h-1 smooth-component-300 relative w-full max-w-96 py-52`}>
                        <div className={`bg-two-day p-10 pt-0 smooth-component-300 absolute top-0 left-0 border-2 border-t-0 border-slate-800 flex opacity-100`}>
                            <ul className="text-two-day text-xl list-disc pl-4 pt-4">
                                {features.map((feature, idx) => (
                                    <li key={idx}>{feature}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className='w-full flex justify-evenly'>
                        <button
                            className="sign-button smooth-component-300"
                            onClick={() => handleEditPlan(plan)}
                        >
                            Edit
                        </button>
                        <button
                            className="sign-button smooth-component-300"
                            onClick={() => handleDelete(plan.id)}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            );
        });
    };


    //Edit and delete plan

    const handleEditPlan = (planToEdit) => {
        // Set the plan state to the plan you want to edit
        // and open the modal in edit mode
        const featuresArray = typeof planToEdit.features === 'string' 
        ? JSON.parse(planToEdit.features) 
        : planToEdit.features;

    setPlan({
        ...planToEdit,
        features: featuresArray,
    });
        setIsEditing(true);
        setShowModal(true);
    };

    const handleDelete = async (planId) => {
        if (confirm('Are you sure you want to delete this plan?')) {
            try {
                console.log('Deleting plan:', planId);
                const response = await fetch(`/api/plans/${planId}/route`, {
                    method: 'DELETE',
                });
    
                if (response.ok) {
                    alert('Plan deleted successfully');
                    setRefreshCount(refreshCount + 1);
                } else {
                    alert('Failed to delete plan');
                    throw new Error(`Error: ${response.status}`);
                }
            } catch (error) {
                console.error('Failed to delete plan:', error);
            }
        }
    };

    return (
        <div className='min-h-screen bg-two-day text-main-day'>
            <div className="fixed top-0 left-0 w-full"
            style={{zIndex:2}}>
                <NavBar currentPage={title}/>
            </div>
            {loading && <div className='fixed top-0 left-0 h-screen w-full bg-three-day opacity-85 text-main-day flex justify-center items-center'>
                <Spinner />
            </div>}            
            {error && <div className='h-screen w-full bg-two-day text-main-day flex justify-center items-center'>Error: {error.message}, &nbsp; <a href='/' className=' underline hover:text-blue-500'>return to home</a></div>}
            {!authenticated && <div className='fixed top-0 left-0 h-screen w-full bg-three-day opacity-85 text-main-day flex flex-col justify-center items-center'>You are not yet authenticated, please wait or &nbsp; <a href='/' className=' underline hover:text-blue-500'>return to home</a><Spinner/></div>}
            {authenticated && (
                <div>
                    <div className='flex flex-col items-center my-20'
                    style={avoidMenu}>
                        {showModal && (
                            <CreatePlanModal
                                plan={plan}
                                isEditing={isEditing}
                                handleChange={handleChange}
                                handleFeatureChange={handleFeatureChange}
                                handleAddFeature={handleAddFeature}
                                handleRemoveFeature={handleRemoveFeature}
                                handleSubmit={handleSubmit}
                                closeModal={handleCloseModal}
                            />
                        )}
                    <button type='button' className='mt-16 general-button smooth-component-300' onClick={handleCreateButton}>Create Plan</button>
                    </div>
                    <div className='bg-two-day py-4'>
                        <h2 className='text-center text-4xl font-bold my-6'>Existing Plans</h2>
                        <div className="plans-list flex flex-wrap justify-center ">
                            {renderPlans()}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

