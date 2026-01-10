
import { FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply } from 'fastify';

export default function controller(fastify: FastifyInstance, opts: FastifyPluginOptions): any {
    return {
        listBookingsHandler: async (request: FastifyRequest, reply: FastifyReply) => {
            return reply.code(200).send({ message: "Booking listing not implemented yet" });
        }
    };
}
