// import React from 'react';
import { SignUpForm } from './Signup';
import { UserPage } from './Userpage';
import './App.css';
import { useState } from 'react';

interface User {
  username: string;
}

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState<string>('');

  const handleLogin = (user: User) => {
    if (user) {
      setUsername(user.username);
      setLoggedIn(true);
    } else {
      console.log('invalid user object:', user);
    }
  };

  return (
    <div>
      {loggedIn ? (
        <UserPage username={username} />
      ) : (
        <SignUpForm onLogin={handleLogin} />
      )}
    </div>
  );
}
