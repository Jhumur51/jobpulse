import api from './api';
import { PredictionRequest, PredictionResponse } from '../types';

export const predictionService = {
  async createPrediction(data: PredictionRequest): Promise<PredictionResponse> {
    const res: any = await api.post('/predictions', data);
    return res.data;
  },

  async getPredictions(): Promise<any[]> {
    const res: any = await api.get('/predictions');
    return res.data;
  },

  async getPredictionById(id: string): Promise<any> {
    const res: any = await api.get(`/predictions/${id}`);
    return res.data;
  },
};

