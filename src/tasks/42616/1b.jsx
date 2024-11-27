import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const initialTasks = [
  { id: 1, name: "Buy groceries", date: "2023-07-15" },
  { id: 2, name: "Clean the house", date: "2023-07-16" },
  { id: 3, name: "Finish project", date: "2023-07-17" },
];

const TaskItem = ({ task, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(task.name);
  const [editedDate, setEditedDate] = useState(task.date);

  const handleSave = () => {
    onEdit(task.id, editedName, editedDate);
    setIsEditing(false);
  };

  return (
    <li className="mb-4">
      <Card>
        <CardContent className="p-4">
          {isEditing ? (
            <div className="space-y-2">
              <Input
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="w-full"
              />
              <Input
                type="date"
                value={editedDate}
                onChange={(e) => setEditedDate(e.target.value)}
                className="w-full"
              />
              <div className="space-x-2">
                <Button onClick={handleSave}>Save</Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{task.name}</h3>
                <p className="text-sm text-gray-500">{task.date}</p>
              </div>
              <div className="space-x-2">
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  Edit
                </Button>
                <Button variant="destructive" onClick={() => onDelete(task.id)}>
                  Delete
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </li>
  );
};

export default function App() {
  const [tasks, setTasks] = useState(initialTasks);
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskDate, setNewTaskDate] = useState("");
  const [history, setHistory] = useState([]);

  const addToHistory = useCallback((action) => {
    setHistory((prev) => [...prev, action]);
  }, []);

  const addTask = useCallback(() => {
    if (newTaskName && newTaskDate) {
      const newTask = {
        id: Date.now(),
        name: newTaskName,
        date: newTaskDate,
      };
      setTasks((prev) => [...prev, newTask]);
      addToHistory({ type: "ADD", task: newTask });
      setNewTaskName("");
      setNewTaskDate("");
    }
  }, [newTaskName, newTaskDate, addToHistory]);

  const editTask = useCallback(
    (id, newName, newDate) => {
      setTasks((prev) => {
        const taskIndex = prev.findIndex((task) => task.id === id);
        if (taskIndex !== -1) {
          const oldTask = prev[taskIndex];
          const newTasks = [...prev];
          newTasks[taskIndex] = { ...oldTask, name: newName, date: newDate };
          addToHistory({ type: "EDIT", oldTask, newTask: newTasks[taskIndex] });
          return newTasks;
        }
        return prev;
      });
    },
    [addToHistory]
  );

  const deleteTask = useCallback(
    (id) => {
      setTasks((prev) => {
        const taskIndex = prev.findIndex((task) => task.id === id);
        if (taskIndex !== -1) {
          const deletedTask = prev[taskIndex];
          addToHistory({ type: "DELETE", task: deletedTask });
          return prev.filter((task) => task.id !== id);
        }
        return prev;
      });
    },
    [addToHistory]
  );

  const undo = useCallback(() => {
    if (history.length > 0) {
      const lastAction = history[history.length - 1];
      setHistory((prev) => prev.slice(0, -1));

      switch (lastAction.type) {
        case "ADD":
          setTasks((prev) => prev.filter((task) => task.id !== lastAction.task.id));
          break;
        case "EDIT":
          setTasks((prev) =>
            prev.map((task) =>
              task.id === lastAction.oldTask.id ? lastAction.oldTask : task
            )
          );
          break;
        case "DELETE":
          setTasks((prev) => [...prev, lastAction.task]);
          break;
        default:
          break;
      }
    }
  }, [history]);

  return (
    <div className="container mx-auto p-4 max-w-md">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Task Manager</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              placeholder="Task name"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
            />
            <Input
              type="date"
              value={newTaskDate}
              onChange={(e) => setNewTaskDate(e.target.value)}
            />
            <Button onClick={addTask} className="w-full">
              Add Task
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <ul>
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onEdit={editTask}
                onDelete={deleteTask}
              />
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="mt-4">
        <Button onClick={undo} disabled={history.length === 0} className="w-full">
          Undo
        </Button>
      </div>
    </div>
  );
}