const Joi = require("joi");
const HELPER = require("../helpersForValidations");

const loginSchema = Joi.object({
  email: Joi.string()
    .pattern(HELPER.REGEXES.EMAIL)
    .messages({
      "string.pattern.base": HELPER.MESSEGES.EMAIL,
    })
    .min(6)
    .max(256)
    .required(),
  password: Joi.string()
    .pattern(HELPER.REGEXES.PASSWORD)
    .messages({
      "string.pattern.base": HELPER.MESSEGES.PASSWORD,
    })
    .required(),
});

const validateLoginSchema = (userInput) => loginSchema.validateAsync(userInput);

module.exports = {
  validateLoginSchema,
};
