import { RouteShorthandOptions } from "fastify";

export const getOpts: RouteShorthandOptions = {
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

export const getByIdOpts: RouteShorthandOptions = {
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

export const postOpts: RouteShorthandOptions = {
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

export const putOpts: RouteShorthandOptions = {
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

export const deleteOpts: RouteShorthandOptions = {
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
