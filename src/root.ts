import fastify, { FastifyInstance, RouteShorthandOptions } from "fastify";
import { Server, IncomingMessage, ServerResponse } from "http";
import { ToDo } from "./entity/ToDo";
import "fastify-typeorm-plugin";

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
            type: "array",
            items: {
              type: "object",
              properties: {
                id: {
                  type: "number",
                },
                title: {
                  type: "string",
                },
                description: {
                  type: "string",
                },
              },
            },
          },
        },
      },
    },
  },
};

app.get("/todo", opts, async (request, reply) => {
  const todos = await app.orm.getRepository(ToDo).find();
  console.log(JSON.stringify(todos));
  await reply.code(200).send({
    pong: todos,
  });
});
