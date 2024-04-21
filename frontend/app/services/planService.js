// root/frontend/app/services/planService.js

const BASE_URL = '/api/plans'; // Adjust if your API endpoint differs

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

const PlanService = {
  async createPlan(planData) {
    const response = await fetchWithTimeout(`${BASE_URL}/route`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(planData),
    });
    if (!response.ok) {
      throw new Error('Error creating plan');
    }
    return await response.json();
  },

  async getAllPlans() {
    const response = await fetchWithTimeout(`${BASE_URL}/route`, {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error('Error fetching plans');
    }
    return await response.json();
  },

  async getPlanById(id) {
    const response = await fetchWithTimeout(`${BASE_URL}/${id}/route`, {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error('Error fetching plan');
    }
    return await response.json();
  },

  async updatePlan(id, planData) {
    const response = await fetchWithTimeout(`${BASE_URL}/${id}/route`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(planData),
    });
    if (!response.ok) {
      throw new Error('Error updating plan');
    }
    return await response.json();
  },

  async deletePlan(id) {
    const response = await fetchWithTimeout(`${BASE_URL}/${id}/route`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Error deleting plan');
    }
    return true; // Returns true if deletion was successful
  },

  async getActivePlans() {
    const allPlans = await this.getAllPlans();
    const activePlans = allPlans.filter(plan => plan.isActive);
    return activePlans;
  },
};

export default PlanService;
