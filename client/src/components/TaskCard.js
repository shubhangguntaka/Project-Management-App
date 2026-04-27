import React from "react";

export default function TaskCard({ task, onEdit, onStatusChange, statuses }) {
  const assignee = task.assignedTo;
  const initials = assignee
    ? assignee.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : null;

  return (
    <div className="task-card" onClick={() => onEdit(task)} id={`task-card-${task._id}`}>
      <div className="task-card-title">{task.title}</div>
      <div className="task-card-meta">
        <span className={`priority-badge ${task.priority.toLowerCase()}`}>
          {task.priority}
        </span>
        {assignee ? (
          <span className="task-assignee">
            <span className="task-assignee-avatar">{initials}</span>
            {assignee.name.split(" ")[0]}
          </span>
        ) : (
          <span className="task-assignee" style={{ opacity: 0.5 }}>
            Unassigned
          </span>
        )}
      </div>
      <div className="task-card-actions" onClick={(e) => e.stopPropagation()}>
        <select
          className="form-select-inline"
          value={task.status}
          onChange={(e) => onStatusChange(task._id, e.target.value)}
          id={`task-status-select-${task._id}`}
        >
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
