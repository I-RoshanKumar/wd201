/* eslint-disable no-undef */
const express = require("express");
const app = express();
const csurf = require("csurf");
const { Todo } = require("./models"); // Ensure you import Todo correctly
const path = require("path");
const cookieParser = require("cookie-parser");
app.use(express.urlencoded({ extended: false }));
// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser("sh! some secret parsers"));
app.use(csurf({ cookie: true }));

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", async (req, res) => {
  try {
    const todos = await Todo.findAll(); // Fetch all todos
    const today = new Date().toISOString().split("T")[0];

    const Over_due = todos.filter((todo) => todo.dueDate < today); // Overdue
    const Today_list = todos.filter((todo) => todo.dueDate === today); // Due Today
    const Later_list = todos.filter((todo) => todo.dueDate > today); // Due Later
    const Completed_list = todos.filter((todo) => todo.completed);

    if (req.accepts("html")) {
      res.render("index", {
        Today_list,
        Later_list,
        Over_due,
        Completed_list,
        csrfToken: req.csrfToken(),
      });
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
    const updatedTodo = await todo.markAsCompleted(); // Calls the updated method
    return res.json(updatedTodo); // Returns the updated todo
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
    await Todo.remove(req.params.id);
    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(422).json(error);
  }
});

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

module.exports = app;
