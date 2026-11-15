import api from './api';
import { User } from '../types';

export const userService = {
  async getProfile(): Promise<User> {
    const res: any = await api.get('/users/profile');
    return res.data;
  },

  async updateProfile(data: { name?: string; email?: string }): Promise<User> {
    const res: any = await api.put('/users/profile', data);
    return res.data;
  },

  async updatePassword(data: { currentPassword: string; newPassword: string }): Promise<void> {
    await api.put('/users/password', data);
  },
};

