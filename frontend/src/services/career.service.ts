import api from './api';
import {
  SkillGapResult,
  SalaryEstimateResult,
  CareerRoadmapResult,
  RoleComparisonResult,
} from '../types';

export interface SkillGapParams {
  targetRole: string;
  userSkills?: string[];
  resumeText?: string;
}

export interface SalaryEstimateParams {
  role: string;
  experienceLevel?: string;
  location?: string;
  skills?: string[];
}

export const careerService = {
  async analyzeSkillGap(params: SkillGapParams): Promise<SkillGapResult> {
    const res: any = await api.post('/career/skill-gap', params);
    return res.data;
  },

  async estimateSalary(params: SalaryEstimateParams): Promise<SalaryEstimateResult> {
    const res: any = await api.post('/career/salary-estimate', params);
    return res.data;
  },

  async getRoadmap(role: string): Promise<CareerRoadmapResult> {
    const res: any = await api.get(`/career/roadmap/${encodeURIComponent(role)}`);
    return res.data;
  },

  async compareRoles(roleA: string, roleB: string): Promise<RoleComparisonResult> {
    const res: any = await api.get('/career/compare', {
      params: { roleA, roleB },
    });
    return res.data;
  },
};

