
import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import vendorRoutes from '../vendor/routes';
import serviceRoutes from '../service/routes';
import productRoutes from '../product/routes';
import bookingRoutes from '../booking/routes';

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
  fastify.register(serviceRoutes, { prefix: '/service' });
  fastify.register(productRoutes, { prefix: '/product' });
  fastify.register(bookingRoutes, { prefix: '/booking' });
}
