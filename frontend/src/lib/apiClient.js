import { useAuth } from '@/contexts/AuthContext';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

export function createApiClient() {
  const auth = useAuth();

  const handleResponse = async (response) => {
    const data = await response.json();
    
    if (!response.ok) {
      // Handle 401 Unauthorized
      if (response.status === 401) {
        try {
          const newToken = await auth.refreshToken();
          // Retry the original request with new token
          const retryResponse = await fetch(response.url, {
            ...response,
            headers: {
              ...response.headers,
              'Authorization': `Bearer ${newToken}`
            }
          });
          return handleResponse(retryResponse);
        } catch (error) {
          // If refresh token fails, logout user
          auth.logout();
          throw new ApiError('Session expired. Please login again.', 401, data);
        }
      }
      
      throw new ApiError(
        data.message || 'Something went wrong',
        response.status,
        data
      );
    }
    
    return data;
  };

  const getHeaders = () => {
    const headers = {
      'Content-Type': 'application/json',
    };

    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  };

  return {
    // GET request
    get: async (endpoint) => {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return handleResponse(response);
    },

    // POST request
    post: async (endpoint, data) => {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    },

    // PUT request
    put: async (endpoint, data) => {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    },

    // PATCH request
    patch: async (endpoint, data) => {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    },

    // DELETE request
    delete: async (endpoint) => {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return handleResponse(response);
    }
  };
}