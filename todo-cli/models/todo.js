// models/todo.js
"use strict";
const { Model, Op } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static async addTask(params) {
      return await Todo.create(params);
    }
    static async showList() {
      console.log("My Todo list \n");

      console.log("Overdue");
      // FILL IN HERE
      const overdueTasks = await Todo.overdue();
      overdueTasks.forEach((task) => console.log(task.displayableString()));

      console.log("\n");

      console.log("Due Today");
      // FILL IN HERE
      const dueTodayTasks = await Todo.dueToday();
      dueTodayTasks.forEach((task) => console.log(task.displayableString()));
      console.log("\n");

      console.log("Due Later");
      // FILL IN HERE
      const dueLaterTasks = await Todo.dueLater();
      dueLaterTasks.forEach((task) => console.log(task.displayableString()));
    }

    static async overdue() {
      const today = new Date().toISOString().split("T")[0];
      return await Todo.findAll({
        where: {
          dueDate: {
            [Op.lt]: today,
          },
          completed: false,
        },
      });
    }

    static async dueToday() {
      // FILL IN HERE TO RETURN ITEMS DUE tODAY
      const today = new Date().toISOString().split("T")[0];
      return await Todo.findAll({
        where: {
          dueDate: today,
          completed: false,
        },
      });
    }

    static async dueLater() {
      // FILL IN HERE TO RETURN ITEMS DUE LATER
      const today = new Date().toISOString().split("T")[0];
      return await Todo.findAll({
        where: {
          dueDate: {
            [Op.gt]: today,
          },
          completed: false,
        },
      });
    }

    static async markAsComplete(id) {
      // FILL IN HERE TO MARK AN ITEM AS COMPLETE
      const todo = new todo.findById(id);
      if (todo) {
        todo.completed = true;
        await todo.save();
      }
    }

    displayableString() {
      let checkbox = this.completed ? "[x]" : "[ ]";
      return `${this.id}. ${checkbox} ${this.title} ${this.dueDate}`;
    }
  }
  Todo.init(
    {
      title: DataTypes.STRING,
      dueDate: DataTypes.DATEONLY,
      completed: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Todo",
    },
  );
  return Todo;
};
