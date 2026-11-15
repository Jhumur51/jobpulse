const express = require('express');
const router = express.Router();
const predictionController = require('../controllers/prediction.controller');
const { validate } = require('../middleware/validation.middleware');
const { createPredictionSchema } = require('../validators/prediction.validator');
const { verifyJWT } = require('../middleware/auth.middleware');

// Public or optionally authenticated prediction creation
router.post(
  '/',
  (req, res, next) => {
    // Optional auth: try to verify token if provided, but don't strictly require for public exploration
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (token) {
      return verifyJWT(req, res, next);
    }
    next();
  },
  validate(createPredictionSchema),
  predictionController.createPrediction
);

router.get('/', verifyJWT, predictionController.getPredictions);
router.get('/:id', predictionController.getPredictionById);

module.exports = router;

