import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function TaskOrganizer() {
  const [tasks, setTasks] = useState([
    { id: 1, name: "Task 1" },
    { id: 2, name: "Task 2" },
    { id: 3, name: "Task 3" },
  ]);

  const [draggedTask, setDraggedTask] = useState(null);

  const handleDragStart = (id) => {
    setDraggedTask(id);
  };

  const handleDrop = (id) => {
    const draggedIndex = tasks.findIndex((task) => task.id === draggedTask);
    const targetIndex = tasks.findIndex((task) => task.id === id);

    const updatedTasks = [...tasks];
    const [draggedItem] = updatedTasks.splice(draggedIndex, 1);
    updatedTasks.splice(targetIndex, 0, draggedItem);

    setTasks(updatedTasks);
    setDraggedTask(null);
  };

  const handleAddTask = () => {
    const taskName = prompt("Enter task name:");
    if (taskName) {
      setTasks([...tasks, { id: Date.now(), name: taskName }]);
    }
  };

  const handleEditTask = (id) => {
    const taskName = prompt("Edit task name:");
    if (taskName) {
      setTasks(
        tasks.map((task) =>
          task.id === id ? { ...task, name: taskName } : task
        )
      );
    }
  };

  return (
    <div className="flex flex-col items-center w-full sm:w-1/2 p-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-center">Task Organizer</CardTitle>
        </CardHeader>
        <CardContent>
          <button
            onClick={handleAddTask}
            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Add Task
          </button>
          <ul>
            {tasks.map((task) => (
              <li
                key={task.id}
                draggable
                onDragStart={() => handleDragStart(task.id)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(task.id)}
                className="flex justify-between items-center mb-2 p-2 border rounded-md bg-gray-100"
              >
                <span>{task.name}</span>
                <button
                  onClick={() => handleEditTask(task.id)}
                  className="px-2 py-1 bg-yellow-400 text-white rounded-md hover:bg-yellow-500"
                >
                  Edit
                </button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

function FAQSection() {
  const [faq, setFaq] = useState([
    { id: 1, question: "What is React?", answer: "A JavaScript library for building UIs.", open: false },
    { id: 2, question: "What is Tailwind CSS?", answer: "A utility-first CSS framework.", open: false },
    { id: 3, question: "What is Shadcn?", answer: "A library for building UI components.", open: false },
  ]);

  const toggleFaq = (id) => {
    setFaq(
      faq.map((item) =>
        item.id === id ? { ...item, open: !item.open } : item
      )
    );
  };

  return (
    <div className="flex flex-col items-center w-full sm:w-1/2 p-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-center">FAQ Section</CardTitle>
        </CardHeader>
        <CardContent>
          {faq.map((item) => (
            <div
              key={item.id}
              className="mb-4 border-b pb-2 cursor-pointer"
              onClick={() => toggleFaq(item.id)}
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold">{item.question}</span>
                <span>{item.open ? "-" : "+"}</span>
              </div>
              {item.open && <p className="mt-2 text-gray-700">{item.answer}</p>}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export default function App() {
  return (
    <div className="flex flex-col sm:flex-row justify-center items-start gap-4 p-4">
      <TaskOrganizer />
      <FAQSection />
    </div>
  );
}
