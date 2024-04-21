// frontend/src/services/transactionService.js
const BASE_URL = '/api/transactions'; // Adjust if your API endpoint differs

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

const TransactionService = {
  async addTransaction(transactionData) {
    const response = await fetchWithTimeout(`${BASE_URL}/route`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transactionData),
    });
    if (!response.ok) {
      throw new Error('Error adding transaction');
    }
    return await response.json();
  },

  async getTransaction(id) {
    const response = await fetchWithTimeout(`${BASE_URL}/${id}/route`, {
      method: 'GET',
    });
    if (!response.ok) {
      console.log('Error fetching transaction from servie: ', response, 'id: ', id);
      throw new Error('Error fetching transaction');
    }
    return await response.json();
  },

  async updateTransaction(id, transactionData) {
    const response = await fetchWithTimeout(`${BASE_URL}/${id}/route`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transactionData),
    });
    if (!response.ok) {
      throw new Error('Error updating transaction');
    }
    return await response.json();
  },

  async deleteTransaction(id) {
    console.log(`${BASE_URL}/${id}/route`);
    const response = await fetchWithTimeout(`${BASE_URL}/${id}/route`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(error.message || 'Error deleting transaction');
    }
    return true; // Returns true if deletion was successful
  },

  async listTransactions(page = 0, pageSize = 30) {
    const response = await fetchWithTimeout(`${BASE_URL}/route?page=${page}&pageSize=${pageSize}`, {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error('Error listing transactions');
    }
    return await response.json(); // Direct array of transactions
  },

  async getTransactionByUser(userId) {
    const response = await fetchWithTimeout(`${BASE_URL}/route?userId=${userId}`, {
      method: 'GET',
    });    
    if (!response.ok) {
      throw new Error('Error fetching transactions');
    }
    return await response.json(); // Direct array of transactions
  },
};

export default TransactionService;
