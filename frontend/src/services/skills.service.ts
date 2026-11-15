import api from './api';
import { SkillItem } from '../types';

export const skillsService = {
  async getSkills(params?: { category?: string; trend?: string; search?: string }): Promise<SkillItem[]> {
    const res: any = await api.get('/skills', { params });
    return res.data;
  },

  async getTopSkills(): Promise<SkillItem[]> {
    const res: any = await api.get('/skills/top');
    return res.data;
  },

  async getSkillTrends(): Promise<SkillItem[]> {
    const res: any = await api.get('/skills/trends');
    return res.data;
  },

  async getSkillById(id: string): Promise<SkillItem> {
    const res: any = await api.get(`/skills/${id}`);
    return res.data;
  },
};

