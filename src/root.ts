import fastify, { FastifyInstance, RouteShorthandOptions } from "fastify";
import { Server, IncomingMessage, ServerResponse } from "http";
import { ToDo } from "./entity/ToDo";

export const app: FastifyInstance<
  Server,
  IncomingMessage,
  ServerResponse
> = fastify();

const opts: RouteShorthandOptions = {
  schema: {
    response: {
      200: {
        type: "object",
        properties: {
          pong: {
            type: "string",
          },
        },
      },
    },
  },
};

app.get("/", opts, async (request, reply) => {
  const todos = app.orm.getRepository(ToDo);
  const todo = todos.findOne(1);
  reply.code(200).send(todo);
});
