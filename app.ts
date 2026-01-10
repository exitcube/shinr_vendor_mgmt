import Fastify from "fastify";
import mult from "@fastify/multipart";
import typeormPlugin from "./plugins/typeorm";
import cors from "@fastify/cors"; // REMOVE ON PRODUCTION
import errorHandlerPlugin from "./plugins/errorHandler";
import routes from "./routes/root";
import vendorDevicePlugin from "./plugins/vendorDevice";



import Joi from 'joi';

export async function buildApp() {
  const fastify = Fastify({
    logger: true,
  });

  fastify.setValidatorCompiler(({ schema, method, url, httpPart }) => {
    return (data) => (schema as any).validate(data);
  });

  // Register plugins
  // registering cors -- REMOVE ON PRODUCTION
  await fastify.register(cors, {
    origin: true, // reflects request origin
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });
  await fastify.register(mult)
  await fastify.register(typeormPlugin);
  await fastify.register(errorHandlerPlugin);
  await fastify.register(vendorDevicePlugin);

  // Register routes
  await fastify.register(routes);


  return fastify;
}