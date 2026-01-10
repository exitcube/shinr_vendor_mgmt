
import { FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply } from 'fastify';

export default function controller(fastify: FastifyInstance, opts: FastifyPluginOptions): any {
    return {
        listServicesHandler: async (request: FastifyRequest, reply: FastifyReply) => {
            return reply.code(200).send({ message: "Service listing not implemented yet" });
        }
    };
}
