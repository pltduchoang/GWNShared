// root/frontend/app/services/CoachImageService.js

const BASE_URL = '/api/coachImages'; // Adjust if your API endpoint differs

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

const CoachImageService = {
  async createCoachImage(imageData) {
    const response = await fetchWithTimeout(`${BASE_URL}/route`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(imageData),
    });
    if (!response.ok) {
      throw new Error('Error creating coach image');
    }
    return await response.json();
  },

  async getAllCoachImages() {
    const response = await fetchWithTimeout(`${BASE_URL}/route`, {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error('Error fetching coach images');
    }
    return await response.json();
  },

  async getCoachImageById(id) {
    const response = await fetchWithTimeout(`${BASE_URL}/${id}/route`, {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error('Error fetching coach image');
    }
    return await response.json();
  },

  async updateCoachImage(id, imageData) {
    const response = await fetchWithTimeout(`${BASE_URL}/${id}/route`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(imageData),
    });
    if (!response.ok) {
      throw new Error('Error updating coach image');
    }
    return await response.json();
  },

  async deleteCoachImage(id) {
    const response = await fetchWithTimeout(`${BASE_URL}/${id}/route`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Error deleting coach image');
    }
    return true; // Returns true if deletion was successful
  },
};

export default CoachImageService;
