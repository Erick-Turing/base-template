import React, { useState, useCallback } from "react";
// import { DndProvider, useDrag, useDrop } from "react-dnd"; // ERROR
// import { HTML5Backend } from "react-dnd-html5-backend"; // ERROR
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const ItemTypes = {
  TASK: "task",
};

const TaskItem = ({ id, text, index, moveTask, removeTask, editTask, listType }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.TASK,
    item: { id, index, listType },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(text);

  const handleEdit = () => {
    editTask(id, editedText);
    setIsEditing(false);
  };

  return (
    <div
      ref={drag}
      className={`p-2 mb-2 bg-white rounded shadow ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      {isEditing ? (
        <div className="flex">
          <Input
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className="mr-2"
          />
          <Button onClick={handleEdit}>Save</Button>
        </div>
      ) : (
        <div className="flex justify-between items-center">
          <span>{text}</span>
          <div>
            <Button onClick={() => setIsEditing(true)} className="mr-2">
              Edit
            </Button>
            <Button onClick={() => removeTask(id)}>Remove</Button>
          </div>
        </div>
      )}
    </div>
  );
};

const TaskList = ({ tasks, moveTask, removeTask, editTask, listType }) => {
  const [, drop] = useDrop(() => ({
    accept: ItemTypes.TASK,
    drop: (item, monitor) => {
      if (item.listType !== listType) {
        moveTask(item.id, listType);
      }
    },
  }));

  return (
    <div ref={drop} className="min-h-[200px]">
      {tasks.map((task, index) => (
        <TaskItem
          key={task.id}
          index={index}
          {...task}
          moveTask={moveTask}
          removeTask={removeTask}
          editTask={editTask}
          listType={listType}
        />
      ))}
    </div>
  );
};

const ConfirmDialog = ({ isOpen, onClose, onConfirm, taskName }) => {
  const [inputValue, setInputValue] = useState("");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
        </DialogHeader>
        <p>Type "{taskName}" to confirm deletion:</p>
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <DialogFooter>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            onClick={() => {
              if (inputValue === taskName) {
                onConfirm();
                onClose();
              }
            }}
            disabled={inputValue !== taskName}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default function App() {
  const [todoTasks, setTodoTasks] = useState([]);
  const [doneTasks, setDoneTasks] = useState([]);
  const [newTodoTask, setNewTodoTask] = useState("");
  const [newDoneTask, setNewDoneTask] = useState("");
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    taskId: null,
    taskName: "",
    listType: null,
  });

  const addTask = useCallback(
    (text, listType) => {
      const newTask = { id: Date.now(), text };
      if (listType === "todo") {
        setTodoTasks((prev) => [...prev, newTask]);
        setNewTodoTask("");
      } else {
        setDoneTasks((prev) => [...prev, newTask]);
        setNewDoneTask("");
      }
    },
    []
  );

  const moveTask = useCallback((id, targetList) => {
    const sourceList = todoTasks.find((task) => task.id === id)
      ? todoTasks
      : doneTasks;
    const task = sourceList.find((task) => task.id === id);

    if (targetList === "todo") {
      setTodoTasks((prev) => [...prev, task]);
      setDoneTasks((prev) => prev.filter((t) => t.id !== id));
    } else {
      setDoneTasks((prev) => [...prev, task]);
      setTodoTasks((prev) => prev.filter((t) => t.id !== id));
    }
  }, [todoTasks, doneTasks]);

  const removeTask = useCallback((id, listType) => {
    const taskList = listType === "todo" ? todoTasks : doneTasks;
    const task = taskList.find((t) => t.id === id);
    setConfirmDialog({
      isOpen: true,
      taskId: id,
      taskName: task.text,
      listType,
    });
  }, [todoTasks, doneTasks]);

  const confirmRemoveTask = useCallback(() => {
    const { taskId, listType } = confirmDialog;
    if (listType === "todo") {
      setTodoTasks((prev) => prev.filter((task) => task.id !== taskId));
    } else {
      setDoneTasks((prev) => prev.filter((task) => task.id !== taskId));
    }
  }, [confirmDialog]);

  const editTask = useCallback((id, newText) => {
    setTodoTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, text: newText } : task))
    );
    setDoneTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, text: newText } : task))
    );
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Todo List</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Todo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Input
                  value={newTodoTask}
                  onChange={(e) => setNewTodoTask(e.target.value)}
                  placeholder="Add new todo task"
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && newTodoTask.trim() !== "") {
                      addTask(newTodoTask, "todo");
                    }
                  }}
                />
                <Button
                  onClick={() => addTask(newTodoTask, "todo")}
                  disabled={newTodoTask.trim() === ""}
                  className="mt-2"
                >
                  Add Todo
                </Button>
              </div>
              <TaskList
                tasks={todoTasks}
                moveTask={moveTask}
                removeTask={(id) => removeTask(id, "todo")}
                editTask={editTask}
                listType="todo"
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Done</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Input
                  value={newDoneTask}
                  onChange={(e) => setNewDoneTask(e.target.value)}
                  placeholder="Add new done task"
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && newDoneTask.trim() !== "") {
                      addTask(newDoneTask, "done");
                    }
                  }}
                />
                <Button
                  onClick={() => addTask(newDoneTask, "done")}
                  disabled={newDoneTask.trim() === ""}
                  className="mt-2"
                >
                  Add Done
                </Button>
              </div>
              <TaskList
                tasks={doneTasks}
                moveTask={moveTask}
                removeTask={(id) => removeTask(id, "done")}
                editTask={editTask}
                listType="done"
              />
            </CardContent>
          </Card>
        </div>
      </div>
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        onConfirm={confirmRemoveTask}
        taskName={confirmDialog.taskName}
      />
    </DndProvider>
  );
}