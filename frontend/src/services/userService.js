import { userAPI } from './api';

export const userService = {
  getUserById: async (userId) => {
    try {
      const response = await userAPI.get(`/users/${userId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
};