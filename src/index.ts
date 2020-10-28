import "reflect-metadata";
import { app } from "./route";
import { createConnection } from "typeorm";
import * as plugin from "fastify-typeorm-plugin";
import { ToDo } from "./entity/ToDo";

const main = async () => {
  const connection = await createConnection();
  const startFetch = async () => {
    console.log("Loading users from the database...");
    const todos = await connection.manager.find(ToDo);
    console.log("Loaded users: ", todos);

    console.log("Here you can setup and run express/koa/any other framework.");
  };
  await startFetch();
  app.register(plugin, {
    connection,
  });
  app.listen(3030);
};

main();
