// root/app/pages/manageTestimony/createTestimonyModal.js
'use client';
import React from 'react';

const CreateTestimonyModal = ({ testimony, handleSubmit, closeModal, onChange }) => {
    return (
        <div className="modal p-20" onClick={closeModal}>
            <form onSubmit={handleSubmit} className='modal-container' onClick={(e) => e.stopPropagation()}>
                <div className='flex flex-col space-y-4'>
                    <div className='flex w-full items-end '>
                        <label htmlFor="author"
                        className='w-32'>Author</label>
                        <input
                            type="text"
                            name="author"
                            value={testimony.author || ''}
                            onChange={onChange}
                            placeholder="Author Name"
                            required
                            className=' h-10 bg-transparent border-b-2 border-slate-500'
                        />
                    </div>
                    <div className='flex w-full items-end '>
                        <label htmlFor="content"
                        className='w-32'>Content</label>
                        <textarea
                            name="content"
                            value={testimony.content || ''}
                            onChange={onChange}
                            placeholder="Testimony Content"
                            rows="4"
                            required
                            className='bg-transparent border-b-2 border-slate-500'
                        />
                    </div>

                    <div className='flex w-full items-end'>
                        <label htmlFor="profilePicURL"
                        className='w-32'>Picture URL</label>
                        <input
                            type="text"
                            name="profilePicURL"
                            value={testimony.profilePicURL || ''}
                            onChange={onChange}
                            placeholder="Profile Picture URL"
                            className=' h-10 bg-transparent border-b-2 border-slate-500'

                        />
                    </div>

                    <button type="submit" className="general-button">
                        {testimony.id ? 'Update Testimony' : 'Create Testimony'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateTestimonyModal;
