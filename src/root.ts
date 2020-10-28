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

const getByIdOpts: RouteShorthandOptions = {
  schema: {
    response: {
      200: {
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

const putOpts: RouteShorthandOptions = {
  schema: {
    body: {
      title: { type: "string" },
      description: { type: "string" },
    },
    response: {
      200: {
        type: "object",
        properties: {
          updated: {
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
        error: {
          type: "string",
        },
      },
    },
  },
};

const deleteOpts: RouteShorthandOptions = {
  schema: {
    response: {
      200: {
        type: "object",
        properties: {
          deleted: {
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
        error: {
          type: "string",
        },
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

app.get("/todo/:id", getByIdOpts, async (request, reply) => {
  const params = request.params as Record<string, string>;
  if (params.id == null)
    return await reply.code(400).send({ error: "id is necessary" });
  const id = Number(params.id);
  if (isNaN(id))
    return await reply.code(400).send({ error: "id should be integer" });

  const repository = app.orm.getRepository(ToDo);
  const todo = await repository.findOne(id);
  if (todo == null)
    await reply.code(404).send({ error: `id ${id} is not found` });

  await reply.code(200).send({ ...todo });
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
    return await reply.code(400).send({ error: parameters.error });

  const todo = new ToDo();
  todo.title = parameters.title;
  todo.description = parameters.description;

  const repository = app.orm.getRepository(ToDo);
  await repository.save([todo]);
  await reply.code(200).send({ created: { ...todo } });
});

app.put("/todo/:id", putOpts, async (request, reply) => {
  const params = request.params as Record<string, string>;
  if (params.id == null)
    return await reply.code(400).send({ error: "id is necessary" });

  const parseBody = (): Record<string, string> => {
    const body = request.body as Record<string, string>;
    if (body.title == null && body.description == null)
      return { error: "missing parameter" };
    return {
      title: body.title,
      description: body.description,
    };
  };
  const parameters = parseBody();
  if (parameters.error != null)
    return await reply.code(400).send({ error: parameters.error });

  const new_parameters: Record<string, string> = {};
  if (parameters.title != null) new_parameters.title = parameters.title;
  if (parameters.description != null)
    new_parameters.description = parameters.description;

  const repository = app.orm.getRepository(ToDo);
  const id = Number(params.id);
  if (isNaN(id))
    return await reply.code(400).send({ error: "id should be integer" });
  repository.update(id, new_parameters);

  const todo = await repository.findOne(id);
  console.log(todo);
  await reply.code(200).send({ updated: { ...todo } });
});

app.delete("/todo/:id", deleteOpts, async (request, reply) => {
  const params = request.params as Record<string, string>;
  if (params.id == null)
    return await reply.code(400).send({ error: "id is necessary" });
  const id = Number(params.id);
  if (isNaN(id))
    return await reply.code(400).send({ error: "id should be integer" });

  const repository = app.orm.getRepository(ToDo);
  const todo = await repository.findOne(id);
  if (todo == null)
    await reply.code(404).send({ error: `id ${id} is not found` });
  await repository.delete(id);

  await reply.code(200).send({ deleted: { ...todo } });
});
