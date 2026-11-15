const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/database');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

// In-memory demo users when database is in transition
const inMemoryUsers = [
  {
    id: 'admin-user-01',
    name: 'Administrator',
    email: 'admin@jobpulse.ai',
    passwordHash: bcrypt.hashSync('admin123', 10),
    role: 'ADMIN',
    createdAt: new Date(),
  },
  {
    id: 'demo-user-02',
    name: 'Research Analyst',
    email: 'user@jobpulse.ai',
    passwordHash: bcrypt.hashSync('user123', 10),
    role: 'USER',
    createdAt: new Date(),
  },
];

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    env.jwt.secret,
    { expiresIn: env.jwt.expiresIn }
  );
  const refreshToken = jwt.sign(
    { id: user.id },
    env.jwt.refreshSecret,
    { expiresIn: env.jwt.refreshExpiresIn }
  );
  return { accessToken, refreshToken };
};

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  let existingUser = null;
  if (prisma && prisma.$isAvailable) {
    try {
      existingUser = await prisma.user.findUnique({ where: { email } });
    } catch (e) {}
  }
  if (!existingUser) {
    existingUser = inMemoryUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  if (existingUser) {
    throw new ApiError(409, 'User with this email already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  let newUser = {
    id: 'user-' + Date.now(),
    name,
    email: email.toLowerCase(),
    passwordHash,
    role: 'USER',
    createdAt: new Date(),
  };

  if (prisma && prisma.$isAvailable) {
    try {
      newUser = await prisma.user.create({
        data: {
          name,
          email: email.toLowerCase(),
          passwordHash,
          role: 'USER',
        },
      });
    } catch (e) {}
  } else {
    inMemoryUsers.push(newUser);
  }

  const { accessToken, refreshToken } = generateTokens(newUser);

  res.status(201).json(
    new ApiResponse(
      201,
      {
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
        accessToken,
        refreshToken,
      },
      'User registered successfully'
    )
  );
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  let user = null;
  if (prisma && prisma.$isAvailable) {
    try {
      user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    } catch (e) {}
  }
  if (!user) {
    user = inMemoryUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  if (!user) {
    throw new ApiError(401, 'Invalid email or password credentials');
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid email or password credentials');
  }

  const { accessToken, refreshToken } = generateTokens(user);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        accessToken,
        refreshToken,
      },
      'Login successful'
    )
  );
});

const logout = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, {}, 'Logout successful'));
});

const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    throw new ApiError(400, 'Refresh token is required');
  }

  try {
    const decoded = jwt.verify(refreshToken, env.jwt.refreshSecret);
    let user = null;
    if (prisma && prisma.user) {
      try {
        user = await prisma.user.findUnique({ where: { id: decoded.id } });
      } catch (e) {}
    }
    if (!user) {
      user = inMemoryUsers.find((u) => u.id === decoded.id);
    }

    if (!user) {
      throw new ApiError(401, 'Invalid refresh token: User not found');
    }

    const tokens = generateTokens(user);
    res.status(200).json(new ApiResponse(200, tokens, 'Token refreshed successfully'));
  } catch (err) {
    throw new ApiError(401, 'Invalid or expired refresh token');
  }
});

const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, { user: req.user }, 'Current user retrieved'));
});

module.exports = {
  register,
  login,
  logout,
  refresh,
  getMe,
};
