const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { verifyJWT } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');
const { updateProfileSchema, updatePasswordSchema } = require('../validators/auth.validator');

router.use(verifyJWT);

router.get('/profile', userController.getProfile);
router.put('/profile', validate(updateProfileSchema), userController.updateProfile);
router.put('/password', validate(updatePasswordSchema), userController.updatePassword);

module.exports = router;

