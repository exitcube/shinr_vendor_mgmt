import Joi from "joi";


export const vendorLoginValidate = {
  body: Joi.object({
    vendorCode: Joi.string()
      .required()
      .messages({
        "string.empty": "vendorCode is required",
        "any.required": "vendorCode is required",
      }),

    password: Joi.string()
      .required()
      .messages({
        "string.empty": "Password is required",
        "any.required": "Password is required",
      }),
  }),
};
export const refreshTokenValidate = {
    body: Joi.object({
        refreshToken: Joi.string()
            .required()
            .messages({
                'string.empty': 'Refresh token is required',
            }),
    }),
    query: Joi.object({}),
};
