import React, { useState, useEffect } from "react";
import TaskHistory from "./TaskHistory";

const STATUSES = ["Backlog", "Todo", "In Progress", "Code Review", "Testing", "Done"];
const PRIORITIES = ["Low", "Medium", "High", "Critical"];

export default function TaskModal({ task, users, onSave, onDelete, onClose }) {
  const isEdit = !!task;

  const [form, setForm] = useState({
    title: "",
    description: "",
    assignedTo: "",
    status: "Backlog",
    priority: "Medium",
  });

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || "",
        description: task.description || "",
        assignedTo: task.assignedTo?._id || task.assignedTo || "",
        status: task.status || "Backlog",
        priority: task.priority || "Medium",
      });
    }
  }, [task]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSave({
      ...form,
      assignedTo: form.assignedTo || null,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={`modal ${isEdit ? "modal-wide" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>{isEdit ? "Edit Task" : "New Task"}</h3>
          <button className="modal-close" onClick={onClose} id="modal-close-btn">
            ✕
          </button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit} id="task-form">
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input
                className="form-input"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Task title..."
                required
                id="task-title-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-textarea"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the task..."
                id="task-description-input"
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  id="task-status-input"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Priority</label>
                <select
                  className="form-select"
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                  id="task-priority-input"
                >
                  {PRIORITIES.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Assigned To</label>
              <select
                className="form-select"
                name="assignedTo"
                value={form.assignedTo}
                onChange={handleChange}
                id="task-assignee-input"
              >
                <option value="">Unassigned</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name} ({u.role})
                  </option>
                ))}
              </select>
            </div>

            <div className="modal-footer" style={{ padding: 0, borderTop: "none", marginTop: "8px" }}>
              {isEdit && onDelete && (
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => onDelete(task._id)}
                  id="task-delete-btn"
                  style={{ marginRight: "auto" }}
                >
                  🗑 Delete
                </button>
              )}
              <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary btn-sm" id="task-save-btn">
                {isEdit ? "Save Changes" : "Create Task"}
              </button>
            </div>
          </form>

          {isEdit && task.history && task.history.length > 0 && (
            <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: "1px solid var(--border-glass)" }}>
              <h4 style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "14px", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                📜 Change History
              </h4>
              <TaskHistory history={task.history} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
