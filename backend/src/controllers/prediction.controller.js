const mlService = require('../services/ml.service');
const prisma = require('../config/database');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const inMemoryPredictions = [];

const createPrediction = asyncHandler(async (req, res) => {
  const { jobRole, location, industry, horizon, modelName } = req.body;
  const userId = req.user?.id || null;

  // 1. Submit prediction to Python ML Service
  const mlResult = await mlService.predictDemand({
    jobRole,
    location,
    industry,
    horizon,
    modelName,
  });

  // 2. Persist prediction audit record
  let savedRecord = {
    id: 'pred-' + Date.now(),
    userId,
    jobRole,
    location: location || 'All',
    horizon,
    modelName: mlResult.model_name,
    predictedDemand: mlResult.predicted_demand,
    predictedGrowth: mlResult.growth_percentage,
    predictionResults: mlResult,
    createdAt: new Date(),
  };

  if (prisma && prisma.$isAvailable) {
    try {
      savedRecord = await prisma.prediction.create({
        data: {
          userId,
          jobRole,
          location: location || 'All',
          horizon,
          modelName: mlResult.model_name,
          predictedDemand: mlResult.predicted_demand,
          predictedGrowth: mlResult.growth_percentage,
          predictionResults: mlResult,
        },
      });
    } catch (e) {
      console.warn('Prisma prediction write fallback to in-memory store:', e.message);
      inMemoryPredictions.unshift(savedRecord);
    }
  } else {
    inMemoryPredictions.unshift(savedRecord);
  }

  res.status(201).json(
    new ApiResponse(
      201,
      {
        predictionId: savedRecord.id,
        ...mlResult,
      },
      'Demand prediction generated successfully'
    )
  );
});

const getPredictions = asyncHandler(async (req, res) => {
  const userId = req.user?.id;

  if (prisma && prisma.prediction && userId) {
    try {
      const records = await prisma.prediction.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 20,
      });
      return res.status(200).json(new ApiResponse(200, records, 'Historical predictions retrieved'));
    } catch (e) {}
  }

  const userPredictions = inMemoryPredictions.filter((p) => !userId || p.userId === userId);
  res.status(200).json(new ApiResponse(200, userPredictions, 'Historical predictions retrieved'));
});

const getPredictionById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (prisma && prisma.prediction) {
    try {
      const record = await prisma.prediction.findUnique({ where: { id } });
      if (record) return res.status(200).json(new ApiResponse(200, record, 'Prediction retrieved'));
    } catch (e) {}
  }

  const found = inMemoryPredictions.find((p) => p.id === id);
  if (!found) {
    throw new ApiError(404, `Prediction with ID '${id}' not found`);
  }
  res.status(200).json(new ApiResponse(200, found, 'Prediction retrieved'));
});

module.exports = {
  createPrediction,
  getPredictions,
  getPredictionById,
};
