import api from './api';
import { Dataset } from '../types';

export const datasetService = {
  async getDatasets(): Promise<Dataset[]> {
    const res: any = await api.get('/datasets');
    return res.data;
  },

  async getDatasetById(id: string): Promise<Dataset> {
    const res: any = await api.get(`/datasets/${id}`);
    return res.data;
  },

  async uploadDataset(formData: FormData): Promise<Dataset> {
    const res: any = await api.post('/datasets/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  async importDataset(id: string): Promise<any> {
    const res: any = await api.post(`/datasets/${id}/import`);
    return res.data;
  },

  async deleteDataset(id: string): Promise<void> {
    await api.delete(`/datasets/${id}`);
  },
};

