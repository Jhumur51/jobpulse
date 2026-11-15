const analyticsService = require('../services/analytics.service');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const getSummary = asyncHandler(async (req, res) => {
  const summary = await analyticsService.getSummaryKPIs();
  res.status(200).json(new ApiResponse(200, summary, 'Dashboard summary retrieved'));
});

const getJobVolume = asyncHandler(async (req, res) => {
  const data = await analyticsService.getJobVolumeOverTime();
  res.status(200).json(new ApiResponse(200, data, 'Job posting volume over time retrieved'));
});

const getTopRoles = asyncHandler(async (req, res) => {
  const data = await analyticsService.getTopRoles();
  res.status(200).json(new ApiResponse(200, data, 'Top job roles retrieved'));
});

const getTopSkills = asyncHandler(async (req, res) => {
  const data = await analyticsService.getTopSkills();
  res.status(200).json(new ApiResponse(200, data, 'Top in-demand skills retrieved'));
});

const getIndustryDistribution = asyncHandler(async (req, res) => {
  const data = await analyticsService.getIndustryDistribution();
  res.status(200).json(new ApiResponse(200, data, 'Industry distribution retrieved'));
});

const getLocationDistribution = asyncHandler(async (req, res) => {
  const data = await analyticsService.getLocationDistribution();
  res.status(200).json(new ApiResponse(200, data, 'Location-based distribution retrieved'));
});

const getExperienceDistribution = asyncHandler(async (req, res) => {
  const data = await analyticsService.getExperienceDistribution();
  res.status(200).json(new ApiResponse(200, data, 'Experience distribution retrieved'));
});

const getEducationDistribution = asyncHandler(async (req, res) => {
  const data = await analyticsService.getEducationDistribution();
  res.status(200).json(new ApiResponse(200, data, 'Education distribution retrieved'));
});

module.exports = {
  getSummary,
  getJobVolume,
  getTopRoles,
  getTopSkills,
  getIndustryDistribution,
  getLocationDistribution,
  getExperienceDistribution,
  getEducationDistribution,
};

