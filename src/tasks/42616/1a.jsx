import React, { useState, useReducer, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Reducer to handle state changes with undo functionality
function tasksReducer(state, action) {
  switch (action.type) {
    case 'ADD_TASK':
      return { tasks: [...state.tasks, action.task], history: [...state.history, state.tasks] };
    case 'EDIT_TASK':
      const newTasks = state.tasks.map(task => 
        task.id === action.task.id ? { ...task, ...action.task } : task
      );
      return { tasks: newTasks, history: [...state.history, state.tasks] };
    case 'REMOVE_TASK':
      const removedTasks = state.tasks.filter(task => task.id !== action.id);
      return { tasks: removedTasks, history: [...state.history, state.tasks] };
    case 'UNDO':
      if (state.history.length > 1) {
        const newHistory = state.history.slice(0, -1);
        return { tasks: newHistory[newHistory.length - 1], history: newHistory };
      }
      return state;
    default:
      return state;
  }
}

function TaskList() {
  const [state, dispatch] = useReducer(tasksReducer, {
    tasks: [
      { id: 1, name: 'Buy groceries', date: '2023-10-01' },
      { id: 2, name: 'Call mom', date: '2023-10-02' },
      { id: 3, name: 'Finish project', date: '2023-10-05' },
    ],
    history: []
  });

  const [taskName, setTaskName] = useState('');
  const [taskDate, setTaskDate] = useState('');
  const [editId, setEditId] = useState(null);

  const handleAddTask = useCallback(() => {
    if (taskName && taskDate) {
      if (editId) {
        dispatch({ type: 'EDIT_TASK', task: { id: editId, name: taskName, date: taskDate } });
        setEditId(null);
      } else {
        dispatch({ type: 'ADD_TASK', task: { id: Date.now(), name: taskName, date: taskDate } });
      }
      setTaskName('');
      setTaskDate('');
    }
  }, [taskName, taskDate, editId]);

  const handleUndo = () => {
    dispatch({ type: 'UNDO' });
  };

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Add/Edit Task</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="taskName">Task Name</Label>
              <Input 
                id="taskName" 
                value={taskName} 
                onChange={e => setTaskName(e.target.value)} 
                placeholder="Task name"
              />
            </div>
            <div>
              <Label htmlFor="taskDate">Date</Label>
              <Input 
                id="taskDate" 
                type="date"
                value={taskDate} 
                onChange={e => setTaskDate(e.target.value)} 
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleAddTask}>
            {editId ? 'Update Task' : 'Add Task'}
          </Button>
          <Button className="ml-2" onClick={handleUndo} disabled={state.history.length <= 1}>Undo</Button>
        </CardFooter>
      </Card>

      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {state.tasks.map(task => (
          <Card key={task.id}>
            <CardHeader>
              <CardTitle>{task.name}</CardTitle>
              <CardDescription>{task.date}</CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-between">
              <Button onClick={() => {
                setTaskName(task.name);
                setTaskDate(task.date);
                setEditId(task.id);
              }}>Edit</Button>
              <Button onClick={() => dispatch({ type: 'REMOVE_TASK', id: task.id })} variant="destructive">Delete</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return <TaskList />;
}