import api from './api';
import { ModelPerformanceData } from '../types';

export const modelsService = {
  async getModels(): Promise<any> {
    const res: any = await api.get('/models');
    return res.data;
  },

  async getPerformance(): Promise<ModelPerformanceData> {
    const res: any = await api.get('/models/performance');
    return res.data;
  },

  async getBestModel(): Promise<any> {
    const res: any = await api.get('/models/best');
    return res.data;
  },
};

