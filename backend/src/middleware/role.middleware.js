const ApiError = require('../utils/ApiError');

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new ApiError(403, `Access denied: Role '${req.user?.role || 'ANONYMOUS'}' is not authorized`)
      );
    }
    next();
  };
};

module.exports = { authorizeRoles };

