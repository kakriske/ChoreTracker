import { useState, useEffect } from 'react';

interface UserPageProps {
  username: string;
  selectedTasks: number[];
  onNavigateBack: () => void;
  onNavigateBackToTaskPage: () => void;
}

export function UserPage({
  username,
  selectedTasks,
  onNavigateBackToTaskPage,
}: UserPageProps) {
  const [selectedTaskInfo, setSelectedTaskInfo] = useState<any | null>(null);

  useEffect(() => {
    const fetchTaskDetails = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`/api/tasks/${selectedTasks}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error(`Error fetching task details: ${response.status}`);
        }
        const taskDetails = await response.json();
        setSelectedTaskInfo(taskDetails);
      } catch (error) {
        console.error(error);
      }
    };

    if (selectedTasks != null) {
      fetchTaskDetails();
    }
  }, [selectedTasks]);

  return (
    <div className="container-fluid vh-100 custom-light-blue-bg p-1">
      <div className="chore-tracker-section border border-dark shadow mb-3 pb-2 bg-warning text-dark">
        <h1 className="d-block">Welcome, now get to work {username}!</h1>
      </div>
      {selectedTasks != null && selectedTaskInfo ? (
        <div>
          <h2>Your Task List</h2>
          <p>{`Task ID: ${selectedTasks}`}</p>
          {selectedTaskInfo && (
            <p>{`Task Content: ${selectedTaskInfo.taskContent}`}</p>
          )}
        </div>
      ) : (
        <p>No task selected</p>
      )}
      <button onClick={onNavigateBackToTaskPage}>Go to Task Page</button>
    </div>
  );
}
