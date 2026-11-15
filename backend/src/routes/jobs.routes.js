const express = require('express');
const router = express.Router();
const jobsController = require('../controllers/jobs.controller');

router.get('/', jobsController.getJobs);
router.get('/trends', jobsController.getJobTrends);
router.get('/roles', jobsController.getJobRoles);
router.get('/filters', jobsController.getJobFilters);
router.get('/:id', jobsController.getJobById);

module.exports = router;

