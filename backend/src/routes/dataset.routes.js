const express = require('express');
const router = express.Router();
const datasetController = require('../controllers/dataset.controller');
const { verifyJWT } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/role.middleware');
const upload = require('../middleware/upload.middleware');

router.get('/', datasetController.getDatasets);
router.get('/:id', datasetController.getDatasetById);

// Admin-only endpoints
router.post(
  '/upload',
  verifyJWT,
  authorizeRoles('ADMIN'),
  upload.single('file'),
  datasetController.uploadDataset
);

router.post(
  '/:id/import',
  verifyJWT,
  authorizeRoles('ADMIN'),
  datasetController.importDataset
);

router.delete(
  '/:id',
  verifyJWT,
  authorizeRoles('ADMIN'),
  datasetController.deleteDataset
);

module.exports = router;

