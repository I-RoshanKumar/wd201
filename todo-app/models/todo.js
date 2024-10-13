/* eslint-disable no-unused-vars */
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    static associate(models) {
      Todo.belongsTo(models.User, { foreignKey: "userId" });
    }
    static getTodos() {
      return this.findAll();
    }
    static addTodo({ title, dueDate }) {
      return this.create({ title: title, dueDate: dueDate, completed: false });
    }
    markAsCompleted() {
      this.update({ completed: true });
    }
    static async remove(id) {
      return this.destroy({
        where: {
          id: id,
        },
      });
    }
    markAsIncompleted() {
      return this.update({ completed: false });
    }
    static completedItems() {
      return this.findAll({
        where: {
          completed: true,
        },
        order: [["id", "ASC"]],
      });
    }
    setCompletionStatus(status) {
      return this.update({ completed: status });
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
