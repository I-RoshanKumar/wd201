/* eslint-disable no-undef */
const todoList = require("../todo");

describe("TodoList Test Suite", () => {
  let todos;

  beforeEach(() => {
    // Initialize a fresh instance of the todoList before each test
    todos = todoList();
  });

  test("should add new todo", () => {
    expect(todos.all.length).toBe(0); // Check that the list is initially empty

    todos.add({
      title: "Test todo",
      completed: false, // Corrected to use 'completed'
      dueDate: new Date().toISOString().slice(0, 10), // Set today's date
    });

    expect(todos.all.length).toBe(1); // The list should now contain one item
  });

  test("should mark todo as completed", () => {
    todos.add({
      title: "Test todo",
      completed: false, // Initially the todo is not completed
      dueDate: new Date().toISOString().slice(0, 10), // Set today's date
    });

    expect(todos.all[0].completed).toBe(false); // Verify that the item is not completed

    todos.markAsComplete(0); // Mark the first item as completed

    expect(todos.all[0].completed).toBe(true); // Verify that the item is now marked as completed
  });
});
