const ApiError = require('../utils/ApiError');

const validate = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    req.body = parsed.body || req.body;
    req.query = parsed.query || req.query;
    req.params = parsed.params || req.params;
    next();
  } catch (err) {
    const errors = err.errors?.map((e) => ({
      field: e.path.join('.').replace(/^body\.|^query\.|^params\./, ''),
      message: e.message,
    })) || [{ message: err.message }];
    next(new ApiError(400, 'Validation Failed', errors));
  }
};

module.exports = { validate };

