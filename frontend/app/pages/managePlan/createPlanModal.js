// root/app/pages/managePlan/createPlanModal.js
import React, {useState} from 'react';

const CreatePlanModal = ({ plan, handleChange, handleFeatureChange, handleAddFeature, handleRemoveFeature, handleSubmit, isEditing, closeModal }) => {
    const [isActiveChange, setIsActiveChange] = useState(false);
    
    return (
        <div className="modal" onClick={closeModal}>
            <div className='modal-container' onClick={(e) => e.stopPropagation()}>
                <form onSubmit={handleSubmit} className=''>
                    <div className='flex flex-col justify-center items-center space-y-10 form-style'>
                        <div className='flex w-full items-end'>
                            <label htmlFor="title"
                            className='w-32'>Title</label>
                            <input
                                type="text"
                                name="title"
                                value={plan.title}
                                onChange={handleChange}
                                placeholder="Title"
                                className='h-10 bg-transparent border-b-2 border-slate-500 w-full'
                            />
                        </div>
                        <div className='flex w-full items-end '>
                            <label htmlFor="price"
                            className='w-32'>Price</label>
                            <input
                                type="text"
                                name="price"
                                value={plan.price}
                                onChange={handleChange}
                                placeholder="Price"
                                className='h-10 bg-transparent border-b-2 border-slate-500 w-full'
                            />
                        </div>
                        <div className='flex w-full items-end '>
                            <label htmlFor="description"
                            className='w-32'>Description</label>
                            <textarea
                                name="description"
                                value={plan.description}
                                onChange={handleChange}
                                placeholder="Description"
                                className=' h-10 bg-transparent border-b-2 border-slate-500 w-full'
                            />
                        </div>
                        <div className='flex w-full items-end '>
                            <label htmlFor="validPeriod"
                            className='w-32'>Valid Period</label>
                            <input
                                type="text"
                                name="validPeriod"
                                value={plan.validPeriod}
                                onChange={handleChange}
                                placeholder="Valid Period"
                                className='h-10 bg-transparent border-b-2 border-slate-500 w-full'
                            />
                        </div>
                        <label>
                            Best Value
                            <input
                                className='mx-10'
                                type="checkbox"
                                name="bestValue"
                                checked={plan.bestValue}
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            Active
                            <input
                                className='mx-10'
                                type="checkbox"
                                name="isActive"
                                checked={plan.isActive || false} // Ensure checked prop isn't undefined
                                onChange={(e)=> {handleChange(e), setIsActiveChange(!isActiveChange)}}
                            />
                        </label>
                        {isActiveChange && 
                        <div>
                            <p className='text-center text-red-400'>Caution: You are changing the ACTIVE state of the plan, this change affects other functionalities of the system. Be sure it's intentional!</p>
                        </div>}
                        <div className='w-full flex flex-col space-y-4'>
                            {plan.features.length !== 0 && plan.features.map((feature, index) => (
                                <div key={index} className='w-full flex space-x-2'>
                                    <input
                                        className='w-full'
                                        type="text"
                                        value={feature}
                                        onChange={e => handleFeatureChange(index, e)}
                                        placeholder="Feature"
                                    />
                                    {plan.features.length > 1 && (
                                        <button type="button" onClick={() => handleRemoveFeature(index)}>
                                            Remove
                                        </button>
                                    )}
                                </div>
                            ))}
                            <div className='w-full flex justify-center'>
                                <div className='text-center my-4 w-full hover:cursor-pointer' onClick={handleAddFeature}>
                                    Add Feature
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='w-full flex justify-center general-button'>
                        <button type="submit">{isEditing ? 'Update Plan' : 'Create Plan'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePlanModal;