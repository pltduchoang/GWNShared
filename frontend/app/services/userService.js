// root/frontend/app/services/userService.js
import { auth } from '@/app/utils/firebase'; // Ed added this, temporary until proper integration with backends 
const BASE_URL = '/api/users'; // Adjust if your API endpoint differs

async function fetchWithTimeout(resource, options = {}, timeout = 8000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  const response = await fetch(resource, {
    ...options,
    signal: controller.signal,
  });
  clearTimeout(id);
  return response;
}

const UserService = {
  async addUser(userData) {
    const response = await fetchWithTimeout(`${BASE_URL}/route`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      throw new Error('Error adding user');
    }
    
    return await response.json();
  },

  async getUser(id) {
    const response = await fetchWithTimeout(`${BASE_URL}/${id}/route`, {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error('Error fetching user');
    }
    return await response.json();
  },



  async updateUser(id, userData) {
    const URL = `${BASE_URL}/${id}/route`;
    const response = await fetchWithTimeout(`${BASE_URL}/${id}/route`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      throw new Error('Error updating user');
    }
    return await response.json();
  },

  async deleteUser(id) {
    const response = await fetchWithTimeout(`${BASE_URL}/${id}/route`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Error deleting user');
    }
    return response.ok; // Returns true if deletion was successful
  },

  async listUsers(page = 0, pageSize = 30) {
    const response = await fetchWithTimeout(`${BASE_URL}/route?page=${page}&pageSize=${pageSize}`, {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error('Error listing users');
    }
    // Directly return the array since the API responds with an array of users.
    return await response.json(); // Direct array of users
  },

  // GET USER ID; Edward made this (>w<), I can't figure a way to get userID as getting all users first is a risk (I can move this somewhere else if needed)
  async getCurrentUserId() {
    const currentUser = auth.currentUser;
    if (currentUser) {
      return currentUser.uid;
    } else {
      console.log('No user logged in');
      return null;
    }
  },

  async getSubscribedUsers() {
    const response = await fetchWithTimeout(`${BASE_URL}/route?subscribed=true`, {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error('Error fetching subscribed users');
    }
    return await response.json(); // Returns the array of subscribed users
  },


  async getStaffList() {
    const response = await fetchWithTimeout(`${BASE_URL}/route?staff=true`, {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error('Error fetching staff');
    }
    return await response.json(); // Returns the array of staff
  },

  async getUserByEmail(email) {
    const response = await fetchWithTimeout(`${BASE_URL}/route?email=${email}`, {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error('Error fetching user by email');
    }
    return await response.json();
  },
  

  
  async searchUser(searchValue) {
    const response = await fetchWithTimeout(`${BASE_URL}/route?search=${encodeURIComponent(searchValue)}`, {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error('Error searching users');
    }
    return await response.json();
  },
};




export default UserService;
