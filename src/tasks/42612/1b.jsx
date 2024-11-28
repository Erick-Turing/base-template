import React, { useState } from "react";
// import { DragDropContext, Droppable, Draggable } from "@/components/ui/dnd"; // ERROR
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

const TaskOrganizer = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  const addTask = () => {
    if (newTask.trim() !== "") {
      setTasks([...tasks, { id: Date.now(), content: newTask }]);
      setNewTask("");
    }
  };

  const editTask = (id, newContent) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, content: newContent } : task));
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const newTasks = Array.from(tasks);
    const [reorderedItem] = newTasks.splice(result.source.index, 1);
    newTasks.splice(result.destination.index, 0, reorderedItem);
    setTasks(newTasks);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Task Organizer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex mb-4">
          <Input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task"
            className="mr-2"
          />
          <Button onClick={addTask}>Add</Button>
        </div>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="tasks">
            {(provided) => (
              <ul {...provided.droppableProps} ref={provided.innerRef}>
                {tasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="bg-white p-2 mb-2 rounded shadow"
                      >
                        <Input
                          value={task.content}
                          onChange={(e) => editTask(task.id, e.target.value)}
                          className="w-full"
                        />
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </CardContent>
    </Card>
  );
};

const FAQSection = () => {
  const faqItems = [
    { question: "What is React?", answer: "React is a JavaScript library for building user interfaces." },
    { question: "What is Tailwind CSS?", answer: "Tailwind CSS is a utility-first CSS framework for rapidly building custom user interfaces." },
    { question: "What is Shadcn?", answer: "Shadcn is a collection of re-usable components built with Radix UI and Tailwind CSS." },
  ];

  return (
    <Card className="w-full max-w-md mt-8">
      <CardHeader>
        <CardTitle>FAQ</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible>
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <TaskOrganizer />
        <FAQSection />
      </div>
    </div>
  );
}