const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');

router.get('/summary', dashboardController.getSummary);
router.get('/job-volume', dashboardController.getJobVolume);
router.get('/top-roles', dashboardController.getTopRoles);
router.get('/top-skills', dashboardController.getTopSkills);
router.get('/industry-distribution', dashboardController.getIndustryDistribution);
router.get('/location-distribution', dashboardController.getLocationDistribution);
router.get('/experience-distribution', dashboardController.getExperienceDistribution);
router.get('/education-distribution', dashboardController.getEducationDistribution);

module.exports = router;

