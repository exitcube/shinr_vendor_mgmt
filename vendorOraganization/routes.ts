import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import controller from './handler';
import { validation } from '../utils/validation';
import { vendorOrgLoginValidate } from './validators';
import { vendorOrgAuthValidationPreHandler } from '../utils/authValidation';

export default async function vendorOrganizationRoutes(fastify: FastifyInstance, opts: FastifyPluginOptions) {
	const handler = controller(fastify, opts);
        fastify.post('/login', {preHandler: [validation(vendorOrgLoginValidate)]}, handler.loginVendorOrgHandler);
        fastify.post('/generate-refreshToken', {preHandler: [vendorOrgAuthValidationPreHandler]}, handler.refreshTokenHandler);
}