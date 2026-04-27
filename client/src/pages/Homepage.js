import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { taskApi, userApi } from "../api";

const STATUSES = ["Backlog", "Todo", "In Progress", "Code Review", "Testing", "Done"];

export default function Homepage() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [taskRes, userRes] = await Promise.all([
          taskApi.getAll(),
          userApi.getAll(),
        ]);
        setTasks(taskRes.data);
        setUsers(userRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  const statusCounts = STATUSES.reduce((acc, s) => {
    acc[s] = tasks.filter((t) => t.status === s).length;
    return acc;
  }, {});

  const completedCount = statusCounts["Done"];
  const inProgressCount = statusCounts["In Progress"] + statusCounts["Code Review"] + statusCounts["Testing"];

  return (
    <div id="homepage">
      <div className="page-header">
        <h2>Welcome to ProjectFlow</h2>
        <p>Your centralized project management dashboard</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card accent">
          <span className="stat-icon">📋</span>
          <span className="stat-value">{tasks.length}</span>
          <span className="stat-label">Total Tasks</span>
        </div>
        <div className="stat-card info">
          <span className="stat-icon">🔄</span>
          <span className="stat-value">{inProgressCount}</span>
          <span className="stat-label">In Progress</span>
        </div>
        <div className="stat-card success">
          <span className="stat-icon">✅</span>
          <span className="stat-value">{completedCount}</span>
          <span className="stat-label">Completed</span>
        </div>
        <div className="stat-card warning">
          <span className="stat-icon">👥</span>
          <span className="stat-value">{users.length}</span>
          <span className="stat-label">Team Members</span>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="page-header" style={{ marginBottom: "16px" }}>
        <h2 style={{ fontSize: "1.2rem" }}>Quick Actions</h2>
      </div>
      <div className="quick-nav">
        <Link to="/board" className="quick-card" id="nav-to-board">
          <span className="quick-card-icon">📋</span>
          <h3>Kanban Board</h3>
          <p>
            Visualize your SDLC phases. Drag tasks across Backlog, Todo, In
            Progress, Code Review, Testing, and Done columns.
          </p>
        </Link>
        <Link to="/users" className="quick-card" id="nav-to-users">
          <span className="quick-card-icon">👥</span>
          <h3>Manage Users</h3>
          <p>
            Add, edit, and manage team members. Assign roles like Developer,
            Tester, Manager, or Admin.
          </p>
        </Link>
        <Link
          to={users.length > 0 ? `/dashboard/${users[0]._id}` : "/users"}
          className="quick-card"
          id="nav-to-dashboard"
        >
          <span className="quick-card-icon">📊</span>
          <h3>User Dashboard</h3>
          <p>
            View a user's assigned tasks grouped by status. Track individual
            workload and progress.
          </p>
        </Link>
      </div>

      {/* Status Breakdown */}
      {tasks.length > 0 && (
        <div style={{ marginTop: "36px" }}>
          <div className="page-header" style={{ marginBottom: "16px" }}>
            <h2 style={{ fontSize: "1.2rem" }}>Status Breakdown</h2>
          </div>
          <div className="glass-card">
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {STATUSES.map((s) => {
                const count = statusCounts[s];
                const pct = tasks.length > 0 ? (count / tasks.length) * 100 : 0;
                return (
                  <div key={s} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span className="status-dot" data-status={s}></span>
                    <span style={{ fontSize: "0.85rem", width: "120px", color: "var(--text-secondary)" }}>
                      {s}
                    </span>
                    <div
                      style={{
                        flex: 1,
                        height: "8px",
                        background: "var(--bg-tertiary)",
                        borderRadius: "4px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${pct}%`,
                          height: "100%",
                          background: `var(--color-${s.toLowerCase().replace(/\s+/g, "")})`,
                          borderRadius: "4px",
                          transition: "width 0.6s ease",
                        }}
                      ></div>
                    </div>
                    <span
                      style={{
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        color: "var(--text-muted)",
                        width: "32px",
                        textAlign: "right",
                      }}
                    >
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
