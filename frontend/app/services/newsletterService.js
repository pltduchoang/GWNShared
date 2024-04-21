// root/frontend/app/services/newsletterService.js

const BASE_URL = '/api/newsletters'; // Adjust if your API endpoint differs

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

const NewsletterService = {
  async createNewsletter(newsletterData) {
    const response = await fetchWithTimeout(`${BASE_URL}/route`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newsletterData),
    });
    if (!response.ok) {
      throw new Error('Error creating newsletter');
    }
    return await response.json();
  },

  async getAllNewsletters() {
    const response = await fetchWithTimeout(`${BASE_URL}/route`, {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error('Error fetching newsletters');
    }
    return await response.json();
  },

  async getNewsletterById(id) {
    const response = await fetchWithTimeout(`${BASE_URL}/${id}/route`, {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error('Error fetching newsletter');
    }
    return await response.json();
  },

  async updateNewsletter(id, newsletterData) {
    const response = await fetchWithTimeout(`${BASE_URL}/${id}/route`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newsletterData),
    });
    if (!response.ok) {
      throw new Error('Error updating newsletter');
    }
    return await response.json();
  },

  async deleteNewsletter(id) {
    const response = await fetchWithTimeout(`${BASE_URL}/${id}/route`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Error deleting newsletter');
    }
    return true; // Returns true if deletion was successful
  },
};

export default NewsletterService;
