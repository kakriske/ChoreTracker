interface UserPageProps {
  username: string;
  selectedTask: number | null;
}

export function UserPage({ username, selectedTask }: UserPageProps) {
  return (
    <div className="container-fluid vh-100 custom-light-blue-bg p-1">
      <div className="chore-tracker-section border border-dark shadow mb-3 pb-2 bg-warning text-dark">
        <h1 className="d-block">Welcome, now get to work {username}!</h1>
      </div>
      {selectedTask != null && (
        <div>
          <h2>Selected Task</h2>
          <p>{`Task ID: ${selectedTask}`}</p>
        </div>
      )}
    </div>
  );
}
