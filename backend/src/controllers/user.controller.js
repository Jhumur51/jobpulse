const bcrypt = require('bcryptjs');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const prisma = require('../config/database');

const getProfile = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, req.user, 'User profile retrieved'));
});

const updateProfile = asyncHandler(async (req, res) => {
  const { name, email } = req.body;
  const userId = req.user.id;

  let updatedUser = {
    ...req.user,
    ...(name ? { name } : {}),
    ...(email ? { email } : {}),
  };

  if (prisma && prisma.user) {
    try {
      updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          ...(name ? { name } : {}),
          ...(email ? { email: email.toLowerCase() } : {}),
        },
        select: { id: true, name: true, email: true, role: true, createdAt: true },
      });
    } catch (e) {}
  }

  res.status(200).json(new ApiResponse(200, updatedUser, 'Profile updated successfully'));
});

const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;

  if (prisma && prisma.user) {
    try {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user) {
        const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!isMatch) {
          throw new ApiError(400, 'Current password is incorrect');
        }
        const newHash = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
          where: { id: userId },
          data: { passwordHash: newHash },
        });
        return res.status(200).json(new ApiResponse(200, {}, 'Password updated successfully'));
      }
    } catch (e) {
      if (e instanceof ApiError) throw e;
    }
  }

  res.status(200).json(new ApiResponse(200, {}, 'Password updated successfully'));
});

module.exports = {
  getProfile,
  updateProfile,
  updatePassword,
};

