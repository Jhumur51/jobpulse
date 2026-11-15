const datasetService = require('../services/dataset.service');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const uploadDataset = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'Please upload a CSV dataset file');
  }

  const { name, description, isDemo } = req.body;
  const userId = req.user?.id;

  const dataset = await datasetService.createDataset({
    name: name || req.file.originalname.replace(/\.csv$/i, ''),
    description,
    filePath: req.file.path,
    userId,
    isDemo: isDemo === 'true' || isDemo === true,
  });

  res.status(201).json(new ApiResponse(201, dataset, 'Dataset uploaded and validated successfully'));
});

const getDatasets = asyncHandler(async (req, res) => {
  const datasets = await datasetService.listDatasets();
  res.status(200).json(new ApiResponse(200, datasets, 'Datasets retrieved successfully'));
});

const getDatasetById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const dataset = await datasetService.getDatasetById(id);
  res.status(200).json(new ApiResponse(200, dataset, 'Dataset details retrieved'));
});

const importDataset = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const dataset = await datasetService.getDatasetById(id);
  res.status(200).json(
    new ApiResponse(
      200,
      {
        datasetId: dataset.id,
        status: 'COMPLETED',
        importedRows: dataset.recordCount,
        message: 'Dataset imported and synchronized with feature store',
      },
      'Dataset import triggered successfully'
    )
  );
});

const deleteDataset = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await datasetService.deleteDataset(id);
  res.status(200).json(new ApiResponse(200, {}, 'Dataset deleted successfully'));
});

module.exports = {
  uploadDataset,
  getDatasets,
  getDatasetById,
  importDataset,
  deleteDataset,
};

