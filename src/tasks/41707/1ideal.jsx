import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// TaskItem Component: Displays individual tasks
function TaskItem({ task, onComplete, onDelete }) {
  return (
    <Card className="mb-4">
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={task.completed}
            onCheckedChange={() => onComplete(task.id)}
          />
          <div>
            <h3
              className={`font-semibold ${
                task.completed ? "line-through text-gray-500" : ""
              }`}
            >
              {task.title}
            </h3>
            {task.description && (
              <p className="text-sm text-gray-600">{task.description}</p>
            )}
          </div>
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(task.id)}
        >
          Delete
        </Button>
      </CardContent>
    </Card>
  );
}

// TaskForm Component: Handles task creation
function TaskForm({ onAddTask }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddTask({ title: title.trim(), description: description.trim() });
    setTitle("");
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
      <Input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <Textarea
        placeholder="Task description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Button type="submit">Add Task</Button>
    </form>
  );
}

// TaskSummary Component: Shows summary of tasks
function TaskSummary({ tasks }) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Task Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Total Tasks: {totalTasks}</p>
        <p>Completed Tasks: {completedTasks}</p>
      </CardContent>
    </Card>
  );
}

// Main App Component
export default function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(savedTasks);
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Add a new task
  const addTask = (newTask) => {
    if (tasks.some((task) => task.title === newTask.title)) {
      alert("Task with the same title already exists!");
      return;
    }
    setTasks([...tasks, { ...newTask, id: Date.now(), completed: false }]);
  };

  // Mark a task as complete/incomplete
  const completeTask = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Delete a task
  const deleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  // Clear all completed tasks
  const clearCompletedTasks = () => {
    setTasks(tasks.filter((task) => !task.completed));
  };

  // Filter tasks based on selection
  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "incomplete") return !task.completed;
    return true;
  });

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-6">Task Tracker</h1>
      <TaskSummary tasks={tasks} />
      <TaskForm onAddTask={addTask} />
      <div className="flex justify-between items-center mb-4">
        <Select onValueChange={setFilter} defaultValue={filter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter tasks" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tasks</SelectItem>
            <SelectItem value="completed">Completed Tasks</SelectItem>
            <SelectItem value="incomplete">Incomplete Tasks</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="secondary" size="sm" onClick={clearCompletedTasks}>
          Clear Completed
        </Button>
      </div>
      <div>
        {filteredTasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onComplete={completeTask}
            onDelete={deleteTask}
          />
        ))}
      </div>
    </div>
  );
}
