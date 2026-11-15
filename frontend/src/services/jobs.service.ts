import api from './api';
import { JobPosting } from '../types';

export interface JobsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  location?: string;
  industry?: string;
  experience?: string;
  education?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface JobsResponse {
  data: JobPosting[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const jobsService = {
  async getJobs(params: JobsQueryParams = {}): Promise<JobsResponse> {
    const res: any = await api.get('/jobs', { params });
    return {
      data: res.data,
      pagination: res.pagination,
    };
  },

  async getJobById(id: string): Promise<JobPosting> {
    const res: any = await api.get(`/jobs/${id}`);
    return res.data;
  },

  async getJobTrends(): Promise<any[]> {
    const res: any = await api.get('/jobs/trends');
    return res.data;
  },

  async getJobRoles(): Promise<string[]> {
    const res: any = await api.get('/jobs/roles');
    return res.data;
  },

  async getJobFilters(): Promise<{
    locations: string[];
    industries: string[];
    experienceLevels: string[];
    educationLevels: string[];
  }> {
    const res: any = await api.get('/jobs/filters');
    return res.data;
  },
};

