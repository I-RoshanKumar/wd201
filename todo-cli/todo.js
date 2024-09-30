const todoList = () => {
  const all = [];

  const getCurrentDate = () => new Date().toISOString().slice(0, 10);

  const add = (todoItem) => {
    all.push(todoItem);
  };

  const markAsComplete = (index) => {
    if (all[index]) {
      all[index].completed = true;
    }
  };

  const overdue = () => {
    return all.filter((item) => item.dueDate < getCurrentDate());
  };

  const dueToday = () => {
    return all.filter((item) => item.dueDate === getCurrentDate());
  };

  const dueLater = () => {
    return all.filter((item) => item.dueDate > getCurrentDate());
  };

  const toDisplayableList = (list) => {
    return list
      .map((item) => {
        const isCompleted = item.completed ? "[x]" : "[ ]";
        const displayDate =
          item.dueDate === getCurrentDate() ? "" : item.dueDate;
        return `${isCompleted} ${item.title} ${displayDate}`.trim();
      })
      .join("\n");
  };

  return {
    all,
    add,
    markAsComplete,
    overdue,
    dueToday,
    dueLater,
    toDisplayableList,
  };
};

module.exports = todoList;
