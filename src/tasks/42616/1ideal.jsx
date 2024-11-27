import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

function TaskCard({ task, onEdit, onExecute }) {
  return (
    <Card className="w-full sm:w-96 mb-4">
      <CardHeader>
        <CardTitle>{task.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Date: {task.date}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          onClick={() => onEdit(task.id)}
        >
          Edit
        </button>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          onClick={() => onExecute(task.id)}
        >
          Execute
        </button>
      </CardFooter>
    </Card>
  );
}

function TaskForm({ onAddTask }) {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !date) return;
    onAddTask({ name, date });
    setName("");
    setDate("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-6 w-full sm:w-96">
      <input
        type="text"
        placeholder="Task Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="px-4 py-2 border rounded-md"
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="px-4 py-2 border rounded-md"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Add Task
      </button>
    </form>
  );
}

export default function App() {
  const [tasks, setTasks] = useState([
    { id: 1, name: "Buy groceries", date: "2024-11-28" },
    { id: 2, name: "Clean the house", date: "2024-11-29" },
    { id: 3, name: "Finish project", date: "2024-11-30" },
  ]);
  const [history, setHistory] = useState([]);

  const addTask = (task) => {
    const newTask = { ...task, id: Date.now() };
    setHistory([...history, { type: "add", task: newTask }]);
    setTasks([...tasks, newTask]);
  };

  const editTask = (id) => {
    const newName = prompt("Enter new task name:");
    const newDate = prompt("Enter new task date:");
    if (!newName || !newDate) return;

    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, name: newName, date: newDate } : task
    );
    const oldTask = tasks.find((task) => task.id === id);

    setHistory([...history, { type: "edit", before: oldTask }]);
    setTasks(updatedTasks);
  };

  const executeTask = (id) => {
    const taskToExecute = tasks.find((task) => task.id === id);
    if (!taskToExecute) return;

    setHistory([...history, { type: "delete", task: taskToExecute }]);
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const undo = () => {
    if (!history.length) return;

    const lastAction = history.pop();
    setHistory([...history]);

    if (lastAction.type === "add") {
      setTasks(tasks.filter((task) => task.id !== lastAction.task.id));
    } else if (lastAction.type === "edit") {
      setTasks(
        tasks.map((task) =>
          task.id === lastAction.before.id ? lastAction.before : task
        )
      );
    } else if (lastAction.type === "delete") {
      setTasks([...tasks, lastAction.task]);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 sm:p-8">
      <h1 className="text-2xl font-bold mb-6">Task Manager</h1>
      <TaskForm onAddTask={addTask} />
      <div className="w-full flex flex-col items-center">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={editTask}
            onExecute={executeTask}
          />
        ))}
      </div>
      <button
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        onClick={undo}
      >
        Undo
      </button>
    </div>
  );
}
