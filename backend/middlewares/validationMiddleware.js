import Joi from 'joi';

const schemas = {
  signup: Joi.object({
    name: Joi.string().min(2).max(50).required().messages({
      'string.empty': 'Name cannot be empty',
      'string.min': 'Name must be at least 2 characters',
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address',
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Password must be at least 6 characters long',
    }),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  pdf: Joi.object({
    language: Joi.string().valid('English', 'Hindi', 'Telugu', 'Spanish', 'French').default('English'),
  }),
};

export const validate = (schemaName) => {
  return (req, res, next) => {
    const schema = schemas[schemaName];

    if (!schema) {
      return res.status(500).json({ message: 'Internal Server Error: Validation Schema Not Found' });
    }

    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      // Clean up error messages (remove quotes around field names)
      const errorMessages = error.details.map((detail) => detail.message.replace(/['"]/g, ''));
      return res.status(400).json({ message: errorMessages.join(', ') });
    }

    next();
  };
};