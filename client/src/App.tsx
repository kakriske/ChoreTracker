// import React from 'react';
import { SignUpForm } from './Signup';
import { UserPage } from './Userpage';
import './App.css';
import { useState } from 'react';
import { TaskPage } from './Taskpage';

interface User {
  username: string;
}

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState<string>('');
  const [selectedTask, setSelectedTask] = useState<number | null>(null);

  const handleLogin = (user: User) => {
    if (user) {
      setUsername(user.username);
      setLoggedIn(true);
    } else {
      console.log('invalid user object:', user);
    }
  };

  const handleTaskClick = (taskId: number) => {
    console.log('task clicked:', taskId);
    setSelectedTask(taskId);
  };

  return (
    <div>
      {loggedIn ? (
        selectedTask != null ? (
          <UserPage username={username} selectedTask={selectedTask} />
        ) : (
          <TaskPage onTaskClick={handleTaskClick} />
        )
      ) : (
        <SignUpForm onLogin={handleLogin} />
      )}
    </div>
  );
}
