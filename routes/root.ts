
import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import vendorOrgRoutes from '../vendorOrganization/routes';

export default async function routes(
  fastify: FastifyInstance,
  opts: FastifyPluginOptions
) {
  fastify.get('/', async () => {
    return {
      message: 'Welcome to Shinr Vendor Management API',
      environment: process.env.NODE_ENV || 'development',
    };
  });

  fastify.register(vendorOrgRoutes, { prefix: '/vendorOrg' });
}
