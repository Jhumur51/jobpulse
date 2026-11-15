const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const env = require('../config/env');
const prisma = require('../config/database');

const verifyJWT = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new ApiError(401, 'Unauthorized access: No token provided');
    }

    const decodedToken = jwt.verify(token, env.jwt.secret);

    let user = null;
    if (prisma && prisma.$isAvailable) {
      try {
        user = await prisma.user.findUnique({
          where: { id: decodedToken.id },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
          },
        });
      } catch (dbErr) {
        // Fallback for offline DB
      }
    }

    if (!user) {
      // Allow decoded payload if user exists in token
      user = {
        id: decodedToken.id,
        name: decodedToken.name || 'User',
        email: decodedToken.email,
        role: decodedToken.role || 'USER',
      };
    }

    req.user = user;
    next();
  } catch (error) {
    next(new ApiError(401, error?.message || 'Invalid or expired access token'));
  }
};

module.exports = { verifyJWT };
