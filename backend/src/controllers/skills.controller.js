const mlService = require('../services/ml.service');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const getSkills = asyncHandler(async (req, res) => {
  const { category, trend, search } = req.query;
  const result = await mlService.getSkillTrends({ category, trend, search });
  res.status(200).json(new ApiResponse(200, result.data || [], 'Skills retrieved successfully'));
});

const getTopSkills = asyncHandler(async (req, res) => {
  const result = await mlService.getSkillTrends();
  const top = (result.data || []).slice(0, 10);
  res.status(200).json(new ApiResponse(200, top, 'Top skills retrieved'));
});

const getSkillTrends = asyncHandler(async (req, res) => {
  const result = await mlService.getSkillTrends();
  res.status(200).json(new ApiResponse(200, result.data || [], 'Skill intelligence and trends retrieved'));
});

const getSkillById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await mlService.getSkillTrends();
  const skill = (result.data || []).find((s) => s.name.toLowerCase() === id.toLowerCase() || s.name === id);

  if (!skill) {
    return res.status(404).json(new ApiResponse(404, null, `Skill '${id}' not found`));
  }
  res.status(200).json(new ApiResponse(200, skill, 'Skill details retrieved'));
});

module.exports = {
  getSkills,
  getTopSkills,
  getSkillTrends,
  getSkillById,
};

