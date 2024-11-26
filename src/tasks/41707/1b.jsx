import React, { useState } from 'react';
// import { 
//   Button, 
//   Card, 
//   CardContent, 
//   CardDescription, 
//   CardFooter, 
//   CardHeader, 
//   CardTitle, 
//   Input, 
//   Checkbox,
//   Select,
//   SelectItem,
// } from "@/components/ui";

function TaskTracker() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [newTask, setNewTask] = useState({ title: '', description: '' });

  const addTask = () => {
    if (newTask.title.trim()) {
      setTasks([...tasks, { ...newTask, id: Date.now(), completed: false }]);
      setNewTask({ title: '', description: '' });
    }
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'completed') return task.completed;
    return !task.completed;
  });

  const completedCount = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Task Tracker</CardTitle>
          <CardDescription>
            Total Tasks: {totalTasks} | Completed: {completedCount}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Input 
            value={newTask.title}
            onChange={(e) => setNewTask({...newTask, title: e.target.value})}
            placeholder="Task Title"
            className="mb-2"
          />
          <Input 
            value={newTask.description}
            onChange={(e) => setNewTask({...newTask, description: e.target.value})}
            placeholder="Description (optional)"
          />
          <Button onClick={addTask} className="mt-2 w-full sm:w-auto">Add Task</Button>
        </CardContent>
      </Card>

      <Select 
        value={filter} 
        onChange={(e) => setFilter(e.target.value)}
        className="mb-4"
      >
        <SelectItem value="all">All</SelectItem>
        <SelectItem value="completed">Completed</SelectItem>
        <SelectItem value="incomplete">Incomplete</SelectItem>
      </Select>

      {filteredTasks.map(task => (
        <Card key={task.id} className="mb-2">
          <CardHeader>
            <CardTitle>{task.title}</CardTitle>
          </CardHeader>
          <CardContent>
            {task.description && <p>{task.description}</p>}
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <Checkbox 
              checked={task.completed} 
              onCheckedChange={() => toggleTask(task.id)} 
            />
            <Button onClick={() => deleteTask(task.id)} variant="destructive">Delete</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <TaskTracker />
    </div>
  );
}