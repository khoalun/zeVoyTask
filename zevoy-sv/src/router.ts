import { FastifyInstance } from "fastify";
import {
  budgetController,
  indexController,
  userController,
} from "./controllers";

export default async function router(fastify: FastifyInstance) {
  fastify.register(indexController, { prefix: "/" });
  fastify.register(userController, { prefix: "/users" });
  fastify.register(budgetController, { prefix: "/budgets" });
}
