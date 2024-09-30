/* eslint-disable no-undef */
const todoList = require("../todo");

describe("TodoList Test Suite", () => {
  let todos;

  beforeEach(() => {
    // Initialize a fresh instance of the todoList before each test
    todos = todoList();
  });

  // 1) Test for adding a new todo
  test("should add a new todo", () => {
    expect(todos.all.length).toBe(0); // Check that the list is initially empty

    todos.add({
      title: "Test todo",
      completed: false,
      dueDate: new Date().toISOString().slice(0, 10), // Set today's date
    });

    expect(todos.all.length).toBe(1); // The list should now contain one item
  });

  // 2) Test for marking a todo as completed
  test("should mark todo as completed", () => {
    todos.add({
      title: "Test todo",
      completed: false, // Initially, the todo is not completed
      dueDate: new Date().toISOString().slice(0, 10), // Set today's date
    });

    expect(todos.all[0].completed).toBe(false); // Verify that the item is not completed

    todos.markAsComplete(0); // Mark the first item as completed

    expect(todos.all[0].completed).toBe(true); // Verify that the item is now marked as completed
  });

  // 3) Test for retrieving overdue items
  test("should retrieve overdue items", () => {
    todos.add({
      title: "Overdue todo",
      completed: false,
      dueDate: new Date(Date.now() - 86400000).toISOString().slice(0, 10), // Set due date to yesterday
    });

    const overdueItems = todos.overdue(); // Retrieve overdue items

    expect(overdueItems.length).toBe(1); // There should be one overdue item
    expect(overdueItems[0].title).toBe("Overdue todo"); // The title should match
  });

  // 4) Test for retrieving dueToday items
  test("should retrieve dueToday items", () => {
    todos.add({
      title: "Today's todo",
      completed: false,
      dueDate: new Date().toISOString().slice(0, 10), // Set due date to today
    });

    const dueTodayItems = todos.dueToday(); // Retrieve due today items

    expect(dueTodayItems.length).toBe(1); // There should be one due today item
    expect(dueTodayItems[0].title).toBe("Today's todo"); // The title should match
  });

  // 5) Test for retrieving dueLater items
  test("should retrieve dueLater items", () => {
    todos.add({
      title: "Due later todo",
      completed: false,
      dueDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10), // Set due date to tomorrow
    });

    const dueLaterItems = todos.dueLater(); // Retrieve due later items

    expect(dueLaterItems.length).toBe(1); // There should be one due later item
    expect(dueLaterItems[0].title).toBe("Due later todo"); // The title should match
  });
});
