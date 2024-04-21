const baseUrl = '/api/sessions'; // Base URL for your session-related endpoints

const scheduleService = {
  // Fetch all sessions
  async fetchAllSessions() {
    try {
      const response = await fetch(`${baseUrl}/route`);
      if (!response.ok) {
        throw new Error('Failed to fetch sessions');
      }
      return response.json();
    } catch (error) {
      console.error('fetchAllSessions error:', error);
      throw error;
    }
  },

  // Create a new session
  async createSession(sessionData) {
    try {
      const response = await fetch(`${baseUrl}/route`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sessionData),
      });
      if (!response.ok) {
        throw new Error('Failed to create session');
      }
      return response.json();
    } catch (error) {
      console.error('createSession error:', error);
      throw error;
    }
  },

  // Fetch a session by ID
  async fetchSessionById(id) {
    try {
      const response = await fetch(`${baseUrl}/${id}/route`);
      if (!response.ok) {
        throw new Error('Failed to fetch session');
      }
      return response.json();
    } catch (error) {
      console.error('fetchSessionById error:', error);
      throw error;
    }
  },

  // Update a session
  async updateSession(id, sessionData) {
    try {
      const response = await fetch(`${baseUrl}/${id}/route`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sessionData),
      });
      if (!response.ok) {
        throw new Error('Failed to update session');
      }
      return response.json();
    } catch (error) {
      console.error('updateSession error:', error);
      throw error;
    }
  },

  // Delete a session
  async deleteSession(id) {
    try {
      const response = await fetch(`${baseUrl}/${id}/route`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete session');
      }
      // Assuming DELETE requests return no content
      return { success: true };
    } catch (error) {
      console.error('deleteSession error:', error);
      throw error;
    }
  },

  // Fetch sessions hosted by a user
  async fetchSessionsByHost(userId) {
    try {
      const response = await fetch(`${baseUrl}/byUserId/byHost/${userId}/route`);
      if (!response.ok) {
        throw new Error('Failed to fetch sessions by host');
      }
      return response.json();
    } catch (error) {
      console.error('fetchSessionsByHost error:', error);
      throw error;
    }
  },

  // Fetch sessions attended by a user
  async fetchSessionsByAttendee(userId) {
    try {
      const response = await fetch(`${baseUrl}/byUserId/byAttendee/${userId}/route`);
      if (!response.ok) {
        throw new Error('Failed to fetch sessions by attendee');
      }
      return response.json();
    } catch (error) {
      console.error('fetchSessionsByAttendee error:', error);
      throw error;
    }
  },

  async fetchSessionsByDate(date) {
    try {
      // Assuming the endpoint expects a date in 'YYYY-MM-DD' format
      const response = await fetch(`${baseUrl}/byDate/${date}/route`);
      if (!response.ok) {
        throw new Error('Failed to fetch sessions by date');
      }
      return response.json();
    } catch (error) {
      console.error('fetchSessionsByDate error:', error);
      throw error;
    }
  },



  // Fetch sessions by month for calendar vew
  async getMonthSessions(startDate, endDate) {
    try {
      const response = await fetch(`${baseUrl}/route?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch month sessions');
      }
      return await response.json();
    } catch (error) {
      console.error('getMonthSessions error:', error);
      throw error;
    }
  },
};


export default scheduleService;
