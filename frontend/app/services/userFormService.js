// frontend/src/services/userFormService.js
const BASE_URL = '/api/userForms'; // Adjust if your API endpoint differs

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

const UserFormService = {
  async addUserForm(userFormData) {
    const response = await fetchWithTimeout(`${BASE_URL}/route`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userFormData),
    });
    if (!response.ok) {
      throw new Error('Error adding user form');
    }
    return await response.json();
  },

  async getUserFormById(id) {
    const response = await fetchWithTimeout(`${BASE_URL}/${id}/route`, {
      method: 'GET',
    });
    if (!response.ok) {
      console.log('Error fetching user form from service: ', response, 'id: ', id);
      throw new Error('Error fetching user form');
    }
    return await response.json();
  },

  async findUserFormsByUserId(userId) {
    const response = await fetchWithTimeout(`${BASE_URL}/route?userId=${encodeURIComponent(userId)}`, {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error('Error fetching user forms for specified user');
    }
    return await response.json();
  },

  async updateUserForm(id, userFormData) {
    const response = await fetchWithTimeout(`${BASE_URL}/${id}/route`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userFormData),
    });
    if (!response.ok) {
      throw new Error('Error updating user form');
    }
    return await response.json();
  },

  async deleteUserForm(id) {
    const response = await fetchWithTimeout(`${BASE_URL}/${id}/route`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Error deleting user form');
    }
    return true; // Returns true if deletion was successful
  },
};

export default UserFormService;
