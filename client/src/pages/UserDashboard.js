import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { taskApi, userApi } from "../api";
import TaskHistory from "../components/TaskHistory";

const STATUSES = ["Backlog", "Todo", "In Progress", "Code Review", "Testing", "Done"];

export default function UserDashboard() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedTask, setExpandedTask] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, taskRes] = await Promise.all([
          userApi.getById(userId),
          taskApi.getAll({ assignedTo: userId }),
        ]);
        setUser(userRes.data);
        setTasks(taskRes.data);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskApi.update(taskId, { status: newStatus });
      // Refresh tasks
      const taskRes = await taskApi.getAll({ assignedTo: userId });
      setTasks(taskRes.data);
      showToast(`Task moved to ${newStatus}`);
    } catch (err) {
      showToast("Failed to update status", "error");
    }
  };

  const getInitials = (name) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="empty-state" style={{ padding: "60px" }}>
        <span className="empty-icon">⚠️</span>
        <span className="empty-text">User not found.</span>
        <Link to="/users" className="btn btn-secondary btn-sm" style={{ marginTop: "16px" }}>
          ← Back to Users
        </Link>
      </div>
    );
  }

  return (
    <div id="user-dashboard-page">
      <div className="page-header">
        <h2>User Dashboard</h2>
        <p>
          <Link to="/users" style={{ color: "var(--accent-light)" }}>
            Users
          </Link>{" "}
          / {user.name}
        </p>
      </div>

      {/* User Info */}
      <div className="dashboard-user-header">
        <div className="dashboard-avatar">{getInitials(user.name)}</div>
        <div className="dashboard-user-info">
          <h3>{user.name}</h3>
          <p>{user.email}</p>
          <span className="role-badge">{user.role}</span>
        </div>
        <div style={{ marginLeft: "auto", textAlign: "right" }}>
          <div className="stat-value" style={{ fontSize: "1.5rem" }}>
            {tasks.length}
          </div>
          <div className="stat-label">Assigned Tasks</div>
        </div>
      </div>

      {/* Tasks grouped by status */}
      {tasks.length === 0 ? (
        <div className="empty-state" style={{ padding: "60px" }}>
          <span className="empty-icon">📭</span>
          <span className="empty-text">No tasks assigned to {user.name}.</span>
        </div>
      ) : (
        STATUSES.map((status) => {
          const statusTasks = tasks.filter((t) => t.status === status);
          if (statusTasks.length === 0) return null;

          return (
            <div className="dashboard-tasks-section" key={status}>
              <h4>
                <span className="status-dot" data-status={status}></span>
                {status} ({statusTasks.length})
              </h4>
              <div className="dashboard-task-list">
                {statusTasks.map((task) => (
                  <div className="dashboard-task-item" key={task._id}>
                    <div style={{ flex: 1 }}>
                      <div className="dashboard-task-title">
                        {task.title}
                        <span
                          className={`priority-badge ${task.priority.toLowerCase()}`}
                          style={{ marginLeft: "10px" }}
                        >
                          {task.priority}
                        </span>
                      </div>
                      {task.description && (
                        <div className="dashboard-task-desc">{task.description}</div>
                      )}

                      {/* Expandable History */}
                      {expandedTask === task._id && (
                        <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid var(--border-glass)" }}>
                          <TaskHistory history={task.history} />
                        </div>
                      )}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                      <button
                        className="btn-icon"
                        title="Toggle History"
                        onClick={() =>
                          setExpandedTask(expandedTask === task._id ? null : task._id)
                        }
                      >
                        📜
                      </button>
                      <select
                        className="form-select-inline"
                        value={task.status}
                        onChange={(e) => handleStatusChange(task._id, e.target.value)}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })
      )}

      {/* Toast */}
      {toast && (
        <div className="toast-container">
          <div className={`toast ${toast.type}`}>
            {toast.type === "success" ? "✅" : "❌"} {toast.msg}
          </div>
        </div>
      )}
    </div>
  );
}
