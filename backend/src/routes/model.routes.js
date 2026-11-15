const express = require('express');
const router = express.Router();
const modelController = require('../controllers/model.controller');

router.get('/', modelController.getModels);
router.get('/performance', modelController.getPerformance);
router.get('/best', modelController.getBestModel);

module.exports = router;

