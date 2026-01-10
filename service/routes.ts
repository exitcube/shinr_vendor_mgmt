
import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import controller from './handler';


import { authValidationPreHandler } from '../utils/authValidation';

export default async function serviceRoutes(fastify: FastifyInstance, opts: FastifyPluginOptions) {
    fastify.addHook('preHandler', authValidationPreHandler);
    const { listServicesHandler } = controller(fastify, opts);
    fastify.get('/', listServicesHandler);
}
