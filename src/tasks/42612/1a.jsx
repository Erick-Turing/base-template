import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
// import { useTransition, animated } from 'react-spring'; // ERROR

// Task Organizer Component
function TaskOrganizer() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  const addTask = () => {
    if (newTask) {
      setTasks([...tasks, { id: Date.now(), text: newTask, done: false }]);
      setNewTask('');
    }
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, done: !task.done } : task
    ));
  };

  const moveTask = (dragIndex, hoverIndex) => {
    const draggedTask = tasks[dragIndex];
    setTasks(prevTasks => {
      const newTasks = prevTasks.filter((_, idx) => idx !== dragIndex);
      newTasks.splice(hoverIndex, 0, draggedTask);
      return newTasks;
    });
  };

  return (
    <Card className="sm:w-full w-96">
      <CardHeader>
        <CardTitle>Task Organizer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex mb-4">
          <Input 
            value={newTask} 
            onChange={e => setNewTask(e.target.value)} 
            placeholder="Add new task"
          />
          <Button onClick={addTask} className="ml-2">Add</Button>
        </div>
        <div className="space-y-2">
          {tasks.map((task, index) => (
            <div 
              key={task.id} 
              draggable
              onDragStart={(e) => e.dataTransfer.setData("text/plain", index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => moveTask(Number(e.dataTransfer.getData("text")), index)}
              className="flex items-center bg-slate-100 p-2 rounded"
            >
              <Checkbox 
                checked={task.done} 
                onCheckedChange={() => toggleTask(task.id)}
              />
              <span className={`ml-2 ${task.done ? 'line-through' : ''}`}>{task.text}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// FAQ Item Component
function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="mb-4">
      <CardHeader onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        <CardTitle>{question}</CardTitle>
      </CardHeader>
        <CardContent>
          <p>{answer}</p>
        </CardContent>
    </Card>
  );
}

// FAQ Section Component
function FAQSection() {
  const faqs = [
    { question: "How do I use this app?", answer: "Simply start by adding tasks or exploring the FAQ." },
    { question: "Can I use this on mobile?", answer: "Yes, this app is responsive and works on mobile devices." },
  ];

  return (
    <Card className="sm:w-full w-96">
      <CardHeader>
        <CardTitle>FAQ</CardTitle>
      </CardHeader>
      <CardContent>
        {faqs.map((faq, idx) => (
          <FAQItem key={idx} {...faq} />
        ))}
      </CardContent>
    </Card>
  );
}

// Main App Component
export default function App() {
  return (
    <div className="flex flex-col sm:flex-row justify-center items-start space-y-4 sm:space-y-0 sm:space-x-4 p-4">
      <TaskOrganizer />
      <FAQSection />
    </div>
  );
}