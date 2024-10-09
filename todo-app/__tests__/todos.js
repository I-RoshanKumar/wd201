/* eslint-disable no-undef */
const request = require("supertest");
const db = require("../models/index");
const app = require("../app");
var cheerio = require("cheerio");
let server, agent;

function extractCsrfToken(res) {
  var $ = cheerio.load(res.text);
  return $("[name=_csrf]").val();
}
describe("Todo Application", function () {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(4000, () => {});
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
    const res = await agent.get("/");
    const csrfToken = extractCsrfToken(res);
    const response = await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });
    expect(response.statusCode).toBe(302);
  });

  test("Marks a todo with the given ID as complete", async () => {
    let res = await agent.get("/");
    let csrfToken = extractCsrfToken(res);
    // Create a new todo
    await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });

    // Fetch all todos
    const groupTodoResponse = await agent
      .get("/")
      .set("Accept", "application/json");
    const parsedGroupResponse = JSON.parse(groupTodoResponse.text);
    const dueTodayCount = parsedGroupResponse.dueToday.length;
    console.log(dueTodayCount); 
    const latestTodo = parsedGroupResponse.dueToday[dueTodayCount - 1];

    // Fetch the CSRF token again
    res = await agent.get("/");
    csrfToken = extractCsrfToken(res);

    // Mark the latest todo as complete
    const markCompleteResponse = await agent
      .put(`/todos/${latestTodo.id}/markAsCompleted`)
      .send({
        _csrf: csrfToken,
      });

    const parsedUpdateResponse = JSON.parse(markCompleteResponse.text);
    expect(parsedUpdateResponse.completed).toBe(true);
  });

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
});
