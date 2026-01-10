
import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import controller from './handler';


import { authValidationPreHandler } from '../utils/authValidation';

export default async function productRoutes(fastify: FastifyInstance, opts: FastifyPluginOptions) {
    fastify.addHook('preHandler', authValidationPreHandler);
    const { listProductsHandler } = controller(fastify, opts);
    fastify.get('/', listProductsHandler);
}
