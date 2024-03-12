// import React from "react";
import { useEffect, useState } from 'react';
import { AddTaskForm } from './Addtaskform';
// import { AddTaskForm } from "./Addtaskform";

interface TaskpageProps {
  onTaskClick: (taskId: number, taskContent: string) => void;
}

export function TaskPage({ onTaskClick }: TaskpageProps) {
  const [tasks, setTasks] = useState<any[]>([]);

  const handleAddTask = (newTask: any) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  //UseEffect with a fetch request and authorization header the bearer from authmiddleware and the token
  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token not found');
        return;
      }

      try {
        const response = await fetch('/api/tasks', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error(`Error fetching tasks: ${response.statusText}`);
        }
        const tasks = await response.json();
        setTasks(tasks);
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      }
    };
    fetchTasks();
  }, []);
  const handleTaskClick = (taskId: number) => {
    console.log('Task clicked with taskId:', taskId);
    const selectedTask = tasks.find((task) => task.taskId === taskId);

    if (selectedTask) {
      console.log('selected task:', selectedTask);
      onTaskClick(taskId, selectedTask.taskContent);
    }
  };

  return (
    <div className="container-fluid vh-100 custom-light-blue-bg p-1">
      <div className="chore-tracker-section border border-dark shadow mb-3 pb-2 bg-warning text-dark">
        <h1 className="d-block">Task Page</h1>
      </div>
      <div className="task-list">
        <h2>Task List</h2>
        <AddTaskForm onAddTask={handleAddTask} />
        <ul>
          {tasks.map((task) => (
            <li key={task.taskId} onClick={() => handleTaskClick(task.taskId)}>
              {task.taskContent}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
