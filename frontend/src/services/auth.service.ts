import api from './api';
import { AuthResponse, User } from '../types';

export const authService = {
  async register(data: { name: string; email: string; password: string }): Promise<AuthResponse> {
    const res: any = await api.post('/auth/register', data);
    return res.data;
  },

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    const res: any = await api.post('/auth/login', data);
    return res.data;
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('jobpulse_access_token');
      localStorage.removeItem('jobpulse_user');
    }
  },

  async getCurrentUser(): Promise<User> {
    const res: any = await api.get('/auth/me');
    return res.data.user;
  },
};

