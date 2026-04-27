import React, { useEffect, useState } from "react";
import { taskApi } from "./api"; // Use specific taskApi instead of the generic axios instance

const TASK_STATUSES = ["Todo", "In Progress", "Testing", "Done"];

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllTasks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await taskApi.getAll();
      setTasks(response.data);
    } catch (err) {
      setError("Failed to load tasks. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTasks();
  }, []);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      // Optimistically update the UI to make the app feel responsive
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, status: newStatus } : task
        )
      );

      await taskApi.update(taskId, { status: newStatus });
      // Fetch the latest data to keep task history and other fields consistent
      fetchAllTasks();
    } catch (err) {
      console.error("Failed to update task status:", err);
      setError("Failed to update task. Reverting changes.");
      // If it fails, rely on refetching to revert to the true server state
      fetchAllTasks();
    }
  };

  if (isLoading) return <div style={{ padding: "20px" }}>Loading tasks...</div>;
  if (error) return <div style={{ padding: "20px", color: "red" }}>Error: {error}</div>;

  return (
    <div style={{ display: "flex", gap: "20px", padding: "20px" }}>
      {TASK_STATUSES.map((statusGroup) => {
        const columnTasks = tasks.filter((task) => task.status === statusGroup);

        return (
          <div
            key={statusGroup}
            style={{
              flex: 1,
              padding: "15px",
              backgroundColor: "#f4f5f7",
              borderRadius: "8px",
              minHeight: "300px"
            }}
          >
            <h3 style={{ borderBottom: "2px solid #ddd", paddingBottom: "10px" }}>
              {statusGroup} <span style={{ color: "#777", fontSize: "0.8em" }}>({columnTasks.length})</span>
            </h3>

            {columnTasks.map((task) => (
              <div
                key={task._id}
                style={{
                  border: "1px solid #ddd",
                  margin: "10px 0",
                  padding: "15px",
                  backgroundColor: "#fff",
                  borderRadius: "6px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                }}
              >
                <h4 style={{ margin: "0 0 10px 0" }}>{task.title}</h4>

                <div style={{ marginBottom: "15px" }}>
                  <label htmlFor={`status-${task._id}`} style={{ marginRight: "8px", fontSize: "0.9em" }}>
                    Status:
                  </label>
                  <select
                    id={`status-${task._id}`}
                    onChange={(event) => handleStatusChange(task._id, event.target.value)}
                    value={task.status}
                    style={{ padding: "6px", borderRadius: "4px", border: "1px solid #ccc" }}
                  >
                    {TASK_STATUSES.map((statusOption) => (
                      <option key={statusOption} value={statusOption}>
                        {statusOption}
                      </option>
                    ))}
                  </select>
                </div>

                {task.history && task.history.length > 0 && (
                  <details>
                    <summary style={{ cursor: "pointer", fontSize: "0.9em", color: "#444" }}>History Log</summary>
                    <ul style={{ paddingLeft: "20px", margin: "10px 0 0 0", fontSize: "0.85em", color: "#666" }}>
                      {task.history.map((historyItem, index) => (
                        <li key={index}>
                          <strong>{historyItem.status}</strong> 
                          {historyItem.changedAt && ` - ${new Date(historyItem.changedAt).toLocaleDateString()}`}
                        </li>
                      ))}
                    </ul>
                  </details>
                )}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}