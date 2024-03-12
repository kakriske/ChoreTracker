// import React from 'react';
import { SignUpForm } from './Signup';
import { UserPage } from './Userpage';
import './App.css';
import { useState } from 'react';
import { TaskPage } from './TaskPage';

interface User {
  username: string;
}

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState<string>('');
  const [selectedTasks, setSelectedTasks] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState<'task' | 'user'>('task');

  const checkUserTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const tasks = await response.json();
      if (tasks.length > 0) {
        setSelectedTasks(tasks.map((task) => task.taskId));
        setCurrentPage('user');
      } else {
        setCurrentPage('task');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogin = async (user: User) => {
    if (user) {
      setUsername(user.username);
      setLoggedIn(true);
      await checkUserTasks();
    } else {
      console.log('invalid user object:', user);
    }
  };

  const handleTaskClick = (taskId: number) => {
    console.log('task clicked in app:', taskId);
    if (!selectedTasks.includes(taskId)) {
      setSelectedTasks([...selectedTasks, taskId]);
    }
    setCurrentPage('user');
  };

  const handleNavigateBack = () => {
    setCurrentPage('task');
    setSelectedTasks([]);
  };

  const handleNavigateToTaskPage = () => {
    setCurrentPage('task');
  };

  return (
    <div>
      {loggedIn ? (
        currentPage === 'task' ? (
          <TaskPage
            onTaskClick={handleTaskClick}
            selectedTasks={selectedTasks}
          />
        ) : (
          <UserPage
            username={username}
            selectedTasks={selectedTasks}
            onNavigateBack={handleNavigateBack}
            onNavigateBackToTaskPage={handleNavigateToTaskPage}
          />
        )
      ) : (
        <SignUpForm onLogin={handleLogin} />
      )}
    </div>
  );
}
