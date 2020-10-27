import "reflect-metadata";
import { createConnection } from "typeorm";
import { ToDo } from "./entity/ToDo";
import { app } from "./root";

createConnection()
  .then(async (connection) => {
    console.log("Inserting a new user into the database...");
    const todo = new ToDo();
    todo.title = "TODO";
    todo.description = "My first todo";
    await connection.manager.save(todo);
    console.log("Saved a new todo with id: " + todo.id);

    console.log("Loading users from the database...");
    const todos = await connection.manager.find(ToDo);
    console.log("Loaded users: ", todos);

    console.log("Here you can setup and run express/koa/any other framework.");
  })
  .catch((error) => console.log(error));


app.listen(3030);
