import fastify, { FastifyInstance, RouteShorthandOptions } from "fastify";
import { Server, IncomingMessage, ServerResponse } from "http";
import { ToDo } from "./entity/ToDo";
import "fastify-typeorm-plugin";

export const app: FastifyInstance<
  Server,
  IncomingMessage,
  ServerResponse
> = fastify();

const getOpts: RouteShorthandOptions = {
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

const postOpts: RouteShorthandOptions = {
  schema: {
    body: {
      title: { type: "string" },
      description: { type: "string" },
    },
    response: {
      200: {
        type: "object",
        properties: {
          created: {
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
      400: {
        type: "string",
      },
    },
  },
};

app.get("/todo", getOpts, async (request, reply) => {
  const todos = await app.orm.getRepository(ToDo).find();
  console.log(JSON.stringify(todos));
  await reply.code(200).send({
    pong: todos,
  });
});

app.post("/todo", postOpts, async (request, reply) => {
  const parseBody = (): Record<string, string> => {
    const body = request.body as Record<string, string>;
    if (body.title == null || body.description == null)
      return { error: "missing parameter" };
    return {
      title: body.title,
      description: body.description,
    };
  };
  const parameters = parseBody();
  if (parameters.error != null)
    return await reply.code(400).send(parameters.error);

  const todo = new ToDo();
  todo.title = parameters.title;
  todo.description = parameters.description;

  const repository = app.orm.getRepository(ToDo);
  await repository.save([todo]);
  await reply.code(200).send({ created: { ...todo } });
});
