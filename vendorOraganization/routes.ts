import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import controller from './handler';
import { validation } from '../utils/validation';
import { refreshTokenValidate, vendorOrgLoginValidate } from './validators';

export default async function vendorOrganizationRoutes(fastify: FastifyInstance, opts: FastifyPluginOptions) {
	const handler = controller(fastify, opts);
        fastify.post('/login', {preHandler: [validation(vendorOrgLoginValidate)]}, handler.loginVendorOrgHandler);
        fastify.post('/generate-refreshToken', {preHandler: [validation(refreshTokenValidate)]}, handler.refreshTokenHandler);
}