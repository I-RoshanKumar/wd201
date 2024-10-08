/* eslint-disable no-undef */
const express = require("express");
const app = express();
const { Todo } = require("./models"); // Ensure you import Todo correctly
const path = require("path");
app.use(express.urlencoded({ extended: false }));
// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", async (req, res) => {
  try {
    const todos = await Todo.findAll(); // Fetch all todos
    const today = new Date().toISOString().split("T")[0];

    const Over_due = todos.filter(
      (todo) => !todo.completed && todo.dueDate < today,
    ); // Overdue
    const Today_list = todos.filter(
      (todo) => !todo.completed && todo.dueDate === today,
    ); // Due Today
    const Later_list = todos.filter(
      (todo) => !todo.completed && todo.dueDate > today,
    ); // Due Later
    const Completed_list = todos.filter((todo) => todo.completed);

    if (req.accepts("html")) {
      res.render("index", { Today_list, Later_list, Over_due, Completed_list });
    } else {
      res.json({ Today_list, Later_list, Over_due, Completed_list });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching todos" });
  }
});

app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.findAll();
    return res.json(todos);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching todos" });
  }
});

app.get("/todos/:id", async (req, res) => {
  try {
    const todo = await Todo.findByPk(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    return res.json(todo);
  } catch (error) {
    console.error(error);
    return res.status(422).json(error);
  }
});
app.post("/todos", async (req, res) => {
  console.log("Creating new Todos", req.body);
  try {
    // Using req.body.title and req.body.dueDate directly
    await Todo.addTodo({
      title: req.body.title,
      dueDate: req.body.dueDate,
    });
    return res.redirect("/");
  } catch (error) {
    console.error(error);
    return res.status(422).json(error);
  }
});

app.put("/todos/:id/markAsCompleted", async (req, res) => {
  try {
    const todo = await Todo.findByPk(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    const updatedTodo = await todo.markAsCompleted();
    return res.json(updatedTodo);
  } catch (error) {
    console.error(error);
    return res.status(422).json(error);
  }
});

app.put("/todos/:id", async (req, res) => {
  try {
    const todo = await Todo.findByPk(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    const updatedTodo = await todo.update({ completed: req.body.completed });
    return res.json(updatedTodo);
  } catch (error) {
    console.error(error);
    return res.status(422).json(error);
  }
});

app.put("/todos/:id/setCompletionStatus", async (req, res) => {
  try {
    const todo = await Todo.findByPk(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    const updatedTodo = await todo.setCompletionStatus(!todo.completed);
    return res.json(updatedTodo);
  } catch (error) {
    console.error(error);
    return res.status(422).json(error);
  }
});

app.delete("/todos/:id", async (req, res) => {
  try {
    const result = await Todo.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (result) {
      res.send(true);
    } else {
      res.send(false);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
});

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

module.exports = app;
