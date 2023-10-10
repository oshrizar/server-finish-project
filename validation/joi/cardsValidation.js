const Joi = require("joi");

const createCardSchema = Joi.object({
  title: Joi.string().min(2).max(256).required(),
  description: Joi.string().min(2).max(1024).required(),
  stock: Joi.number().min(0).required(),
  price: Joi.number().min(0).required(),
  user_id: Joi.string().min(0).allow(""),
  image: Joi.object()
    .keys({
      imageFile: Joi.any(),
      alt: Joi.string().min(2).max(256).required(),
    })
    .allow(null),
}).options({ abortEarly: false });

const validateCardSchema = (userInput) => {
  return createCardSchema.validateAsync(userInput);
};

module.exports = {
  validateCardSchema,
};
