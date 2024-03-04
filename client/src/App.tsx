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
  const [selectedTask, setSelectedTask] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<'task' | 'user'>('task');

  const handleLogin = (user: User) => {
    if (user) {
      setUsername(user.username);
      setLoggedIn(true);
    } else {
      console.log('invalid user object:', user);
    }
  };

  const handleTaskClick = (taskId: number) => {
    console.log('task clicked in app:', taskId);
    setSelectedTask(taskId);
    setCurrentPage('user');
  };

  const handleNavigateBack = () => {
    setCurrentPage('task');
    setSelectedTask(null);
  };

  const handleNavigateToTaskPage = () => {
    setCurrentPage('task');
  };

  return (
    <div>
      {loggedIn ? (
        currentPage === 'task' ? (
          <TaskPage onTaskClick={handleTaskClick} />
        ) : (
          <UserPage
            username={username}
            selectedTask={selectedTask}
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
