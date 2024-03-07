import { useState, useEffect } from 'react';

interface UserPageProps {
  username: string;
  selectedTasks: number[];
  onNavigateBack: () => void;
  onNavigateBackToTaskPage: () => void;
}

interface TaskDetail {
  id: number;
  taskContent: string;
  // Add other relevant fields here
}

export function UserPage({
  username,
  selectedTasks,
  onNavigateBackToTaskPage,
}: UserPageProps) {
  // const [selectedTaskInfo, setSelectedTaskInfo] = useState<any | null>(null);
  const [tasksDetails, setTasksDetails] = useState<TaskDetail[]>([]);

  useEffect(() => {
    const fetchTasksDetails = async () => {
      const tasksDetailsPromises = selectedTasks.map(async (taskId) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/tasks/${taskId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error(`Error fetching task details: ${response.status}`);
        }
        return response.json() as Promise<TaskDetail>;
      });

      try {
        const tasksDetails: TaskDetail[] = await Promise.all(
          tasksDetailsPromises
        );
        setTasksDetails(tasksDetails);
      } catch (error) {
        console.error(error);
      }
    };

    if (selectedTasks.length > 0) {
      fetchTasksDetails();
    } else {
      setTasksDetails([]); // Clear task details if no tasks are selected
    }
  }, [selectedTasks]);

  // useEffect(() => {
  //   const fetchTaskDetails = async () => {
  //     const token = localStorage.getItem('token');
  //     try {
  //       const response = await fetch(`/api/tasks/${selectedTasks}`, {
  //         headers: {
  //           'Authorization': `Bearer ${token}`,
  //         },
  //       });
  //       if (!response.ok) {
  //         throw new Error(`Error fetching task details: ${response.status}`);
  //       }
  //       const taskDetails = await response.json();
  //       setSelectedTaskInfo(taskDetails);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   if (selectedTasks.length > 0) {
  //     fetchTaskDetails();
  //   } else {
  //     setTaskDetails([])
  //   }
  // }, [selectedTasks]);

  return (
    <div className="container-fluid vh-100 custom-light-blue-bg p-1">
      <div className="chore-tracker-section border border-dark shadow mb-3 pb-2 bg-warning text-dark">
        <h1 className="d-block">Welcome, now get to work {username}!</h1>
      </div>
      {selectedTasks.length > 0 ? (
        <div>
          <h2>Your Task List</h2>
          {tasksDetails.map((taskDetail, index) => (
            <div key={index}>
              <p>Task Id: {taskDetail.id}</p>
              <p>Task Content: {taskDetail.taskContent}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No task selected</p>
      )}
      <button onClick={onNavigateBackToTaskPage}>Go to Task Page</button>
    </div>
  );
}
