import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
// import { useDrop } from 'react-dnd'; // ERROR
// import { DndProvider } from 'react-dnd'; // ERROR
// import { HTML5Backend } from 'react-dnd-html5-backend'; // ERROR

function Task({ task, onEdit, onDelete, onToggle }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(task.text);
  const [confirmDelete, setConfirmDelete] = useState('');

  const handleEdit = () => {
    if (isEditing) {
      onEdit(editedText);
    }
    setIsEditing(!isEditing);
  };

  const handleConfirmDelete = () => {
    if (confirmDelete === task.text) {
      onDelete();
    } else {
      alert("Task name does not match. Deletion cancelled.");
    }
  };

  return (
    <div className="p-2 border-b border-gray-200 last:border-b-0">
      {isEditing ? (
        <div>
          <Input value={editedText} onChange={(e) => setEditedText(e.target.value)} className="mb-2" />
          <Button onClick={handleEdit}>Save</Button>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <Checkbox checked={task.done} onChange={onToggle} />
          <span className={task.done ? "line-through text-gray-500" : ""}>{task.text}</span>
          <div>
            <Button onClick={handleEdit} variant="outline" size="sm" className="mr-2">Edit</Button>
            <Input 
              placeholder="Type task to delete" 
              value={confirmDelete} 
              onChange={(e) => setConfirmDelete(e.target.value)} 
              className="inline w-32 mr-2"
            />
            <Button onClick={handleConfirmDelete} variant="destructive" size="sm">Delete</Button>
          </div>
        </div>
      )}
    </div>
  );
}

function Column({ title, tasks, onAddTask, moveTask, ...props }) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'task',
    drop: (item) => moveTask(item.id, title.toLowerCase()),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <Card className="flex-1 m-2 min-w-0">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <Input placeholder={`Add ${title.toLowerCase()}`} onKeyDown={(e) => {
          if (e.key === 'Enter' && e.target.value.trim()) {
            onAddTask(e.target.value);
            e.target.value = '';
          }
        }} />
      </CardHeader>
      <CardContent className={isOver ? "bg-gray-50" : ""}>
        <div ref={drop} className="min-h-[200px]">
          {tasks.map((task, index) => (
            <Task key={task.id} task={task} {...props} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function App() {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Learn React', done: false },
    { id: 2, text: 'Build an App', done: true },
  ]);

  const addTask = (column, text) => {
    setTasks([...tasks, { id: Date.now(), text, done: column === 'done' }]);
  };

  const moveTask = (id, to) => {
    setTasks(tasks.map(t => 
      t.id === id ? { ...t, done: to === 'done' } : t
    ));
  };

  const updateTask = (id, newText) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, text: newText } : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col sm:flex-row p-4 max-w-4xl mx-auto">
        <Column 
          title="Todo" 
          tasks={tasks.filter(t => !t.done)} 
          onAddTask={(text) => addTask('todo', text)}
          moveTask={moveTask}
          onEdit={(text) => updateTask(tasks.find(t => !t.done).id, text)}
          onDelete={() => deleteTask(tasks.find(t => !t.done).id)}
          onToggle={() => toggleTask(tasks.find(t => !t.done).id)}
        />
        <Column 
          title="Done" 
          tasks={tasks.filter(t => t.done)} 
          onAddTask={(text) => addTask('done', text)}
          moveTask={moveTask}
          onEdit={(text) => updateTask(tasks.find(t => t.done).id, text)}
          onDelete={() => deleteTask(tasks.find(t => t.done).id)}
          onToggle={() => toggleTask(tasks.find(t => t.done).id)}
        />
      </div>
    </DndProvider>
  );
}