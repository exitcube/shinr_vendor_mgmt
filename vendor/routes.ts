
import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import controller from './handler';
import { registerVendorValidator, loginVendorValidator } from './validators';

export default async function vendorRoutes(fastify: FastifyInstance, opts: FastifyPluginOptions) {
    const { registerVendorHandler, loginVendorHandler } = controller(fastify, opts);

    fastify.post('/register', { schema: registerVendorValidator }, registerVendorHandler);
    fastify.post('/login', { schema: loginVendorValidator }, loginVendorHandler);
}
