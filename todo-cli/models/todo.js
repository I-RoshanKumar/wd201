// models/todo.js
"use strict";
const { Model } = require("sequelize");
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
      console.log("\n");

      console.log("Due Today");
      // FILL IN HERE
      console.log("\n");

      console.log("Due Later");
      // FILL IN HERE
    }

    static async overdue() {
      // FILL IN HERE TO RETURN OVERDUE ITEMS
    }

    static async dueToday() {
      // FILL IN HERE TO RETURN ITEMS DUE tODAY
    }

    static async dueLater() {
      // FILL IN HERE TO RETURN ITEMS DUE LATER
    }

    static async markAsComplete() {
      // FILL IN HERE TO MARK AN ITEM AS COMPLETE
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
