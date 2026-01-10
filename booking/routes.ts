
import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import controller from './handler';


import { authValidationPreHandler } from '../utils/authValidation';

export default async function bookingRoutes(fastify: FastifyInstance, opts: FastifyPluginOptions) {
    fastify.addHook('preHandler', authValidationPreHandler);
    const { listBookingsHandler } = controller(fastify, opts);
    fastify.get('/', listBookingsHandler);
}
