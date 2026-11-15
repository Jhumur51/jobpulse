const express = require('express');
const router = express.Router();
const skillsController = require('../controllers/skills.controller');

router.get('/', skillsController.getSkills);
router.get('/top', skillsController.getTopSkills);
router.get('/trends', skillsController.getSkillTrends);
router.get('/:id', skillsController.getSkillById);

module.exports = router;

