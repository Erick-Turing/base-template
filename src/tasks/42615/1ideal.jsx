import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function TaskColumn({
  title,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onDropTask,
  completed
}) {
  const [inputValue, setInputValue] = useState("");

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    onAddTask(inputValue);
    setInputValue("");
  };

  return (
    <div
      className="flex flex-col items-center w-full sm:w-1/2 p-4"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => onDropTask(e, title)}
    >
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-center">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddTask} className="mb-4 flex">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={`Add task to ${title}`}
              className="flex-grow px-4 py-2 border rounded-l-md"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
            >
              Add
            </button>
          </form>
          <ul>
            {tasks.map((task) => (
              <li
                key={task.id}
                draggable
                onDragStart={(e) => e.dataTransfer.setData("taskId", task.id)}
                className="flex justify-between items-center mb-2 p-2 border rounded-md bg-gray-100"
              >
                <span style={{ textDecoration: completed ? 'line-through' : 'none' }}>{task.name}</span>
                <div className="flex gap-2">
                  <button
                    className="px-2 py-1 bg-yellow-400 text-white rounded-md hover:bg-yellow-500"
                    onClick={() => onEditTask(task.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                    onClick={() => onDeleteTask(task.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

export default function App() {
  const [todoTasks, setTodoTasks] = useState([]);
  const [doneTasks, setDoneTasks] = useState([]);

  const handleAddTask = (list, taskName) => {
    const newTask = { id: Date.now(), name: taskName };
    if (list === "Todo") {
      setTodoTasks([...todoTasks, newTask]);
    } else {
      setDoneTasks([...doneTasks, newTask]);
    }
  };

  const handleEditTask = (list, id) => {
    const newName = prompt("Enter the new task name:");
    if (!newName) return;

    if (list === "Todo") {
      setTodoTasks(
        todoTasks.map((task) =>
          task.id === id ? { ...task, name: newName } : task
        )
      );
    } else {
      setDoneTasks(
        doneTasks.map((task) =>
          task.id === id ? { ...task, name: newName } : task
        )
      );
    }
  };

  const handleDeleteTask = (list, id) => {
    const task = list === "Todo" ? todoTasks.find((t) => t.id === id) : doneTasks.find((t) => t.id === id);
    const confirmation = prompt(
      `Type the task name "${task.name}" to confirm deletion:`
    );
    if (confirmation !== task.name) return;

    if (list === "Todo") {
      setTodoTasks(todoTasks.filter((task) => task.id !== id));
    } else {
      setDoneTasks(doneTasks.filter((task) => task.id !== id));
    }
  };

  const handleDropTask = (e, list) => {
    const taskId = parseInt(e.dataTransfer.getData("taskId"));
    if (!taskId) return;

    const task =
      todoTasks.find((task) => task.id === taskId) ||
      doneTasks.find((task) => task.id === taskId);

    if (list === "Todo") {
      setTodoTasks([...todoTasks, task]);
      setDoneTasks(doneTasks.filter((task) => task.id !== taskId));
    } else {
      setDoneTasks([...doneTasks, task]);
      setTodoTasks(todoTasks.filter((task) => task.id !== taskId));
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-center items-start gap-4 p-4">
      <TaskColumn
        title="Todo"
        tasks={todoTasks}
        onAddTask={(taskName) => handleAddTask("Todo", taskName)}
        onEditTask={(id) => handleEditTask("Todo", id)}
        onDeleteTask={(id) => handleDeleteTask("Todo", id)}
        onDropTask={handleDropTask}
        completed={false}
      />
      <TaskColumn
        title="Done"
        tasks={doneTasks}
        onAddTask={(taskName) => handleAddTask("Done", taskName)}
        onEditTask={(id) => handleEditTask("Done", id)}
        onDeleteTask={(id) => handleDeleteTask("Done", id)}
        onDropTask={handleDropTask}
        completed={true}
      />
    </div>
  );
}
