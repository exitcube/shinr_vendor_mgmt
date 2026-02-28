import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import controller from './handler';
import { validation } from '../utils/validation';
import { refreshTokenValidate, vendorLoginValidate } from './validators';

export default async function vendorRoutes(fastify: FastifyInstance, opts: FastifyPluginOptions) {
	const handler = controller(fastify, opts);
        fastify.post('/login', {preHandler: [validation(vendorLoginValidate)]}, handler.loginVendorHandler);
        fastify.post('/generate-refreshToken', {preHandler: [validation(refreshTokenValidate)]}, handler.refreshTokenHandler);
}