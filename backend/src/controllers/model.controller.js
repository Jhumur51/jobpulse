const mlService = require('../services/ml.service');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const getModels = asyncHandler(async (req, res) => {
  const result = await mlService.getModels();
  res.status(200).json(new ApiResponse(200, result, 'Candidate ML models retrieved'));
});

const getPerformance = asyncHandler(async (req, res) => {
  const result = await mlService.getModelPerformance();
  res.status(200).json(new ApiResponse(200, result, 'Model performance evaluations retrieved'));
});

const getBestModel = asyncHandler(async (req, res) => {
  const result = await mlService.getBestModel();
  res.status(200).json(new ApiResponse(200, result, 'Best performing model retrieved'));
});

module.exports = {
  getModels,
  getPerformance,
  getBestModel,
};

