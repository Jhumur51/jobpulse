const { z } = require('zod');

const createPredictionSchema = z.object({
  body: z.object({
    jobRole: z.string().min(1, 'Job role is required'),
    location: z.string().optional().default('All'),
    industry: z.string().optional().default('Technology'),
    horizon: z.number().int().refine((val) => [3, 6, 12, 24].includes(val), {
      message: 'Horizon must be 3, 6, 12, or 24 months',
    }),
    modelName: z.string().optional().default('Random Forest Regressor'),
  }),
});

module.exports = {
  createPredictionSchema,
};

