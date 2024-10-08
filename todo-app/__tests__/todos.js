/* eslint-disable no-undef */
const request = require("supertest");
const db = require("../models/index");
const app = require("../app");

let server, agent;

describe("Todo Application", function () {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(3000, () => {});
    agent = request.agent(server);
  });

  afterAll(async () => {
    try {
      await db.sequelize.close();
      await server.close();
    } catch (error) {
      console.log(error);
    }
  });

  test("Creates a new todo ", async () => {
    const response = await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
    });
    expect(response.statusCode).toBe(302);
  });

  // test("Marks a todo with the given ID as complete", async () => {
  //   const response = await agent.post("/todos").send({
  //     title: "Buy milk",
  //     dueDate: new Date().toISOString(),
  //     completed: false,
  //   });
  //   const parsedResponse = JSON.parse(response.text);
  //   const todoID = parsedResponse.id;

  //   expect(parsedResponse.completed).toBe(false);

  //   const markCompleteResponse = await agent
  //     .put(`/todos/${todoID}/markASCompleted`)
  //     .send();
  //   const parsedUpdateResponse = JSON.parse(markCompleteResponse.text);
  //   expect(parsedUpdateResponse.completed).toBe(true);
  // });

  //

  // test("Deletes a todo with the given ID if it exists and sends a boolean response", async () => {
  //   // FILL IN YOUR CODE HERE
  //   const response=await agent.post("/todos").send({
  //     title:"Test Todo",
  //     dueDate:new Date().toISOString(),
  //     completed:false
  //   });
  //   const todo=JSON.parse(response.text);
  //   const todoid=todo.id;
  //   const deleteResponse=await agent.delete(`/todos/${todoid}`).send();
  //   const deletedResult=JSON.parse(deleteResponse.text);

  //   expect(deletedResult).toBe(true);
  //   const getResponse= await agent.get(`/todos/${todoid}`).send();
  //   expect(getResponse.statusCode).toBe(200);

  // });
});
