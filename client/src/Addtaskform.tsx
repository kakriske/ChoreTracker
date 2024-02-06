// AddTaskForm.tsx
import React, { useState } from 'react';

interface AddTaskFormProps {
  onAddTask: (task: any) => void;
}

export function AddTaskForm({ onAddTask }: AddTaskFormProps) {
  const [taskContent, setTaskContent] = useState('');
  const [priority, setPriority] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newTask = {
      taskContent,
      priority,
    };

    onAddTask(newTask);

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
