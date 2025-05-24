import { userAPI } from './api';

export const userService = {
  login: async (credentials) => {
    try {
      const response = await userAPI.post('/users/login', credentials);
      return response;
    } catch (error) {
      throw error;
    }
  },

  register: async (userData) => {
    try {
      const response = await userAPI.post('/users/register', userData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  getUserById: async (userId) => {
    try {
      const response = await userAPI.get(`/users/${userId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  getProfile: async (userId) => {
    try {
      const response = await userAPI.get(`/users/${userId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateProfile: async (userId, profileData) => {
    try {
      const response = await userAPI.put(`/users/${userId}`, profileData);
      return response;
    } catch (error) {
      throw error;
    }
  }
};