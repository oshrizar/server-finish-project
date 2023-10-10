const Joi = require("joi");
const HELPER = require("../helpersForValidations");

const registerSchema = Joi.object({
  name: Joi.object()
    .keys({
      first: Joi.string().min(2).max(256).required(),
      last: Joi.string().min(2).max(256).required(),
    })
    .required(),
  email: Joi.string()
    .pattern(HELPER.REGEXES.EMAIL)
    .messages({
      "string.pattern.base": HELPER.MESSEGES.EMAIL,
    })
    .min(6)
    .max(256)
    .required(),
  gender: Joi.string().allow("male").allow("female").allow("other"),
  password: Joi.string()
    .pattern(HELPER.REGEXES.PASSWORD)
    .messages({
      "string.pattern.base": HELPER.MESSEGES.PASSWORD,
    })
    .required(),
  image: Joi.object()
    .keys({
      imageFile: Joi.any(),
      alt: Joi.string().min(2).max(256).required(),
    })
    .allow(null),
});

const validateRegisterSchema = (userInput) =>
  registerSchema.validateAsync(userInput);

module.exports = {
  validateRegisterSchema,
};
