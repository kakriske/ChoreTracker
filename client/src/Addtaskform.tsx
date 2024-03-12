// AddTaskForm.tsx
import React, { useState } from 'react';

interface AddTaskFormProps {
  onAddTask: (task: any) => void;
}

export function AddTaskForm({ onAddTask }: AddTaskFormProps) {
  const [taskContent, setTaskContent] = useState('');
  const [priority, setPriority] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const req = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ taskContent, priority }),
      };
      const res = await fetch('/api/tasks', req);

      if (!res.ok) {
        throw new Error(`fetch Error ${res.status}`);
      }
      const newTask = await res.json();
      onAddTask(newTask);
    } catch (err) {
      console.error(`Error adding task: ${err}`);
    }

    // const newTask = {
    //   taskContent,
    //   priority,
    // };

    // onAddTask(newTask);

    // clear out input
    setTaskContent('');
    setPriority('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Task Content:</label>
        <input
          type="text"
          value={taskContent}
          onChange={(e) => setTaskContent(e.target.value)}
        />
      </div>
      <div>
        <label>Priority:</label>
        <input
          type="text"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        />
      </div>
      <div>
        <button type="submit">Add Task</button>
      </div>
    </form>
  );
}
