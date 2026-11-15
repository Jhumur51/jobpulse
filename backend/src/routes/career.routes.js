const express = require('express');
const router = express.Router();
const careerController = require('../controllers/career.controller');

// 1. Skill Gap Analysis
router.post('/skill-gap', careerController.analyzeSkillGap);

// 2. Salary Estimation
router.post('/salary-estimate', careerController.estimateSalary);

// 3. Career Roadmap for a specific role
router.get('/roadmap/:role', careerController.getCareerRoadmap);

// 4. Role Comparison
router.get('/compare', careerController.compareRoles);

module.exports = router;

