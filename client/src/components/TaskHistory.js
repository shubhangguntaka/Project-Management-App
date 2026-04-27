import React from "react";

export default function TaskHistory({ history }) {
  if (!history || history.length === 0) {
    return (
      <div className="empty-state" style={{ padding: "20px" }}>
        <p className="empty-text">No history recorded yet.</p>
      </div>
    );
  }

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="history-timeline">
      {[...history].reverse().map((entry, i) => (
        <div className="history-item" key={i}>
          <div className="history-dot" data-status={entry.status}></div>
          <div className="history-status">{entry.status}</div>
          {entry.note && <div className="history-note">{entry.note}</div>}
          {entry.changedBy && (
            <div className="history-note">
              by {entry.changedBy.name || "Unknown"}
            </div>
          )}
          <div className="history-time">
            {entry.changedAt ? formatDate(entry.changedAt) : "—"}
          </div>
        </div>
      ))}
    </div>
  );
}
