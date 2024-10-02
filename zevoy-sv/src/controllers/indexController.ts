import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

export async function indexController(fastify: FastifyInstance) {
  fastify.get(
    "/",
    async function (_request: FastifyRequest, reply: FastifyReply) {
      return reply.send({ message: "alive" });
    },
  );
}
