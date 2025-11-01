import Joi from 'joi';

export const validateRegisterInput = (data) => {
  const schema = Joi.object({
    username: Joi.string()
      .min(3)
      .max(30)
      .required()
      .messages({
        'string.min': 'Username must be at least 3 characters long',
        'string.max': 'Username cannot exceed 30 characters',
        'any.required': 'Username is required'
      }),
    
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Please enter a valid email address',
        'any.required': 'Email is required'
      }),
    
    password: Joi.string()
      .min(6)
      .required()
      .pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)
      .messages({
        'string.min': 'Password must be at least 6 characters long',
        'string.pattern.base': 'Password must contain at least one letter and one number',
        'any.required': 'Password is required'
      }),
    
    role: Joi.string()
      .valid('student', 'parent', 'tutor', 'admin')
      .required()
      .messages({
        'any.only': 'Invalid role selected',
        'any.required': 'Role is required'
      }),
    
    name: Joi.string()
      .required()
      .messages({
        'any.required': 'Name is required'
      })
  });

  return schema.validate(data);
};

export const validateLoginInput = (data) => {
  const schema = Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Please enter a valid email address',
        'any.required': 'Email is required'
      }),
    
    password: Joi.string()
      .required()
      .messages({
        'any.required': 'Password is required'
      })
  });

  return schema.validate(data);
};