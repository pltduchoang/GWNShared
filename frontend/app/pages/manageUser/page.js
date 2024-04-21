//root/frontend/app/pages/manageUser/page.js

// root/app/pages/manageUser/page.js
'use client';
import React, { useState, useEffect, useRef } from 'react';
import CreateUserModal from './createUserModal'; // Assume a modal component for creating/editing users
import NavBar from '@/app/component/navBar';
import { useContextProvider } from '@/app/utils/globalContext';
import UserService from '@/app/services/userService';
import { useUserAuth } from '@/app/utils/authContext';
import Pagination from '../../component/pagination';
import Spinner from '@/app/component/spinner';
import UserFormService from '@/app/services/userFormService';


export default function ManageUser() {
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [error, setError] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [filters, setFilters] = useState({ role: '', status: '', plan: '' });
  const [searchValue, setSearchValue] = useState(''); // Assuming you want to search by user name
  

  //display user forms
  const [userForms, setUserForms] = useState([]);


  const [userToEdit, setUserToEdit] = useState(null);
  
  
  const { refreshCount, setRefreshCount } = useContextProvider();
  const { user } = useUserAuth(); // Ensure user is authenticated

  // Get the menuHeight and setMenuHeight from the global context-----------------------
  const title ="Account";
  const { menuHeight, setMenuHeight } = useContextProvider();

  
  // Style to avoid the menu
  const avoidMenu = menuHeight ? { marginTop: menuHeight} : {marginTop: 90};


  //Page control
  const [currentPage, setCurrentPage] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const pageSize = 30; // Assuming you want to load 30 users per page


  useEffect(() => {
    async function fetchUsers() {
      setLoadingSearch(true);
      try {
        const response = await UserService.listUsers(currentPage, pageSize);
        if (response && Array.isArray(response.users)) {
          setUsers(response.users);
          setTotalUsers(response.totalUsers); // Now you have the total count
        } else {
          setUsers([]);
          setTotalUsers(0);
        }
      } catch (error) {
        console.error("Fetching users failed: ", error);
        setUsers([]);
        setTotalUsers(0);
        setError(error);
      }
      setLoadingSearch(false);
    }
    fetchUsers();
  }, [currentPage, refreshCount]);
  

  const totalPages = Math.ceil(totalUsers / pageSize);



  const handleCreateButton = () => {
    setShowModal(true);
    setIsEditing(false);
  };

  const handleEditUser = (userToEdit) => {
    setUserToEdit({ ...userToEdit });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`/api/users/${userId}/route`, {
          method: 'DELETE',
        });

        if (response.ok) {
          alert('User deleted successfully');
          setRefreshCount(refreshCount + 1);
        } else {
          alert('Failed to delete user');
          throw new Error(`Error: ${response.status}`);
        }
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  //Toolbar functions
  const handleFilterChange = (filterType, value) => {
    setFilters({ ...filters, [filterType]: value });
  };

  //Search function
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

  //Handle form button
  const handleShowForm = async (userId) => {
    setLoading(true);
    try {
      const userForms = await UserFormService.findUserFormsByUserId(userId);
      userForms.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      if (userForms.length > 3) {
        userForms.slice(0, 3);
      }
      setUserForms(userForms);
    } catch (error) {
      console.error("Fetching user forms failed: ", error);
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    setAuthenticated(user !== null);
  }, [user]);

  const handleClickInside = (e) => {
    e.stopPropagation();
  };

  const renderUsers = () => {
    if (!users.length) {
      return <div>No users found</div>;
    }
    return users.map((user) => (
          <div key={user.id}>
              <div  className="user-item bg-main-day p-6 m-2 w-80 text-main-day rounded-md shadow-md lg:hidden">
                  <div className="flex justify-between">
                      <p>Name:</p> <p>{user.firstName} {user.lastName}</p>
                  </div>
                  <div className="flex justify-between">
                      <p>Email:</p> <p>{user.email}</p>
                  </div>
                  <div className="flex justify-between">
                      <p>Role:</p> <p>{user.role}</p>
                  </div>
                  <div className="flex justify-between">
                      <p>Phone:</p> <p>{user.phone}</p>
                  </div>
                  <div className="flex justify-between">
                      <p>Joined:</p> <p>{new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex justify-between">
                      <p>Postal:</p> <p>{user.postalCode}</p>
                  </div>
                  <div className="flex justify-between">
                      <p>Is Active:</p> {user.isActive ? <p className=' text-lime-500'>Active</p> : <p className=' text-red-500'>Inactive</p>}
                  </div>
                  <div className="flex justify-between">
                      <p>Plan:</p> {user.plan ?  user.plan : <p className='text-red-300'>No Active Plan</p>}
                  </div>
                  <div className='w-full flex justify-evenly mt-10'>
                      <div className='general-button smooth-component' onClick={() => handleShowForm(user.id)}>Forms</div>
                      <div className='general-button smooth-component' onClick={() => handleEditUser(user)}>Edit</div>
                      <div className='general-button smooth-component' onClick={() => handleDelete(user.id)}>Delete</div>
                  </div>
              </div>
          </div>
      ));
  };

  return (
    <div className='min-h-screen bg-two-day text-main-day'>
      <div className="fixed top-0 left-0 w-full"
      style={{zIndex:2}}>
            <NavBar currentPage={title}/>
      </div>
      {loading && 
      <div className='fixed top-0 left-0 h-screen w-full bg-three-day opacity-85 text-main-day flex justify-center items-center'>
          <Spinner />
      </div>}            
      {!authenticated && <div className='fixed top-0 left-0 h-screen w-full bg-three-day opacity-85 text-main-day flex flex-col justify-center items-center'>You are not yet authenticated, please wait or &nbsp; <a href='/' className=' underline hover:text-blue-500'>return to home</a><Spinner/></div>}
      {error && <div className='h-screen w-full bg-two-day text-main-day flex justify-center items-center'>Error: {error.message}, &nbsp; <a href='/' className=' underline hover:text-blue-500'>return to home</a></div>}
      {!loading && authenticated && !error && (
        <div>
              
            <div className='flex flex-col items-center'
              style={avoidMenu}>
                <h2 className='text-center text-3xl font-bold py-10'>Manage Users</h2>
                <div className='button-container'>
                  <div onClick={handleCreateButton} className='general-button smooth-component'>Create User</div>
                </div>
              </div>


              <div className='user-list hidden lg:flex justify-center lg:flex-col lg:p-4 lg:bg-zinc-100 lg:rounded-md shadow-md my-10 lg:border-2 border-slate-500'>
                {/* Toolbar for Filters and Search */}
                <div className='toolbar flex w-full justify-between items-center p-2 bg-slate-200 rounded-lg'>
                  {/* Quick Filter for Role */}
                  <span className='text-main-day'>Quick Filters:</span>
                  <select onChange={(e) => handleFilterChange('role', e.target.value)} className='p-2 rounded-md'>
                    <option value="">All Roles</option>
                    <option value="user">User</option>
                    <option value="staff">Staff</option>
                    <option value="subscriber">Subscriber</option>
                  </select>
                  {/* Quick Filter for Status */}
                  <select onChange={(e) => handleFilterChange('status', e.target.value)} className='p-2 rounded-md'>
                    <option value="">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="non-active">Non-Active</option>
                  </select>
                  {/* Quick Filter for Plan */}
                  <select onChange={(e) => handleFilterChange('plan', e.target.value)} className='p-2 rounded-md'>
                    <option value="">All Plans</option>
                    <option value="withPlan">With Plan</option>
                    <option value="withoutPlan">Without Plan</option>
                  </select>
                  {/* Search Bar */}
                  <div>
                    <input 
                      type="text" 
                      placeholder="Search users..." 
                      onChange={(e) => setSearchValue(e.target.value)} 
                      className='p-2 rounded-md'
                    />
                    <button onClick={handleSearch} className='p-2 bg-slate-300 rounded-md mx-2'>Search</button>
                  </div>                  
                </div>



                {/* Conditionally render the table based on whether the searched users list is populated */}
                {loadingSearch && <div className='h-48 w-full bg-main-day text-main-day flex justify-center items-center'>
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
                        <th>Joined</th>
                        <th>Status</th>
                        <th>Plan</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {searchedUsers.map((user) => (
                        <tr key={user.id} className='hover:bg-neutral-400 smooth-component-300 h-10 shadow-sm'>
                          <td>{user.firstName}</td>
                          <td>{user.lastName}</td>
                          <td>{user.email}</td>
                          <td>{user.role}</td>
                          <td>{user.phone}</td>
                          <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                          <td>{user.isActive ? 'Active' : 'Inactive'}</td>
                          <td>{user.plan}</td>
                          <td>
                            <button onClick={() => handleShowForm(user.id)} className='hover:text-white smooth-component-300'>Forms</button>
                            <span> | </span>
                            <button onClick={() => handleEditUser(user)} className='hover:text-white smooth-component-300'>Edit</button>
                            <span> | </span>
                            <button onClick={() => handleDelete(user.id)} className='hover:text-red-600 smooth-component-300'>Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : null}
              </div>
                

              {/* search section smallscreen*/}
              <div className='w-full flex justify-center mt-10 px-6 lg:hidden flex-col'>
                <div className=' bg-main-day rounded-md shadow-md p-2 flex justify-center'>
                      <input 
                        type="text" 
                        placeholder="Search users..." 
                        onChange={(e) => setSearchValue(e.target.value)} 
                        className='p-2 rounded-md'
                      />
                      <button onClick={handleSearch} className='p-2 bg-slate-300 rounded-md mx-2'>Search</button>
                </div>
                {loadingSearch && <div className='h-48 w-full bg-main-day text-main-day flex justify-center items-center'>
                    <Spinner />
                </div>}

                {!loadingSearch && searchedUsers.length > 0 ? (
                  <div className='user-list flex flex-wrap justify-center py-6 lg:hidden bg-main-day rounded-md shadow-md mt-6'>
                    <h2 class='w-full text-center'>Search result</h2>
                    {searchedUsers.map((user) => (
                      <div key={user.id} className="user-item bg-main-day p-6 m-2 w-80 text-main-day rounded-md shadow-md">
                          <div className="flex justify-between">
                              <p>Name:</p> <p>{user.firstName} {user.lastName}</p>
                          </div>
                          <div className="flex justify-between">
                              <p>Email:</p> <p>{user.email}</p>
                          </div>
                          <div className="flex justify-between">
                              <p>Role:</p> <p>{user.role}</p>
                          </div>
                          <div className="flex justify-between">
                              <p>Phone:</p> <p>{user.phone}</p>
                          </div>
                          <div className="flex justify-between">
                              <p>Joined:</p> <p>{new Date(user.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div className="flex justify-between">
                              <p>Postal:</p> <p>{user.postalCode}</p>
                          </div>
                          <div className="flex justify-between">
                              <p>Is Active:</p> {user.isActive ? <p className=' text-lime-500'>Active</p> : <p className=' text-red-500'>Inactive</p>}
                          </div>
                          <div className="flex justify-between">
                              <p>Plan:</p> {user.plan ?  user.plan : <p className='text-red-300'>No Active Plan</p>}
                          </div>
                          <div className='w-full flex justify-evenly mt-10'>
                              <div className='general-button smooth-component' onClick={() => handleShowForm(user.id)}>Forms</div>
                              <div className='general-button smooth-component' onClick={() => handleEditUser(user)}>Edit</div>
                              <div className='general-button smooth-component' onClick={() => handleDelete(user.id)}>Delete</div>
                          </div>
                      </div>
                    ))}
                  </div>
                ) : null}

              </div>

              <div className='user-list flex flex-wrap justify-center py-10 lg:flex-col lg:p-4 lg:bg-zinc-100 lg:rounded-md shadow-md my-10 lg:border-2 border-slate-500'>
                {renderUsers()}
                <table className='hidden bg-zinc-100 lg:table'>
                  <thead>
                    <tr className='text-left'>
                      <th>First Name</th>
                      <th>Last Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Phone</th>
                      <th>Joined</th>
                      <th>Status</th>
                      <th>Plan</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className='hover:bg-neutral-400 smooth-component-300 h-10 shadow-sm'>
                        <td>{user.firstName}</td>
                        <td>{user.lastName}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>{user.phone}</td>
                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td>{user.isActive ? 'Active' : 'Inactive'}</td>
                        <td>{user.plan}</td>
                        <td>
                          <button onClick={() => handleShowForm(user.id)} className='hover:text-white smooth-component-300'>Forms</button>
                          <span> | </span>
                          <button onClick={() => handleEditUser(user)} className='hover:text-white smooth-component-300'>Edit</button>
                          <span> | </span>
                          <button onClick={() => handleDelete(user.id)} className='hover:text-red-600 smooth-component-300'>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
              </table>
              </div>
              {showModal && (
                <div className=''>
                    <CreateUserModal
                      initialUser={userToEdit}
                      isEditing={isEditing}
                      closeModal={() => setShowModal(false)}
                    />
                </div>
                )}


                {userForms.length > 0 && (
                  <div className='modal'
                  onClick={() => setUserForms([])}>
                    <div className='modal-container overflow-y-auto max-h-screen'
                    onClick={handleClickInside}>
                      <h2>User Forms</h2>
                      {userForms.map((form) => (
                        <div key={form.id} className="bg-main-day rounded-md shadow-md" style={{ border: '1px solid #ccc', padding: '20px', marginBottom: '10px' }}>
                          <div className="user-form-content" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span style={{ fontWeight: 'bold' }}>User Name:</span>
                              <span>{user.name}</span>
                            </div>
                            {Object.entries(form).map(([key, value]) => 
                              key !== 'id' && key !== 'userID' && ( // Exclude the 'id' and 'userID' from being displayed
                                <div key={key} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <span style={{ fontWeight: 'bold' }}>{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}:</span> {/* Converts camelCase keys to normal words */}
                                  <span>{value instanceof Date ? value.toLocaleDateString() : value}</span>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              
                <div className='pagination-controls'>
                  <Pagination 
                    totalPages={totalPages} 
                    currentPage={currentPage + 1} // Assuming currentPage is zero-indexed but we display as one-indexed
                    onPageChange={(page) => setCurrentPage(page - 1)} // Adjust for zero-indexed currentPage
                  />
                </div>
          </div>
      )}
    </div>
  );
}
