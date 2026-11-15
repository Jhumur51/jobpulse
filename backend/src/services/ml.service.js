const axios = require('axios');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');

const mlClient = axios.create({
  baseURL: env.mlService.url,
  timeout: env.mlService.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

class MLService {
  /**
   * Health-check the ML service
   */
  async checkHealth() {
    try {
      const response = await mlClient.get('/health');
      return response.data;
    } catch (error) {
      console.error('[ML Service] Health check failed:', error.message);
      return {
        status: 'unreachable',
        error: error.message,
      };
    }
  }

  /**
   * Retrieve all candidate models and metrics
   */
  async getModels() {
    try {
      const response = await mlClient.get('/models');
      return response.data;
    } catch (error) {
      this._handleError(error, 'Failed to fetch ML models');
    }
  }

  /**
   * Retrieve comprehensive model performance evaluations
   */
  async getModelPerformance() {
    try {
      const response = await mlClient.get('/model-performance');
      return response.data;
    } catch (error) {
      this._handleError(error, 'Failed to fetch model evaluation metrics');
    }
  }

  /**
   * Retrieve best model details
   */
  async getBestModel() {
    try {
      const response = await mlClient.get('/model-performance/best');
      return response.data;
    } catch (error) {
      this._handleError(error, 'Failed to fetch best model');
    }
  }

  /**
   * Submit job market demand prediction request
   */
  async predictDemand({ jobRole, location, industry, horizon, modelName }) {
    try {
      const payload = {
        job_role: jobRole,
        location: location || 'All',
        industry: industry || 'Technology',
        horizon_months: horizon || 6,
        model_name: modelName || 'Random Forest Regressor',
      };

      const response = await mlClient.post('/predict', payload);
      return response.data;
    } catch (error) {
      this._handleError(error, 'Failed to generate demand prediction from ML service');
    }
  }

  /**
   * Retrieve calculated skill intelligence and growth rates
   */
  async getSkillTrends({ category, trend, search } = {}) {
    try {
      const response = await mlClient.get('/skill-trends', {
        params: { category, trend, search },
      });
      return response.data;
    } catch (error) {
      this._handleError(error, 'Failed to fetch skill trends from ML service');
    }
  }

  /**
   * Centralized ML service error translator
   */
  _handleError(error, defaultMsg) {
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      console.error(`[ML Service Error]: Cannot reach Python ML service at ${env.mlService.url}`);
      throw new ApiError(503, 'Python ML Service is currently offline or unreachable. Please start the ML service.');
    }
    if (error.code === 'ECONNABORTED') {
      console.error(`[ML Service Error]: Request timed out after ${env.mlService.timeout}ms`);
      throw new ApiError(504, 'ML Service prediction request timed out. Please try a shorter horizon.');
    }
    if (error.response) {
      const detail = error.response.data?.detail || error.response.data?.message || defaultMsg;
      throw new ApiError(error.response.status, detail);
    }
    throw new ApiError(500, `${defaultMsg}: ${error.message}`);
  }
}

module.exports = new MLService();

