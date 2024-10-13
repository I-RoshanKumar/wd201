/* eslint-disable no-undef */
const express = require("express");
const app = express();
const csurf = require("csurf");
const { Todo, User } = require("./models"); // Ensure you import Todo correctly
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

app.put("/todos/:id", async (req, res) => {
  try {
    const todo = await Todo.findByPk(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    const updatedTodo = await todo.update({ completed: req.body.completed });
    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
app.post("/todos/:id/update", async (req, res) => {
  const todoId = req.params.id;
  const { completed } = req.body; // Get completed status from the request body

  try {
    const todo = await Todo.findByPk(todoId);
    if (!todo) {
      return res.status(404).send("Todo not found");
    }

    todo.completed = completed; // Set the completed status from the request
    await todo.save();
    return res.json({ message: "Todo updated successfully", todo });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Failed to update todo");
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

    // Toggle the completed status based on the current status
    const updatedTodo = await todo.update({ completed: req.body.completed });
    return res.json(updatedTodo);
  } catch (error) {
    console.error(error);
    return res.status(422).json(error);
  }
});

app.put("/todos/:id", async (request, response) => {
  console.log("Mark Todo as completed:", request.params.id);
  const todo = await Todo.findByPk(request.params.id);
  try {
    const updatedtodo = await todo.setCompletionStatus(request.body.completed);
    return response.json(updatedtodo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
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

app.get("/signup", (req, res) => {
  res.render("signup", { title: "Signup", csrfToken: req.csrfToken() });
});

app.post("/users", async (req, res) => {
  //have to create the user
  try {
    await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
    });
    res.redirect("/");
  } catch (error) {
    console.error(error);
    return res.status(422).json(error);
  }
});
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});
module.exports = app;
