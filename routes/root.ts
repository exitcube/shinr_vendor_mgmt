
import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import vendorRoutes from '../vendor/routes';
import vendorOrganizationRoutes from '../vendorOraganization/routes';

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

  fastify.register(vendorRoutes, { prefix: '/vendor' });
  fastify.register(vendorOrganizationRoutes, { prefix: '/vendorOrg' })
}
