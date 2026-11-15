import api from './api';
import {
  DashboardSummary,
  MonthlyVolume,
  TopRole,
  TopSkill,
  DistributionItem,
} from '../types';

export const dashboardService = {
  async getSummary(): Promise<DashboardSummary> {
    const res: any = await api.get('/dashboard/summary');
    return res.data;
  },

  async getJobVolume(): Promise<MonthlyVolume[]> {
    const res: any = await api.get('/dashboard/job-volume');
    return res.data;
  },

  async getTopRoles(): Promise<TopRole[]> {
    const res: any = await api.get('/dashboard/top-roles');
    return res.data;
  },

  async getTopSkills(): Promise<TopSkill[]> {
    const res: any = await api.get('/dashboard/top-skills');
    return res.data;
  },

  async getIndustryDistribution(): Promise<DistributionItem[]> {
    const res: any = await api.get('/dashboard/industry-distribution');
    return res.data;
  },

  async getLocationDistribution(): Promise<DistributionItem[]> {
    const res: any = await api.get('/dashboard/location-distribution');
    return res.data;
  },

  async getExperienceDistribution(): Promise<DistributionItem[]> {
    const res: any = await api.get('/dashboard/experience-distribution');
    return res.data;
  },

  async getEducationDistribution(): Promise<DistributionItem[]> {
    const res: any = await api.get('/dashboard/education-distribution');
    return res.data;
  },
};

