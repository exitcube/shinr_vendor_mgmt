
import Joi from 'joi';

export const registerVendorValidator = {
    body: Joi.object({
        businessName: Joi.string().required(),
        ownerName: Joi.string().required(),
        phone: Joi.string().required(),
        email: Joi.string().email().optional(),
        password: Joi.string().min(6).required(),
        location: Joi.object({
            address: Joi.string().required(),
            lat: Joi.number().required(),
            lng: Joi.number().required()
        }).optional(),
        serviceType: Joi.array().items(Joi.string()).optional()
    })
};

export const loginVendorValidator = {
    body: Joi.object({
        identifier: Joi.string().required(), // phone or email
        password: Joi.string().required()
    })
};
