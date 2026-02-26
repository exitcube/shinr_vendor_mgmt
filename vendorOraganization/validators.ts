import Joi from "joi";


export const vendorOrgLoginValidate = {
  body: Joi.object({
    organizationId: Joi.string()
      .required()
      .messages({
        "string.empty": "organizationId is required",
        "any.required": "organizationId is required",
      }),

    password: Joi.string()
      .required()
      .messages({
        "string.empty": "Password is required",
        "any.required": "Password is required",
      }),
  }),
};